"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaMagic,
  FaSpinner,
  FaDownload,
  FaRedo,
  FaShoppingCart,
  FaLightbulb,
} from "react-icons/fa";
import api from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import toast from "react-hot-toast";

import { useRouter } from "next/navigation";

export default function GeneratePage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [prompt, setPrompt] = useState("");
  const [complexity, setComplexity] = useState("medium");
  const [generating, setGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState("");
  const [coloredPreviewImage, setColoredPreviewImage] = useState("");
  const [includeColoredPreview, setIncludeColoredPreview] = useState(false);

  const handleGenerate = async () => {
    if (!user) {
      toast.error("Vui lòng đăng nhập để sử dụng tính năng này");
      router.push("/login");
      return;
    }

    if (!prompt.trim()) {
      toast.error("Vui lòng nhập mô tả tranh");
      return;
    }

    try {
      setGenerating(true);
      setGeneratedImage("");
      setColoredPreviewImage("");

      const { data } = await api.post("/generate/paint-by-numbers", {
        prompt,
        complexity,
        includeColoredPreview,
      });

      toast.success("Đang tạo tranh... Vui lòng đợi");

      // Poll for status
      pollGenerationStatus(data.generationId);
    } catch (error: any) {
      console.error("Generation error:", error);
      toast.error(error.response?.data?.error || "Có lỗi xảy ra");
      setGenerating(false);
    }
  };

  const pollGenerationStatus = async (id: string) => {
    const maxAttempts = 60;
    let attempts = 0;
    let isPolling = false;

    const interval = setInterval(async () => {
      if (isPolling) return;

      try {
        isPolling = true;
        const { data } = await api.get(`/generate/status/${id}`);

        if (data.status === "completed") {
          setGeneratedImage(data.imageUrl);
          setColoredPreviewImage(data.coloredImageUrl || "");
          setGenerating(false);
          clearInterval(interval);
          toast.success("Tạo tranh thành công!");
        } else if (data.status === "failed") {
          setGenerating(false);
          clearInterval(interval);
          toast.error("Tạo tranh thất bại: " + (data.error || "Unknown error"));
        }

        attempts++;
        if (attempts >= maxAttempts) {
          clearInterval(interval);
          setGenerating(false);
          toast.error("Timeout: Quá trình tạo tranh mất quá lâu");
        }
      } catch (error) {
        console.error("Polling error:", error);
      } finally {
        isPolling = false;
      }
    }, 5000);
  };

  const handleReset = () => {
    setPrompt("");
    setGeneratedImage("");
    setColoredPreviewImage("");
    setComplexity("medium");
    setIncludeColoredPreview(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-12 relative">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent text2-height ">
            ✨ Tạo Tranh AI Độc Đáo
          </h1>
          <p className="text-xl text-purple-400">
            Biến ý tưởng của bạn thành tranh tô màu chuyên nghiệp
          </p>
        </motion.div>

        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-8">
          {/* Left Panel - Input Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Prompt Card */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="flex items-center gap-3 mb-4">
                <FaLightbulb className="text-yellow-500 text-2xl" />
                <h2 className="text-2xl font-bold text-gray-900">
                  Mô Tả Ý Tưởng
                </h2>
              </div>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Mô tả chi tiết tranh bạn muốn tạo...&#10;&#10;VD: Con mèo dễ thương ngồi trên cửa sổ, nhìn ra khu vườn hoa rực rỡ"
                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none transition-all text-gray-900 placeholder:text-gray-400"
                rows={6}
              />
              <p className="text-sm text-purple-300 mt-2">
                💡 Mẹo: Mô tả càng chi tiết, tranh càng đẹp và chính xác!
              </p>
            </div>

            {/* Complexity Selection */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                ⚙️ Độ Phức Tạp
              </h2>
              <div className="space-y-3">
                {complexities.map((c) => (
                  <motion.button
                    key={c.value}
                    onClick={() => setComplexity(c.value)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full p-5 rounded-xl border-2 transition-all text-left ${
                      complexity === c.value
                        ? "border-purple-600 bg-gradient-to-r from-purple-50 to-pink-50 shadow-md"
                        : "border-gray-200 hover:border-purple-300 bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-bold text-lg flex items-center gap-2">
                          {c.icon}{" "}
                          <span className="text-pink-600">{c.label}</span>
                        </div>
                        <div className="text-sm font-semibold text-purple-700 mt-1">
                          Giá: {c.price.toLocaleString("vi-VN")}k
                        </div>
                        <div className="text-sm text-purple-400 mt-1">
                          {c.description}
                        </div>
                      </div>
                      {complexity === c.value && (
                        <div className="text-purple-600 text-2xl">✓</div>
                      )}
                    </div>
                  </motion.button>
                ))}
              </div>

              <div className="mt-6 p-4 rounded-xl border border-purple-200 bg-purple-50/60">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeColoredPreview}
                    onChange={(e) => setIncludeColoredPreview(e.target.checked)}
                    className="mt-1 h-5 w-5 rounded border-purple-300 text-purple-600 focus:ring-purple-500"
                  />
                  <div>
                    <p className="font-semibold text-purple-700">
                      Tạo kèm ảnh mẫu đã tô màu
                    </p>
                    <p className="text-sm text-purple-500">
                      Bật tùy chọn này để có thêm ảnh tham khảo màu hoàn chỉnh.
                      Thời gian tạo có thể lâu hơn.
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {/* Generate Button */}
            <motion.button
              onClick={handleGenerate}
              disabled={generating || !prompt.trim()}
              whileHover={{
                scale: generating ? 1 : 1.05,
                rotate: generating ? 0 : [0, -1, 1, -1, 0],
                boxShadow: "0 20px 60px -15px rgba(168, 85, 247, 0.4)",
              }}
              whileTap={{ scale: generating ? 1 : 0.95 }}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 17,
              }}
              className="w-full bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 bg-[length:200%_100%] hover:bg-right text-white py-6 rounded-2xl font-bold text-xl shadow-xl hover:shadow-2xl transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 border-2 border-purple-400 relative overflow-hidden group"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20"
                animate={{
                  x: ["-100%", "100%"],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 2,
                  ease: "linear",
                }}
              />
              {generating ? (
                <>
                  <FaSpinner className="animate-spin text-2xl" />
                  Đang Tạo Tranh...
                </>
              ) : (
                <>
                  <motion.div
                    animate={{
                      rotate: [0, 15, -15, 15, 0],
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 2,
                      ease: "easeInOut",
                    }}
                  >
                    <FaMagic className="text-2xl" />
                  </motion.div>
                  Tạo Tranh Ngay
                </>
              )}
            </motion.button>
          </motion.div>

          {/* Right Panel - Preview/Result */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:sticky lg:top-8 h-fit"
          >
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                🖼️ Kết Quả
              </h2>

              <AnimatePresence mode="wait">
                {generating ? (
                  <motion.div
                    key="generating"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="aspect-square bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex flex-col items-center justify-center"
                  >
                    <FaSpinner className="text-6xl text-purple-600 animate-spin mb-4" />
                    <p className="text-lg font-semibold text-gray-900">
                      Đang tạo tranh...
                    </p>
                    <p className="text-sm text-purple-300 mt-2">
                      Vui lòng chờ trong giây lát
                    </p>
                  </motion.div>
                ) : generatedImage ? (
                  <motion.div
                    key="result"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div>
                        <p className="text-sm font-semibold text-purple-600 mb-2">
                          Tranh Tô Màu
                        </p>
                        <div className="relative aspect-square rounded-xl overflow-hidden shadow-lg border border-purple-100">
                          <Image
                            src={generatedImage}
                            alt="Generated paint-by-numbers"
                            fill
                            className="object-cover"
                          />
                        </div>
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-pink-600 mb-2">
                          Ảnh Tham Khảo Đã Tô Màu
                        </p>
                        <div className="relative aspect-square rounded-xl overflow-hidden shadow-lg border border-pink-100 bg-gradient-to-br from-pink-50 to-purple-50">
                          {coloredPreviewImage ? (
                            <Image
                              src={coloredPreviewImage}
                              alt="Colored reference preview"
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-sm text-purple-400 px-4 text-center">
                              Chưa có ảnh tham khảo màu cho lần tạo này
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => router.push("/checkout")}
                        className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 py-4 rounded-xl font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2 border-2 border-purple-300"
                      >
                        <FaShoppingCart /> Mua Ngay
                      </button>
                      <button className="border-2 border-purple-600 text-purple-600 py-4 rounded-xl font-bold hover:bg-purple-50 transition-all flex items-center justify-center gap-2">
                        <FaDownload /> Tải Về
                      </button>
                    </div>
                    <button
                      onClick={handleReset}
                      className="w-full mt-3 border-2 border-gray-300 text-gray-700 py-4 rounded-xl font-bold hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
                    >
                      <FaRedo /> Tạo Tranh Mới
                    </button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl flex flex-col items-center justify-center border-2 border-dashed border-gray-300"
                  >
                    <div className="text-8xl mb-4">🎨</div>
                    <p className="text-lg font-semibold text-purple-400">
                      Tranh của bạn sẽ xuất hiện ở đây
                    </p>
                    <p className="text-sm text-purple-300 mt-2 text-center px-8">
                      Nhập mô tả và nhấn "Tạo Tranh Ngay" để bắt đầu
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Example Prompts */}
            <div className="bg-white rounded-2xl shadow-xl p-6 mt-6">
              <h3 className="font-bold text-gray-900 mb-4">💡 Gợi Ý Mô Tả</h3>
              <div className="space-y-2">
                {examplePrompts.map((example, index) => (
                  <button
                    key={index}
                    onClick={() => setPrompt(example)}
                    className="w-full text-left p-3 rounded-lg bg-pink-50 text-pink-600 hover:bg-purple-100 hover:text-pink-700 hover:scale-[1.015] transition-all text-sm font-medium"
                  >
                    "{example}"
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

const complexities = [
  {
    value: "easy",
    label: "Dễ",
    icon: "⭐",
    price: 200,
    description: "12-20 màu - Phù hợp người mới",
  },
  {
    value: "medium",
    label: "Trung Bình",
    icon: "⭐⭐",
    price: 270,
    description: "20-36 màu - Cân bằng",
  },
  {
    value: "hard",
    label: "Khó",
    icon: "⭐⭐⭐",
    price: 350,
    description: "36+ màu - Chi tiết cao",
  },
];

const examplePrompts = [
  "Con mèo dễ thương ngồi bên cửa sổ nhìn ra khu vườn",
  "Phong cảnh biển hoàng hôn với những con sóng vỗ vào bờ",
  "Cô gái anime với mái tóc dài cầm bó hoa",
  "Rừng cây mùa thu với lá vàng rơi",
];
