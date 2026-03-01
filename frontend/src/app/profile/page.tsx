'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuthStore } from '@/store/authStore';
import { useFavoriteStore } from '@/store/favoriteStore';
import { useCartStore } from '@/store/cartStore';
import { useHydration } from '@/hooks';
import { isAdmin } from '@/lib/adminConfig';
import { FaHeart, FaShoppingCart, FaTrash } from 'react-icons/fa';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { user, signOut } = useAuthStore();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('info');
  const hydrated = useHydration();
  const { favorites, removeFavorite } = useFavoriteStore();
  const { addItem } = useCartStore();

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    // Nếu là admin, redirect sang trang quản trị
    if (isAdmin(user.email)) {
      router.push('/admin');
    }
  }, [user, router]);

  if (!user) return null;

  const orderHistory = [
    {
      id: 'DH001',
      date: '2024-11-15',
      product: 'Tranh Phong Cảnh Núi Non',
      price: 299000,
      status: 'Đã giao',
    },
    {
      id: 'DH002',
      date: '2024-11-10',
      product: 'Tranh Hoa Anh Đào',
      price: 199000,
      status: 'Đang giao',
    },
    {
      id: 'DH003',
      date: '2024-11-05',
      product: 'Tranh Biển Hoàng Hôn',
      price: 349000,
      status: 'Đã giao',
    },
  ];

  const vouchers = [
    { code: 'WINTER2024', discount: '20%', expiry: '31/12/2024', status: 'Còn hạn' },
    { code: 'NEWYEAR', discount: '100K', expiry: '15/01/2025', status: 'Còn hạn' },
    { code: 'FLASH50', discount: '50K', expiry: '20/11/2024', status: 'Hết hạn' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-8 relative">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-purple-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
              {user.displayName?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {user.displayName || 'Khách hàng'}
              </h1>
              <p className="text-gray-600">{user.email}</p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-lg mb-6">
          <div className="flex border-b overflow-x-auto">
            <button
              onClick={() => setActiveTab('info')}
              className={`flex-1 py-4 px-6 font-semibold whitespace-nowrap ${
                activeTab === 'info'
                  ? 'border-b-2 border-purple-600 text-purple-600'
                  : 'text-gray-600'
              }`}
            >
              📋 Thông Tin Cá Nhân
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`flex-1 py-4 px-6 font-semibold whitespace-nowrap ${
                activeTab === 'orders'
                  ? 'border-b-2 border-purple-600 text-purple-600'
                  : 'text-gray-600'
              }`}
            >
              📦 Đơn Hàng & Lịch Sử
            </button>
            <button
              onClick={() => setActiveTab('favorites')}
              className={`flex-1 py-4 px-6 font-semibold whitespace-nowrap ${
                activeTab === 'favorites'
                  ? 'border-b-2 border-purple-600 text-purple-600'
                  : 'text-gray-600'
              }`}
            >
              ❤️ Yêu Thích {hydrated && `(${favorites.length})`}
            </button>
            <button
              onClick={() => setActiveTab('utilities')}
              className={`flex-1 py-4 px-6 font-semibold whitespace-nowrap ${
                activeTab === 'utilities'
                  ? 'border-b-2 border-purple-600 text-purple-600'
                  : 'text-gray-600'
              }`}
            >
              🎁 Tiện Ích
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          {/* Thông Tin Cá Nhân */}
          {activeTab === 'info' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Thông Tin Cá Nhân</h2>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Họ và Tên</label>
                  <input
                    type="text"
                    value={user.displayName || ''}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    readOnly
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={user.email || ''}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
                    readOnly
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Số Điện Thoại
                  </label>
                  <input
                    type="tel"
                    placeholder="Chưa cập nhật"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ngày Sinh</label>
                  <input
                    type="date"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Địa Chỉ</label>
                  <textarea
                    rows={3}
                    placeholder="Nhập địa chỉ giao hàng..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div className="pt-4">
                <button className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold">
                  💾 Lưu Thay Đổi
                </button>
              </div>
            </div>
          )}

          {/* Đơn Hàng & Lịch Sử */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Đơn Hàng & Lịch Sử Mua Hàng</h2>

              {orderHistory.map((order) => (
                <div
                  key={order.id}
                  className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-bold text-lg text-gray-900">{order.product}</h3>
                      <p className="text-sm text-gray-600">Mã đơn hàng: {order.id}</p>
                      <p className="text-sm text-gray-600">Ngày đặt: {order.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-purple-600">
                        {order.price.toLocaleString('vi-VN')}₫
                      </p>
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                          order.status === 'Đã giao'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-blue-100 text-blue-700'
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <button className="px-4 py-2 border border-purple-600 text-purple-600 rounded-lg font-semibold">
                      Xem Chi Tiết
                    </button>
                    {order.status === 'Đã giao' && (
                      <button className="px-4 py-2 bg-purple-600 text-white rounded-lg font-semibold">
                        Mua Lại
                      </button>
                    )}
                  </div>
                </div>
              ))}

              {orderHistory.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">Bạn chưa có đơn hàng nào</p>
                  <button className="mt-4 bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold">
                    Khám Phá Sản Phẩm
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Yêu Thích */}
          {activeTab === 'favorites' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                ❤️ Sản Phẩm Yêu Thích {hydrated && `(${favorites.length})`}
              </h2>

              {hydrated && favorites.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {favorites.map((product) => (
                    <div
                      key={product.id}
                      className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow duration-300"
                    >
                      {/* Product Image */}
                      <div className="relative h-48 bg-gradient-to-br from-purple-100 to-pink-100">
                        <Image
                          src={product.thumbnailUrl}
                          alt={product.title}
                          fill
                          className="object-cover"
                        />
                      </div>

                      {/* Product Info */}
                      <div className="p-4">
                        <h3 className="font-bold text-lg mb-2 line-clamp-2 text-gray-800">
                          {product.title}
                        </h3>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 mb-3">
                          <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs font-semibold">
                            {product.difficulty}
                          </span>
                          <span className="bg-pink-100 text-pink-700 px-2 py-1 rounded-full text-xs font-semibold">
                            {product.colors} màu
                          </span>
                        </div>

                        {/* Price */}
                        <p className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
                          {product.price.toLocaleString('vi-VN')}₫
                        </p>

                        {/* Actions */}
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              addItem(product);
                              toast.success('Đã thêm vào giỏ hàng!');
                            }}
                            className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2 px-4 rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                          >
                            <FaShoppingCart /> Thêm Vào Giỏ
                          </button>
                          <button
                            onClick={() => {
                              removeFavorite(product.id);
                              toast.success('Đã xóa khỏi yêu thích!');
                            }}
                            className="bg-red-100 text-red-600 p-2 rounded-lg hover:bg-red-200 transition-all"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 bg-white rounded-xl border border-gray-200">
                  <FaHeart className="text-6xl text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-700 mb-2">
                    Chưa có sản phẩm yêu thích
                  </h3>
                  <p className="text-gray-500 mb-6">
                    Hãy thêm những sản phẩm bạn thích vào danh sách này
                  </p>
                  <button
                    onClick={() => router.push('/gallery')}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
                  >
                    Khám Phá Gallery
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Tiện Ích */}
          {activeTab === 'utilities' && (
            <div className="space-y-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Tiện Ích Khách Hàng</h2>

              {/* Ví Trả Sau */}
              <div className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <span className="text-3xl">💳</span>
                    <div>
                      <h3 className="font-bold text-lg text-gray-900">Ví Trả Sau</h3>
                      <p className="text-sm text-gray-600">Mua trước, trả sau - Không lãi suất</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Hạn mức khả dụng</p>
                    <p className="text-2xl font-bold text-purple-600">5.000.000₫</p>
                  </div>
                </div>
                <button className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold">
                  Kích Hoạt Ví Trả Sau
                </button>
              </div>

              {/* Kho Voucher */}
              <div className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <span className="text-3xl">🎟️</span>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">Kho Voucher</h3>
                    <p className="text-sm text-gray-600">Các mã giảm giá của bạn</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {vouchers.map((voucher, index) => (
                    <div
                      key={index}
                      className={`flex justify-between items-center p-4 rounded-lg border-2 ${
                        voucher.status === 'Còn hạn'
                          ? 'border-purple-300 bg-purple-50'
                          : 'border-gray-200 bg-gray-50'
                      }`}
                    >
                      <div>
                        <p className="font-bold text-lg text-gray-900">{voucher.code}</p>
                        <p className="text-sm text-gray-600">
                          Giảm {voucher.discount} - HSD: {voucher.expiry}
                        </p>
                      </div>
                      <button
                        disabled={voucher.status === 'Hết hạn'}
                        className={`px-4 py-2 rounded-lg font-semibold ${
                          voucher.status === 'Còn hạn'
                            ? 'bg-purple-600 text-white'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        {voucher.status === 'Còn hạn' ? 'Sử Dụng' : 'Hết hạn'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Điểm Tích Lũy */}
              <div className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <span className="text-3xl">⭐</span>
                    <div>
                      <h3 className="font-bold text-lg text-gray-900">Điểm Tích Lũy</h3>
                      <p className="text-sm text-gray-600">Tích điểm đổi quà</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Điểm hiện tại</p>
                    <p className="text-2xl font-bold text-purple-600">1,250 điểm</p>
                  </div>
                </div>
                <div className="bg-gray-100 rounded-lg p-4">
                  <p className="text-sm text-gray-700 mb-2">Cần thêm 250 điểm để lên hạng Bạc</p>
                  <div className="w-full bg-gray-300 rounded-full h-3">
                    <div className="bg-purple-600 h-3 rounded-full" style={{ width: '83%' }}></div>
                  </div>
                </div>
              </div>

              {/* Địa Chỉ Giao Hàng */}
              <div className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <span className="text-3xl">📍</span>
                    <div>
                      <h3 className="font-bold text-lg text-gray-900">Địa Chỉ Giao Hàng</h3>
                      <p className="text-sm text-gray-600">Quản lý địa chỉ nhận hàng</p>
                    </div>
                  </div>
                  <button className="bg-purple-600 text-white px-4 py-2 rounded-lg font-semibold">
                    + Thêm Địa Chỉ
                  </button>
                </div>
                <div className="text-center py-8 text-gray-500">
                  Bạn chưa có địa chỉ giao hàng nào
                </div>
              </div>

              {/* Hỗ Trợ Khách Hàng */}
              <div className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <span className="text-3xl">💬</span>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">Hỗ Trợ Khách Hàng</h3>
                    <p className="text-sm text-gray-600">Chúng tôi luôn sẵn sàng hỗ trợ bạn</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {/* Trung Tâm Trợ Giúp */}
                  <div className="border border-purple-200 rounded-lg p-6 hover:shadow-md transition">
                    <div className="text-center">
                      <span className="text-5xl mb-4 block">📚</span>
                      <h4 className="font-bold text-lg text-gray-900 mb-2">Trung Tâm Trợ Giúp</h4>
                      <p className="text-sm text-gray-600 mb-4">
                        Tìm câu trả lời cho các câu hỏi thường gặp
                      </p>
                      <button className="w-full bg-white border-2 border-purple-600 text-purple-600 px-4 py-3 rounded-lg font-semibold hover:bg-purple-50 transition">
                        Xem Hướng Dẫn
                      </button>
                    </div>
                  </div>

                  {/* Trò Chuyện với Admin */}
                  <div className="border border-purple-200 rounded-lg p-6 hover:shadow-md transition bg-purple-50">
                    <div className="text-center">
                      <span className="text-5xl mb-4 block">👨‍💼</span>
                      <h4 className="font-bold text-lg text-gray-900 mb-2">Trò Chuyện với Admin</h4>
                      <p className="text-sm text-gray-600 mb-4">
                        Chat trực tiếp với đội ngũ hỗ trợ
                      </p>
                      <button className="w-full bg-purple-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-purple-700 transition">
                        Bắt Đầu Chat
                      </button>
                    </div>
                  </div>
                </div>

                {/* Thông Tin Liên Hệ */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="grid md:grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">📞 Hotline</p>
                      <p className="font-bold text-purple-600">1900 1234</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">📧 Email</p>
                      <p className="font-bold text-purple-600">support@paintbynumbers.com</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">⏰ Giờ làm việc</p>
                      <p className="font-bold text-purple-600">8:00 - 22:00 (T2-CN)</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
