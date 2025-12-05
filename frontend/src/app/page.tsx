'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaPalette, FaMagic, FaShoppingCart, FaStar } from 'react-icons/fa';
import { useAuthStore } from '@/store/authStore';

export default function Home() {
  const { initializeAuth } = useAuthStore();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return (
    <div className="min-h-screen relative">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-20 relative">
        <div className="container mx-auto px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-bold mb-6"
          >
            Tranh Tô Màu Số Hóa với AI
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto"
          >
            Khám phá nghệ thuật thư giãn với tranh tô màu số hóa chất lượng cao. Hoặc tạo tranh độc
            đáo của riêng bạn bằng AI!
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap gap-4 justify-center"
          >
            <Link
              href="/gallery"
              className="bg-white text-purple-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              Xem Gallery
            </Link>
            <Link
              href="/generate"
              className="bg-purple-800 text-white px-8 py-4 rounded-lg font-semibold hover:bg-purple-900 transition border-2 border-white"
            >
              Tạo Tranh AI
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-br from-purple-50 via-pink-100 to-blue-50">
        <div className="container mx-auto px-4">
          <h2 className="text-5xl font-extrabold text-center mb-16 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 drop-shadow-lg">
            Tại Sao Chọn Chúng Tôi?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.15 }}
                className="relative bg-white rounded-3xl shadow-xl p-10 text-center transition-transform hover:-translate-y-2 hover:shadow-2xl duration-300 border-t-4 border-purple-300"
              >
                <div className="absolute -top-8 left-1/2 -translate-x-1/2">
                  <div className="bg-gradient-to-r from-purple-600 to-pink-500 text-white w-16 h-16 rounded-full flex items-center justify-center text-4xl font-extrabold border-4 border-white shadow-lg">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-4 mt-10 text-purple-700">{feature.title}</h3>
                <p className="text-gray-600 text-base mb-4">{feature.description}</p>
                <div className="flex justify-center mt-4">
                  <span className="inline-block w-12 h-1 rounded-full bg-gradient-to-r from-purple-400 to-pink-400"></span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gradient-to-br from-purple-50 via-pink-100 to-blue-50">
        <div className="container mx-auto px-4">
          <h2 className="text-5xl font-extrabold text-center mb-16 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 drop-shadow-lg">
            Cách Thức Hoạt Động
          </h2>
          <div className="flex flex-col md:flex-row items-center justify-center gap-12">
            {steps.map((step, index) => (
              <div
                key={index}
                className="relative flex-1 max-w-xs bg-white rounded-3xl shadow-xl p-8 text-center transition-transform hover:-translate-y-2 hover:shadow-2xl duration-300"
              >
                <div className="absolute -top-8 left-1/2 -translate-x-1/2">
                  <div className="bg-gradient-to-r from-purple-600 to-pink-500 text-white w-20 h-20 rounded-full flex items-center justify-center text-3xl font-extrabold border-4 border-white shadow-lg">
                    {index + 1}
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-4 mt-12 text-purple-700">{step.title}</h3>
                <p className="text-gray-600 text-base mb-4">{step.description}</p>
                <div className="flex justify-center mt-4">
                  <span className="inline-block w-16 h-1 rounded-full bg-gradient-to-r from-purple-400 to-pink-400"></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-[#E6007A] via-[#8A2BE2] to-[#FF0077] text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6 drop-shadow-lg">Sẵn Sàng Bắt Đầu Sáng Tạo?</h2>
          <p className="text-xl mb-8 opacity-90">
            Tham gia cộng đồng nghệ sĩ và tạo ra những tác phẩm độc đáo ngay hôm nay!
          </p>
          <Link
            href="/register"
            className="bg-white text-[#E6007A] px-8 py-4 rounded-lg font-semibold hover:bg-pink-100 hover:text-[#8A2BE2] transition inline-block shadow-md"
          >
            Đăng Ký Miễn Phí
          </Link>
        </div>
      </section>
    </div>
  );
}

const features = [
  {
    icon: <FaPalette />,
    title: 'Chất Lượng Cao',
    description: 'Tranh in chất lượng cao trên canvas cao cấp',
  },
  {
    icon: <FaMagic />,
    title: 'AI Tạo Tranh',
    description: 'Tạo tranh độc đáo từ ý tưởng của bạn',
  },
  {
    icon: <FaShoppingCart />,
    title: 'Mua Sắm Dễ Dàng',
    description: 'Thanh toán nhanh chóng và giao hàng tận nơi',
  },
  {
    icon: <FaStar />,
    title: 'Đánh Giá 5 Sao',
    description: 'Hàng nghìn khách hàng hài lòng',
  },
];

const steps = [
  {
    title: 'Chọn Hoặc Tạo',
    description: 'Chọn từ gallery hoặc tạo tranh bằng AI',
  },
  {
    title: 'Đặt Hàng',
    description: 'Thêm vào giỏ và hoàn tất thanh toán',
  },
  {
    title: 'Nhận và Tô',
    description: 'Nhận tranh và bắt đầu sáng tạo',
  },
];
