"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaSpinner,
  FaReceipt,
  FaHome,
} from "react-icons/fa";

export default function VNPayCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "failed">(
    "loading"
  );
  const [message, setMessage] = useState("Đang xử lý thanh toán...");
  const [orderId, setOrderId] = useState<string | null>(null);

  useEffect(() => {
    // Get payment result from URL params
    const vnp_ResponseCode = searchParams.get("vnp_ResponseCode");
    const vnp_TxnRef = searchParams.get("vnp_TxnRef");
    const vnp_OrderInfo = searchParams.get("vnp_OrderInfo");
    const vnp_Amount = searchParams.get("vnp_Amount");

    // Extract order ID from transaction ref (format: orderId_timestamp)
    if (vnp_TxnRef) {
      const orderIdFromRef = vnp_TxnRef.split("_")[0];
      setOrderId(orderIdFromRef);
    }

    // Process payment result
    if (vnp_ResponseCode === "00") {
      setStatus("success");
      setMessage("Thanh toán thành công!");

      // Redirect to order success page after 2 seconds
      setTimeout(() => {
        if (orderId) {
          router.push(`/order-success?orderId=${orderId}&payment=success`);
        }
      }, 2000);
    } else {
      setStatus("failed");

      // Map VNPay response codes to Vietnamese messages
      const errorMessages: Record<string, string> = {
        "07": "Giao dịch bị nghi ngờ gian lận",
        "09": "Thẻ chưa đăng ký dịch vụ",
        "10": "Thẻ hết hạn",
        "11": "Thẻ bị khóa",
        "12": "Sai mật khẩu",
        "13": "Sai OTP",
        "24": "Giao dịch bị hủy",
        "51": "Tài khoản không đủ số dư",
        "65": "Vượt quá hạn mức giao dịch",
        "75": "Ngân hàng đang bảo trì",
      };

      setMessage(
        errorMessages[vnp_ResponseCode || ""] ||
          "Thanh toán thất bại. Vui lòng thử lại."
      );
    }
  }, [searchParams, router, orderId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 max-w-md w-full text-center"
      >
        {/* Icon */}
        <div className="mb-6">
          {status === "loading" && (
            <FaSpinner className="text-6xl text-purple-500 mx-auto animate-spin" />
          )}
          {status === "success" && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", duration: 0.5 }}
            >
              <FaCheckCircle className="text-6xl text-green-500 mx-auto" />
            </motion.div>
          )}
          {status === "failed" && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", duration: 0.5 }}
            >
              <FaTimesCircle className="text-6xl text-red-500 mx-auto" />
            </motion.div>
          )}
        </div>

        {/* Title */}
        <h1 className="text-2xl md:text-3xl font-bold mb-4">
          {status === "loading" && "Đang xử lý..."}
          {status === "success" && "Thanh toán thành công!"}
          {status === "failed" && "Thanh toán thất bại"}
        </h1>

        {/* Message */}
        <p className="text-gray-600 mb-8">{message}</p>

        {/* Payment Details */}
        {searchParams.get("vnp_Amount") && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
            <p className="text-sm text-gray-600 mb-2">
              <strong>Mã giao dịch:</strong> {searchParams.get("vnp_TxnRef")}
            </p>
            <p className="text-sm text-gray-600 mb-2">
              <strong>Số tiền:</strong>{" "}
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(parseInt(searchParams.get("vnp_Amount") || "0") / 100)}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Phương thức:</strong> VNPay
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col gap-3">
          {status === "success" && orderId && (
            <Link
              href={`/order-success?orderId=${orderId}&payment=success`}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition flex items-center justify-center gap-2"
            >
              <FaReceipt />
              Xem đơn hàng
            </Link>
          )}

          {status === "failed" && (
            <Link
              href="/cart"
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition"
            >
              Thử lại
            </Link>
          )}

          <Link
            href="/"
            className="text-gray-600 hover:text-purple-600 transition flex items-center justify-center gap-2"
          >
            <FaHome />
            Về trang chủ
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
