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

export default function MoMoCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "failed">(
    "loading"
  );
  const [message, setMessage] = useState("Đang xử lý thanh toán...");
  const [orderId, setOrderId] = useState<string | null>(null);

  useEffect(() => {
    // Get payment result from URL params
    const resultCode = searchParams.get("resultCode");
    const orderIdParam = searchParams.get("orderId");
    const amountParam = searchParams.get("amount");
    const messageParam = searchParams.get("message");

    setOrderId(orderIdParam);

    // Process payment result
    if (resultCode === "0") {
      setStatus("success");
      setMessage("Thanh toán thành công!");

      // Redirect to order success page after 2 seconds
      setTimeout(() => {
        if (orderIdParam) {
          router.push(`/order-success?orderId=${orderIdParam}&payment=success`);
        }
      }, 2000);
    } else {
      setStatus("failed");

      // Map MoMo result codes to Vietnamese messages
      const errorMessages: Record<string, string> = {
        "1": "Giao dịch thất bại",
        "2": "Giao dịch bị từ chối",
        "3": "Giao dịch bị hủy",
        "4": "Giao dịch đang xử lý",
        "5": "Giao dịch bị lỗi",
        "9": "Giao dịch bị từ chối (do người dùng)",
        "1000": "Giao dịch được khởi tạo",
        "1001": "Giao dịch thất bại do tài khoản người dùng không đủ tiền",
        "1002": "Giao dịch bị từ chối do nhà phát hành tài khoản thanh toán",
        "1003": "Giao dịch bị hủy",
        "1004": "Giao dịch thất bại do số tiền vượt quá hạn mức giao dịch",
        "1005": "Giao dịch thất bại do url hoặc QR code đã hết hạn",
        "1006": "Giao dịch thất bại do người dùng từ chối xác nhận thanh toán",
        "1007": "Giao dịch bị từ chối vì tài khoản người dùng đang bị khóa",
        "2001": "Giao dịch thất bại do sai thông tin",
      };

      setMessage(
        errorMessages[resultCode || ""] ||
          messageParam ||
          "Thanh toán thất bại. Vui lòng thử lại."
      );
    }
  }, [searchParams, router]);

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
        {searchParams.get("amount") && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
            <p className="text-sm text-gray-600 mb-2">
              <strong>Mã đơn hàng:</strong> {searchParams.get("orderId")}
            </p>
            <p className="text-sm text-gray-600 mb-2">
              <strong>Mã giao dịch:</strong>{" "}
              {searchParams.get("transId") || searchParams.get("requestId")}
            </p>
            <p className="text-sm text-gray-600 mb-2">
              <strong>Số tiền:</strong>{" "}
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(parseInt(searchParams.get("amount") || "0"))}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Phương thức:</strong> MoMo
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
