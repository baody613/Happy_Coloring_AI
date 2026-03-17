"use client";

import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="w-full border-t border-slate-200 dark:border-surface-dark bg-background-light dark:bg-background-dark py-12 px-6 md:px-10 mt-10">
      <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
        {/* Branding */}
        <Link href="/" className="flex items-center gap-3 flex-shrink-0">
          <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-primary shadow-md">
            <Image
              src="/images/YuLingStore2.png"
              alt="YuLing Store Logo"
              fill
              className="object-cover"
            />
          </div>
          <span
            className="text-xl font-bold bg-clip-text text-transparent pb-1"
            style={{
              fontFamily: "'Pacifico', cursive",
              backgroundImage:
                "linear-gradient(to right, #9400D3, #E6007A, #8A2BE2)",
            }}
          >
            Yu Ling Store
          </span>
        </Link>

        {/* Nav links */}
        <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8">
          <Link
            href="/gallery"
            className="text-slate-500 hover:text-primary dark:text-slate-400 dark:hover:text-primary text-sm font-medium transition-colors"
          >
            Gallery
          </Link>
          <Link
            href="/generate"
            className="text-slate-500 hover:text-primary dark:text-slate-400 dark:hover:text-primary text-sm font-medium transition-colors"
          >
            Tạo Tranh AI
          </Link>
          <a
            href="#"
            className="text-slate-500 hover:text-primary dark:text-slate-400 dark:hover:text-primary text-sm font-medium transition-colors"
          >
            Chính Sách Bảo Mật
          </a>
          <a
            href="#"
            className="text-slate-500 hover:text-primary dark:text-slate-400 dark:hover:text-primary text-sm font-medium transition-colors"
          >
            Điều Khoản Dịch Vụ
          </a>
          <a
            href="#"
            className="text-slate-500 hover:text-primary dark:text-slate-400 dark:hover:text-primary text-sm font-medium transition-colors"
          >
            Liên Hệ
          </a>
        </div>

        {/* Copyright */}
        <p className="text-slate-400 dark:text-slate-500 text-sm font-normal text-center md:text-right flex-shrink-0">
          &copy; {new Date().getFullYear()} Yu Ling Store. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
