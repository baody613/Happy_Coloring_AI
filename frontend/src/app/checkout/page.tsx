"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useCartStore } from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore";
import { FaShoppingBag, FaCreditCard, FaMoneyBillWave } from "react-icons/fa";
import { Product } from "@/types";
import toast from "react-hot-toast";
import { safeLocalStorage } from "@/lib/safeStorage";

// Mock products cho phần gợi ý
const mockProducts: Product[] = [
  {
    id: "p1",
    title: "Tranh Phong Cảnh Núi Non",
    description: "Tranh tô màu phong cảnh núi non tuyệt đẹp",
    category: "landscape",
    price: 299000,
    imageUrl:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200",
    difficulty: "medium",
    dimensions: "40x50cm",
    colors: 24,
    status: "active",
    sales: 150,
    rating: 4.8,
    reviews: [],
    createdAt: "2024-01-01",
  },
  {
    id: "p2",
    title: "Tranh Hoa Anh Đào",
    description: "Tranh hoa anh đào lãng mạn",
    category: "flowers",
    price: 199000,
    imageUrl:
      "https://images.unsplash.com/photo-1522383225653-ed111181a951?w=500",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1522383225653-ed111181a951?w=200",
    difficulty: "easy",
    dimensions: "30x40cm",
    colors: 18,
    status: "active",
    sales: 200,
    rating: 4.9,
    reviews: [],
    createdAt: "2024-01-02",
  },
  {
    id: "p3",
    title: "Tranh Động Vật Dễ Thương",
    description: "Tranh động vật đáng yêu cho bé",
    category: "animals",
    price: 249000,
    imageUrl:
      "https://images.unsplash.com/photo-1425082661705-1834bfd09dca?w=500",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1425082661705-1834bfd09dca?w=200",
    difficulty: "easy",
    dimensions: "35x45cm",
    colors: 20,
    status: "active",
    sales: 180,
    rating: 4.7,
    reviews: [],
    createdAt: "2024-01-03",
  },
];

