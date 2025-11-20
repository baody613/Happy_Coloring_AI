'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { isAdmin } from '@/lib/adminConfig';
import { adminAPI } from '@/lib/adminAPI';

interface Product {
  id: string;
  title: string;
  price: number;
  imageUrl: string;
  status: string;
  sales: number;
  difficulty: string;
  createdAt: string;
}

export default function AdminProductsPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [priceDisplay, setPriceDisplay] = useState('');
  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    category: string;
    price: number;
    imageUrl: string;
    thumbnailUrl: string;
    difficulty: 'easy' | 'medium' | 'hard';
    colors: number;
  }>({
    title: '',
    description: '',
    category: 'paint-by-numbers',
    price: 0,
    imageUrl: '',
    thumbnailUrl: '',
    difficulty: 'medium',
    colors: 24,
  });

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    if (!isAdmin(user.email)) {
      router.push('/');
      return;
    }

    loadProducts();
    setLoading(false);
  }, [user, router]);

  const loadProducts = async () => {
    try {
      const data = await adminAPI.products.getAll();
      setProducts(data.products || []);
    } catch (error) {
      console.error('Error loading products:', error);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Vui lòng chọn file hình ảnh!');
      return;
    }

    // Validate file size (max 5MB for ImgBB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Kích thước ảnh không được vượt quá 5MB!');
      return;
    }

    try {
      setUploadingImage(true);

      // Upload to ImgBB (Free image hosting)
      const uploadFormData = new FormData();
      uploadFormData.append('image', file);

      // ImgBB API key from environment
      const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY || '9c3a8f6d4e8c8b5a8e4f9d6b5c8a7e9f';

      const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: 'POST',
        body: uploadFormData,
      });

      const data = await response.json();

      if (data.success) {
        const imageUrl = data.data.url;
        setFormData((prev) => ({ ...prev, imageUrl, thumbnailUrl: imageUrl }));
        alert('✅ Tải ảnh lên thành công!');
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('❌ Có lỗi khi tải ảnh lên! Vui lòng nhập URL thay thế.');
    } finally {
      setUploadingImage(false);
    }
  };

  const formatPrice = (value: string) => {
    // Remove non-digit characters
    const numbers = value.replace(/\D/g, '');
    if (!numbers) return '';

    // Convert to number and format with thousands separator
    const num = parseInt(numbers);
    return num.toLocaleString('vi-VN');
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numbers = value.replace(/\D/g, '');
    const numValue = numbers ? parseInt(numbers) : 0;

    setFormData({ ...formData, price: numValue });
    setPriceDisplay(formatPrice(numbers));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.title.trim()) {
      alert('Vui lòng nhập tên sản phẩm!');
      return;
    }
    if (formData.price <= 0) {
      alert('Vui lòng nhập giá sản phẩm hợp lệ!');
      return;
    }
    if (!formData.imageUrl) {
      alert('Vui lòng tải lên hình ảnh sản phẩm!');
      return;
    }

    try {
      if (editingProduct) {
        await adminAPI.products.update(editingProduct.id, formData);
        alert('Cập nhật sản phẩm thành công!');
      } else {
        await adminAPI.products.create(formData);
        alert('Thêm sản phẩm thành công!');
      }
      setShowAddForm(false);
      setEditingProduct(null);
      setPriceDisplay('');
      setFormData({
        title: '',
        description: '',
        category: 'paint-by-numbers',
        price: 0,
        imageUrl: '',
        thumbnailUrl: '',
        difficulty: 'medium',
        colors: 24,
      });
      loadProducts();
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Có lỗi xảy ra!');
    }
  };

  const handleDelete = async (productId: string) => {
    if (!confirm('Bạn có chắc muốn xóa sản phẩm này?')) return;

    try {
      await adminAPI.products.delete(productId);
      alert('Xóa sản phẩm thành công!');
      loadProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Có lỗi xảy ra!');
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setPriceDisplay(product.price.toLocaleString('vi-VN'));
    setFormData({
      title: product.title,
      description: '',
      category: 'paint-by-numbers',
      price: product.price,
      imageUrl: product.imageUrl,
      thumbnailUrl: product.imageUrl,
      difficulty: (product.difficulty || 'medium') as 'easy' | 'medium' | 'hard',
      colors: 24,
    });
    setShowAddForm(true);
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
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link
              href="/admin"
              className="text-purple-600 hover:text-purple-700 hover:underline mb-3 inline-flex items-center gap-2 font-medium transition-colors"
            >
              <span>←</span> Quay lại Dashboard
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-2xl shadow-lg">
                🎨
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Quản Lý Sản Phẩm
              </h1>
            </div>
          </div>
          <button
            onClick={() => {
              setShowAddForm(!showAddForm);
              setEditingProduct(null);
              setPriceDisplay('');
              setFormData({
                title: '',
                description: '',
                category: 'paint-by-numbers',
                price: 0,
                imageUrl: '',
                thumbnailUrl: '',
                difficulty: 'medium',
                colors: 24,
              });
            }}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:shadow-xl text-white px-8 py-3 rounded-xl font-semibold transition-all transform hover:scale-105"
          >
            {showAddForm ? '❌ Đóng Form' : '➕ Thêm Sản Phẩm'}
          </button>
        </div>

        {/* Add/Edit Form */}
        {showAddForm && (
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-gray-800">
              <span className="text-3xl">{editingProduct ? '✏️' : '➕'}</span>
              {editingProduct ? 'Chỉnh Sửa Sản Phẩm' : 'Thêm Sản Phẩm Mới'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">
                    Tên Sản Phẩm *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Nhập tên sản phẩm..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 placeholder-gray-400 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">Giá *</label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={priceDisplay}
                      onChange={handlePriceChange}
                      placeholder="0"
                      className="w-full px-4 py-3 pr-16 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 placeholder-gray-400 transition-all"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">
                      .000đ
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Ví dụ: Nhập "150" = 150.000đ</p>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold mb-2 text-gray-700">
                    Hình Ảnh Sản Phẩm *
                  </label>
                  <div className="space-y-3">
                    {/* Upload Button */}
                    <div className="flex gap-3">
                      <label className="flex-1 cursor-pointer">
                        <div className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-600 hover:shadow-lg text-white rounded-lg font-semibold transition-all transform hover:scale-105">
                          <span>📁</span>
                          <span>{uploadingImage ? 'Đang tải...' : 'Chọn Ảnh Từ Máy Tính'}</span>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          disabled={uploadingImage}
                          className="hidden"
                        />
                      </label>
                      <span className="flex items-center text-gray-400 font-semibold">HOẶC</span>
                      <div className="flex-1"></div>
                    </div>

                    {/* URL Input */}
                    <input
                      type="text"
                      required
                      value={formData.imageUrl}
                      onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                      placeholder="Hoặc nhập URL hình ảnh (https://...)"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 placeholder-gray-400 transition-all"
                    />

                    {/* Image Preview */}
                    {formData.imageUrl && (
                      <div className="mt-3 p-4 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50">
                        <p className="text-sm font-semibold text-gray-700 mb-2">Xem trước:</p>
                        <img
                          src={formData.imageUrl}
                          alt="Preview"
                          className="w-48 h-48 object-cover rounded-lg shadow-md border border-gray-200"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23ddd" width="200" height="200"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle"%3EKh%C3%B4ng t%E1%BA%A3i %C4%91%C6%B0%E1%BB%A3c%3C/text%3E%3C/svg%3E';
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">Độ Khó</label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        difficulty: e.target.value as 'easy' | 'medium' | 'hard',
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 bg-white transition-all"
                  >
                    <option value="easy">Dễ</option>
                    <option value="medium">Trung Bình</option>
                    <option value="hard">Khó</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold mb-2 text-gray-700">Mô Tả</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Mô tả chi tiết về sản phẩm..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 placeholder-gray-400 transition-all resize-none"
                    rows={4}
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:shadow-xl text-white px-8 py-3 rounded-xl font-semibold transition-all transform hover:scale-105"
                >
                  {editingProduct ? '💾 Cập Nhật' : '➕ Thêm Mới'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingProduct(null);
                    setPriceDisplay('');
                    setFormData({
                      title: '',
                      description: '',
                      category: 'paint-by-numbers',
                      price: 0,
                      imageUrl: '',
                      thumbnailUrl: '',
                      difficulty: 'medium',
                      colors: 24,
                    });
                  }}
                  className="bg-gray-500 hover:bg-gray-600 hover:shadow-lg text-white px-8 py-3 rounded-xl font-semibold transition-all"
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Products Table */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold">Hình Ảnh</th>
                  <th className="px-6 py-4 text-left font-semibold">Tên Sản Phẩm</th>
                  <th className="px-6 py-4 text-left font-semibold">Giá</th>
                  <th className="px-6 py-4 text-left font-semibold">Độ Khó</th>
                  <th className="px-6 py-4 text-left font-semibold">Trạng Thái</th>
                  <th className="px-6 py-4 text-left font-semibold">Đã Bán</th>
                  <th className="px-6 py-4 text-left font-semibold">Thao Tác</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr
                    key={product.id}
                    className="border-b border-gray-100 hover:bg-purple-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <img
                        src={product.imageUrl}
                        alt={product.title}
                        className="w-20 h-20 object-cover rounded-xl shadow-md border border-gray-200"
                      />
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-900">{product.title}</td>
                    <td className="px-6 py-4 font-bold text-purple-600">
                      {product.price.toLocaleString('vi-VN')}đ
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1.5 rounded-lg text-sm font-semibold border ${
                          product.difficulty === 'easy'
                            ? 'bg-green-100 text-green-700 border-green-200'
                            : product.difficulty === 'hard'
                            ? 'bg-red-100 text-red-700 border-red-200'
                            : 'bg-yellow-100 text-yellow-700 border-yellow-200'
                        }`}
                      >
                        {product.difficulty === 'easy'
                          ? '🟢 Dễ'
                          : product.difficulty === 'hard'
                          ? '🔴 Khó'
                          : '🟡 Trung Bình'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1.5 rounded-lg text-sm font-semibold border ${
                          product.status === 'active'
                            ? 'bg-green-100 text-green-700 border-green-200'
                            : 'bg-gray-100 text-gray-700 border-gray-200'
                        }`}
                      >
                        {product.status === 'active' ? '✅ Hoạt động' : '⏸️ Ẩn'}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-700">{product.sales} đơn</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(product)}
                          className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:shadow-lg text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all transform hover:scale-105"
                        >
                          ✏️ Sửa
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="bg-gradient-to-r from-red-500 to-pink-600 hover:shadow-lg text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all transform hover:scale-105"
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
          {products.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🎨</div>
              <div className="text-gray-500 text-lg">Chưa có sản phẩm nào</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
