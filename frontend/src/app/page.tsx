"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useAuthStore } from "@/store/authStore";

const templates = [
  {
    id: 1,
    title: "Floral Serenity",
    author: "Elena R.",
    aspect: "aspect-[4/5]",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDUkKlkl7iHFBwxvnS2G2DrHonnbNsYP1NLV0DlgxAnipGfsYhgLFMg4t5lKXDlnb0HKD1-GWYGLaBWaPPW7RcL6dtKXIKBSSangsxMP5kjLwjF2cpmv4QgdxYDz7cJKQ3bx43huMKNWxPCZpgEuJRo8pIhPp9K44m7JGSdL4z0cmZF2hzJVOFx0G74LX7cCMxLnIFMSwmrXoADZBMDztlHxnNVHi1eUKE9h0cVCiRm7_kAMY48n7N9W1i1fVEkpPiiXIkwHNj428E",
  },
  {
    id: 2,
    title: "Mountain Escape",
    author: "Studio Nova",
    aspect: "aspect-square",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCc_G9xCRouIyREzipZqBrUi89_DJngQrC3DTz01_FJctn4Uan-Nd5WXUA4lLQHRggV2-0xRp0i59qPNGBZqD20ZZ5uFVuwZbvd4s3oTQU2w7bavaq3KmEG15Rnng9ptf0x-Ra_b3Ker4Q0TdravbEfIkajJWMhuQwmchAoqVbA4olg5N7w70Frr1OSjehRnOTiSo4zp7ODhlM7265vOyt-ipGOc91mXz4OwRHlY4aM7vAGkC4N1ykRMmYqFD1zOMi5OXNRhH_lCQI",
  },
  {
    id: 3,
    title: "Pastel Geometry",
    author: "Marcus T.",
    aspect: "aspect-[3/4]",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCqeJAyNKJ9kJuuZwuOq72_aZZRAfG99pDXw7GbQ1t2fRFXNQK5us1HaxY8LPWzDxFTaKem6tlqLBhu04BDKBOF5EC0OGHE64LI2PFXUOvcciUhgRNAZus0J61LF7PxU4QYC6QraM9SDchkYeD8leg8nyu6jtUsBh4eC2PzPdIsaYsluP_8GPWXR8PGWqkuTR4kJiaUruIGHgUzzZ4OybTWW_XmxMQcGbBvPORA1MVdRhtczkqqDidCTheNc9vv2kQMDJ9AshIGayQ",
  },
  {
    id: 4,
    title: "Dreamscape",
    author: "Anna K.",
    aspect: "aspect-video",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCe-3MODAWI-UY1Qk3AMepBssRQAVdWqo_PrxgeSysgMSNoRBWFclSMjTnjRbR-PsvgBE5CJ_voCtUoWgytwP38hw58Gnj5rjaEtb8M4G1l-Usz6eDpRMU2L4DPUvRrXBKXIc4_JdSVXYXbJ7UhoZDvdhZnCHpEVNwAJc4FHPkGBQQm6PB7PJewrDU354cV32HjMs5HDTEki5-kyPYrk-CitIQ7tZsAIo8ijrKi7LNXIhkFmNGdSDH8eEJJzUzmwxFyeUWUqcFISxg",
  },
  {
    id: 5,
    title: "Liquid Aura",
    author: "J. Dean",
    aspect: "aspect-[4/3]",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCMBkQlHOR2ooHlTbtQ3pzS_gse-H2UqY51P8SY6X3M2eow3KR3j0ajMwApQgZysJxiYVaqlgB_lJ7tcF3OCGTsDTQjXWJgE6U13O2hgI_YKP65rJheT3eYq941fAP1pUfHCO6wwgGJLSXAvQtbyHgDkQ5M3C0E3b0rIWNnz_XcXxgsYn06JTyYMSF-YeCBZr3ZFXFNgyzqCM1A-WyGLuO012VmVO52sWgWiuTwYr9nNIfMUJo1WmdzXiSYqw63wOsmmY8nY5ox6dA",
  },
  {
    id: 6,
    title: "Monstera Blues",
    author: "Flora Designs",
    aspect: "aspect-square",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB_fXHShDZcz_HyGV4ZoZIwpE3EAlLYfwn7c-pxYwjqcOpQQVfvAOWerVYyKciCZpmupj_isiXDVCKoRtRC3UmKrEbzYRr8SAge4YXTFXMygummAPHqsVIcSXbsTloA8-AwGufOPdIXm5cfFKJKTCOzw1ItC69yDykr5rDqzUJu985pevOJaTdYbjr3BbEJW9FIAMUH0DDU-hTHCFhVcMtVRc7nHSA6mtB07KPfT4LTKhbS9MnsQ3WfJmgffXEXBcACpAKBOnpC0F8",
  },
];

