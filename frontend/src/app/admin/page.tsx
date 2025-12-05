'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { isAdmin } from '@/lib/adminConfig';
import { adminAPI } from '@/lib/adminAPI';

export default function AdminPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalProducts: 0,
    totalUsers: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    processingOrders: 0,
    shippingOrders: 0,
    deliveredOrders: 0,
  });

  useEffect(() => {
    // Đợi auth loading hoàn tất
    if (authLoading) {
      return;
    }

    // Check if user is logged in
    if (!user) {
      router.push('/login');
      return;
    }

    // Check if user is admin
    if (!isAdmin(user.email)) {
      router.push('/');
      return;
    }

    loadStats();
    setLoading(false);
  }, [user, router, authLoading]);

  const loadStats = async () => {
    try {
      const data = await adminAPI.stats.getDashboardStats();
      setStats(data);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  if (loading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl text-purple-600">Đang tải...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">🎨 Admin Dashboard</h1>
          <p className="text-gray-600">Chào mừng {user?.displayName || user?.email}</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Tổng Đơn Hàng</p>
                <h3 className="text-2xl font-bold text-gray-800">{stats.totalOrders}</h3>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">📦</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Sản Phẩm</p>
                <h3 className="text-2xl font-bold text-gray-800">{stats.totalProducts}</h3>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">🎨</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Người Dùng</p>
                <h3 className="text-2xl font-bold text-gray-800">{stats.totalUsers}</h3>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">👥</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Doanh Thu</p>
                <h3 className="text-2xl font-bold text-gray-800">
                  {stats.totalRevenue.toLocaleString('vi-VN')}đ
                </h3>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">💰</span>
              </div>
            </div>
          </div>
        </div>

        {/* Management Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Products Management */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              🎨 Quản Lý Sản Phẩm
            </h2>
            <div className="space-y-3">
              <button
                onClick={() => router.push('/admin/products')}
                className="w-full bg-purple-500 hover:bg-purple-600 text-white font-semibold py-3 px-4 rounded-lg transition"
              >
                ➕ Thêm Sản Phẩm Mới
              </button>
              <button
                onClick={() => router.push('/admin/products')}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg transition"
              >
                📝 Danh Sách Sản Phẩm
              </button>
            </div>
          </div>

          {/* Orders Management */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              📦 Quản Lý Đơn Hàng
            </h2>
            <div className="space-y-3">
              <button
                onClick={() => router.push('/admin/orders?status=pending')}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-4 rounded-lg transition"
              >
                📋 Đơn Hàng Mới
              </button>
              <button
                onClick={() => router.push('/admin/orders?status=shipping')}
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 px-4 rounded-lg transition"
              >
                🚚 Đang Giao Hàng
              </button>
              <button
                onClick={() => router.push('/admin/orders?status=delivered')}
                className="w-full bg-teal-500 hover:bg-teal-600 text-white font-semibold py-3 px-4 rounded-lg transition"
              >
                ✅ Đã Hoàn Thành
              </button>
            </div>
          </div>

          {/* Users Management */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              👥 Quản Lý Người Dùng
            </h2>
            <div className="space-y-3">
              <button
                onClick={() => router.push('/admin/users')}
                className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-3 px-4 rounded-lg transition"
              >
                📋 Danh Sách Users
              </button>
              <button
                onClick={() => router.push('/admin/users')}
                className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 px-4 rounded-lg transition"
              >
                🔒 Phân Quyền
              </button>
              <button
                onClick={() => router.push('/admin/users')}
                className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-4 rounded-lg transition"
              >
                🚫 Chặn/Khóa User
              </button>
            </div>
          </div>

          {/* Settings */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              ⚙️ Cài Đặt Hệ Thống
            </h2>
            <div className="space-y-3">
              <button
                onClick={() => router.push('/admin/settings')}
                className="w-full bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-4 rounded-lg transition"
              >
                🔧 Cấu Hình
              </button>
              <button
                onClick={() => router.push('/admin/settings')}
                className="w-full bg-violet-500 hover:bg-violet-600 text-white font-semibold py-3 px-4 rounded-lg transition"
              >
                💳 Thanh Toán
              </button>
              <button
                onClick={() => router.push('/admin/settings')}
                className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-3 px-4 rounded-lg transition"
              >
                📧 Email & Thông Báo
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
