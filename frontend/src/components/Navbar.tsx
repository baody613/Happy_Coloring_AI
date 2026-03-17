"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaShoppingCart, FaBars, FaTimes } from "react-icons/fa";
import { useAuthStore } from "@/store/authStore";
import { useCartStore } from "@/store/cartStore";
import { isAdmin } from "@/lib/adminConfig";
import { useHydration } from "@/hooks";

const navLinks = [
  { href: "/gallery", label: "Gallery" },
  { href: "/generate", label: "Tạo Tranh" },
  { href: "/#about", label: "Về Chúng Tôi" },
];

const adminNavLinks = [{ href: "/admin", label: "Dashboard" }];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const hydrated = useHydration();
  const { user, signOut } = useAuthStore();
  const { getTotalItems } = useCartStore();
  const userIsAdmin = hydrated && user ? isAdmin(user.email) : false;

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  return (
    <>
      {/* ── Main Navbar ── */}
      <header className="sticky top-0 z-50 flex items-center justify-between whitespace-nowrap border-b border-slate-200 dark:border-surface-dark bg-background-light/90 dark:bg-background-dark/90 backdrop-blur px-6 md:px-10 py-3 w-full">
        {/* LEFT: Hamburger (mobile) + Logo */}
        <div className="flex items-center gap-3">
          {/* Hamburger – mobile only */}
          <button
            className="md:hidden p-2 rounded-lg text-slate-500 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-surface-dark transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <FaTimes className="text-xl" />
            ) : (
              <FaBars className="text-xl" />
            )}
          </button>

          {/* Logo + Store Name */}
          <Link href="/" className="flex items-center gap-3">
            <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-primary shadow-md flex-shrink-0">
              <Image
                src="/images/YuLingStore2.png"
                alt="YuLing Store Logo"
                fill
                priority
                className="object-cover"
              />
            </div>
            <span
              className="hidden sm:block text-2xl md:text-3xl font-bold bg-clip-text text-transparent pb-2"
              style={{
                fontFamily: "'Pacifico', cursive",
                backgroundImage:
                  "linear-gradient(to right, #9400D3, #E6007A, #8A2BE2)",
              }}
            >
              Yu Ling Store
            </span>
          </Link>
        </div>

        {/* CENTER: Nav links – desktop */}
        <nav className="hidden md:flex items-center gap-8">
          {(userIsAdmin ? adminNavLinks : navLinks).map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-slate-600 hover:text-primary dark:text-slate-300 dark:hover:text-primary transition-colors text-sm font-semibold leading-normal"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* RIGHT: Cart + Auth */}
        <div className="flex items-center gap-3">
          {/* Cart – hidden for admin */}
          {!userIsAdmin && (
            <Link
              href="/cart"
              className="relative p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-surface-dark transition-colors"
              aria-label="Giỏ hàng"
            >
              <FaShoppingCart className="text-xl" />
              {hydrated && user && getTotalItems() > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {getTotalItems()}
                </span>
              )}
            </Link>
          )}

          {user ? (
            <>
              {/* Greeting – desktop */}
              <span className="hidden lg:block text-sm font-semibold text-slate-600 dark:text-slate-300 max-w-[160px] truncate">
                Xin chào, {user.displayName || user.email}!
              </span>
              {/* Profile / Admin avatar */}
              <Link
                href={isAdmin(user.email) ? "/admin" : "/profile"}
                className="flex items-center justify-center w-9 h-9 rounded-full font-bold text-base text-white shadow transition-transform hover:scale-105"
                style={{
                  background:
                    "linear-gradient(135deg, #E6007A 0%, #9932CC 50%, #8A2BE2 100%)",
                }}
              >
                {isAdmin(user.email) ? "" : "👤"}
              </Link>
              {/* Sign out */}
              <button
                onClick={handleSignOut}
                className="hidden md:flex min-w-[84px] cursor-pointer items-center justify-center rounded-lg h-9 px-4 border border-slate-200 dark:border-surface-dark hover:bg-slate-100 dark:hover:bg-surface-dark text-slate-700 dark:text-slate-200 text-sm font-bold transition-colors"
              >
                Đăng Xuất
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden sm:flex min-w-[84px] cursor-pointer items-center justify-center rounded-lg h-9 px-4 border border-slate-200 dark:border-surface-dark hover:bg-slate-100 dark:hover:bg-surface-dark text-slate-700 dark:text-slate-200 text-sm font-bold transition-colors"
              >
                Đăng Nhập
              </Link>
              <Link
                href="/register"
                className="flex min-w-[84px] cursor-pointer items-center justify-center rounded-lg h-9 px-4 bg-primary hover:bg-primary/90 text-white text-sm font-bold transition-colors"
              >
                Đăng Ký
              </Link>
            </>
          )}
        </div>
      </header>

      {/* ── Mobile Overlay ── */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* ── Mobile Slide-out Drawer ── */}
      {isMenuOpen && (
        <div className="fixed top-[57px] left-0 w-64 h-full bg-background-light dark:bg-background-dark border-r border-slate-200 dark:border-surface-dark shadow-xl z-50 overflow-y-auto md:hidden">
          <div className="px-5 py-6 flex flex-col gap-2">
            {(userIsAdmin ? adminNavLinks : navLinks).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-base font-semibold text-slate-700 dark:text-slate-200 py-3 px-4 rounded-lg hover:bg-slate-100 dark:hover:bg-surface-dark hover:text-primary dark:hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}

            <div className="border-t border-slate-200 dark:border-surface-dark my-3" />

            {user ? (
              <>
                <Link
                  href={isAdmin(user.email) ? "/admin" : "/profile"}
                  className="text-base font-semibold text-slate-700 dark:text-slate-200 py-3 px-4 rounded-lg hover:bg-slate-100 dark:hover:bg-surface-dark hover:text-primary transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {isAdmin(user.email) ? "⚙️ Admin" : "👤 Tài Khoản"}
                </Link>
                <button
                  onClick={() => {
                    handleSignOut();
                    setIsMenuOpen(false);
                  }}
                  className="text-base font-semibold text-red-500 py-3 px-4 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors text-left"
                >
                  🚪 Đăng Xuất
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-base font-semibold text-slate-700 dark:text-slate-200 py-3 px-4 rounded-lg hover:bg-slate-100 dark:hover:bg-surface-dark hover:text-primary transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Đăng Nhập
                </Link>
                <Link
                  href="/register"
                  className="text-base font-bold text-white py-3 px-4 rounded-lg bg-primary hover:bg-primary/90 transition-colors text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Đăng Ký
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