export default function Home() {
  const { initializeAuth } = useAuthStore();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return (
    <div className="flex-1 flex flex-col items-center w-full">
      {/* Hero Section */}
      <section className="w-full max-w-[1440px] px-6 md:px-10 py-12 md:py-20 flex flex-col items-center">
        <div className="w-full max-w-[1200px] flex flex-col items-center gap-10">
          <div className="flex flex-col gap-4 text-center max-w-[800px]">
            <h1 className="text-slate-900 dark:text-white text-5xl md:text-7xl font-extrabold leading-[1.1] tracking-[-0.04em]">
              Unwind through Art
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-lg md:text-xl font-medium leading-relaxed mt-2">
              Thu gian va sang tao voi tranh to mau so hoa. Mot khoang nghi ngoi
              binh yen cho tam hon sang tao cua ban.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 mt-6">
              <Link
                href="/generate"
                className="flex min-w-[160px] cursor-pointer items-center justify-center rounded-full h-14 px-8 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 text-white text-base font-bold transition-all hover:-translate-y-0.5"
              >
                Tao Tranh AI
              </Link>
              <Link
                href="/gallery"
                className="flex min-w-[160px] cursor-pointer items-center justify-center rounded-full h-14 px-8 border-2 border-slate-200 dark:border-surface-dark hover:border-primary dark:hover:border-primary text-slate-700 dark:text-slate-200 hover:text-primary dark:hover:text-primary text-base font-bold transition-all"
              >
                Kham Pha Gallery
              </Link>
            </div>
          </div>

          <div className="w-full relative rounded-2xl md:rounded-[2rem] overflow-hidden shadow-2xl shadow-slate-200/50 dark:shadow-black/50 aspect-[21/9] bg-surface-light dark:bg-surface-dark group">
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
              style={{
                backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuDI1k8ebEefBreDMB8MySVuROfodhUZ_aEcSUNBLpb3tBD7XuJLwgg7P8mqM1l-XasBXAPou5OxkW3CKa209AQR5u547hLcwXZY-QNx1dILOp4FCCYtyKRpxXJ5KHXkwb7JEcvJVKLauu_JC9-2n_r8DRb9CZo1WGiUpzRitQFVKpwnIXb2uPtsmB67oRgOsoW0divQZAWhfpYnKHiWO-GwnxSIwAA4kVOz2GWB7TmC-ChW-Aan2EzCvo7tVNv8L6GvEcJ-qONKUTk")`,
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          </div>
        </div>
      </section>

      {/* Featured Templates */}
      <section className="w-full max-w-[1440px] px-6 md:px-10 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-slate-900 dark:text-white text-2xl md:text-3xl font-bold tracking-tight">
            Mau Noi Bat
          </h2>
          <div className="flex gap-2">
            <button className="p-2 rounded-full border border-slate-200 dark:border-surface-dark text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-surface-dark transition-colors">
              <span className="material-symbols-outlined text-[20px]">
                filter_list
              </span>
            </button>
          </div>
        </div>

        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
          {templates.map((tpl) => (
            <div
              key={tpl.id}
              className="break-inside-avoid group cursor-pointer"
            >
              <div className="relative w-full rounded-xl overflow-hidden bg-surface-light dark:bg-surface-dark shadow-sm hover:shadow-xl transition-all duration-300">
                <div
                  className={`w-full ${tpl.aspect} bg-cover bg-center group-hover:scale-105 transition-transform duration-500`}
                  style={{ backgroundImage: `url("${tpl.image}")` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
                  <p className="text-white text-lg font-bold">{tpl.title}</p>
                  <p className="text-white/80 text-sm font-medium">
                    By {tpl.author}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-12">
          <Link
            href="/gallery"
            className="flex items-center justify-center gap-2 rounded-full h-12 px-8 bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-surface-dark hover:border-primary dark:hover:border-primary text-slate-700 dark:text-slate-200 text-sm font-bold transition-all shadow-sm"
          >
            Xem Them
            <span className="material-symbols-outlined text-[18px]">
              expand_more
            </span>
          </Link>
        </div>
      </section>
    </div>
  );
}
