import Link from 'next/link';
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-2xl font-bold mb-4">🎨 PaintByNumbers</h3>
            <p className="text-gray-400">
              Nền tảng tranh tô màu số hóa hàng đầu Việt Nam với công nghệ AI.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Liên Kết</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/gallery" className="text-gray-400 hover:text-white transition">
                  Gallery
                </Link>
              </li>
              <li>
                <Link href="/generate" className="text-gray-400 hover:text-white transition">
                  Tạo Tranh AI
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white transition">
                  Về Chúng Tôi
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white transition">
                  Liên Hệ
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Hỗ Trợ</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/shipping" className="text-gray-400 hover:text-white transition">
                  Chính Sách Giao Hàng
                </Link>
              </li>
              <li>
                <Link href="/returns" className="text-gray-400 hover:text-white transition">
                  Đổi Trả Hàng
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-400 hover:text-white transition">
                  Chính Sách Bảo Mật
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-400 hover:text-white transition">
                  Điều Khoản Sử Dụng
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Kết Nối</h4>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-400 hover:text-white transition text-2xl"
                aria-label="Facebook"
              >
                <FaFacebook />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition text-2xl"
                aria-label="Instagram"
              >
                <FaInstagram />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition text-2xl"
                aria-label="Twitter"
              >
                <FaTwitter />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition text-2xl"
                aria-label="YouTube"
              >
                <FaYoutube />
              </a>
            </div>
            <p className="text-gray-400 mt-4">
              Email: support@paintbynumbers.vn
              <br />
              Hotline: 0123-456-789
            </p>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2025 PaintByNumbers AI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
