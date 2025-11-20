'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaShoppingCart, FaUser, FaBars, FaTimes } from 'react-icons/fa';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';
import { isAdmin } from '@/lib/adminConfig';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut } = useAuthStore();
  const { getTotalItems } = useCartStore();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <>
      <nav className="bg-white shadow-md sticky top-0 z-50 overflow-visible">
        <div className="container mx-auto px-4">
          <div className="flex items-center h-20 md:h-24 pb-2">
            {/* Hamburger Menu Button */}
            <button
              className="text-3xl text-purple-600 mr-4"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <FaTimes /> : <FaBars />}
            </button>

            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 flex-1">
              <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-purple-300 shadow-md flex-shrink-0">
                <Image
                  src="/images/YuLingStore2.png"
                  alt="YuLing Store Logo"
                  fill
                  priority
                  className="object-cover"
                />
              </div>
              <div className="relative">
                <span
                  className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 bg-clip-text text-transparent block store-name"
                  style={{ fontFamily: "'Pacifico', cursive" }}
                >
                  Yu Ling Store
                </span>
              </div>
            </Link>

            {/* Desktop Menu - Show greeting when logged in, Login/Register when not */}
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <span className="text-purple-600 font-semibold px-4 py-2 bg-purple-50 rounded whitespace-nowrap">
                    Xin chào {user.displayName || user.email}!
                  </span>
                  <Link
                    href="/profile"
                    className="bg-green-600 text-white px-4 py-2 rounded whitespace-nowrap"
                  >
                    👤 Tài Khoản
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="relative px-6 py-2.5 rounded-lg font-semibold text-white bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 whitespace-nowrap"
                  >
                    Đăng Nhập
                  </Link>
                  <Link
                    href="/register"
                    className="relative px-6 py-2.5 rounded-lg font-semibold text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 whitespace-nowrap"
                  >
                    Đăng Ký
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Overlay - Dim background when menu is open */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Slide-out Menu - Narrower width */}
      {isMenuOpen && (
        <div className="fixed top-20 md:top-24 left-0 w-64 h-full bg-white shadow-lg z-50 overflow-y-auto">
          <div className="px-6 py-8">
            <div className="flex flex-col space-y-6">
              <Link
                href="/gallery"
                className="text-xl font-semibold text-gray-800 py-3 px-4 hover:bg-purple-100 hover:text-purple-600 rounded-lg transition"
                onClick={() => setIsMenuOpen(false)}
              >
                📸 Gallery
              </Link>
              <Link
                href="/generate"
                className="text-xl font-semibold text-gray-800 py-3 px-4 hover:bg-purple-100 hover:text-purple-600 rounded-lg transition"
                onClick={() => setIsMenuOpen(false)}
              >
                🎨 Tạo Tranh AI
              </Link>
              <Link
                href="/about"
                className="text-xl font-semibold text-gray-800 py-3 px-4 hover:bg-purple-100 hover:text-purple-600 rounded-lg transition"
                onClick={() => setIsMenuOpen(false)}
              >
                ℹ️ Về Chúng Tôi
              </Link>

              {user && (
                <>
                  <div className="border-t border-gray-200 my-2"></div>
                  <Link
                    href="/profile"
                    className="text-xl font-semibold text-gray-800 py-3 px-4 hover:bg-purple-100 hover:text-purple-600 rounded-lg transition"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    👤 Tài Khoản của {user.displayName || user.email}
                  </Link>
                  {isAdmin(user.email) && (
                    <Link
                      href="/admin"
                      className="text-xl font-semibold text-orange-600 py-3 px-4 hover:bg-orange-50 rounded-lg transition border-2 border-orange-300"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      ⚙️ Quản Trị Admin
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      handleSignOut();
                      setIsMenuOpen(false);
                    }}
                    className="text-xl font-semibold text-red-600 py-3 px-4 hover:bg-red-50 rounded-lg transition text-left w-full"
                  >
                    🚪 Đăng Xuất
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
