"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { FaHeart, FaShoppingCart, FaArrowLeft, FaStar } from "react-icons/fa";
import toast from "react-hot-toast";
import api from "@/lib/api";
import { Product } from "@/types";
import { useAuthStore } from "@/store/authStore";
import { useCartStore } from "@/store/cartStore";
import { useFavoriteStore } from "@/store/favoriteStore";
import { useHydration } from "@/hooks";

const DIFFICULTY_LABELS: Record<string, string> = {
  easy: "Dễ",
  medium: "Trung Bình",
  hard: "Khó",
};

const DIFFICULTY_COLORS: Record<string, string> = {
  easy: "bg-green-100 text-green-700 border border-green-200",
  medium: "bg-yellow-100 text-yellow-700 border border-yellow-200",
  hard: "bg-red-100 text-red-700 border border-red-200",
};

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = String(params?.id || "");

  const hydrated = useHydration();
  const { user } = useAuthStore();
  const { addItem } = useCartStore();
  const { addFavorite, removeFavorite, isFavorite, setCurrentUser } =
    useFavoriteStore();

  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    setCurrentUser(user?.uid || null);
  }, [user?.uid, setCurrentUser]);

  useEffect(() => {
    if (!productId) return;

    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/products/${productId}`);
        const data = res.data?.data || res.data;
        setProduct(data || null);
      } catch (error) {
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-purple-600">Đang tải chi tiết sản phẩm...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="bg-white rounded-xl shadow-md p-8 text-center max-w-md w-full">
          <h1 className="text-2xl font-bold text-gray-800 mb-3">
            Không tìm thấy sản phẩm
          </h1>
          <p className="text-gray-500 mb-6">
            Sản phẩm có thể đã bị xóa hoặc đường dẫn không hợp lệ.
          </p>
          <button
            onClick={() => router.push("/gallery")}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2.5 rounded-lg font-semibold"
          >
            Quay lại Gallery
          </button>
        </div>
      </div>
    );
  }

  const favorite = hydrated && isFavorite(product.id);
  const difficultyKey = product.difficulty || "medium";
  const difficultyLabel = DIFFICULTY_LABELS[difficultyKey] || "Trung Bình";
  const difficultyColor = DIFFICULTY_COLORS[difficultyKey] || DIFFICULTY_COLORS.medium;

  const handleAddToCart = () => {
    addItem(product, 1);
    toast.success(`Đã thêm "${product.title}" vào giỏ hàng!`, {
      icon: "🛒",
      duration: 2000,
    });
  };

  const handleToggleFavorite = () => {
    if (!user) {
      toast.error("Vui lòng đăng nhập để lưu yêu thích!", { icon: "🔐" });
      router.push("/login");
      return;
    }

    if (favorite) {
      removeFavorite(product.id);
      toast("Đã xóa khỏi yêu thích", { icon: "💔", duration: 1500 });
    } else {
      addFavorite(product);
      toast.success("Đã thêm vào yêu thích!", { icon: "❤️", duration: 1500 });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50/60 to-white py-8">
      <div className="max-w-6xl mx-auto px-4">
        <Link
          href="/gallery"
          className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-semibold mb-6"
        >
          <FaArrowLeft /> Quay lại gallery
        </Link>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 lg:p-8">
            <div className="bg-gray-50 rounded-2xl overflow-hidden border border-gray-100">
              <img
                src={product.imageUrl || product.thumbnailUrl}
                alt={product.title}
                className="w-full h-full object-cover min-h-[320px]"
              />
            </div>

            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-3">{product.title}</h1>

              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${difficultyColor}`}>
                  {difficultyLabel}
                </span>
                {product.category && (
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-purple-50 text-purple-700 border border-purple-200">
                    {product.category}
                  </span>
                )}
                {product.rating > 0 && (
                  <span className="inline-flex items-center gap-1 text-sm text-amber-600 font-semibold">
                    <FaStar /> {product.rating.toFixed(1)}
                  </span>
                )}
              </div>

              <p className="text-3xl font-extrabold text-purple-700 mb-6">
                {(product.price || 0).toLocaleString("vi-VN")}đ
              </p>

              <div className="grid grid-cols-2 gap-3 mb-6 text-sm">
                <div className="bg-gray-50 border border-gray-100 rounded-lg p-3">
                  <p className="text-gray-500">Số màu</p>
                  <p className="font-bold text-gray-800">{product.colors || 0}</p>
                </div>
                <div className="bg-gray-50 border border-gray-100 rounded-lg p-3">
                  <p className="text-gray-500">Đã bán</p>
                  <p className="font-bold text-gray-800">{product.sales || 0}</p>
                </div>
              </div>

              <div className="flex gap-3 mb-8">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-5 py-3 rounded-xl font-semibold inline-flex items-center justify-center gap-2"
                >
                  <FaShoppingCart /> Thêm vào giỏ
                </button>
                <button
                  onClick={handleToggleFavorite}
                  className={`px-5 py-3 rounded-xl font-semibold border inline-flex items-center justify-center gap-2 ${
                    favorite
                      ? "bg-red-500 text-white border-red-500"
                      : "bg-white text-gray-700 border-gray-300 hover:border-red-300 hover:text-red-500"
                  }`}
                >
                  <FaHeart />
                </button>
              </div>

              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-2">Mô tả sản phẩm</h2>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                  {product.description || "Chưa có mô tả chi tiết cho sản phẩm này."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
