'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { isAdmin } from '@/lib/adminConfig';
import { adminAPI } from '@/lib/adminAPI';

interface Order {
  id: string;
  userId: string;
  totalAmount: number;
  status: string;
  paymentMethod: string;
  createdAt: string;
  shippingAddress: any;
  items: any[];
}

export default function AdminOrdersPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [filterStatus, setFilterStatus] = useState(searchParams.get('status') || 'all');

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    if (!isAdmin(user.email)) {
      router.push('/');
      return;
    }

    loadOrders();
    setLoading(false);
  }, [user, router, filterStatus]);

  const loadOrders = async () => {
    try {
      const params = filterStatus !== 'all' ? { status: filterStatus } : {};
      const data = await adminAPI.orders.getAll(params);
      setOrders(data.orders || []);
    } catch (error) {
      console.error('Error loading orders:', error);
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await adminAPI.orders.updateStatus(orderId, newStatus as any);
      alert('Cập nhật trạng thái thành công!');
      loadOrders();
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Có lỗi xảy ra!');
    }
  };

  const handleDelete = async (orderId: string) => {
    if (!confirm('Bạn có chắc muốn xóa đơn hàng này?')) return;

    try {
      await adminAPI.orders.delete(orderId);
      alert('Xóa đơn hàng thành công!');
      loadOrders();
    } catch (error) {
      console.error('Error deleting order:', error);
      alert('Có lỗi xảy ra!');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'processing':
        return 'bg-blue-100 text-blue-700';
      case 'shipping':
        return 'bg-purple-100 text-purple-700';
      case 'delivered':
        return 'bg-green-100 text-green-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Chờ Xử Lý';
      case 'processing':
        return 'Đang Xử Lý';
      case 'shipping':
        return 'Đang Giao';
      case 'delivered':
        return 'Đã Giao';
      case 'cancelled':
        return 'Đã Hủy';
      default:
        return status;
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
              📦
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Quản Lý Đơn Hàng
            </h1>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 mb-8">
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 ${
                filterStatus === 'all'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              📊 Tất Cả
            </button>
            <button
              onClick={() => setFilterStatus('pending')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 ${
                filterStatus === 'pending'
                  ? 'bg-gradient-to-r from-yellow-500 to-orange-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              ⏳ Chờ Xử Lý
            </button>
            <button
              onClick={() => setFilterStatus('processing')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 ${
                filterStatus === 'processing'
                  ? 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              ⚙️ Đang Xử Lý
            </button>
            <button
              onClick={() => setFilterStatus('shipping')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 ${
                filterStatus === 'shipping'
                  ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              🚚 Đang Giao
            </button>
            <button
              onClick={() => setFilterStatus('delivered')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 ${
                filterStatus === 'delivered'
                  ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              ✅ Đã Giao
            </button>
            <button
              onClick={() => setFilterStatus('cancelled')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 ${
                filterStatus === 'cancelled'
                  ? 'bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              ❌ Đã Hủy
            </button>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold">Mã Đơn</th>
                  <th className="px-6 py-4 text-left font-semibold">Ngày Đặt</th>
                  <th className="px-6 py-4 text-left font-semibold">Tổng Tiền</th>
                  <th className="px-6 py-4 text-left font-semibold">Thanh Toán</th>
                  <th className="px-6 py-4 text-left font-semibold">Trạng Thái</th>
                  <th className="px-6 py-4 text-left font-semibold">Thao Tác</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-gray-100 hover:bg-purple-50 transition-colors"
                  >
                    <td className="px-6 py-4 font-mono text-sm bg-gray-50 text-gray-700 font-semibold">
                      #{order.id.substring(0, 8).toUpperCase()}
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="px-6 py-4 font-bold text-purple-600">
                      {order.totalAmount.toLocaleString('vi-VN')}đ
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1.5 bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg text-sm font-semibold text-gray-700 border border-gray-300">
                        {order.paymentMethod === 'cod' ? '💵 COD' : order.paymentMethod}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        className={`px-3 py-2 rounded-lg text-sm font-semibold border-2 transition-all cursor-pointer ${getStatusColor(
                          order.status
                        )} hover:opacity-80 focus:ring-2 focus:ring-purple-500`}
                      >
                        <option value="pending" className="bg-white text-gray-900">
                          Chờ Xử Lý
                        </option>
                        <option value="processing" className="bg-white text-gray-900">
                          Đang Xử Lý
                        </option>
                        <option value="shipping" className="bg-white text-gray-900">
                          Đang Giao
                        </option>
                        <option value="delivered" className="bg-white text-gray-900">
                          Đã Giao
                        </option>
                        <option value="cancelled" className="bg-white text-gray-900">
                          Đã Hủy
                        </option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleDelete(order.id)}
                        className="bg-gradient-to-r from-red-500 to-pink-600 hover:shadow-lg text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all transform hover:scale-105"
                      >
                        🗑️ Xóa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {orders.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📦</div>
              <div className="text-gray-500 text-lg">Không có đơn hàng nào</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
