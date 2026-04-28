"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import { isAdmin } from "@/lib/adminConfig";
import { adminAPI } from "@/lib/adminAPI";
import toast from "react-hot-toast";

interface Product {
  id: string;
  title: string;
  category?: string;
  price: number;
  imageUrl: string;
  status: string;
  sales: number;
  difficulty: string;
  description?: string;
  createdAt: string;
}

type ViewMode = "table";

const DIFFICULTY_CONFIG = {
  easy: {
    label: "Dễ",
    emoji: "🟢",
    badge: "bg-green-100 text-green-700 border-green-200",
  },
  medium: {
    label: "Trung Bình",
    emoji: "🟡",
    badge: "bg-yellow-100 text-yellow-700 border-yellow-200",
  },
  hard: {
    label: "Khó",
    emoji: "🔴",
    badge: "bg-red-100 text-red-700 border-red-200",
  },
};

const CATEGORY_OPTIONS = [
  { value: "paint-by-numbers", label: "🖌️ Tô Màu" },
  { value: "animals", label: "🐾 Động Vật" },
  { value: "landscape", label: "🌄 Phong Cảnh" },
  { value: "flowers", label: "🌸 Hoa Lá" },
  { value: "architecture", label: "🏛️ Kiến Trúc" },
  { value: "abstract", label: "🎨 Trừu Tượng" },
  { value: "portrait", label: "🖼️ Chân Dung" },
  { value: "fantasy", label: "🌌 Huyền Bí" },
  { value: "ocean", label: "🌊 Đại Dương" },
  { value: "city", label: "🏙️ Thành Phố" },
];

const CATEGORY_LABEL_MAP = CATEGORY_OPTIONS.reduce(
  (acc, item) => ({ ...acc, [item.value]: item.label }),
  {} as Record<string, string>,
);

const NEW_PRODUCT_DAYS = 3;

