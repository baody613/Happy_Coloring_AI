'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaShoppingCart, FaUser, FaBars, FaTimes, FaSearch } from 'react-icons/fa';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';
import { isAdmin } from '@/lib/adminConfig';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
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
          <div className="flex items-center justify-between h-20 md:h-24 pb-2">
            {/* Left Side: Hamburger + Logo */}
            <div className="flex items-center gap-3">
              {/* Hamburger Menu Button */}
              <button
                className="text-3xl text-brand-orchid"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <FaTimes /> : <FaBars />}
              </button>

              {/* Logo */}
              <Link href="/" className="flex items-center gap-3">
                <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-brand-hot-pink shadow-md flex-shrink-0">
                  <Image
                    src="/images/YuLingStore2.png"
                    alt="YuLing Store Logo"
                    fill
                    priority
                    className="object-cover"
                  />
                </div>
                <div className="relative hidden lg:block">
                  <span
                    className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent block store-name"
                    style={{
                      fontFamily: "'Pacifico', cursive",
                      backgroundImage: 'linear-gradient(to right, #9400D3, #E6007A, #8A2BE2)',
                    }}
                  >
                    Yu Ling Store
                  </span>
                </div>
              </Link>
            </div>

            {/* Center: Search Bar */}
            <div className="hidden md:flex items-center flex-1 max-w-xl mx-8">
              <div className="relative w-full group">
                <input
                  type="text"
                  placeholder="Tìm kiếm tranh yêu thích của bạn..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-6 py-3 pl-12 pr-4 rounded-full border-2 border-brand-hot-pink hover:border-brand-magenta focus:border-brand-orchid focus:outline-none focus:ring-4 ring-brand-hot-pink transition-all duration-300 text-gray-700 font-medium shadow-sm hover:shadow-md"
                  style={{ backgroundColor: '#FFF0F5' }}
                />
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-medium-orchid group-focus-within:text-brand-orchid transition-colors">
                  <FaSearch className="text-lg" />
                </div>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-brand-magenta transition-colors"
                  >
                    <FaTimes />
                  </button>
                )}
              </div>
            </div>

            {/* Right Side: Cart + User Actions */}
            <div className="flex items-center space-x-4">
              {/* Shopping Cart - Always visible */}
              <Link
                href="/cart"
                className="relative p-3 hover:bg-opacity-80 rounded-full transition-all"
                style={{ backgroundColor: '#FFE4F0' }}
              >
                <FaShoppingCart className="text-brand-magenta text-2xl" />
                {getTotalItems() > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                    {getTotalItems()}
                  </span>
                )}
              </Link>

              {user ? (
                <>
                  <span
                    className="text-brand-orchid font-semibold px-4 py-2 rounded whitespace-nowrap"
                    style={{ backgroundColor: '#F5E6FF' }}
                  >
                    Xin chào {user.displayName || user.email}!
                  </span>
                  <Link
                    href={isAdmin(user.email) ? '/admin' : '/profile'}
                    className="relative flex items-center justify-center w-12 h-12 rounded-full font-bold text-2xl transition-all duration-300 transform hover:scale-110 hover:rotate-12 shadow-lg hover:shadow-xl"
                    style={{
                      background: 'linear-gradient(135deg, #E6007A 0%, #9932CC 50%, #8A2BE2 100%)',
                      color: 'white',
                    }}
                    title={isAdmin(user.email) ? 'Quản Trị Admin' : 'Tài Khoản'}
                  >
                    {isAdmin(user.email) ? '⚙️' : '👤'}
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
