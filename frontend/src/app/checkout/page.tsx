"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useCartStore } from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore";
import { useHydration } from "@/hooks";
import {
  FaShoppingBag,
  FaCreditCard,
  FaMoneyBillWave,
  FaMobile,
  FaUniversity,
} from "react-icons/fa";
import { SiVisa } from "react-icons/si";
import { Product } from "@/types";
import toast from "react-hot-toast";
import { safeLocalStorage } from "@/lib/safeStorage";
import { createPayment } from "@/lib/paymentAPI";
import api from "@/lib/api";

export default function CheckoutPage() {
  const router = useRouter();
  const hydrated = useHydration();
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
  const [bankingInfo, setBankingInfo] = useState<{
    enabled: boolean;
    bankName: string;
    accountNumber: string;
    accountName: string;
    qrImageUrl: string;
  } | null>(null);
  const [showBankingQuickView, setShowBankingQuickView] = useState(false);

  // Filter only selected items
  const selectedCartItems = items.filter((item) =>
    selectedItems.includes(item.product.id),
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
    // Không redirect khi đang xử lý thanh toán
    if (isProcessing) return;

    if (!user) {
      toast.error("Vui lòng đăng nhập để thanh toán!");
      router.push("/login");
      return;
    }

    if (selectedCartItems.length === 0) {
      toast.error("Vui lòng chọn sản phẩm để thanh toán!");
      router.push("/cart");
    }
  }, [user, selectedCartItems.length, router, isProcessing]);

  useEffect(() => {
    api
      .get("/payment/banking-info")
      .then((res) => {
        const data = res.data?.data || res.data;
        setBankingInfo({
          enabled: Boolean(data?.enabled),
          bankName: data?.bankName || "",
          accountNumber: data?.accountNumber || "",
          accountName: data?.accountName || "",
          qrImageUrl: data?.qrImageUrl || "",
        });
      })
      .catch(() => {
        setBankingInfo(null);
      });
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "paymentMethod") {
      if (value === "banking" && bankingInfo?.enabled) {
        setShowBankingQuickView(true);
      } else {
        setShowBankingQuickView(false);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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
    setIsProcessing(true);

    try {
      const aiGeneratedImageUrl =
        selectedCartItems.find(
          (item) =>
            item.product.category === "ai-products" ||
            item.product.category === "Sản Phẩm AI",
        )?.product.imageUrl || "";

      // Tạo đơn hàng
      const orderData = {
        userId: user?.uid,
        items: selectedCartItems.map((item) => ({
          productId: item.product.id,
          title: item.product.title,
          price: item.product.price,
          quantity: item.quantity,
          imageUrl: item.product.imageUrl,
          category: item.product.category,
          isAIProduct:
            item.product.category === "ai-products" ||
            item.product.category === "Sản Phẩm AI",
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

      // Gửi API tạo đơn hàng — api interceptor tự động đính bearer token
      const orderResponse = await api.post("/orders", orderData);

      const createdOrder = orderResponse.data.data;

      if (!createdOrder || !createdOrder.id) {
        throw new Error("Invalid order response - missing order ID");
      }

      // Xử lý theo phương thức thanh toán
      if (
        formData.paymentMethod === "vnpay" ||
        formData.paymentMethod === "momo"
      ) {
        // Tạo payment URL
        const paymentResponse = await createPayment({
          orderId: createdOrder.id,
          paymentMethod: formData.paymentMethod,
        });

        if (paymentResponse.success && paymentResponse.data?.paymentUrl) {
          // Lưu thông tin đơn hàng trước khi redirect
          safeLocalStorage.setItem(
            "lastOrder",
            JSON.stringify({
              orderId: createdOrder.id,
              totalAmount: orderData.totalAmount,
              itemCount: selectedCartItems.length,
              email: formData.email,
              paymentMethod: formData.paymentMethod,
              aiGeneratedImageUrl,
            }),
          );

          // Redirect đến payment gateway
          window.location.href = paymentResponse.data.paymentUrl;
          return;
        }
      }

      // Nếu COD hoặc không có payment URL

      safeLocalStorage.setItem(
        "lastOrder",
        JSON.stringify({
          orderId: createdOrder.id,
          totalAmount: orderData.totalAmount,
          itemCount: selectedCartItems.length,
          email: formData.email,
          voucherCode: orderData.voucherCode,
          voucherDiscount: orderData.voucherDiscount,
          aiGeneratedImageUrl,
        }),
      );

      console.log("✅ localStorage saved!");
      console.log("🚀 Redirecting to order-success...");

      toast.success("Đặt hàng thành công!");

      // Dùng window.location.href thay vì router.push để tránh useEffect redirect về cart
      window.location.href = "/order-success";

      // Không cần clearSelectedItems ở đây - order-success page sẽ tự clear
    } catch (error: any) {
      toast.error(error?.message || "Có lỗi xảy ra khi đặt hàng!");
    } finally {
      setIsProcessing(false);
    }
  };

  if (!hydrated || !user || items.length === 0) {
    return null;
  }

  return (
    <>
      {showBankingQuickView &&
        formData.paymentMethod === "banking" &&
        bankingInfo?.enabled &&
        bankingInfo.qrImageUrl && (
          <div
            className="fixed inset-0 z-[70] bg-black/55 backdrop-blur-[2px] flex items-center justify-center p-4"
            onClick={() => setShowBankingQuickView(false)}
          >
            <div
              className="w-full max-w-lg rounded-2xl bg-white shadow-2xl border border-indigo-100"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="px-5 py-4 border-b border-indigo-100 flex items-center justify-between">
                <h3 className="text-lg font-bold text-indigo-900">
                  QR Chuyển Khoản Nhanh
                </h3>
                <button
                  type="button"
                  onClick={() => setShowBankingQuickView(false)}
                  className="w-9 h-9 rounded-full text-gray-500 hover:bg-gray-100"
                  aria-label="Đóng xem nhanh QR"
                >
                  ✕
                </button>
              </div>

              <div className="p-5">
                <div className="space-y-1 text-sm text-gray-700 mb-4">
                  <p>
                    Ngân hàng:{" "}
                    <span className="font-semibold">
                      {bankingInfo.bankName || "-"}
                    </span>
                  </p>
                  <p>
                    Số tài khoản:{" "}
                    <span className="font-semibold">
                      {bankingInfo.accountNumber || "-"}
                    </span>
                  </p>
                  <p>
                    Chủ tài khoản:{" "}
                    <span className="font-semibold">
                      {bankingInfo.accountName || "-"}
                    </span>
                  </p>
                </div>

                <div className="mx-auto w-full max-w-[360px] aspect-square rounded-2xl border border-indigo-200 bg-white overflow-hidden">
                  <img
                    src={bankingInfo.qrImageUrl}
                    alt="QR chuyển khoản"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

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
                        value="vnpay"
                        checked={formData.paymentMethod === "vnpay"}
                        onChange={handleInputChange}
                        className="w-5 h-5 text-purple-600"
                      />
                      <SiVisa className="text-blue-600 text-2xl ml-3 mr-3" />
                      <div>
                        <div className="font-semibold text-gray-800">VNPay</div>
                        <div className="text-sm text-gray-600">
                          Thanh toán qua VNPay (ATM, Visa, Mastercard)
                        </div>
                      </div>
                    </label>

                    <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-purple-500 transition">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="momo"
                        checked={formData.paymentMethod === "momo"}
                        onChange={handleInputChange}
                        className="w-5 h-5 text-purple-600"
                      />
                      <FaMobile className="text-pink-600 text-2xl ml-3 mr-3" />
                      <div>
                        <div className="font-semibold text-gray-800">
                          MoMo E-Wallet
                        </div>
                        <div className="text-sm text-gray-600">
                          Thanh toán qua ví điện tử MoMo
                        </div>
                      </div>
                    </label>

                    {bankingInfo?.enabled && (
                      <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-purple-500 transition">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="banking"
                          checked={formData.paymentMethod === "banking"}
                          onChange={handleInputChange}
                          className="w-5 h-5 text-purple-600"
                        />
                        <FaUniversity className="text-indigo-600 text-2xl ml-3 mr-3" />
                        <div>
                          <div className="font-semibold text-gray-800">
                            Chuyển khoản ngân hàng
                          </div>
                          <div className="text-sm text-gray-600">
                            Quét mã QR để chuyển khoản nhanh
                          </div>
                        </div>
                      </label>
                    )}

                    {formData.paymentMethod === "banking" &&
                      bankingInfo?.enabled && (
                        <div className="p-4 rounded-lg border border-indigo-200 bg-indigo-50">
                          <h3 className="font-semibold text-indigo-800 mb-3">
                            Thông tin chuyển khoản
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4 items-start">
                            <div className="space-y-1 text-sm text-gray-700">
                              <p>
                                Ngân hàng:{" "}
                                <span className="font-semibold">
                                  {bankingInfo.bankName || "-"}
                                </span>
                              </p>
                              <p>
                                Số tài khoản:{" "}
                                <span className="font-semibold">
                                  {bankingInfo.accountNumber || "-"}
                                </span>
                              </p>
                              <p>
                                Chủ tài khoản:{" "}
                                <span className="font-semibold">
                                  {bankingInfo.accountName || "-"}
                                </span>
                              </p>

                              {bankingInfo.qrImageUrl && (
                                <button
                                  type="button"
                                  onClick={() => setShowBankingQuickView(true)}
                                  className="mt-3 inline-flex items-center px-3 py-2 text-sm font-semibold text-indigo-700 bg-white border border-indigo-300 rounded-lg hover:bg-indigo-50"
                                >
                                  Xem QR nhanh
                                </button>
                              )}
                            </div>

                            {bankingInfo.qrImageUrl && (
                              <div className="w-full max-w-[280px] aspect-square rounded-xl border border-indigo-200 bg-white overflow-hidden">
                                <img
                                  src={bankingInfo.qrImageUrl}
                                  alt="QR chuyển khoản"
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      )}
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
