"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import { isAdmin } from "@/lib/adminConfig";
import { adminAPI } from "@/lib/adminAPI";
import toast from "react-hot-toast";

interface User {
  id: string;
  email: string;
  displayName?: string;
  phoneNumber?: string;
  address?: string;
  disabled?: boolean;
  role?: string;
  createdAt: string;
  updatedAt?: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export default function AdminUsersPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

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
    loadUsers(1, "");
  }, [user, router, authLoading]);

  const loadUsers = useCallback(
    async (page = 1, searchText = search) => {
      try {
        setLoading(true);
        const res = await adminAPI.users.getAll({
          page,
          limit: 10,
          ...(searchText ? { search: searchText } : {}),
        } as any);
        // sendSuccess wraps data as: { success, message, data: { users, pagination } }
        const payload = res.data ?? res;
        setUsers(payload.users || []);
        if (payload.pagination) setPagination(payload.pagination);
      } catch (error) {
        console.error("Error loading users:", error);
        toast.error("Không thể tải danh sách người dùng!");
      } finally {
        setLoading(false);
      }
    },
    [search],
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadUsers(1, search);
  };

  const handleToggleDisable = async (
    userId: string,
    currentStatus: boolean,
  ) => {
    try {
      await adminAPI.users.update(userId, { disabled: !currentStatus });
      toast.success(
        currentStatus ? "Đã mở khóa người dùng!" : "Đã khóa người dùng!",
      );
      loadUsers(pagination.page);
    } catch (error) {
      console.error("Error toggling user status:", error);
      toast.error("Có lỗi xảy ra!");
    }
  };

  const handleDelete = async (userId: string) => {
    if (
      !confirm(
        "Bạn có chắc muốn xóa người dùng này? Hành động này không thể hoàn tác!",
      )
    )
      return;
    try {
      await adminAPI.users.delete(userId);
      toast.success("Xóa người dùng thành công!");
      loadUsers(pagination.page);
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Có lỗi xảy ra!");
    }
  };

  if (loading && users.length === 0) {
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
            <span>←</span> Quay lại Dashboard
          </Link>
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-2xl shadow-lg">
                👥
              </div>
              <div>
                <h1
                  className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"
                  style={{ height: "43px" }}
                >
                  Quản Lý Người Dùng
                </h1>
                <p className="text-gray-500 text-sm mt-0.5">
                  Tổng cộng: {pagination.total} người dùng
                </p>
              </div>
            </div>
            {/* Search */}
            <form onSubmit={handleSearch} className="flex gap-2">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Tìm theo email..."
                className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 w-60"
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
                    loadUsers(1, "");
                  }}
                  className="border border-gray-300 hover:bg-gray-50 text-gray-600 px-3 py-2 rounded-lg text-sm transition-colors"
                >
                  ✕
                </button>
              )}
            </form>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                <tr>
                  <th className="px-5 py-4 text-left font-semibold whitespace-nowrap">
                    Email
                  </th>
                  <th className="px-5 py-4 text-left font-semibold whitespace-nowrap">
                    Họ Tên
                  </th>
                  <th className="px-5 py-4 text-left font-semibold whitespace-nowrap">
                    Số Điện Thoại
                  </th>
                  <th className="px-5 py-4 text-left font-semibold whitespace-nowrap">
                    Địa Chỉ
                  </th>
                  <th className="px-5 py-4 text-left font-semibold whitespace-nowrap">
                    Vai Trò
                  </th>
                  <th className="px-5 py-4 text-left font-semibold whitespace-nowrap">
                    Ngày Đăng Ký
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
                {users.map((userItem) => (
                  <tr
                    key={userItem.id}
                    className="border-b border-gray-100 hover:bg-purple-50 transition-colors"
                  >
                    <td
                      className="px-5 py-4 font-semibold text-gray-900 max-w-[200px] truncate"
                      title={userItem.email}
                    >
                      {userItem.email}
                    </td>
                    <td className="px-5 py-4 text-gray-700">
                      {userItem.displayName || (
                        <span className="text-gray-400 italic">
                          Chưa cập nhật
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-gray-700">
                      {userItem.phoneNumber || (
                        <span className="text-gray-400 italic">
                          Chưa cập nhật
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-gray-700 max-w-[180px]">
                      {userItem.address ? (
                        <span
                          title={userItem.address}
                          className="block truncate"
                        >
                          {userItem.address}
                        </span>
                      ) : (
                        <span className="text-gray-400 italic">
                          Chưa cập nhật
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`px-3 py-1.5 rounded-lg text-sm font-semibold inline-flex items-center gap-1.5 ${
                          isAdmin(userItem.email)
                            ? "bg-gradient-to-r from-orange-100 to-red-100 text-orange-700 border border-orange-200"
                            : "bg-gray-100 text-gray-700 border border-gray-200"
                        }`}
                      >
                        {isAdmin(userItem.email) ? "👑 Admin" : "👤 User"}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-gray-600 whitespace-nowrap">
                      {userItem.createdAt
                        ? new Date(userItem.createdAt).toLocaleDateString(
                            "vi-VN",
                          )
                        : "-"}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`px-3 py-1.5 rounded-lg text-sm font-semibold inline-flex items-center gap-1.5 ${
                          userItem.disabled
                            ? "bg-red-100 text-red-700 border border-red-200"
                            : "bg-green-100 text-green-700 border border-green-200"
                        }`}
                      >
                        {userItem.disabled ? "🚫 Bị Khóa" : "✅ Hoạt Động"}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex gap-2 items-center">
                        <button
                          onClick={() => setSelectedUser(userItem)}
                          className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:shadow-lg text-white px-3 py-2 rounded-lg text-sm font-semibold transition-all hover:scale-105"
                          title="Xem chi tiết"
                        >
                          👁️
                        </button>
                        <button
                          onClick={() =>
                            handleToggleDisable(
                              userItem.id,
                              userItem.disabled || false,
                            )
                          }
                          className={`px-3 py-2 rounded-lg text-sm font-semibold text-white transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${
                            userItem.disabled
                              ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:shadow-lg"
                              : "bg-gradient-to-r from-yellow-500 to-orange-600 hover:shadow-lg"
                          }`}
                          disabled={isAdmin(userItem.email)}
                          title={userItem.disabled ? "Mở khóa" : "Khóa"}
                        >
                          {userItem.disabled ? "🔓" : "🔒"}
                        </button>
                        <button
                          onClick={() => handleDelete(userItem.id)}
                          className="bg-gradient-to-r from-red-500 to-pink-600 hover:shadow-lg text-white px-3 py-2 rounded-lg text-sm font-semibold transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                          disabled={isAdmin(userItem.email)}
                          title="Xóa"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {users.length === 0 && !loading && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">👥</div>
              <div className="text-gray-500 text-lg">
                {search
                  ? `Không tìm thấy người dùng với "${search}"`
                  : "Chưa có người dùng nào"}
              </div>
            </div>
          )}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50">
              <span className="text-sm text-gray-600">
                Trang {pagination.page} / {pagination.totalPages} &nbsp;•&nbsp;{" "}
                {pagination.total} người dùng
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => loadUsers(pagination.page - 1)}
                  disabled={pagination.page <= 1}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium disabled:opacity-40 hover:bg-purple-50 transition-colors"
                >
                  ← Trước
                </button>
                <button
                  onClick={() => loadUsers(pagination.page + 1)}
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

      {/* Detail Modal */}
      {selectedUser && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedUser(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold text-gray-800">
                Thông Tin Người Dùng
              </h2>
              <button
                onClick={() => setSelectedUser(null)}
                className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
              >
                ×
              </button>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex gap-2">
                <span className="font-semibold text-gray-600 w-36 shrink-0">
                  Email:
                </span>
                <span className="text-gray-900 break-all">
                  {selectedUser.email}
                </span>
              </div>
              <div className="flex gap-2">
                <span className="font-semibold text-gray-600 w-36 shrink-0">
                  Họ tên:
                </span>
                <span className="text-gray-900">
                  {selectedUser.displayName || (
                    <span className="italic text-gray-400">Chưa cập nhật</span>
                  )}
                </span>
              </div>
              <div className="flex gap-2">
                <span className="font-semibold text-gray-600 w-36 shrink-0">
                  Số điện thoại:
                </span>
                <span className="text-gray-900">
                  {selectedUser.phoneNumber || (
                    <span className="italic text-gray-400">Chưa cập nhật</span>
                  )}
                </span>
              </div>
              <div className="flex gap-2">
                <span className="font-semibold text-gray-600 w-36 shrink-0">
                  Địa chỉ:
                </span>
                <span className="text-gray-900">
                  {selectedUser.address || (
                    <span className="italic text-gray-400">Chưa cập nhật</span>
                  )}
                </span>
              </div>
              <div className="flex gap-2">
                <span className="font-semibold text-gray-600 w-36 shrink-0">
                  Vai trò:
                </span>
                <span>
                  {isAdmin(selectedUser.email) ? "👑 Admin" : "👤 User"}
                </span>
              </div>
              <div className="flex gap-2">
                <span className="font-semibold text-gray-600 w-36 shrink-0">
                  Ngày đăng ký:
                </span>
                <span className="text-gray-900">
                  {selectedUser.createdAt
                    ? new Date(selectedUser.createdAt).toLocaleString("vi-VN")
                    : "-"}
                </span>
              </div>
              <div className="flex gap-2">
                <span className="font-semibold text-gray-600 w-36 shrink-0">
                  Cập nhật lần cuối:
                </span>
                <span className="text-gray-900">
                  {selectedUser.updatedAt
                    ? new Date(selectedUser.updatedAt).toLocaleString("vi-VN")
                    : "-"}
                </span>
              </div>
              <div className="flex gap-2">
                <span className="font-semibold text-gray-600 w-36 shrink-0">
                  Trạng thái:
                </span>
                <span
                  className={
                    selectedUser.disabled
                      ? "text-red-600 font-semibold"
                      : "text-green-600 font-semibold"
                  }
                >
                  {selectedUser.disabled ? "🚫 Bị khóa" : "✅ Hoạt động"}
                </span>
              </div>
              <div className="flex gap-2">
                <span className="font-semibold text-gray-600 w-36 shrink-0">
                  UID:
                </span>
                <span className="text-gray-500 text-xs break-all">
                  {selectedUser.id}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
