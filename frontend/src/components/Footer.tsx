// Simple Footer component for your app
'use client';

export default function Footer() {
  return (
    <footer className="w-full bg-gradient-to-br from-purple-900 via-purple-700 to-pink-600 text-white pt-12 pb-6 mt-0 shadow-2xl">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Logo & Slogan */}
        <div className="md:col-span-1 flex flex-col items-start">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-4xl font-extrabold tracking-tight">
              🎨 Happy Coloring with AI
            </span>
          </div>
          <p className="text-base opacity-80 mb-6 font-light">
            Nền tảng tranh tô màu số hóa & AI hiện đại, giúp bạn sáng tạo và thư giãn mỗi ngày.
          </p>
          <div className="flex gap-4 mt-2">
            <a href="#" className="hover:text-yellow-300 transition text-xl">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="#" className="hover:text-blue-400 transition text-xl">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="#" className="hover:text-pink-400 transition text-xl">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="#" className="hover:text-red-500 transition text-xl">
              <i className="fab fa-youtube"></i>
            </a>
          </div>
        </div>
        {/* Sản phẩm */}
        <div>
          <h3 className="font-semibold text-lg mb-4 uppercase tracking-wide">Sản phẩm</h3>
          <ul className="space-y-3 text-base">
            <li>
              <a href="/gallery" className="hover:text-yellow-300 transition">
                Tranh tô màu
              </a>
            </li>
            <li>
              <a href="/generate" className="hover:text-yellow-300 transition">
                Tạo tranh AI
              </a>
            </li>
            <li>
              <a href="/profile" className="hover:text-yellow-300 transition">
                Tài khoản của bạn
              </a>
            </li>
            <li>
              <a href="/order-success" className="hover:text-yellow-300 transition">
                Đơn hàng
              </a>
            </li>
          </ul>
        </div>
        {/* Hỗ trợ khách hàng */}
        <div>
          <h3 className="font-semibold text-lg mb-4 uppercase tracking-wide">Hỗ trợ khách hàng</h3>
          <ul className="space-y-3 text-base">
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
                Liên hệ hỗ trợ
              </a>
            </li>
          </ul>
        </div>
        {/* Đăng ký nhận tin */}
        <div>
          <h3 className="font-semibold text-lg mb-4 uppercase tracking-wide">Đăng ký nhận tin</h3>
          <form className="flex flex-col gap-3">
            <input
              type="email"
              placeholder="Nhập email của bạn"
              className="px-4 py-2 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
            <button
              type="submit"
              className="bg-yellow-400 text-purple-900 font-bold px-4 py-2 rounded-lg hover:bg-yellow-300 transition"
            >
              Đăng ký
            </button>
          </form>
          <p className="text-xs opacity-70 mt-3">
            Nhận thông tin khuyến mãi và sản phẩm mới nhất từ chúng tôi.
          </p>
        </div>
      </div>
      <div className="container mx-auto px-6 mt-10 border-t border-white/20 pt-4 text-center text-xs opacity-70">
        &copy; {new Date().getFullYear()} Happy Coloring AI. All rights reserved.
      </div>
    </footer>
  );
}
