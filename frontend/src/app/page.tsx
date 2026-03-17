"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import { motion, useInView } from "framer-motion";
import { once } from "events";

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

function FadeIn({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

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
            <FadeIn>
              <h1 className="text-slate-900 dark:text-white text-5xl md:text-7xl font-extrabold leading-[1.1] tracking-[-0.04em]">
                Unwind through Art
              </h1>
            </FadeIn>

            <FadeIn>
              <p className="text-slate-500 dark:text-slate-400 text-lg md:text-xl font-medium leading-relaxed mt-2">
                Thu gian va sang tao voi tranh to mau so hoa. Mot khoang nghi
                ngoi binh yen cho tam hon sang tao cua ban.
              </p>
            </FadeIn>

            <FadeIn>
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
            </FadeIn>
          </div>
          <section>
            <FadeIn delay={0.4} className="w-full">
              <div className="w-full relative rounded-2xl md:rounded-[2rem] overflow-hidden shadow-2xl shadow-slate-200/50 dark:shadow-black/50 aspect-[21/9] bg-surface-light dark:bg-surface-dark group">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                  style={{
                    backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuDI1k8ebEefBreDMB8MySVuROfodhUZ_aEcSUNBLpb3tBD7XuJLwgg7P8mqM1l-XasBXAPou5OxkW3CKa209AQR5u547hLcwXZY-QNx1dILOp4FCCYtyKRpxXJ5KHXkwb7JEcvJVKLauu_JC9-2n_r8DRb9CZo1WGiUpzRitQFVKpwnIXb2uPtsmB67oRgOsoW0divQZAWhfpYnKHiWO-GwnxSIwAA4kVOz2GWB7TmC-ChW-Aan2EzCvo7tVNv8L6GvEcJ-qONKUTk")`,
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </div>
            </FadeIn>
          </section>
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

      {/* Về Chúng Tôi */}
      <section
        id="about"
        className="w-full max-w-[1440px] px-6 md:px-10 py-16 md:py-24"
      >
        <div className="max-w-[1200px] mx-auto grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <span className="text-primary font-semibold text-sm uppercase tracking-widest">
              Về Chúng Tôi
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-300 mt-3 mb-6 leading-tight">
              Yu Ling Store —<br />
              Nghệ Thuật Cho Mọi Người
            </h2>
            <p className="text-slate-500 text-lg leading-relaxed mb-4">
              Chúng tôi tin rằng mỗi người đều có một nghệ sĩ bên trong. Yu Ling
              Store mang đến những bộ tranh tô màu theo số được thiết kế bởi AI,
              giúp bạn thư giãn và sáng tạo mà không cần kỹ năng vẽ.
            </p>
            <p className="text-slate-500 text-lg leading-relaxed">
              Từ phong cảnh thiên nhiên đến chân dung nghệ thuật — chúng tôi có
              hơn 200+ mẫu tranh đa dạng, phù hợp cho mọi lứa tuổi.
            </p>
          </motion.div>

          <motion.div
            className="relative rounded-2xl overflow-hidden aspect-square shadow-xl"
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuDUkKlkl7iHFBwxvnS2G2DrHonnbNsYP1NLV0DlgxAnipGfsYhgLFMg4t5lKXDlnb0HKD1-GWYGLaBWaPPW7RcL6dtKXIKBSSangsxMP5kjLwjF2cpmv4QgdxYDz7cJKQ3bx43huMKNWxPCZpgEuJRo8pIhPp9K44m7JGSdL4z0cmZF2hzJVOFx0G74LX7cCMxLnIFMSwmrXoADZBMDztlHxnNVHi1eUKE9h0cVCiRm7_kAMY48n7N9W1i1fVEkpPiiXIkwHNj428E")`,
              }}
            />
          </motion.div>
        </div>
      </section>

      {/* Cách Hoạt Động */}
      <section className="w-full bg-slate-50 py-16 md:py-24">
        <div className="max-w-[1200px] mx-auto px-6 md:px-10">
          <div className="text-center mb-12">
            <span className="text-primary font-semibold text-sm uppercase tracking-widest">
              Đơn Giản & Dễ Dàng
            </span>
            <h2 className="text-4xl font-extrabold text-slate-900 mt-3">
              Chỉ 3 Bước Để Bắt Đầu
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Chọn Tranh",
                desc: "Duyệt qua hàng trăm mẫu tranh đa dạng hoặc tạo tranh AI từ ảnh của bạn.",
                icon: "🖼️",
              },
              {
                step: "02",
                title: "Đặt Hàng",
                desc: "Thêm vào giỏ, chọn kích thước canvas và hoàn tất thanh toán trong vài phút.",
                icon: "🛒",
              },
              {
                step: "03",
                title: "Tô Màu & Thư Giãn",
                desc: "Nhận bộ kit tại nhà, làm theo số đánh dấu và tận hưởng khoảnh khắc sáng tạo.",
                icon: "🎨",
              },
            ].map((item) => (
              <motion.div
                key={item.step}
                className="text-center p-8 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{
                  duration: 0.5,
                  delay: parseInt(item.step) * 0.15,
                  ease: "easeOut",
                }}
                whileHover={{ scale: 1.03 }}
              >
                <div className="text-5xl mb-4">{item.icon}</div>
                <div className="text-primary font-bold text-sm mb-2">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  {item.title}
                </h3>
                <p className="text-slate-500 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tại Sao Chọn Chúng Tôi */}
      <section className="w-full max-w-[1440px] px-6 md:px-10 py-16 md:py-24">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-extrabold text-primary">
              Tại Sao Chọn Yu Ling Store?
            </h2>
          </div>
          <div className="grid sm:grid-cols-222 lg:grid-cols-4 gap-6 ">
            {[
              {
                icon: "✨",
                title: "AI Tạo Tranh",
                desc: "Upload ảnh bất kỳ, AI chuyển thành tranh tô màu theo số độc đáo.",
              },
              {
                icon: "🚚",
                title: "Giao Hàng Nhanh",
                desc: "Miễn phí vận chuyển cho đơn từ 500K. Giao trong 3-5 ngày.",
              },
              {
                icon: "🎁",
                title: "Chất Lượng Cao",
                desc: "Canvas dày, màu sơn an toàn không độc hại, cọ vẽ cao cấp.",
              },
              {
                icon: "💬",
                title: "Hỗ Trợ 24/7",
                desc: "Đội ngũ tư vấn sẵn sàng hỗ trợ bạn qua chat hoặc hotline.",
              },
            ].map((item) => (
              <motion.div
                key={item.title}
                className="p-6 border border-slate-200 rounded-2xl hover:border-primary hover:shadow-lg transition-all"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: 0.1 }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
              >
                <div className="text-center text-4xl mb-4">{item.icon}</div>
                <h3 className="text-center font-bold text-lg text-slate-300 mb-2">
                  {item.title}
                </h3>
                <p className="text-center text-slate-200 text-sm leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA cuối trang */}
      <section className="w-full bg-gradient-to-r from-purple-600 to-pink-600 py-20">
        <motion.div
          className="max-w-[800px] mx-auto px-6 text-center"
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
            Sẵn Sàng Bắt Đầu?
          </h2>
          <p className="text-white/80 text-xl mb-8">
            Khám phá hơn 200+ mẫu tranh hoặc tạo tranh AI từ ảnh của bạn ngay
            hôm nay.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/gallery"
              className="bg-white text-purple-600 font-bold px-8 py-4 rounded-full hover:shadow-xl transition-all hover:-translate-y-1"
            >
              Khám Phá Gallery
            </Link>
            <Link
              href="/generate"
              className="bg-transparent border-2 border-white text-white font-bold px-8 py-4 rounded-full hover:bg-white/10 transition-all"
            >
              Tạo Tranh AI
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
