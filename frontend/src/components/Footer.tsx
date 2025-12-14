// Simple Footer component for your app
"use client";

export default function Footer() {
  return (
    <footer className="w-full bg-gradient-to-br from-purple-900 via-purple-700 to-pink-600 text-white py-8 md:py-12 mt-0 shadow-2xl">
      <div className="container mx-auto px-4 md:px-6">
        {/* Mobile: 2 Columns, Desktop: 4 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8">
          {/* Logo & Slogan - Full width on mobile */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl md:text-3xl font-bold">
                🎨 Happy Coloring AI
              </span>
            </div>
            <p className="text-sm md:text-base opacity-80 mb-4 leading-relaxed">
              Nền tảng tranh tô màu số hóa & AI hiện đại
            </p>
            <div className="flex gap-3">
              <a
                href="#"
                className="hover:text-yellow-300 transition text-lg md:text-xl"
                aria-label="Facebook"
              >
                <i className="fab fa-facebook-f"></i>
              </a>
              <a
                href="#"
                className="hover:text-blue-400 transition text-lg md:text-xl"
                aria-label="Twitter"
              >
                <i className="fab fa-twitter"></i>
              </a>
              <a
                href="#"
                className="hover:text-pink-400 transition text-lg md:text-xl"
                aria-label="Instagram"
              >
                <i className="fab fa-instagram"></i>
              </a>
              <a
                href="#"
                className="hover:text-red-500 transition text-lg md:text-xl"
                aria-label="YouTube"
              >
                <i className="fab fa-youtube"></i>
              </a>
            </div>
          </div>
        </div>

        {/* Products & Support - 2 columns on mobile, part of 4-col grid on desktop */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mt-6 md:mt-0">
          {/* Sản phẩm */}
          <div>
            <h3 className="font-semibold text-base md:text-lg mb-3 uppercase tracking-wide">
              Sản phẩm
            </h3>
            <ul className="space-y-2 text-sm md:text-base">
              <li>
                <a href="/gallery" className="hover:text-yellow-300 transition">
                  Tranh tô màu
                </a>
              </li>
              <li>
                <a
                  href="/generate"
                  className="hover:text-yellow-300 transition"
                >
                  Tạo tranh AI
                </a>
              </li>
              <li>
                <a href="/profile" className="hover:text-yellow-300 transition">
                  Tài khoản
                </a>
              </li>
              <li>
                <a href="/cart" className="hover:text-yellow-300 transition">
                  Giỏ hàng
                </a>
              </li>
            </ul>
          </div>

          {/* Hỗ trợ - Compact spacing */}
          <div>
            <h3 className="font-semibold text-base md:text-lg mb-3 uppercase tracking-wide">
              Hỗ trợ
            </h3>
            <ul className="space-y-2 text-sm md:text-base">
              <li>
                <a href="#" className="hover:text-yellow-300 transition">
                  Câu hỏi thường gặp
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-yellow-300 transition">
                  Chính sách bảo mật
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-yellow-300 transition">
                  Điều khoản dịch vụ
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-yellow-300 transition">
                  Liên hệ
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter - Full width on mobile */}
          <div className="col-span-2 md:col-span-2">
            <h3 className="font-semibold text-base md:text-lg mb-3 uppercase tracking-wide">
              Nhận tin
            </h3>
            <form className="flex flex-col gap-2">
              <input
                type="email"
                placeholder="Email của bạn"
                className="px-3 py-2 text-sm rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-pink-400"
              />
              <button
                type="submit"
                className="bg-yellow-400 text-purple-900 font-bold px-3 py-2 text-sm rounded-lg hover:bg-yellow-300 transition"
              >
                Đăng ký
              </button>
            </form>
            <p className="text-xs opacity-70 mt-2 hidden md:block">
              Nhận thông tin khuyến mãi mới nhất
            </p>
          </div>
        </div>

        {/* Copyright - Smaller padding */}
        <div className="mt-6 md:mt-8 pt-4 border-t border-white/20 text-center text-xs opacity-70">
          &copy; {new Date().getFullYear()} Happy Coloring AI. All rights
          reserved.
        </div>
      </div>
    </footer>
  );
}
