"use client";

import Link from "next/link";
import Image from "next/image";
import { FaPalette, FaMagic, FaShoppingCart, FaStar, FaLeaf, FaHeart, FaUsers, FaAward } from "react-icons/fa";

const features = [
  {
    icon: <FaMagic className="text-3xl text-purple-500" />,
    title: "Tạo Tranh AI",
    desc: "Sử dụng trí tuệ nhân tạo để tạo ra những mẫu tranh tô màu độc đáo từ ý tưởng của bạn chỉ trong vài giây.",
  },
  {
    icon: <FaPalette className="text-3xl text-pink-500" />,
    title: "Bộ Sưu Tập Phong Phú",
    desc: "Hàng trăm mẫu tranh tô màu theo nhiều chủ đề: thiên nhiên, động vật, phong cảnh, nghệ thuật trừu tượng...",
  },
  {
    icon: <FaShoppingCart className="text-3xl text-indigo-500" />,
    title: "Mua Sắm Tiện Lợi",
    desc: "Đặt hàng dễ dàng, thanh toán an toàn, giao hàng nhanh chóng đến tận tay bạn.",
  },
  {
    icon: <FaLeaf className="text-3xl text-green-500" />,
    title: "Chất Lượng Cao",
    desc: "Tranh được in trên giấy chất lượng cao, màu sắc rõ nét, đường nét sắc bén giúp trải nghiệm tô màu tốt nhất.",
  },
];

const stats = [
  { icon: <FaUsers />, value: "1,000+", label: "Khách hàng" },
  { icon: <FaStar />, value: "500+", label: "Mẫu tranh" },
  { icon: <FaHeart />, value: "4.9/5", label: "Đánh giá" },
  { icon: <FaAward />, value: "2+", label: "Năm kinh nghiệm" },
];

const steps = [
  { step: "01", title: "Chọn hoặc Tạo", desc: "Duyệt bộ sưu tập có sẵn hoặc nhập mô tả để AI tạo mẫu tranh riêng cho bạn." },
  { step: "02", title: "Đặt Hàng", desc: "Thêm vào giỏ hàng và hoàn tất thanh toán an toàn qua nhiều phương thức." },
  { step: "03", title: "Nhận Hàng", desc: "Tranh được in và giao tận nhà. Mở hộp, lấy bút màu và bắt đầu thư giãn!" },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">

      {/* ── Hero ── */}
      <section className="relative overflow-hidden py-24 px-6 text-center bg-gradient-to-br from-purple-600 via-pink-500 to-indigo-600">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_30%_50%,white,transparent_60%)]" />
        <div className="relative max-w-3xl mx-auto">
          <div className="text-7xl mb-6">🎨</div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 leading-tight">
            Chào mừng đến với<br />
            <span className="text-yellow-300">Yu Ling Store</span>
          </h1>
          <p className="text-lg md:text-xl text-purple-100 mb-8 leading-relaxed">
            Nơi nghệ thuật tô màu gặp gỡ công nghệ AI — mang lại những giây phút thư giãn,
            sáng tạo và bình yên cho mỗi người.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/gallery"
              className="px-8 py-3 bg-white text-purple-700 font-bold rounded-full hover:bg-yellow-300 hover:text-purple-900 transition-all shadow-lg"
            >
              Khám Phá Gallery
            </Link>
            <Link
              href="/generate"
              className="px-8 py-3 bg-transparent border-2 border-white text-white font-bold rounded-full hover:bg-white/10 transition-all"
            >
              Tạo Tranh AI ✨
            </Link>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="py-12 bg-white dark:bg-surface-dark border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {stats.map((s, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <div className="text-2xl text-purple-500">{s.icon}</div>
              <div className="text-3xl font-extrabold text-gray-800 dark:text-white">{s.value}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Về chúng tôi ── */}
      <section className="py-20 px-6 max-w-5xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-sm font-bold text-purple-500 uppercase tracking-widest">Câu chuyện của chúng tôi</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800 dark:text-white mt-3 mb-5 leading-tight">
              Tranh tô màu — Liệu pháp thư giãn cho mọi người
            </h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
              Yu Ling Store ra đời từ niềm đam mê nghệ thuật và mong muốn mang lại những khoảnh khắc
              tĩnh lặng, sáng tạo trong cuộc sống bận rộn hàng ngày. Chúng tôi tin rằng tô màu
              không chỉ là trò chơi của trẻ em — đó là liệu pháp tâm lý giúp giảm căng thẳng,
              rèn luyện sự tập trung và khơi dậy khả năng sáng tạo tiềm ẩn trong mỗi người.
            </p>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              Kết hợp với công nghệ AI tiên tiến, chúng tôi cho phép mỗi khách hàng tạo ra những
              mẫu tranh hoàn toàn cá nhân hóa — độc nhất như chính họ.
            </p>
          </div>
          <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-square bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 flex items-center justify-center">
            <span className="text-[120px]">🖼️</span>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="py-20 px-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-sm font-bold text-purple-500 uppercase tracking-widest">Tính năng nổi bật</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800 dark:text-white mt-3">
              Tại sao chọn Yu Ling Store?
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {features.map((f, i) => (
              <div
                key={i}
                className="bg-white dark:bg-surface-dark rounded-2xl p-6 shadow-md hover:shadow-xl transition-shadow flex gap-5 items-start"
              >
                <div className="mt-1 shrink-0">{f.icon}</div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">{f.title}</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="py-20 px-6 max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <span className="text-sm font-bold text-purple-500 uppercase tracking-widest">Quy trình</span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800 dark:text-white mt-3">
            Chỉ 3 bước đơn giản
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((s, i) => (
            <div key={i} className="text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-2xl font-extrabold mx-auto mb-4 shadow-lg">
                {s.step}
              </div>
              <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">{s.title}</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{s.desc}</p>
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute mt-8 text-gray-300 text-2xl">→</div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 px-6 bg-gradient-to-r from-purple-600 to-pink-600 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
            Bắt đầu hành trình sáng tạo hôm nay!
          </h2>
          <p className="text-purple-100 mb-8 text-lg">
            Hàng trăm mẫu tranh đang chờ bạn khám phá. Hoặc hãy để AI tạo ra một tác phẩm riêng cho bạn.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/gallery"
              className="px-8 py-3 bg-white text-purple-700 font-bold rounded-full hover:bg-yellow-300 hover:text-purple-900 transition-all shadow-lg"
            >
              🖼️ Xem Gallery
            </Link>
            <Link
              href="/generate"
              className="px-8 py-3 bg-purple-800 text-white font-bold rounded-full hover:bg-purple-900 transition-all border border-purple-400"
            >
              ✨ Tạo Tranh AI
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