export default function CheckoutPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const {
    items,
    selectedItems,
    getTotalPrice,
    clearCart,
    addItem,
    getDiscountedTotal,
    voucherCode,
    voucherDiscount,
    clearSelectedItems,
  } = useCartStore();
  const [isProcessing, setIsProcessing] = useState(false);

  // Filter only selected items
  const selectedCartItems = items.filter((item) =>
    selectedItems.includes(item.product.id)
  );
  const [formData, setFormData] = useState({
    fullName: user?.displayName || "",
    email: user?.email || "",
    phone: "",
    address: "",
    city: "",
    district: "",
    ward: "",
    note: "",
    paymentMethod: "cod", // cod, bank_transfer, credit_card
  });

  useEffect(() => {
    if (!user) {
      toast.error("Vui lòng đăng nhập để thanh toán!");
      router.push("/login");
      return;
    }

    if (selectedCartItems.length === 0) {
      toast.error("Vui lòng chọn sản phẩm để thanh toán!");
      router.push("/cart");
    }
  }, [user, selectedCartItems.length, router]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log("Form submitted!", formData);
    console.log("Selected items:", selectedCartItems);

    // Validation
    if (
      !formData.fullName ||
      !formData.phone ||
      !formData.address ||
      !formData.city
    ) {
      toast.error("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    if (!/^[0-9]{10,11}$/.test(formData.phone)) {
      toast.error("Số điện thoại không hợp lệ!");
      return;
    }

    console.log("Validation passed!");
    setIsProcessing(true);

    try {
      // Tạo đơn hàng
      const orderData = {
        userId: user?.uid,
        items: selectedCartItems.map((item) => ({
          productId: item.product.id,
          title: item.product.title,
          price: item.product.price,
          quantity: item.quantity,
          imageUrl: item.product.imageUrl,
        })),
        shippingAddress: {
          fullName: formData.fullName,
          phone: formData.phone,
          address: formData.address,
          ward: formData.ward,
          district: formData.district,
          city: formData.city,
        },
        totalAmount: getDiscountedTotal(),
        originalAmount: getTotalPrice(),
        voucherCode: voucherCode || null,
        voucherDiscount: voucherDiscount || 0,
        paymentMethod: formData.paymentMethod,
        note: formData.note,
        status: "pending",
        createdAt: new Date().toISOString(),
      };

      // TODO: Gửi API tạo đơn hàng
      console.log("Order Data:", orderData);

      // Giả lập API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Lưu thông tin đơn hàng vào localStorage để hiển thị ở trang success
      safeLocalStorage.setItem(
        "lastOrder",
        JSON.stringify({
          totalAmount: orderData.totalAmount,
          itemCount: selectedCartItems.length,
          email: formData.email,
          voucherCode: orderData.voucherCode,
          voucherDiscount: orderData.voucherDiscount,
        })
      );

      console.log("Order data saved to localStorage");
      console.log("Clearing selected items...");

      // Xóa các sản phẩm đã chọn khỏi giỏ hàng
      clearSelectedItems();

      console.log("Redirecting to order-success page...");

      // Chuyển hướng đến trang thông báo thành công - dùng window.location để force reload
      window.location.href = "/order-success";

      console.log("Window.location.href called!");
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("Có lỗi xảy ra khi đặt hàng!");
    } finally {
      setIsProcessing(false);
    }
  };

  if (!user || items.length === 0) {
    return null;
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Header */}
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
              <FaShoppingBag className="text-purple-600" />
              Thanh Toán Đơn Hàng
            </h1>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Side - Shipping Info */}
              <div className="lg:col-span-2 space-y-6">
                {/* Thông tin người nhận */}
                <div className="bg-white rounded-xl shadow-md p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-4">
                    📋 Thông Tin Người Nhận
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Họ và Tên *
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
                        placeholder="Nguyễn Văn A"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Số Điện Thoại *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
                        placeholder="0123456789"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-50 text-gray-900"
                        placeholder="email@example.com"
                        readOnly
                      />
                    </div>
                  </div>
                </div>

                {/* Địa chỉ giao hàng */}
                <div className="bg-white rounded-xl shadow-md p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-4">
                    📍 Địa Chỉ Giao Hàng
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Tỉnh/Thành Phố *
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
                        placeholder="TP. Hồ Chí Minh"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Quận/Huyện
                      </label>
                      <input
                        type="text"
                        name="district"
                        value={formData.district}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
                        placeholder="Quận 1"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Phường/Xã
                      </label>
                      <input
                        type="text"
                        name="ward"
                        value={formData.ward}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
                        placeholder="Phường Bến Nghé"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Địa Chỉ Chi Tiết *
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
                      placeholder="Số nhà, tên đường..."
                    />
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Ghi Chú (Tùy chọn)
                    </label>
                    <textarea
                      name="note"
                      value={formData.note}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none text-gray-900"
                      placeholder="Ghi chú thêm cho đơn hàng..."
                    />
                  </div>
                </div>

                {/* Phương thức thanh toán */}
                <div className="bg-white rounded-xl shadow-md p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-4">
                    💳 Phương Thức Thanh Toán
                  </h2>
                  <div className="space-y-3">
                    <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-purple-500 transition">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cod"
                        checked={formData.paymentMethod === "cod"}
                        onChange={handleInputChange}
                        className="w-5 h-5 text-purple-600"
                      />
                      <FaMoneyBillWave className="text-green-600 text-2xl ml-3 mr-3" />
                      <div>
                        <div className="font-semibold text-gray-800">
                          Thanh Toán Khi Nhận Hàng (COD)
                        </div>
                        <div className="text-sm text-gray-600">
                          Thanh toán bằng tiền mặt khi nhận hàng
                        </div>
                      </div>
                    </label>

                    <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-purple-500 transition">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="bank_transfer"
                        checked={formData.paymentMethod === "bank_transfer"}
                        onChange={handleInputChange}
                        className="w-5 h-5 text-purple-600"
                      />
                      <FaCreditCard className="text-blue-600 text-2xl ml-3 mr-3" />
                      <div>
                        <div className="font-semibold text-gray-800">
                          Chuyển Khoản Ngân Hàng
                        </div>
                        <div className="text-sm text-gray-600">
                          Chuyển khoản qua ngân hàng (sẽ được hướng dẫn sau)
                        </div>
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Right Side - Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-xl shadow-xl p-6 sticky top-24">
                  <h2 className="text-xl font-bold text-gray-800 mb-4">
                    📦 Đơn Hàng Của Bạn ({selectedCartItems.length} sản phẩm)
                  </h2>

                  {/* Product List */}
                  <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                    {selectedCartItems.map((item) => (
                      <div
                        key={item.product.id}
                        className="flex gap-3 pb-3 border-b border-gray-100"
                      >
                        <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden">
                          <Image
                            src={item.product.imageUrl}
                            alt={item.product.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-sm text-gray-800 line-clamp-2">
                            {item.product.title}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {item.quantity} x{" "}
                            {item.product.price.toLocaleString("vi-VN")} VNĐ
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Price Summary */}
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-gray-600">
                      <span>Tạm tính:</span>
                      <span className="font-semibold">
                        {getDiscountedTotal().toLocaleString("vi-VN")} VNĐ
                      </span>
                    </div>
                    {voucherDiscount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>
                          Giảm giá ({voucherCode} - {voucherDiscount}%):
                        </span>
                        <span className="font-semibold">
                          -
                          {(
                            (getDiscountedTotal() / (100 - voucherDiscount)) *
                              100 -
                            getDiscountedTotal()
                          ).toLocaleString("vi-VN")}{" "}
                          VNĐ
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between text-gray-600">
                      <span>Phí vận chuyển:</span>
                      <span className="font-semibold text-green-600">
                        Miễn phí
                      </span>
                    </div>
                    <div className="border-t border-gray-200 pt-3">
                      <div className="flex justify-between text-xl font-bold text-gray-800">
                        <span>Tổng cộng:</span>
                        <span className="text-purple-600">
                          {getDiscountedTotal().toLocaleString("vi-VN")} VNĐ
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl font-bold text-lg hover:shadow-xl transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {isProcessing ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg
                          className="animate-spin h-5 w-5"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        Đang xử lý...
                      </span>
                    ) : (
                      <>
                        <FaShoppingBag className="inline mr-2" />
                        Đặt Hàng
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
