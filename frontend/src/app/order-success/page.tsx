"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  FaCheckCircle,
  FaHome,
  FaShoppingBag,
  FaPalette,
  FaPaintBrush,
  FaImage,
  FaSprayCan,
  FaPencilAlt,
  FaFillDrip,
} from "react-icons/fa";
import { useAuthStore } from "@/store/authStore";
import { safeLocalStorage } from "@/lib/safeStorage";

export default function OrderSuccessPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [orderInfo, setOrderInfo] = useState<any>(null);

  useEffect(() => {
    // Lấy thông tin đơn hàng từ localStorage
    const lastOrder = safeLocalStorage.getItem("lastOrder");
    if (lastOrder) {
      setOrderInfo(JSON.parse(lastOrder));
      // Xóa sau khi đọc
      safeLocalStorage.removeItem("lastOrder");
    }

    // Lấy payment status từ URL query params (từ payment callback)
    const params = new URLSearchParams(window.location.search);
    const paymentStatus = params.get("payment");
    const status = params.get("status");

    if (paymentStatus && lastOrder) {
      const order = JSON.parse(lastOrder);
      order.paymentStatus = paymentStatus;
      setOrderInfo(order);
    } else if (status && lastOrder) {
      const order = JSON.parse(lastOrder);
      order.paymentStatus = status;
      setOrderInfo(order);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center py-12 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-[#FFF8F0] rounded-2xl shadow-2xl p-12 max-w-2xl w-full text-center"
      >
        {/* Cute Cat Image */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{
            scale: 1,
            rotate: 0,
            y: [0, -20, 0],
          }}
          transition={{
            delay: 0.1,
            type: "spring",
            stiffness: 200,
            damping: 15,
            y: {
              repeat: Infinity,
              duration: 2,
              ease: "easeInOut",
            },
          }}
          className="mb-2 -mt-4 relative"
        >
          {/* Floating Icons */}
          <motion.div
            className="absolute top-8 left-12 text-5xl"
            animate={{ y: [0, -15, 0] }}
            transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
          >
            🎨
          </motion.div>
          <motion.div
            className="absolute top-8 right-12 text-4xl"
            animate={{ y: [0, -20, 0] }}
            transition={{
              repeat: Infinity,
              duration: 2.2,
              ease: "easeInOut",
              delay: 0.3,
            }}
          >
            🖌️
          </motion.div>
          <motion.div
            className="absolute top-1/2 left-4 -translate-y-1/2 text-4xl"
            animate={{ y: [0, -18, 0] }}
            transition={{
              repeat: Infinity,
              duration: 2.8,
              ease: "easeInOut",
              delay: 0.5,
            }}
          >
            🖼️
          </motion.div>
          <motion.div
            className="absolute top-1/2 right-4 -translate-y-1/2 text-4xl"
            animate={{ y: [0, -22, 0] }}
            transition={{
              repeat: Infinity,
              duration: 2.3,
              ease: "easeInOut",
              delay: 0.7,
            }}
          >
            🎨
          </motion.div>
          <motion.div
            className="absolute bottom-8 left-12 text-4xl"
            animate={{ y: [0, -16, 0] }}
            transition={{
              repeat: Infinity,
              duration: 2.6,
              ease: "easeInOut",
              delay: 0.2,
            }}
          >
            ✏️
          </motion.div>
          <motion.div
            className="absolute bottom-8 right-12 text-4xl"
            animate={{ y: [0, -19, 0] }}
            transition={{
              repeat: Infinity,
              duration: 2.4,
              ease: "easeInOut",
              delay: 0.6,
            }}
          >
            💧
          </motion.div>

          <motion.div
            className="relative w-80 h-80 mx-auto"
            animate={{
              rotateY: [0, 180, 0],
            }}
            transition={{
              repeat: Infinity,
              duration: 5,
              ease: "easeInOut",
            }}
          >
            <Image
              src="/images/cute-cat.png.jpg.jpg"
              alt="Cute Cat Wizard"
              fill
              className="object-contain"
              style={{
                maskImage:
                  "radial-gradient(circle, black 60%, transparent 100%)",
                WebkitMaskImage:
                  "radial-gradient(circle, black 60%, transparent 100%)",
              }}
              priority
            />
          </motion.div>
        </motion.div>

        {/* Success Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            🎉 Đặt Hàng Thành Công!
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Cảm ơn bạn đã mua hàng tại Yu Ling Store
          </p>
        </motion.div>

        {/* Order Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white border-2 border-purple-200 rounded-xl p-6 mb-8 shadow-lg"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            📋 Thông Tin Đơn Hàng
          </h2>
          <div className="space-y-3 text-gray-800 text-left">
            <p className="flex items-start gap-2">
              <span className="text-green-500 font-bold">✓</span>
              <span>Đơn hàng của bạn đã được tiếp nhận và đang được xử lý</span>
            </p>
            <p className="flex items-start gap-2">
              <span className="text-green-500 font-bold">✓</span>
              <span>
                Thông tin chi tiết đã được gửi qua email:{" "}
                <strong className="text-purple-700">
                  {orderInfo?.email || user?.email}
                </strong>
              </span>
            </p>
            <p className="flex items-start gap-2">
              <span className="text-green-500 font-bold">✓</span>
              <span>
                Chúng tôi sẽ liên hệ xác nhận trong vòng{" "}
                <strong className="text-gray-900">24 giờ</strong>
              </span>
            </p>
            <p className="flex items-start gap-2">
              <span className="text-blue-500">🚚</span>
              <span>
                Đơn hàng sẽ được giao đến bạn trong vòng{" "}
                <strong className="text-purple-700">3-5 ngày làm việc</strong>
              </span>
            </p>
            {orderInfo && (
              <>
                <p className="flex items-start gap-2">
                  <span className="text-purple-500">📦</span>
                  Số lượng sản phẩm: <strong>{orderInfo.itemCount}</strong>
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-yellow-500">💰</span>
                  Tổng giá trị đơn hàng:{" "}
                  <strong className="text-purple-600">
                    {orderInfo.totalAmount.toLocaleString("vi-VN")} VNĐ
                  </strong>
                </p>
                {orderInfo.voucherCode && (
                  <p className="flex items-start gap-2">
                    <span className="text-green-500">🎫</span>
                    Đã áp dụng voucher:{" "}
                    <strong className="text-green-600">
                      {orderInfo.voucherCode}
                    </strong>{" "}
                    (Giảm {orderInfo.voucherDiscount}%)
                  </p>
                )}
              </>
            )}
            <p className="flex items-start gap-2">
              <span className="text-orange-500">📞</span>
              <span>
                Hotline hỗ trợ:{" "}
                <a
                  href="tel:0123456789"
                  className="text-purple-600 font-semibold hover:underline"
                >
                  0123-456-789
                </a>
              </span>
            </p>
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl font-bold hover:shadow-xl transform hover:scale-105 transition-all"
          >
            <FaHome />
            Về Trang Chủ
          </Link>
          <Link
            href="/gallery"
            className="inline-flex items-center justify-center gap-2 bg-white border-2 border-purple-600 text-purple-600 px-8 py-4 rounded-xl font-bold hover:bg-purple-50 transform hover:scale-105 transition-all"
          >
            <FaShoppingBag />
            Tiếp Tục Mua Sắm
          </Link>
        </motion.div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-8 pt-8 border-t border-gray-200"
        >
          <p className="text-sm text-gray-600">
            Nếu có bất kỳ thắc mắc nào, vui lòng liên hệ:{" "}
            <a
              href="mailto:support@yulingstore.com"
              className="text-purple-600 font-semibold hover:underline"
            >
              support@yulingstore.com
            </a>{" "}
            hoặc hotline{" "}
            <a
              href="tel:0123456789"
              className="text-purple-600 font-semibold hover:underline"
            >
              0123-456-789
            </a>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