export default function AdminProductsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>("table");
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");

  const loadProducts = useCallback(async () => {
    try {
      const data = await adminAPI.products.getAll({
        limit: 200,
        sortBy: "createdAt",
        sortOrder: "desc",
      });
      const list = data?.data?.products || data?.products || [];
      const sortedList = [...list].sort(
        (a: Product, b: Product) => getCreatedTime(b) - getCreatedTime(a),
      );
      setProducts(sortedList);
    } catch {
      toast.error("Không thể tải danh sách sản phẩm!");
    }
  }, []);

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
    loadProducts();
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.uid, authLoading]);

  const getCreatedTime = (product: Product) => {
    const createdAt = (product as any)?.createdAt;
    if (!createdAt) return 0;

    if (typeof createdAt === "string" || typeof createdAt === "number") {
      const timestamp = new Date(createdAt).getTime();
      return Number.isNaN(timestamp) ? 0 : timestamp;
    }

    if (typeof createdAt?.toDate === "function") {
      const timestamp = createdAt.toDate().getTime();
      return Number.isNaN(timestamp) ? 0 : timestamp;
    }

    if (typeof createdAt?._seconds === "number") {
      return createdAt._seconds * 1000;
    }

    return 0;
  };

  const formatCreatedAtParts = (product: Product) => {
    const timestamp = getCreatedTime(product);
    if (!timestamp) {
      return { time: "--:--", date: "Chưa có" };
    }

    const date = new Date(timestamp);

    return {
      time: date.toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      date: date.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }),
    };
  };

  const isNewProduct = useCallback((product: Product) => {
    const createdTime = getCreatedTime(product);
    if (!createdTime) return false;
    const daysSinceCreated = (Date.now() - createdTime) / (1000 * 60 * 60 * 24);
    return daysSinceCreated <= NEW_PRODUCT_DAYS;
  }, []);

  const stats = useMemo(
    () => ({
      total: products.length,
      active: products.filter((p) => p.status === "active").length,
      inactive: products.filter((p) => p.status !== "active").length,
      easy: products.filter((p) => p.difficulty === "easy").length,
      medium: products.filter((p) => p.difficulty === "medium").length,
      hard: products.filter((p) => p.difficulty === "hard").length,
    }),
    [products],
  );

  const filtered = useMemo(
    () =>
      products.filter((p) => {
        const matchSearch =
          !search.trim() ||
          p.title.toLowerCase().includes(search.toLowerCase());
        const matchCategory =
          filterCategory === "all"
            ? true
            : filterCategory === "new"
              ? isNewProduct(p)
              : p.category === filterCategory;
        return matchSearch && matchCategory;
      }),
    [products, search, filterCategory, isNewProduct],
  );

  const newProductCount = useMemo(
    () => products.filter((p) => isNewProduct(p)).length,
    [products, isNewProduct],
  );

  const categoryCounts = useMemo(() => {
    return CATEGORY_OPTIONS.map((cat) => ({
      ...cat,
      count: products.filter((p) => p.category === cat.value).length,
    }));
  }, [products]);

  const handleDelete = async (productId: string, name: string) => {
    if (!confirm(`Bạn có chắc muốn xoá sản phẩm "${name}"?`)) return;
    const toastId = toast.loading("Đang xóa...");
    // Xóa ngay khỏi state để UI phản hồi tức thì
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    try {
      await adminAPI.products.delete(productId);
      toast.success("Đã xóa sản phẩm!", { id: toastId });
    } catch {
      toast.error("Có lỗi xảy ra!", { id: toastId });
      // Rollback: tải lại danh sách nếu API thất bại
      loadProducts();
    }
  };

  if (loading || authLoading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl text-purple-600">Đang tải...</div>
      </div>
    );

  const badgeImg =
    'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23f3f4f6" width="200" height="200"/%3E%3Ctext fill="%239ca3af" x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle"%3ENo image%3C/text%3E%3C/svg%3E';

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
                🎨
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent text-height">
                  Gallery Sản Phẩm
                </h1>
                <p className="text-gray-500 text-sm mt-0.5">
                  Tổng cộng: {stats.total} sản phẩm
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push("/admin/add-products")}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:shadow-xl text-white px-6 py-2.5 rounded-xl font-semibold transition-all hover:scale-105"
              >
                ➕ Thêm Sản Phẩm
              </button>
            </div>
          </div>
        </div>

        {/* Category-first Toolbar */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-4 mb-6 space-y-3">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm text-gray-600">
              Hiển thị{" "}
              <span className="font-semibold text-purple-700">
                {filtered.length}
              </span>{" "}
              / {products.length} sản phẩm
            </p>
            <p className="text-xs text-gray-500">
              Chọn danh mục trước để xem đúng nhóm sản phẩm
            </p>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <button
              onClick={() => setFilterCategory("all")}
              className={`text-sm px-3 py-2 rounded-lg border whitespace-nowrap transition-colors ${
                filterCategory === "all"
                  ? "bg-purple-600 text-white border-purple-600"
                  : "bg-white text-gray-600 border-gray-300 hover:border-purple-300"
              }`}
            >
              Tất cả danh mục ({products.length})
            </button>
            <button
              onClick={() => setFilterCategory("new")}
              className={`text-sm px-3 py-2 rounded-lg border whitespace-nowrap transition-colors ${
                filterCategory === "new"
                  ? "bg-purple-600 text-white border-purple-600"
                  : "bg-white text-gray-600 border-gray-300 hover:border-purple-300"
              }`}
            >
              🆕 Mới thêm ({newProductCount})
            </button>
            {categoryCounts.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setFilterCategory(cat.value)}
                className={`text-sm px-3 py-2 rounded-lg border transition-colors ${
                  filterCategory === cat.value
                    ? "bg-purple-600 text-white border-purple-600"
                    : "bg-white text-gray-600 border-gray-300 hover:border-purple-300"
                }`}
              >
                {cat.label} ({cat.count})
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="🔍 Tìm tên sản phẩm..."
              className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 w-56"
            />
            {(search || filterCategory !== "all") && (
              <button
                onClick={() => {
                  setSearch("");
                  setFilterCategory("all");
                }}
                className="text-sm text-gray-500 hover:text-red-500 px-3 py-2 rounded-lg border border-gray-200 hover:border-red-200 transition-colors"
              >
                ✕ Xóa bộ lọc
              </button>
            )}
          </div>
        </div>

        {/* Table View */}
        {viewMode === "table" && (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                  <tr>
                    <th className="px-5 py-4 text-left font-semibold whitespace-nowrap">
                      Hình Ảnh
                    </th>
                    <th className="px-5 py-4 text-left font-semibold whitespace-nowrap">
                      Danh Mục
                    </th>
                    <th className="px-5 py-4 text-left font-semibold whitespace-nowrap">
                      Tên Sản Phẩm
                    </th>
                    <th className="px-5 py-4 text-left font-semibold whitespace-nowrap">
                      Giá
                    </th>
                    <th className="px-5 py-4 text-left font-semibold whitespace-nowrap">
                      Độ Khó
                    </th>
                    <th className="px-5 py-4 text-left font-semibold whitespace-nowrap">
                      Trạng Thái
                    </th>
                    <th className="px-5 py-4 text-left font-semibold whitespace-nowrap">
                      Ngày Thêm
                    </th>
                    <th className="px-5 py-4 text-left font-semibold whitespace-nowrap">
                      Đã Bán
                    </th>
                    <th className="px-5 py-4 text-left font-semibold whitespace-nowrap">
                      Thao Tác
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((product) => {
                    const d =
                      DIFFICULTY_CONFIG[
                        product.difficulty as keyof typeof DIFFICULTY_CONFIG
                      ] || DIFFICULTY_CONFIG.medium;
                    const created = formatCreatedAtParts(product);
                    return (
                      <tr
                        key={product.id}
                        className="border-b border-gray-100 hover:bg-purple-50 transition-colors"
                      >
                        <td className="px-5 py-4">
                          <div className="relative inline-block">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={product.imageUrl}
                              alt={product.title}
                              className="w-16 h-16 object-cover rounded-xl shadow-md border border-gray-200"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = badgeImg;
                              }}
                            />
                          </div>
                        </td>
                        <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-600">
                          {CATEGORY_LABEL_MAP[product.category || ""] ||
                            "📦 Chưa phân loại"}
                        </td>
                        <td className="px-5 py-4 font-semibold text-gray-900 max-w-[180px]">
                          <div className="truncate">{product.title}</div>
                        </td>
                        <td className="px-5 py-4 font-bold text-purple-600 whitespace-nowrap">
                          {(product.price >= 1000
                            ? product.price
                            : product.price * 1000
                          ).toLocaleString("vi-VN")}{" "}
                          VND
                        </td>
                        <td className="px-5 py-4">
                          <span
                            className={`px-2.5 py-1 rounded-lg text-xs font-semibold border ${d.badge}`}
                          >
                            {d.emoji} {d.label}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <span
                            className={`px-2.5 py-1 rounded-lg text-xs font-semibold border ${product.status === "active" ? "bg-green-100 text-green-700 border-green-200" : "bg-gray-100 text-gray-600 border-gray-200"}`}
                          >
                            {product.status === "active"
                              ? "✅ Hoạt động"
                              : "⏸️ Đang ẩn"}
                          </span>
                        </td>
                        <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-600">
                          <div className="leading-tight">
                            <p className="font-semibold text-gray-800">
                              {created.time}
                            </p>
                            <p className="text-xs text-gray-500">
                              {created.date}
                            </p>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-gray-700 font-semibold">
                          {product.sales} đơn
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() =>
                                router.push(
                                  `/admin/add-products?id=${product.id}`,
                                )
                              }
                              className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:shadow-lg text-white px-3 py-2 rounded-lg text-sm font-semibold transition-all hover:scale-105"
                            >
                              ✏️
                            </button>
                            <button
                              onClick={() =>
                                handleDelete(product.id, product.title)
                              }
                              className="bg-gradient-to-r from-red-500 to-pink-600 hover:shadow-lg text-white px-3 py-2 rounded-lg text-sm font-semibold transition-all hover:scale-105"
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
            {filtered.length === 0 && (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🎨</div>
                <p className="text-gray-500 text-lg">
                  {search
                    ? `Không tìm thấy "${search}"`
                    : "Chưa có sản phẩm nào"}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
