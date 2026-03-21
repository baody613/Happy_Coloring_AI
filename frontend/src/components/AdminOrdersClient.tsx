"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import { isAdmin } from "@/lib/adminConfig";
import { adminAPI } from "@/lib/adminAPI";
import toast from "react-hot-toast";

interface OrderItem {
  productId: string;
  title: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  category?: string;
  isAIProduct?: boolean;
}

interface Order {
  id: string;
  orderNumber?: string;
  userId: string;
  totalAmount: number;
  status: string;
  paymentMethod: string;
  paymentStatus?: string;
  createdAt: string;
  updatedAt?: string;
  shippingAddress?: {
    fullName?: string;
    phone?: string;
    address?: string;
    city?: string;
    district?: string;
  };
  items: OrderItem[];
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface Stats {
  total: number;
  pending: number;
  processing: number;
  shipping: number;
  delivered: number;
  cancelled: number;
  totalRevenue: number;
}

const STATUS_CONFIG: Record<
  string,
  { label: string; emoji: string; color: string; badge: string }
> = {
  pending: {
    label: "Chờ Xử Lý",
    emoji: "⏳",
    color: "from-yellow-500 to-orange-500",
    badge: "bg-yellow-100 text-yellow-700 border-yellow-200",
  },
  processing: {
    label: "Đang Xử Lý",
    emoji: "⚙️",
    color: "from-blue-500 to-cyan-500",
    badge: "bg-blue-100 text-blue-700 border-blue-200",
  },
  shipping: {
    label: "Đang Giao",
    emoji: "🚚",
    color: "from-purple-500 to-indigo-500",
    badge: "bg-purple-100 text-purple-700 border-purple-200",
  },
  delivered: {
    label: "Đã Giao",
    emoji: "✅",
    color: "from-green-500 to-emerald-500",
    badge: "bg-green-100 text-green-700 border-green-200",
  },
  cancelled: {
    label: "Đã Hủy",
    emoji: "❌",
    color: "from-red-500 to-pink-500",
    badge: "bg-red-100 text-red-700 border-red-200",
  },
};

export default function AdminOrdersClient() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [filterStatus, setFilterStatus] = useState("all");
  const [search, setSearch] = useState("");
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });
  const [stats, setStats] = useState<Stats | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const isAIItem = (item: OrderItem) =>
    Boolean(item?.isAIProduct) ||
    item?.category === "ai-products" ||
    item?.category === "Sản Phẩm AI";

  const isAIOrder = (order: Order) =>
    Array.isArray(order.items) && order.items.some((item) => isAIItem(item));

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push("/login");
      return;
    }
    if (!isAdmin(user.email)) {
      router.push("/");
      return;
    }
    loadOrders(1, filterStatus, search);
    loadStats();
  }, [user, authLoading]);

  const loadStats = async () => {
    try {
      const res = await adminAPI.orders.getAll({ limit: 1000 } as any);
      const all: Order[] = res.data?.orders || res.orders || [];
      const s: Stats = {
        total: all.length,
        pending: all.filter((o) => o.status === "pending").length,
        processing: all.filter((o) => o.status === "processing").length,
        shipping: all.filter((o) => o.status === "shipping").length,
        delivered: all.filter((o) => o.status === "delivered").length,
        cancelled: all.filter((o) => o.status === "cancelled").length,
        totalRevenue: all
          .filter((o) => o.status === "delivered")
          .reduce((s, o) => s + (o.totalAmount || 0), 0),
      };
      setStats(s);
    } catch {}
  };

  const loadOrders = useCallback(
    async (page = 1, status = filterStatus, searchText = search) => {
      try {
        setLoading(true);
        const params: any = { page, limit: 10 };
        if (status !== "all" && status !== "ai-products") {
          params.status = status;
        }
        const res = await adminAPI.orders.getAll(params);
        let list: Order[] = res.data?.orders || res.orders || [];

        if (status === "ai-products") {
          list = list.filter((order) => isAIOrder(order));
        }

        // client-side search by order id / customer name / phone
        if (searchText.trim()) {
          const q = searchText.toLowerCase();
          list = list.filter(
            (o) =>
              o.id.toLowerCase().includes(q) ||
              (o.orderNumber || "").toLowerCase().includes(q) ||
              (o.shippingAddress?.fullName || "").toLowerCase().includes(q) ||
              (o.shippingAddress?.phone || "").includes(q),
          );
        }

        setOrders(list);
        if (res.data?.pagination) setPagination(res.data.pagination);
      } catch (err) {
        console.error(err);
        toast.error("Không thể tải danh sách đơn hàng!");
      } finally {
        setLoading(false);
      }
    },
    [filterStatus, search],
  );

  const handleFilterChange = (status: string) => {
    setFilterStatus(status);
    loadOrders(1, status, search);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadOrders(1, filterStatus, search);
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId);
    try {
      await adminAPI.orders.updateStatus(orderId, newStatus as any);
      toast.success("Đã cập nhật trạng thái đơn hàng!");
      loadOrders(pagination.page);
      loadStats();
      if (selectedOrder?.id === orderId) {
        setSelectedOrder((prev) =>
          prev ? { ...prev, status: newStatus } : null,
        );
      }
    } catch {
      toast.error("Có lỗi xảy ra khi cập nhật!");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (orderId: string) => {
    if (!confirm("Bạn có chắc muốn xóa đơn hàng này?")) return;
    try {
      await adminAPI.orders.delete(orderId);
      toast.success("Đã xóa đơn hàng!");
      if (selectedOrder?.id === orderId) setSelectedOrder(null);
      loadOrders(pagination.page);
      loadStats();
    } catch {
      toast.error("Có lỗi xảy ra!");
    }
  };

  if (loading && orders.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl text-purple-600">Đang tải...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/admin"
            className="text-purple-600 hover:text-purple-700 hover:underline mb-3 inline-flex items-center gap-2 font-medium transition-colors"
          >
            <span>← Quay lại Dashboard</span>
          </Link>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-2xl shadow-lg">
                📦
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent text-height">
                  Quản Lý Đơn Hàng
                </h1>
                <p className="text-gray-500 text-sm mt-0.5">
                  Tổng cộng: {pagination.total} đơn hàng
                </p>
              </div>
            </div>
            {/* Search */}
            <form onSubmit={handleSearch} className="flex gap-2">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Tìm mã đơn, tên, SĐT..."
                className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 w-56"
              />
              <button
                type="submit"
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
              >
                🔍 Tìm
              </button>
              {search && (
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    loadOrders(1, filterStatus, "");
                  }}
                  className="border border-gray-300 hover:bg-gray-50 text-gray-600 px-3 py-2 rounded-lg text-sm transition-colors"
                >
                  ✕
                </button>
              )}
            </form>
          </div>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
            {[
              {
                label: "Tổng đơn",
                value: stats.total,
                color: "from-purple-500 to-pink-500",
                emoji: "📊",
              },
              {
                label: "Chờ xử lý",
                value: stats.pending,
                color: "from-yellow-500 to-orange-500",
                emoji: "⏳",
              },
              {
                label: "Đang xử lý",
                value: stats.processing,
                color: "from-blue-500 to-cyan-500",
                emoji: "⚙️",
              },
              {
                label: "Đang giao",
                value: stats.shipping,
                color: "from-purple-500 to-indigo-500",
                emoji: "🚚",
              },
              {
                label: "Đã giao",
                value: stats.delivered,
                color: "from-green-500 to-emerald-500",
                emoji: "✅",
              },
              {
                label: "Đã hủy",
                value: stats.cancelled,
                color: "from-red-500 to-pink-500",
                emoji: "❌",
              },
              {
                label: "Doanh thu",
                value: stats.totalRevenue.toLocaleString("vi-VN") + "đ",
                color: "from-amber-500 to-yellow-500",
                emoji: "💰",
              },
            ].map((s, i) => (
              <div
                key={i}
                className={`bg-gradient-to-br ${s.color} rounded-2xl p-4 text-white shadow-lg`}
              >
                <div className="text-2xl mb-1">{s.emoji}</div>
                <div className="text-xl font-bold truncate">{s.value}</div>
                <div className="text-xs opacity-80">{s.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Filter Tabs */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-4 mb-6">
          <div className="flex flex-wrap gap-2">
            {[
              ["all", "📊 Tất Cả", "from-purple-600 to-pink-600"],
              ["ai-products", "🤖 Sản Phẩm AI", "from-fuchsia-600 to-violet-600"],
              ...Object.entries(STATUS_CONFIG).map(([k, v]) => [
                k,
                `${v.emoji} ${v.label}`,
                v.color,
              ]),
            ].map(([val, label, grad]) => (
              <button
                key={val}
                onClick={() => handleFilterChange(val)}
                className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all hover:scale-105 ${
                  filterStatus === val
                    ? `bg-gradient-to-r ${grad} text-white shadow-lg`
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                <tr>
                  <th className="px-5 py-4 text-left font-semibold whitespace-nowrap">
                    Mã Đơn
                  </th>
                  <th className="px-5 py-4 text-left font-semibold whitespace-nowrap">
                    Khách Hàng
                  </th>
                  <th className="px-5 py-4 text-left font-semibold whitespace-nowrap">
                    Sản Phẩm
                  </th>
                  <th className="px-5 py-4 text-left font-semibold whitespace-nowrap">
                    Tổng Tiền
                  </th>
                  <th className="px-5 py-4 text-left font-semibold whitespace-nowrap">
                    Thanh Toán
                  </th>
                  <th className="px-5 py-4 text-left font-semibold whitespace-nowrap">
                    Ngày Đặt
                  </th>
                  <th className="px-5 py-4 text-left font-semibold whitespace-nowrap">
                    Trạng Thái
                  </th>
                  <th className="px-5 py-4 text-left font-semibold whitespace-nowrap">
                    Thao Tác
                  </th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => {
                  const statusCfg =
                    STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
                  return (
                    <tr
                      key={order.id}
                      className="border-b border-gray-100 hover:bg-purple-50 transition-colors"
                    >
                      <td className="px-5 py-4">
                        <div className="font-mono text-xs font-bold text-gray-700 bg-gray-100 px-2 py-1 rounded">
                          #
                          {(order.orderNumber || order.id)
                            .substring(0, 10)
                            .toUpperCase()}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="text-sm font-semibold text-gray-800">
                          {order.shippingAddress?.fullName || (
                            <span className="text-gray-400 italic">
                              Chưa có
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-gray-500">
                          {order.shippingAddress?.phone || ""}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="text-sm text-gray-700">
                          {order.items?.length > 0 ? (
                            <div className="flex items-center gap-2">
                              <span>{order.items.length} sản phẩm</span>
                              {isAIOrder(order) && (
                                <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-fuchsia-100 text-fuchsia-700 border border-fuchsia-200">
                                  Sản Phẩm AI
                                </span>
                              )}
                            </div>
                          ) : (
                            <span className="text-gray-400 italic">—</span>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-4 font-bold text-purple-600 whitespace-nowrap">
                        {(order.totalAmount || 0).toLocaleString("vi-VN")}đ
                      </td>
                      <td className="px-5 py-4">
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-semibold">
                          {order.paymentMethod === "cod"
                            ? "💵 COD"
                            : order.paymentMethod === "vnpay"
                              ? "🏦 VNPay"
                              : order.paymentMethod === "momo"
                                ? "📱 MoMo"
                                : order.paymentMethod || "—"}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-gray-600 text-sm whitespace-nowrap">
                        {order.createdAt
                          ? (() => {
                              const d = new Date(order.createdAt);
                              const time = d.toLocaleTimeString("vi-VN", {
                                hour: "2-digit",
                                minute: "2-digit",
                              });
                              const date = d.toLocaleDateString("vi-VN");
                              const day = d.toLocaleDateString("vi-VN", {
                                weekday: "long",
                              });
                              return `${time} ${date} - ${day.charAt(0).toUpperCase() + day.slice(1)}`;
                            })()
                          : "—"}
                      </td>
                      <td className="px-5 py-4">
                        <select
                          value={order.status}
                          onChange={(e) =>
                            handleStatusChange(order.id, e.target.value)
                          }
                          disabled={updatingId === order.id}
                          className={`px-2 py-1.5 rounded-lg text-xs font-semibold border cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-400 disabled:opacity-60 ${statusCfg.badge}`}
                        >
                          {Object.entries(STATUS_CONFIG).map(([k, v]) => (
                            <option
                              key={k}
                              value={k}
                              className="bg-white text-gray-900"
                            >
                              {v.emoji} {v.label}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:shadow-lg text-white px-3 py-2 rounded-lg text-sm font-semibold transition-all hover:scale-105"
                            title="Xem chi tiết"
                          >
                            👁️
                          </button>
                          <button
                            onClick={() => handleDelete(order.id)}
                            className="bg-gradient-to-r from-red-500 to-pink-600 hover:shadow-lg text-white px-3 py-2 rounded-lg text-sm font-semibold transition-all hover:scale-105"
                            title="Xóa"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {orders.length === 0 && !loading && (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">📦</div>
              <div className="text-gray-500 text-lg">
                {search
                  ? `Không tìm thấy đơn hàng với "${search}"`
                  : "Không có đơn hàng nào"}
              </div>
            </div>
          )}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50">
              <span className="text-sm text-gray-600">
                Trang {pagination.page} / {pagination.totalPages} •{" "}
                {pagination.total} đơn hàng
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => loadOrders(pagination.page - 1)}
                  disabled={pagination.page <= 1}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium disabled:opacity-40 hover:bg-purple-50 transition-colors"
                >
                  ← Trước
                </button>
                <button
                  onClick={() => loadOrders(pagination.page + 1)}
                  disabled={pagination.page >= pagination.totalPages}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium disabled:opacity-40 hover:bg-purple-50 transition-colors"
                >
                  Sau →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedOrder(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <h2 className="text-xl font-bold text-gray-800">
                Chi Tiết Đơn Hàng
              </h2>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
              >
                ×
              </button>
            </div>
            <div className="p-6 space-y-5">
              {/* Order info */}
              <div className="bg-purple-50 rounded-xl p-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-600">Mã đơn:</span>
                  <span className="font-mono font-bold text-purple-700">
                    #
                    {(
                      selectedOrder.orderNumber || selectedOrder.id
                    ).toUpperCase()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-600">Ngày đặt:</span>
                  <span>
                    {selectedOrder.createdAt
                      ? new Date(selectedOrder.createdAt).toLocaleString(
                          "vi-VN",
                        )
                      : "—"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-600">
                    Thanh toán:
                  </span>
                  <span>
                    {selectedOrder.paymentMethod?.toUpperCase() || "—"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-600">
                    Trạng thái:
                  </span>
                  <select
                    value={selectedOrder.status}
                    onChange={(e) =>
                      handleStatusChange(selectedOrder.id, e.target.value)
                    }
                    disabled={updatingId === selectedOrder.id}
                    className={`px-2 py-1 rounded-lg text-xs font-semibold border cursor-pointer ${STATUS_CONFIG[selectedOrder.status]?.badge || ""}`}
                  >
                    {Object.entries(STATUS_CONFIG).map(([k, v]) => (
                      <option
                        key={k}
                        value={k}
                        className="bg-white text-gray-900"
                      >
                        {v.emoji} {v.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Customer */}
              {selectedOrder.shippingAddress && (
                <div>
                  <h3 className="font-bold text-gray-700 mb-2">
                    📍 Thông Tin Giao Hàng
                  </h3>
                  <div className="text-sm space-y-1 text-gray-600 bg-gray-50 rounded-xl p-4">
                    <div>
                      <span className="font-semibold">Họ tên:</span>{" "}
                      {selectedOrder.shippingAddress.fullName || "—"}
                    </div>
                    <div>
                      <span className="font-semibold">SĐT:</span>{" "}
                      {selectedOrder.shippingAddress.phone || "—"}
                    </div>
                    <div>
                      <span className="font-semibold">Địa chỉ:</span>{" "}
                      {selectedOrder.shippingAddress.address || "—"}
                    </div>
                    {selectedOrder.shippingAddress.district && (
                      <div>
                        <span className="font-semibold">Quận/Huyện:</span>{" "}
                        {selectedOrder.shippingAddress.district}
                      </div>
                    )}
                    {selectedOrder.shippingAddress.city && (
                      <div>
                        <span className="font-semibold">Tỉnh/TP:</span>{" "}
                        {selectedOrder.shippingAddress.city}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Items */}
              {selectedOrder.items?.length > 0 && (
                <div>
                  <h3 className="font-bold text-gray-700 mb-2">
                    🛒 Sản Phẩm ({selectedOrder.items.length})
                  </h3>
                  <div className="space-y-2">
                    {selectedOrder.items.map((item, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-3 bg-gray-50 rounded-xl p-3"
                      >
                        {item.imageUrl && (
                          <img
                            src={item.imageUrl}
                            alt={item.title}
                            className="w-12 h-12 object-cover rounded-lg shrink-0"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-semibold text-gray-800 truncate">
                            {item.title || "Sản phẩm"}
                          </div>
                          {isAIItem(item) && (
                            <div className="text-[11px] inline-block mt-1 px-2 py-0.5 rounded-full font-semibold bg-fuchsia-100 text-fuchsia-700 border border-fuchsia-200">
                              Sản Phẩm AI
                            </div>
                          )}
                          <div className="text-xs text-gray-500">
                            SL: {item.quantity} ×{" "}
                            {(item.price || 0).toLocaleString("vi-VN")}đ
                          </div>
                        </div>
                        <div className="text-sm font-bold text-purple-600 shrink-0">
                          {(
                            (item.price || 0) * (item.quantity || 1)
                          ).toLocaleString("vi-VN")}
                          đ
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Total */}
              <div className="border-t border-gray-100 pt-4 flex justify-between items-center">
                <span className="font-bold text-gray-700 text-lg">
                  Tổng cộng:
                </span>
                <span className="text-2xl font-extrabold text-purple-600">
                  {(selectedOrder.totalAmount || 0).toLocaleString("vi-VN")}đ
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
