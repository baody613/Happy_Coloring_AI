'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { isAdmin } from '@/lib/adminConfig';
import { adminAPI } from '@/lib/adminAPI';

interface User {
  id: string;
  email: string;
  displayName?: string;
  disabled?: boolean;
  role?: string;
  createdAt: string;
}

export default function AdminUsersPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    // Đợi auth loading hoàn tất
    if (authLoading) {
      return;
    }

    if (!user) {
      router.push('/login');
      return;
    }

    if (!isAdmin(user.email)) {
      router.push('/');
      return;
    }

    loadUsers();
    setLoading(false);
  }, [user, router, authLoading]);

  const loadUsers = async () => {
    try {
      const data = await adminAPI.users.getAll();
      setUsers(data.users || []);
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const handleToggleDisable = async (userId: string, currentStatus: boolean) => {
    try {
      await adminAPI.users.update(userId, { disabled: !currentStatus });
      alert(currentStatus ? 'Đã mở khóa user!' : 'Đã khóa user!');
      loadUsers();
    } catch (error) {
      console.error('Error toggling user status:', error);
      alert('Có lỗi xảy ra!');
    }
  };

  const handleDelete = async (userId: string) => {
    if (!confirm('Bạn có chắc muốn xóa user này? Hành động này không thể hoàn tác!')) return;

    try {
      await adminAPI.users.delete(userId);
      alert('Xóa user thành công!');
      loadUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Có lỗi xảy ra!');
    }
  };

  if (loading) {
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
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-2xl shadow-lg">
              👥
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Quản Lý Người Dùng
            </h1>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold">Email</th>
                  <th className="px-6 py-4 text-left font-semibold">Tên Hiển Thị</th>
                  <th className="px-6 py-4 text-left font-semibold">Vai Trò</th>
                  <th className="px-6 py-4 text-left font-semibold">Ngày Tạo</th>
                  <th className="px-6 py-4 text-left font-semibold">Trạng Thái</th>
                  <th className="px-6 py-4 text-left font-semibold">Thao Tác</th>
                </tr>
              </thead>
              <tbody>
                {users.map((userItem) => (
                  <tr
                    key={userItem.id}
                    className="border-b border-gray-100 hover:bg-purple-50 transition-colors"
                  >
                    <td className="px-6 py-4 font-semibold text-gray-900">{userItem.email}</td>
                    <td className="px-6 py-4 text-gray-700">{userItem.displayName || '-'}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1.5 rounded-lg text-sm font-semibold inline-flex items-center gap-1.5 ${
                          isAdmin(userItem.email)
                            ? 'bg-gradient-to-r from-orange-100 to-red-100 text-orange-700 border border-orange-200'
                            : 'bg-gray-100 text-gray-700 border border-gray-200'
                        }`}
                      >
                        {isAdmin(userItem.email) ? '👑 Admin' : '👤 User'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {userItem.createdAt
                        ? new Date(userItem.createdAt).toLocaleDateString('vi-VN')
                        : '-'}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1.5 rounded-lg text-sm font-semibold inline-flex items-center gap-1.5 ${
                          userItem.disabled
                            ? 'bg-red-100 text-red-700 border border-red-200'
                            : 'bg-green-100 text-green-700 border border-green-200'
                        }`}
                      >
                        {userItem.disabled ? '🚫 Bị Khóa' : '✅ Hoạt Động'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            handleToggleDisable(userItem.id, userItem.disabled || false)
                          }
                          className={`px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${
                            userItem.disabled
                              ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:shadow-lg'
                              : 'bg-gradient-to-r from-yellow-500 to-orange-600 hover:shadow-lg'
                          }`}
                          disabled={isAdmin(userItem.email)}
                        >
                          {userItem.disabled ? '🔓 Mở Khóa' : '🔒 Khóa'}
                        </button>
                        <button
                          onClick={() => handleDelete(userItem.id)}
                          className="bg-gradient-to-r from-red-500 to-pink-600 hover:shadow-lg text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                          disabled={isAdmin(userItem.email)}
                        >
                          🗑️ Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {users.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">👥</div>
              <div className="text-gray-500 text-lg">Chưa có người dùng nào</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
