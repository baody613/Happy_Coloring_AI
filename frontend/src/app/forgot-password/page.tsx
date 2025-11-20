'use client';

import { useState } from 'react';
import Link from 'next/link';
import { passwordResetAPI } from '@/lib/passwordResetAPI';

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<'email' | 'verify' | 'reset'>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  // Đếm ngược thời gian gửi lại mã
  const startResendTimer = () => {
    setResendTimer(60);
    const interval = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await passwordResetAPI.sendCode(email);
      setStep('verify');
      setError('');
      startResendTimer();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await passwordResetAPI.verifyCode(email, code);
      setStep('reset');
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Mã xác nhận không chính xác.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (newPassword !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp!');
      return;
    }

    if (newPassword.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự!');
      return;
    }

    setLoading(true);

    try {
      await passwordResetAPI.resetPassword(email, code, newPassword);
      setSuccess(true);
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (resendTimer > 0) return;

    setError('');
    setLoading(true);

    try {
      await passwordResetAPI.sendCode(email);
      setError('');
      startResendTimer();
      alert('Mã xác nhận mới đã được gửi đến email của bạn!');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-2xl">
        {/* Header */}
        <div>
          <div className="text-center">
            <span className="text-6xl">
              {step === 'email' ? '🔑' : step === 'verify' ? '📧' : '🔐'}
            </span>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {step === 'email' && 'Quên Mật Khẩu'}
            {step === 'verify' && 'Nhập Mã Xác Nhận'}
            {step === 'reset' && 'Đặt Lại Mật Khẩu'}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {step === 'email' && 'Nhập email để nhận mã xác nhận 6 số'}
            {step === 'verify' && 'Mã OTP đã được gửi đến email của bạn'}
            {step === 'reset' && 'Nhập mật khẩu mới của bạn'}
          </p>
        </div>

        {/* Step 1: Email Form */}
        {step === 'email' && (
          <form className="mt-8 space-y-6" onSubmit={handleSendCode}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
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
                {loading ? 'Đang gửi mã...' : 'Gửi Mã OTP'}
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
                Chưa có tài khoản?{' '}
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

        {/* Step 2: Verify OTP */}
        {step === 'verify' && (
          <form className="mt-8 space-y-6" onSubmit={handleVerifyCode}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg text-sm">
              📧 Mã OTP 6 số đã được gửi đến: <strong>{email}</strong>
              <br />
              <span className="text-xs">Vui lòng kiểm tra hộp thư và spam folder.</span>
            </div>

            <div>
              <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-2">
                Mã OTP (6 số)
              </label>
              <input
                id="code"
                name="code"
                type="text"
                required
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent font-mono text-center text-2xl tracking-widest"
                placeholder="000000"
              />
              <p className="mt-1 text-xs text-gray-500 text-center">Mã có hiệu lực trong 10 phút</p>
            </div>

            <div className="space-y-3">
              <button
                type="submit"
                disabled={loading || code.length !== 6}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Đang xác thực...' : 'Xác Nhận Mã'}
              </button>

              <button
                type="button"
                onClick={handleResendCode}
                disabled={resendTimer > 0 || loading}
                className="w-full py-3 px-4 border border-purple-600 text-purple-600 font-medium rounded-lg hover:bg-purple-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {resendTimer > 0 ? `Gửi lại sau ${resendTimer}s` : '↻ Gửi Lại Mã'}
              </button>

              <button
                type="button"
                onClick={() => {
                  setStep('email');
                  setCode('');
                  setError('');
                }}
                className="w-full py-3 px-4 text-gray-600 font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                ← Đổi Email
              </button>
            </div>
          </form>
        )}

        {/* Step 3: Reset Password */}
        {step === 'reset' && (
          <form className="mt-8 space-y-6" onSubmit={handleResetPassword}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg text-sm font-medium">
                🎉 Đặt lại mật khẩu thành công! Đang chuyển đến trang đăng nhập...
              </div>
            )}

            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
              ✅ Mã OTP đã được xác thực thành công!
            </div>

            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Mật Khẩu Mới
              </label>
              <input
                id="newPassword"
                name="newPassword"
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="••••••••"
              />
              <p className="mt-1 text-xs text-gray-500">Tối thiểu 6 ký tự</p>
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Xác Nhận Mật Khẩu Mới
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="••••••••"
              />
            </div>

            <div className="space-y-3">
              <button
                type="submit"
                disabled={loading || success}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Đang đặt lại mật khẩu...' : 'Đặt Lại Mật Khẩu'}
              </button>
            </div>

            <div className="text-center">
              <Link
                href="/login"
                className="text-sm font-medium text-purple-600 hover:text-purple-500"
              >
                Quay lại đăng nhập
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
