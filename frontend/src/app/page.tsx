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
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-20">
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
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-purple-400">
            Tại Sao Chọn Chúng Tôi?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-6 rounded-lg shadow-lg text-center"
              >
                <div className="text-4xl mb-4 text-purple-600 flex justify-center">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Cách Thức Hoạt Động</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="bg-purple-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {index + 1}
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-purple-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Sẵn Sàng Bắt Đầu Sáng Tạo?</h2>
          <p className="text-xl mb-8">
            Tham gia cộng đồng nghệ sĩ và tạo ra những tác phẩm độc đáo ngay hôm nay!
          </p>
          <Link
            href="/register"
            className="bg-white text-purple-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition inline-block"
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
