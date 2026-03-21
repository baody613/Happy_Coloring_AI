"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaShoppingCart,
  FaHeart,
  FaStar,
  FaSearch,
  FaFilter,
  FaChevronLeft,
  FaChevronRight,
  FaSortAmountDown,
  FaTimes,
} from "react-icons/fa";
import toast from "react-hot-toast";
import { Product } from "@/types";
import { useCartStore } from "@/store/cartStore";
import { useFavoriteStore } from "@/store/favoriteStore";
import { useAuthStore } from "@/store/authStore";
import { useHydration } from "@/hooks";
import api from "@/lib/api";

const DIFFICULTY_LABELS: Record<string, string> = {
  all: "Tất Cả",
  easy: "Dễ",
  medium: "Trung Bình",
  hard: "Khó",
};

const DIFFICULTY_COLORS: Record<string, string> = {
  easy: "bg-green-100 text-green-700 border border-green-200",
  medium: "bg-yellow-100 text-yellow-700 border border-yellow-200",
  hard: "bg-red-100 text-red-700 border border-red-200",
};

const CATEGORY_ICONS: Record<string, string> = {
  all: "🎨",
  animals: "🐾",
  landscape: "🌄",
  flowers: "🌸",
  architecture: "🏛️",
  abstract: "🌀",
  portrait: "👤",
  "paint-by-numbers": "🖌️",
  fantasy: "🦋",
  ocean: "🌊",
  city: "🏙️",
};

const CATEGORY_LABELS: Record<string, string> = {
  all: "Tất Cả",
  animals: "Động Vật",
  landscape: "Phong Cảnh",
  flowers: "Hoa Lá",
  architecture: "Kiến Trúc",
  abstract: "Trừu Tượng",
  portrait: "Chân Dung",
  "paint-by-numbers": "Tô Màu",
  fantasy: "Huyền Bí",
  ocean: "Đại Dương",
  city: "Thành Phố",
};

const SORT_OPTIONS = [
  { value: "default", label: "Mặc định" },
  { value: "price_asc", label: "Giá: Thấp → Cao" },
  { value: "price_desc", label: "Giá: Cao → Thấp" },
  { value: "rating", label: "Đánh giá cao nhất" },
  { value: "newest", label: "Mới nhất" },
];

const ITEMS_PER_PAGE = 12;

const NEW_PRODUCT_DAYS = 7;

const quickViewContainerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.14,
    },
  },
};

const quickViewItemVariants = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

function getQuickViewDynamicMotion(seed: string) {
  const hash = seed
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);

  const direction = hash % 2 === 0 ? 1 : -1;
  const rotate = direction * (2 + (hash % 4));
  const rotateX = direction * (8 + (hash % 5));
  const startY = 68 + (hash % 42);
  const overshootY = direction * (6 + (hash % 5));
  const startScale = 0.84 + (hash % 6) * 0.01;
  const duration = 0.8 + (hash % 3) * 0.1;
  const hue = 250 + (hash % 38);

  return {
    panel: {
      initial: {
        opacity: 0,
        scale: startScale,
        y: startY,
        rotate,
        rotateX,
        filter: "blur(10px)",
      },
      animate: {
        opacity: 1,
        scale: [startScale, 1.02, 1],
        y: [startY, -overshootY, 0],
        rotate: [rotate, -rotate * 0.15, 0],
        rotateX: [rotateX, -rotateX * 0.15, 0],
        filter: "blur(0px)",
      },
      exit: {
        opacity: 0,
        scale: 0.95,
        y: 22,
        rotate: direction * 1.5,
        rotateX: direction * 6,
        filter: "blur(4px)",
      },
      transition: {
        duration,
        ease: [0.16, 1, 0.3, 1],
        times: [0, 0.72, 1],
      },
    },
    glowColor: `hsla(${hue}, 95%, 78%, 0.30)`,
  };
}

function isNewProduct(createdAt: string): boolean {
  if (!createdAt) return false;
  const created = new Date(createdAt).getTime();
  const now = Date.now();
  return now - created < NEW_PRODUCT_DAYS * 24 * 60 * 60 * 1000;
}

function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 animate-pulse">
      <div className="aspect-square bg-gray-200" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-200 rounded w-1/2" />
        <div className="flex justify-between items-center pt-1">
          <div className="h-5 bg-gray-200 rounded w-24" />
          <div className="h-8 bg-gray-200 rounded-full w-8" />
        </div>
      </div>
    </div>
  );
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <FaStar
          key={star}
          className={
            star <= Math.round(rating)
              ? "text-yellow-400 text-xs"
              : "text-gray-200 text-xs"
          }
        />
      ))}
      <span className="text-xs text-gray-500 ml-1">{rating.toFixed(1)}</span>
    </div>
  );
}

