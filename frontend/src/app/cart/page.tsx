"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore";
import { useFavoriteStore } from "@/store/favoriteStore";
import { useHydration } from "@/hooks";
import { isAdmin } from "@/lib/adminConfig";
import {
  FaTrash,
  FaMinus,
  FaPlus,
  FaShoppingBag,
  FaHeart,
  FaRegHeart,
  FaTicketAlt,
  FaTimes,
  FaCheck,
} from "react-icons/fa";
import toast from "react-hot-toast";

export default function CartPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { addFavorite, removeFavorite, isFavorite, setCurrentUser } =
    useFavoriteStore();
  const hydrated = useHydration();

  useEffect(() => {
    if (hydrated && user && isAdmin(user.email)) {
      router.replace("/admin");
    }
  }, [hydrated, user, router]);

  useEffect(() => {
    setCurrentUser(user?.uid || null);
  }, [setCurrentUser, user?.uid]);

  const {
    items,
    savedForLater,
    selectedItems,
    voucherCode,
    voucherDiscount,
    removeItem,
    updateQuantity,
    getTotalPrice,
    clearCart,
    toggleSelectItem,
    selectAllItems,
    deselectAllItems,
    moveToSavedForLater,
    moveToCart,
    removeSavedItem,
    applyVoucher,
    removeVoucher,
    getSelectedTotal,
    getDiscountedTotal,
  } = useCartStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [voucherInput, setVoucherInput] = useState("");
  const [showVoucherInput, setShowVoucherInput] = useState(false);

  const handleCheckout = () => {
    if (selectedItems.length === 0) {
      toast.error("Vui lòng chọn sản phẩm để thanh toán!");
      return;
    }
    router.push("/checkout");
  };

  const handleClearCart = () => {
    if (confirm("Bạn có chắc muốn xóa toàn bộ giỏ hàng?")) {
      clearCart();
      toast.success("Đã xóa toàn bộ giỏ hàng!");
    }
  };

  const handleApplyVoucher = () => {
    if (!voucherInput.trim()) {
      toast.error("Vui lòng nhập mã voucher!");
      return;
    }

    if (applyVoucher(voucherInput)) {
      toast.success(`Áp dụng voucher thành công! Giảm ${voucherDiscount}%`);
      setVoucherInput("");
      setShowVoucherInput(false);
    } else {
      toast.error("Mã voucher không hợp lệ!");
    }
  };

  const handleSelectAll = () => {
    if (selectedItems.length === items.length) {
      deselectAllItems();
    } else {
      selectAllItems();
    }
  };

  const handleMoveToSavedForLater = (productId: string) => {
    const cartItem = items.find((item) => item.product.id === productId);
    if (!cartItem) return;

    const favorited = isFavorite(productId);

    if (favorited) {
      removeFavorite(productId);
      toast("Đã chuyển vào Mua Sau và xóa khỏi yêu thích", {
        icon: "💔",
        duration: 1800,
      });
    } else {
      addFavorite(cartItem.product);
      toast.success("Đã chuyển vào Mua Sau và thêm vào yêu thích!", {
        icon: "❤️",
        duration: 1800,
      });
    }

    moveToSavedForLater(productId);
  };

  // Prevent hydration mismatch
  if (!hydrated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-12 flex items-center justify-center">
        <div className="text-2xl text-purple-600">Đang tải...</div>
      </div>
    );
  }

  // Not logged in
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div
            className="rounded-2xl shadow-xl p-12 text-center"
            style={{ backgroundColor: "#FEF3E8" }}
          >
            <div className="flex justify-center mb-6">
              <Image
                src="/images/mascot-login.jpg"
                alt="Mascot"
                width={180}
                height={180}
                className="object-contain"
              />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Giỏ Hàng Trống
            </h2>
            <p className="text-gray-600 mb-8 text-lg">
              Hãy đăng nhập/đăng ký trước khi vào lựa sản phẩm nha 😊
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => router.push("/login")}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-xl transform hover:scale-105 transition-all"
              >
                🔑 Đăng Nhập
              </button>
              <button
                onClick={() => router.push("/register")}
                className="bg-white border-2 border-purple-600 text-purple-600 px-8 py-4 rounded-xl font-semibold hover:bg-purple-50 transform hover:scale-105 transition-all"
              >
                📝 Đăng Ký
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <div className="text-8xl mb-6">🛒</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Giỏ Hàng Trống
            </h2>
            <p className="text-gray-600 mb-8">
              Bạn chưa có sản phẩm nào trong giỏ hàng
            </p>
            <Link
              href="/gallery"
              className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-xl transform hover:scale-105 transition-all"
            >
              🎨 Khám Phá Sản Phẩm
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
              🛒 Giỏ Hàng Của Bạn
              <span className="text-lg text-purple-600">
                ({items.length} sản phẩm)
              </span>
            </h1>
            <div className="flex gap-3">
              <button
                onClick={handleSelectAll}
                className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg font-semibold transition"
              >
                {selectedItems.length === items.length
                  ? "❌ Bỏ Chọn Tất Cả"
                  : "✅ Chọn Tất Cả"}
              </button>
              <button
                onClick={handleClearCart}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold transition"
              >
                🗑️ Xóa Tất Cả
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={item.product.id}
                className={`bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-all ${
                  selectedItems.includes(item.product.id)
                    ? "ring-2 ring-purple-500"
                    : ""
                }`}
              >
                <div className="flex gap-6">
                  {/* Checkbox */}
                  <div className="flex items-start pt-2">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item.product.id)}
                      onChange={() => toggleSelectItem(item.product.id)}
                      className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500 cursor-pointer"
                    />
                  </div>

                  {/* Product Image */}
                  <div className="relative w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden">
                    <Image
                      src={item.product.imageUrl}
                      alt={item.product.title}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      {item.product.title}
                    </h3>
                    <p className="text-gray-600 mb-2">
                      Độ khó:{" "}
                      <span className="font-semibold">
                        {item.product.difficulty || "Medium"}
                      </span>
                    </p>
                    <p className="text-2xl font-bold text-purple-600 mb-3">
                      {(item.product.price || 0).toLocaleString("vi-VN")} VNĐ
                    </p>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      {(() => {
                        const favorited = isFavorite(item.product.id);

                        return (
                          <button
                            onClick={() =>
                              handleMoveToSavedForLater(item.product.id)
                            }
                            className={`text-sm px-3 py-1 rounded-lg transition flex items-center gap-1 ${
                              favorited
                                ? "bg-rose-100 text-rose-600 hover:bg-rose-200"
                                : "bg-blue-100 text-blue-600 hover:bg-blue-200"
                            }`}
                          >
                            {favorited ? (
                              <FaHeart size={12} />
                            ) : (
                              <FaRegHeart size={12} />
                            )}
                            Mua Sau
                          </button>
                        );
                      })()}
                      <button
                        onClick={() => {
                          removeItem(item.product.id);
                          toast.success("Đã xóa khỏi giỏ hàng!");
                        }}
                        className="text-sm bg-red-100 text-red-600 px-3 py-1 rounded-lg hover:bg-red-200 transition flex items-center gap-1"
                      >
                        <FaTrash size={12} />
                        Xóa
                      </button>
                    </div>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex flex-col items-end justify-between">
                    <div className="flex items-center gap-3 bg-gray-100 rounded-lg p-2">
                      <button
                        onClick={() =>
                          updateQuantity(
                            item.product.id,
                            Math.max(1, item.quantity - 1),
                          )
                        }
                        className="w-8 h-8 flex items-center justify-center bg-white rounded-lg hover:bg-purple-100 transition"
                      >
                        <FaMinus className="text-purple-600" />
                      </button>
                      <span className="text-xl font-bold w-12 text-center text-gray-900">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.product.id, item.quantity + 1)
                        }
                        className="w-8 h-8 flex items-center justify-center bg-white rounded-lg hover:bg-purple-100 transition"
                      >
                        <FaPlus className="text-purple-600" />
                      </button>
                    </div>

                    <p className="text-lg font-bold text-gray-800">
                      Tổng:{" "}
                      {(
                        (item.product.price || 0) * item.quantity
                      ).toLocaleString("vi-VN")}{" "}
                      VNĐ
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {/* Saved For Later Section */}
            {savedForLater.length > 0 && (
              <div className="mt-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <FaHeart className="text-pink-500" />
                  Mua Sau ({savedForLater.length} sản phẩm)
                </h2>
                <div className="space-y-4">
                  {savedForLater.map((item) => (
                    <div
                      key={item.product.id}
                      className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-all"
                    >
                      <div className="flex gap-6">
                        <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden">
                          <Image
                            src={item.product.imageUrl}
                            alt={item.product.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-gray-800 mb-2">
                            {item.product.title}
                          </h3>
                          <p className="text-xl font-bold text-purple-600">
                            {(item.product.price || 0).toLocaleString("vi-VN")}{" "}
                            VNĐ
                          </p>
                        </div>
                        <div className="flex flex-col gap-2">
                          <button
                            onClick={() => {
                              moveToCart(item.product.id);
                              toast.success("Đã thêm lại vào giỏ hàng!");
                            }}
                            className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg font-semibold transition text-sm"
                          >
                            Thêm Vào Giỏ
                          </button>
                          <button
                            onClick={() => {
                              removeSavedItem(item.product.id);
                              toast.success("Đã xóa!");
                            }}
                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold transition text-sm"
                          >
                            Xóa
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-xl p-6 sticky top-24">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Tóm Tắt Đơn Hàng
              </h2>

              {/* Voucher Section */}
              <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
                {voucherCode ? (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FaTicketAlt className="text-purple-600" />
                      <div>
                        <p className="text-sm font-semibold text-gray-700">
                          Mã: {voucherCode}
                        </p>
                        <p className="text-xs text-green-600">
                          Giảm {voucherDiscount}%
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        removeVoucher();
                        toast.success("Đã xóa voucher!");
                      }}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FaTimes />
                    </button>
                  </div>
                ) : (
                  <div>
                    <button
                      onClick={() => setShowVoucherInput(!showVoucherInput)}
                      className="w-full flex items-center justify-center gap-2 text-purple-600 font-semibold hover:text-purple-700 transition"
                    >
                      <FaTicketAlt />
                      {showVoucherInput ? "Ẩn" : "Nhập Mã Giảm Giá"}
                    </button>

                    {showVoucherInput && (
                      <div className="mt-3 flex gap-2">
                        <input
                          type="text"
                          value={voucherInput}
                          onChange={(e) =>
                            setVoucherInput(e.target.value.toUpperCase())
                          }
                          placeholder="Nhập mã..."
                          className="flex-1 px-3 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900"
                          onKeyPress={(e) =>
                            e.key === "Enter" && handleApplyVoucher()
                          }
                        />
                        <button
                          onClick={handleApplyVoucher}
                          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition"
                        >
                          <FaCheck />
                        </button>
                      </div>
                    )}

                    <div className="mt-3 text-xs text-gray-600">
                      <p className="font-semibold mb-1">Mã khả dụng:</p>
                      <p>• YULING10 - Giảm 10%</p>
                      <p>• YULING20 - Giảm 20%</p>
                      <p>• GIAMGIA15 - Giảm 15%</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Đã chọn ({selectedItems.length} sản phẩm):</span>
                  <span className="font-semibold">
                    {getSelectedTotal().toLocaleString("vi-VN")} VNĐ
                  </span>
                </div>
                {voucherDiscount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Giảm giá ({voucherDiscount}%):</span>
                    <span className="font-semibold">
                      -
                      {(
                        (getSelectedTotal() * voucherDiscount) /
                        100
                      ).toLocaleString("vi-VN")}{" "}
                      VNĐ
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-gray-600">
                  <span>Phí vận chuyển:</span>
                  <span className="font-semibold text-green-600">Miễn phí</span>
                </div>
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between text-xl font-bold text-gray-800">
                    <span>Tổng cộng:</span>
                    <span className="text-purple-600">
                      {getDiscountedTotal().toLocaleString("vi-VN")} VNĐ
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={isProcessing || selectedItems.length === 0}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl font-bold text-lg hover:shadow-xl transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                <FaShoppingBag className="inline mr-2" />
                Thanh Toán ({selectedItems.length})
              </button>

              {selectedItems.length === 0 && (
                <p className="text-center text-sm text-red-500 mt-2">
                  Vui lòng chọn sản phẩm để thanh toán
                </p>
              )}

              <Link
                href="/gallery"
                className="block w-full text-center mt-4 text-purple-600 hover:text-purple-800 font-semibold transition"
              >
                ← Tiếp Tục Mua Sắm
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
