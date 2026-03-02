"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaHeart,
  FaShoppingCart,
  FaStar,
  FaEye,
  FaFilter,
  FaSort,
  FaTimes,
} from "react-icons/fa";
import api from "@/lib/api";
import { Product } from "@/types";
import { useCartStore } from "@/store/cartStore";
import { useFavoriteStore } from "@/store/favoriteStore";
import { useHydration } from "@/hooks/useHydration";
import toast from "react-hot-toast";

export default function GalleryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [priceRange, setPriceRange] = useState("all");
  const [difficulty, setDifficulty] = useState("all");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [fullScreenImage, setFullScreenImage] = useState<string | null>(null);
  const { addItem } = useCartStore();
  const { addFavorite, removeFavorite, isFavorite } = useFavoriteStore();
  const hydrated = useHydration();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/products?limit=100");
      console.log("API Response:", data); // Debug log
      // API returns { success, message, data: { products, pagination } }
      setProducts(data.data?.products || data.products || []);
    } catch (error) {
      console.error("Error loading products:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Lọc và sắp xếp sản phẩm
  const filteredAndSortedProducts = useMemo(() => {
    let result = [...products];

    // Lọc theo category
    if (filter !== "all") {
      result = result.filter((p) => p.category === filter);
    }

    // Lọc theo giá
    if (priceRange !== "all") {
      result = result.filter((p) => {
        if (priceRange === "under200k") return p.price < 200000;
        if (priceRange === "200k-500k")
          return p.price >= 200000 && p.price <= 500000;
        if (priceRange === "over500k") return p.price > 500000;
        return true;
      });
    }

    // Lọc theo độ khó
    if (difficulty !== "all") {
      result = result.filter((p) => p.difficulty === difficulty);
    }

    // Sắp xếp
    result.sort((a, b) => {
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      if (sortBy === "name") return a.title.localeCompare(b.title);
      if (sortBy === "popular") return (b.colors || 0) - (a.colors || 0);
      return 0; // newest - mặc định
    });

    return result;
  }, [products, filter, sortBy, priceRange, difficulty]);

  const handleAddToCart = (product: Product) => {
    addItem(product);
    toast.success("Đã thêm vào giỏ hàng!");
  };

  const handleToggleFavorite = (product: Product) => {
    if (isFavorite(product.id)) {
      removeFavorite(product.id);
      toast.success("Đã xóa khỏi yêu thích!");
    } else {
      addFavorite(product);
      toast.success("Đã thêm vào yêu thích!");
    }
  };

  const emotions = [
    "happy",
    "surprised",
    "sad",
    "sleepy",
    "angry",
    "thinking",
    "smile",
    "cry",
    "default",
  ];
  const [mascotEmotion, setMascotEmotion] = useState("happy");
  const nextEmotion = () => {
    const idx = emotions.indexOf(mascotEmotion);
    setMascotEmotion(emotions[(idx + 1) % emotions.length]);
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-4">
              🎨 Gallery Tranh Tô Màu
            </h1>
            <p className="text-xl md:text-2xl mb-2">
              Khám phá bộ sưu tập tranh tô màu độc đáo
            </p>
            <p className="text-lg opacity-90">
              Hơn 1000+ mẫu tranh chất lượng cao
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Filter and Sort Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-6 mb-8"
        >
          {/* Category Filter */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
              <FaFilter className="text-purple-600" /> Danh Mục
            </h3>
            <div className="flex flex-wrap gap-3">
              {categories.map((category) => (
                <button
                  key={category.value}
                  onClick={() => setFilter(category.value)}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                    filter === category.value
                      ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg scale-105"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105"
                  }`}
                >
                  {category.icon} {category.label}
                </button>
              ))}
            </div>
          </div>

          {/* Advanced Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-gray-200">
            {/* Price Range */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Khoảng Giá
              </label>
              <select
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all bg-white text-gray-700"
              >
                <option value="all">Tất cả</option>
                <option value="under200k">Dưới 200,000₫</option>
                <option value="200k-500k">200,000₫ - 500,000₫</option>
                <option value="over500k">Trên 500,000₫</option>
              </select>
            </div>

            {/* Difficulty */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Độ Khó
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all bg-white text-gray-700"
              >
                <option value="all">Tất cả</option>
                <option value="Dễ">Dễ</option>
                <option value="Trung Bình">Trung Bình</option>
                <option value="Khó">Khó</option>
              </select>
            </div>

            {/* Sort */}
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <FaSort className="text-purple-600" /> Sắp Xếp
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all bg-white text-gray-700"
              >
                <option value="newest">Mới Nhất</option>
                <option value="popular">Phổ Biến Nhất</option>
                <option value="price-asc">Giá Thấp - Cao</option>
                <option value="price-desc">Giá Cao - Thấp</option>
                <option value="name">Tên A-Z</option>
              </select>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-gray-600">
              Hiển thị{" "}
              <span className="font-bold text-purple-600">
                {filteredAndSortedProducts.length}
              </span>{" "}
              sản phẩm
            </p>
          </div>
        </motion.div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl h-96 animate-pulse shadow-lg"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredAndSortedProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -10 }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden group hover:shadow-2xl transition-all duration-300"
              >
                {/* Image Container */}
                <div className="relative h-72 overflow-hidden bg-gradient-to-br from-purple-100 to-pink-100">
                  <Image
                    src={product.thumbnailUrl}
                    alt={product.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />

                  {/* Overlay on Hover */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
                    <button
                      onClick={() => setSelectedProduct(product)}
                      className="opacity-0 group-hover:opacity-100 bg-white text-purple-600 px-6 py-3 rounded-full font-semibold transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 flex items-center gap-2"
                    >
                      <FaEye /> Xem Chi Tiết Sản Phẩm
                    </button>
                  </div>

                  {/* Favorite Button */}
                  <button
                    onClick={() => handleToggleFavorite(product)}
                    className={`absolute top-4 right-4 p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 ${
                      hydrated && isFavorite(product.id)
                        ? "bg-red-500 text-white"
                        : "bg-white text-red-500 hover:bg-red-50"
                    }`}
                  >
                    <FaHeart />
                  </button>

                  {/* Badge */}
                  <div className="absolute top-4 left-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                    <FaStar /> Bán Chạy
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="font-bold text-lg mb-3 line-clamp-2 text-gray-800 group-hover:text-purple-600 transition-colors">
                    {product.title}
                  </h3>

                  {/* Info Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-semibold">
                      {product.difficulty}
                    </span>
                    <span className="bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-xs font-semibold">
                      {product.colors} màu
                    </span>
                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">
                      ⭐ 4.8
                    </span>
                  </div>

                  {/* Price and Cart */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div>
                      <p className="text-xs text-gray-500 line-through">
                        {(product.price * 1.3).toLocaleString("vi-VN")} VNĐ
                      </p>
                      <p className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                        {product.price.toLocaleString("vi-VN")} VNĐ
                      </p>
                    </div>
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4 rounded-xl hover:shadow-lg hover:scale-110 transition-all duration-300"
                    >
                      <FaShoppingCart size={20} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredAndSortedProducts.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="text-8xl mb-6">🎨</div>
            <h3 className="text-2xl font-bold text-gray-700 mb-2">
              Không tìm thấy sản phẩm
            </h3>
            <p className="text-gray-500">Hãy thử chọn danh mục khác</p>
          </motion.div>
        )}
      </div>

      {/* 3D Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedProduct(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", damping: 20 }}
              className="bg-white rounded-3xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 rounded-t-3xl z-10 flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold mb-2">
                    {selectedProduct.title}
                  </h2>
                  <p className="text-white/90">{selectedProduct.description}</p>
                </div>
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="p-3 hover:bg-white/20 rounded-full transition-all duration-300 hover:rotate-90"
                >
                  <FaTimes size={24} />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Product Info */}
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">
                      📋 Thông Tin Sản Phẩm
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Kích thước:</span>
                        <span className="font-semibold text-gray-800">
                          {typeof selectedProduct.dimensions === "string"
                            ? selectedProduct.dimensions
                            : `${selectedProduct.dimensions?.width || 40} x ${selectedProduct.dimensions?.height || 50} ${selectedProduct.dimensions?.unit || "cm"}`}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Độ khó:</span>
                        <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold">
                          {selectedProduct.difficulty}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Số màu:</span>
                        <span className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-sm font-semibold">
                          {selectedProduct.colors} màu
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Đánh giá:</span>
                        <span className="flex items-center gap-1 text-yellow-600 font-semibold">
                          <FaStar /> {selectedProduct.rating || 4.8}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Đã bán:</span>
                        <span className="font-semibold text-gray-800">
                          {selectedProduct.sales || 0} sản phẩm
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">
                      💰 Giá Bán
                    </h3>
                    <div className="flex items-center gap-4">
                      <span className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                        {selectedProduct.price.toLocaleString("vi-VN")} VNĐ
                      </span>
                      <span className="text-gray-500 line-through">
                        {(selectedProduct.price * 1.3).toLocaleString("vi-VN")}{" "}
                        VNĐ
                      </span>
                    </div>
                    <p className="text-sm text-green-600 font-semibold mt-2">
                      🎉 Tiết kiệm{" "}
                      {(selectedProduct.price * 0.3).toLocaleString("vi-VN")}{" "}
                      VNĐ
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-4">
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">
                      📦 Bộ sản phẩm bao gồm
                    </h3>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start gap-2">
                        <span className="text-green-600">✓</span>
                        <span>
                          Bộ canvas in sẵn số với khung tranh gỗ cao cấp
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-600">✓</span>
                        <span>
                          Bộ màu acrylic {selectedProduct.colors} màu chất lượng
                          cao
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-600">✓</span>
                        <span>3 cọ vẽ chuyên dụng (size nhỏ, vừa, lớn)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-600">✓</span>
                        <span>Hướng dẫn chi tiết và bảng màu tham khảo</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-600">✓</span>
                        <span>Móc treo tranh và vít đi kèm</span>
                      </li>
                    </ul>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col gap-3">
                    <Link
                      href={`/products/${selectedProduct.id}`}
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-4 rounded-xl font-bold hover:shadow-xl transition text-center flex items-center justify-center gap-2"
                    >
                      <FaEye />
                      Xem Chi Tiết
                    </Link>
                    <button
                      onClick={() => {
                        handleAddToCart(selectedProduct);
                        setSelectedProduct(null);
                      }}
                      className="w-full bg-white border-2 border-purple-600 text-purple-600 px-6 py-4 rounded-xl font-bold hover:bg-purple-50 transition flex items-center justify-center gap-2"
                    >
                      <FaShoppingCart /> Thêm Vào Giỏ
                    </button>
                    <button
                      onClick={() => handleToggleFavorite(selectedProduct)}
                      className={`w-full p-4 rounded-xl font-bold transition flex items-center justify-center gap-2 ${
                        hydrated && isFavorite(selectedProduct.id)
                          ? "bg-red-500 text-white hover:bg-red-600"
                          : "bg-gray-200 text-red-500 hover:bg-red-50"
                      }`}
                    >
                      <FaHeart size={24} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Instruction Images Section */}
              <div className="px-6 pb-6">
                <h3 className="text-2xl font-bold text-center text-gray-800 mb-6">
                  📚 Hướng Dẫn Chi Tiết
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Image 1: Phụ kiện */}
                  <div
                    onClick={() =>
                      setFullScreenImage(
                        "/images/guides/phu-kien-treo-tranh.webp",
                      )
                    }
                    className="bg-gradient-to-br from-green-50 to-teal-50 rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group"
                  >
                    <div className="relative w-full h-80 mb-3 rounded-xl overflow-hidden">
                      <Image
                        src="/images/guides/phu-kien-treo-tranh.webp"
                        alt="Phụ kiện đi kèm hộp tranh tô màu"
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                        onError={(e) => {
                          e.currentTarget.src =
                            "https://via.placeholder.com/400x400/ecfccb/16a34a?text=Phụ+Kiện+Treo+Tranh";
                        }}
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                        <FaEye className="text-white text-4xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                    </div>
                    <h4 className="text-lg font-bold text-gray-800 text-center">
                      Phụ Kiện Đi Kèm & Hướng Dẫn Treo Tranh
                    </h4>
                  </div>

                  {/* Image 2: Hướng dẫn tô màu */}
                  <div
                    onClick={() =>
                      setFullScreenImage("/images/guides/huong-dan-to-mau.webp")
                    }
                    className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group"
                  >
                    <div className="relative w-full h-80 mb-3 rounded-xl overflow-hidden">
                      <Image
                        src="/images/guides/huong-dan-to-mau.webp"
                        alt="Hướng dẫn tô màu tranh"
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                        onError={(e) => {
                          e.currentTarget.src =
                            "https://via.placeholder.com/400x400/fce7f3/db2777?text=Hướng+Dẫn+Tô+Màu";
                        }}
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                        <FaEye className="text-white text-4xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                    </div>
                    <h4 className="text-lg font-bold text-gray-800 text-center">
                      Hướng Dẫn Tô Màu Chi Tiết
                    </h4>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Full Screen Image Viewer */}
      <AnimatePresence>
        {fullScreenImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setFullScreenImage(null)}
            className="fixed inset-0 z-[100] bg-black bg-opacity-95 flex items-center justify-center p-4 cursor-zoom-out"
          >
            <button
              onClick={() => setFullScreenImage(null)}
              className="absolute top-4 right-4 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-all duration-300 z-10"
            >
              <FaTimes className="text-white text-2xl" />
            </button>
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-6xl h-[90vh] cursor-default"
            >
              <Image
                src={fullScreenImage}
                alt="Hướng dẫn chi tiết"
                fill
                className="object-contain"
                quality={100}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={nextEmotion}
        className="fixed right-4 bottom-28 z-50 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-full shadow-lg font-bold hover:scale-105 transition-all"
      >
        Đổi biểu cảm
      </button>
    </div>
  );
}

const categories = [
  { value: "all", label: "Tất Cả", icon: "🎨" },
  { value: "animals", label: "Động Vật", icon: "🐾" },
  { value: "landscape", label: "Phong Cảnh", icon: "🏞️" },
  { value: "flowers", label: "Hoa", icon: "🌸" },
  { value: "architecture", label: "Kiến Trúc", icon: "🏛️" },
];