function ProductCard({
  product,
  onViewDetail,
}: {
  product: Product;
  onViewDetail: (product: Product) => void;
}) {
  const hydrated = useHydration();
  const { addItem } = useCartStore();
  const { addFavorite, removeFavorite, isFavorite } = useFavoriteStore();
  const { user } = useAuthStore();

  const favorited = hydrated && isFavorite(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem(product, 1);
    toast.success(`Đã thêm "${product.title}" vào giỏ hàng!`, {
      icon: "🛒",
      duration: 2000,
    });
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      toast.error("Vui lòng đăng nhập để lưu yêu thích!", { icon: "🔐" });
      return;
    }
    if (favorited) {
      removeFavorite(product.id);
      toast("Đã xóa khỏi yêu thích", { icon: "💔", duration: 1500 });
    } else {
      addFavorite(product);
      toast.success("Đã thêm vào yêu thích!", { icon: "❤️", duration: 1500 });
    }
  };

  const discountPercent =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(
          ((product.originalPrice - product.price) / product.originalPrice) *
            100,
        )
      : 0;

  const isNew = isNewProduct(product.createdAt);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="group cursor-pointer"
      onClick={() => onViewDetail(product)}
    >
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-gray-50">
          <Image
            src={product.imageUrl || product.thumbnailUrl}
            alt={product.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1">
            {isNew && (
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-sm animate-pulse">
                ✨ Mới
              </span>
            )}
            <span
              className={`text-xs font-semibold px-2 py-0.5 rounded-full ${DIFFICULTY_COLORS[product.difficulty]}`}
            >
              {DIFFICULTY_LABELS[product.difficulty]}
            </span>
            {discountPercent > 0 && (
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-red-500 text-white">
                -{discountPercent}%
              </span>
            )}
          </div>

          {/* Favorite button */}
          <button
            onClick={handleToggleFavorite}
            className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center shadow-md transition-all duration-200 ${
              favorited
                ? "bg-red-500 text-white scale-110"
                : "bg-white/90 text-gray-400 hover:text-red-400 hover:bg-white"
            }`}
          >
            <FaHeart className="text-sm" />
          </button>

          {/* Colors info */}
          {product.colors > 0 && (
            <div className="absolute bottom-3 left-3 bg-black/60 text-white text-xs px-2 py-0.5 rounded-full backdrop-blur-sm">
              {product.colors} màu
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-4">
          <h3 className="font-semibold text-gray-800 line-clamp-2 text-sm leading-snug mb-1">
            {product.title}
          </h3>

          {product.rating > 0 && (
            <div className="mb-2">
              <StarRating rating={product.rating} />
            </div>
          )}

          <div className="flex items-center justify-between mt-2">
            <div>
              <span className="text-lg font-bold text-purple-700">
                {product.price.toLocaleString("vi-VN")}đ
              </span>
              {product.originalPrice &&
                product.originalPrice > product.price && (
                  <span className="text-xs text-gray-400 line-through ml-1.5">
                    {product.originalPrice.toLocaleString("vi-VN")}đ
                  </span>
                )}
            </div>

            <button
              onClick={handleAddToCart}
              className="w-9 h-9 rounded-full bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center shadow-md hover:shadow-purple-300 hover:scale-110 transition-all duration-200"
              title="Thêm vào giỏ hàng"
            >
              <FaShoppingCart className="text-sm" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function ProductQuickView({
  product,
  onClose,
}: {
  product: Product;
  onClose: () => void;
}) {
  const hydrated = useHydration();
  const { user } = useAuthStore();
  const { addItem } = useCartStore();
  const { addFavorite, removeFavorite, isFavorite } = useFavoriteStore();
  const favorited = hydrated && isFavorite(product.id);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

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
      return;
    }

    if (favorited) {
      removeFavorite(product.id);
      toast("Đã xóa khỏi yêu thích", { icon: "💔", duration: 1500 });
    } else {
      addFavorite(product);
      toast.success("Đã thêm vào yêu thích!", { icon: "❤️", duration: 1500 });
    }
  };

  const dynamicMotion = getQuickViewDynamicMotion(product.id || "default");

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
      initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
      animate={{ opacity: 1, backdropFilter: "blur(4px)" }}
      exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
      transition={{ duration: 0.55, ease: "easeOut" }}
    >
      <motion.div
        className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full overflow-hidden transform-gpu will-change-transform"
        onClick={(e) => e.stopPropagation()}
        initial={dynamicMotion.panel.initial}
        animate={dynamicMotion.panel.animate}
        exit={dynamicMotion.panel.exit}
        transition={dynamicMotion.panel.transition}
        style={{ transformPerspective: 1200 }}
      >
        <motion.div
          className="pointer-events-none absolute -top-24 -right-24 h-52 w-52 rounded-full blur-3xl"
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          style={{ backgroundColor: dynamicMotion.glowColor }}
        />

        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900">Chi tiết sản phẩm</h3>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full hover:bg-gray-100 text-gray-500 flex items-center justify-center"
          >
            <FaTimes />
          </button>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6"
          variants={quickViewContainerVariants}
          initial="hidden"
          animate="show"
        >
          <motion.div
            className="relative aspect-square rounded-xl overflow-hidden bg-gray-50 border border-gray-100"
            variants={quickViewItemVariants}
          >
            <img
              src={product.imageUrl || product.thumbnailUrl}
              alt={product.title}
              className="w-full h-full object-cover"
            />
          </motion.div>

          <motion.div variants={quickViewItemVariants}>
            <motion.h2
              className="text-2xl font-bold text-gray-900 mb-3"
              variants={quickViewItemVariants}
            >
              {product.title}
            </motion.h2>
            <motion.p
              className="text-2xl font-extrabold text-purple-700 mb-4"
              variants={quickViewItemVariants}
            >
              {product.price.toLocaleString("vi-VN")}đ
            </motion.p>
            <motion.p
              className="text-gray-600 mb-4 whitespace-pre-line"
              variants={quickViewItemVariants}
            >
              {product.description ||
                "Chưa có mô tả chi tiết cho sản phẩm này."}
            </motion.p>
            <motion.div
              className="flex items-center gap-4 text-sm text-gray-600 mb-6"
              variants={quickViewItemVariants}
            >
              <span>🎨 {product.colors || 0} màu</span>
              <span>🛍️ Đã bán: {product.sales || 0}</span>
            </motion.div>

            <motion.div className="flex gap-3" variants={quickViewItemVariants}>
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-5 py-3 rounded-xl font-semibold inline-flex items-center justify-center gap-2"
              >
                <FaShoppingCart /> Thêm vào giỏ
              </button>
              <button
                onClick={handleToggleFavorite}
                className={`px-5 py-3 rounded-xl font-semibold border inline-flex items-center justify-center gap-2 ${
                  favorited
                    ? "bg-red-500 text-white border-red-500"
                    : "bg-white text-gray-700 border-gray-300 hover:border-red-300 hover:text-red-500"
                }`}
              >
                <FaHeart />
              </button>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export default function GalleryPage() {
  const { user } = useAuthStore();
  const { setCurrentUser } = useFavoriteStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<string[]>([]);
  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("all");
  const [sortBy, setSortBy] = useState("default");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    setCurrentUser(user?.uid || null);
  }, [user?.uid, setCurrentUser]);

  useEffect(() => {
    api
      .get("/products/categories")
      .then((res) => {
        const cats: string[] = res.data?.data || [];
        setCategories(cats);
      })
      .catch(() => {});
  }, []);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);

      const params: Record<string, string | number> = {
        page,
        limit: ITEMS_PER_PAGE,
      };

      if (category !== "all") params.category = category;
      if (difficulty !== "all") params.difficulty = difficulty;

      if (sortBy === "price_asc") {
        params.sortBy = "price";
        params.sortOrder = "asc";
      } else if (sortBy === "price_desc") {
        params.sortBy = "price";
        params.sortOrder = "desc";
      } else if (sortBy === "rating") {
        params.sortBy = "rating";
        params.sortOrder = "desc";
      } else if (sortBy === "newest") {
        params.sortBy = "createdAt";
        params.sortOrder = "desc";
      }

      const response = await api.get("/products", { params });
      const data = response.data?.data;
      const list: Product[] = data?.products || [];

      setProducts(list);
      setTotalPages(data?.pagination?.totalPages || 1);
      setTotalProducts(data?.pagination?.total || list.length);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Không thể tải sản phẩm. Vui lòng thử lại!");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [page, category, difficulty, sortBy]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [category, difficulty, sortBy, search]);

  // Client-side search filter
  const displayedProducts = search.trim()
    ? products.filter((p) =>
        p.title.toLowerCase().includes(search.trim().toLowerCase()),
      )
    : products;

  const uniqueCategories = Array.from(
    new Set(categories.map((cat) => cat.trim()).filter(Boolean)),
  );

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-700 via-purple-600 to-pink-500">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-purple-700 via-purple-600 to-pink-500 text-white py-14 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold mb-3"
          >
            🎨 Bộ Sưu Tập Tranh
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-purple-100 text-lg max-w-xl mx-auto"
          >
            Khám phá hàng trăm mẫu tranh tô màu theo số độc đáo, phù hợp mọi lứa
            tuổi
          </motion.p>
          {!loading && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-purple-200 text-sm mt-2"
            >
              {totalProducts} sản phẩm
            </motion.p>
          )}
        </div>
      </div>

      {/* Category Tabs */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-20 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex flex-wrap gap-2">
            {["all", ...uniqueCategories].map((cat) => {
              const icon = CATEGORY_ICONS[cat] ?? "🖼️";
              const label =
                CATEGORY_LABELS[cat] ??
                cat.charAt(0).toUpperCase() + cat.slice(1);
              const active = category === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 border ${
                    active
                      ? "bg-purple-600 text-white border-purple-600 shadow-md shadow-purple-200"
                      : "bg-white text-gray-600 border-gray-200 hover:bg-purple-50 hover:text-purple-600 hover:border-purple-300"
                  }`}
                >
                  <span>{icon}</span>
                  <span>{label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-purple-700 via-purple-600 to-pink-500 border border-gray-100 max-w-6xl mx-auto px-4 py-8">
        {/* Filter Bar */}
        <div className="bg-gradient-to-r from-purple-700 via-purple-600 to-pink-500 rounded-2xl shadow-sm border border-gray-100 p-4 mb-8">
          <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center">
            {/* Search */}
            <div className="relative flex-1">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
              <input
                type="text"
                placeholder="Tìm kiếm tranh..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent"
              />
            </div>

            {/* Mobile filter toggle */}
            <button
              onClick={() => setShowFilters((v) => !v)}
              className="md:hidden flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600 hover:border-purple-300"
            >
              <FaFilter className="text-xs" />
              Bộ lọc
            </button>

            {/* Difficulty filter - always visible on desktop */}
            <div
              className={`flex gap-2 flex-wrap ${showFilters ? "flex" : "hidden md:flex"}`}
            >
              {Object.entries(DIFFICULTY_LABELS).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setDifficulty(key)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                    difficulty === key
                      ? "bg-purple-600 text-white shadow-md shadow-purple-200"
                      : "bg-gray-50 text-gray-600 hover:bg-purple-50 hover:text-purple-600 border border-gray-200"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Sort */}
            <div
              className={`relative ${showFilters ? "flex" : "hidden md:flex"} items-center`}
            >
              <FaSortAmountDown className="absolute left-3 text-gray-400 text-xs" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="pl-8 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300 bg-white text-gray-600 cursor-pointer"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : displayedProducts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-24"
          >
            <div className="text-6xl mb-4">🖼️</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Không tìm thấy sản phẩm
            </h3>
            <p className="text-gray-400 text-sm mb-6">
              Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
            </p>
            <button
              onClick={() => {
                setSearch("");
                setDifficulty("all");
                setSortBy("default");
              }}
              className="px-6 py-2.5 bg-purple-600 text-white rounded-full text-sm font-medium hover:bg-purple-700 transition-colors"
            >
              Xóa bộ lọc
            </button>
          </motion.div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={`${difficulty}-${sortBy}-${page}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5"
            >
              {displayedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onViewDetail={setSelectedProduct}
                />
              ))}
            </motion.div>
          </AnimatePresence>
        )}

        <AnimatePresence>
          {selectedProduct && (
            <ProductQuickView
              key={selectedProduct.id}
              product={selectedProduct}
              onClose={() => setSelectedProduct(null)}
            />
          )}
        </AnimatePresence>

        {/* Pagination */}
        {!loading && totalPages > 1 && !search.trim() && (
          <div className="from-blue-500 to-indigo-500 flex items-center justify-center gap-2 mt-12">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:border-purple-400 hover:text-purple-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <FaChevronLeft className="text-sm" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(
                (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 2,
              )
              .reduce<(number | "...")[]>((acc, p, idx, arr) => {
                if (idx > 0 && p - (arr[idx - 1] as number) > 1)
                  acc.push("...");
                acc.push(p);
                return acc;
              }, [])
              .map((item, idx) =>
                item === "..." ? (
                  <span key={`ellipsis-${idx}`} className="px-1 text-gray-400">
                    …
                  </span>
                ) : (
                  <button
                    key={item}
                    onClick={() => setPage(item as number)}
                    className={`w-10 h-10 rounded-full text-sm font-medium transition-all ${
                      page === item
                        ? "bg-purple-600 text-white shadow-md shadow-purple-200"
                        : "border border-gray-200 text-gray-600 hover:border-purple-400 hover:text-purple-600"
                    }`}
                  >
                    {item}
                  </button>
                ),
              )}

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:border-purple-400 hover:text-purple-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <FaChevronRight className="text-sm" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
