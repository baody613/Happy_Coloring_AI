"use client";

import { useState } from "react";
import Link from "next/link";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await sendPasswordResetEmail(auth, email);
      setSuccess(true);
    } catch (err: any) {
      const code = err?.code || "";
      if (code === "auth/user-not-found") {
        setError("Email không tồn tại trong hệ thống.");
      } else if (code === "auth/invalid-email") {
        setError("Email không hợp lệ.");
      } else {
        setError("Có lỗi xảy ra. Vui lòng thử lại.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-2xl">
        <div>
          <div className="text-center">
            <span className="text-6xl">🔑</span>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Quên Mật Khẩu
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Nhập email để nhận link đặt lại mật khẩu
          </p>
        </div>

        {success ? (
          <div className="text-center space-y-4">
            <div className="text-6xl">📧</div>
            <p className="text-green-600 font-semibold text-lg">
              Email đặt lại mật khẩu đã được gửi!
            </p>
            <p className="text-gray-600 text-sm">
              Vui lòng kiểm tra hộp thư <strong>{email}</strong> và làm theo
              hướng dẫn. Nhớ kiểm tra cả thư mục spam.
            </p>
            <Link
              href="/login"
              className="block text-sm font-medium text-purple-600 hover:text-purple-500 mt-4"
            >
              ← Quay lại đăng nhập
            </Link>
          </div>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="your@email.com"
              />
            </div>

            <div className="space-y-3">
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? "Đang gửi..." : "Gửi Link Đặt Lại Mật Khẩu"}
              </button>
            </div>

            <div className="text-center space-y-2">
              <Link
                href="/login"
                className="block text-sm font-medium text-purple-600 hover:text-purple-500"
              >
                ← Quay lại đăng nhập
              </Link>
              <p className="text-sm text-gray-600">
                Chưa có tài khoản?{" "}
                <Link
                  href="/register"
                  className="font-medium text-purple-600 hover:text-purple-500"
                >
                  Đăng ký ngay
                </Link>
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
