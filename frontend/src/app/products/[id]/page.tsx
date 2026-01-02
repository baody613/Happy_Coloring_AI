"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaShoppingCart,
  FaHeart,
  FaStar,
  FaCheckCircle,
  FaTruck,
  FaShieldAlt,
  FaChevronLeft,
  FaChevronRight,
  FaExpand,
  FaMinus,
  FaPlus,
  FaShare,
  FaPalette,
  FaRuler,
} from "react-icons/fa";
import { Product } from "@/types";
import { useCartStore } from "@/store/cartStore";
import { useFavoriteStore } from "@/store/favoriteStore";
import { useAuthStore } from "@/store/authStore";
import api from "@/lib/api";
import toast from "react-hot-toast";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isImageZoomed, setIsImageZoomed] = useState(false);

  const { addItem } = useCartStore();
  const { addFavorite, removeFavorite, isFavorite } = useFavoriteStore();
  const { user } = useAuthStore();

  // Mock product images
  const productImages = product
    ? [
        product.imageUrl,
        product.thumbnailUrl || product.imageUrl,
        // Add more demo images
        `https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=800`,
        `https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800`,
      ]
    : [];

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/products/${productId}`);
      const productData = response.data.data;
      setProduct(productData);

      // Fetch related products (same category)
      if (productData.category) {
        fetchRelatedProducts(productData.category, productId);
      }
    } catch (error) {
      console.error("Error fetching product:", error);
      toast.error("Không tìm thấy sản phẩm!");
      // Use mock data if API fails
      setProduct(getMockProduct(productId));
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedProducts = async (category: string, excludeId: string) => {
    try {
      const response = await api.get(`/products?category=${category}&limit=4`);
      const products = response.data.data?.products || [];
      setRelatedProducts(products.filter((p: Product) => p.id !== excludeId));
    } catch (error) {
      console.error("Error fetching related products:", error);
      setRelatedProducts(getMockRelatedProducts());
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    addItem(product, quantity);
    toast.success(`Đã thêm ${quantity} sản phẩm vào giỏ hàng!`);
  };

  const handleBuyNow = () => {
    if (!user) {
      toast.error("Vui lòng đăng nhập để mua hàng!");
      router.push("/login");
      return;
    }
    if (!product) return;
    addItem(product, quantity);
    router.push("/checkout");
  };

  const handleToggleFavorite = () => {
    if (!product) return;
    if (isFavorite(product.id)) {
      removeFavorite(product.id);
      toast.success("Đã xóa khỏi yêu thích!");
    } else {
      addFavorite(product);
      toast.success("Đã thêm vào yêu thích!");
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product?.title,
          text: product?.description,
          url: window.location.href,
        });
      } catch (error) {
        console.log("Share cancelled");
      }
    } else {
      // Copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast.success("Đã copy link sản phẩm!");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải sản phẩm...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Không tìm thấy sản phẩm
          </h1>
          <Link
            href="/gallery"
            className="text-purple-600 hover:text-purple-700 underline"
          >
            Quay lại Gallery
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-purple-600">
              Trang chủ
            </Link>
            <span>/</span>
            <Link href="/gallery" className="hover:text-purple-600">
              Gallery
            </Link>
            <span>/</span>
            <span className="text-gray-800 font-medium">{product.title}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Left: Image Gallery */}
          <div>
            {/* Main Image */}
            <motion.div
              className="relative bg-white rounded-2xl shadow-xl overflow-hidden mb-4 group"
              whileHover={{ scale: 1.02 }}
            >
              <div className="relative aspect-square">
                <Image
                  src={productImages[selectedImage]}
                  alt={product.title}
                  fill
                  className="object-cover cursor-zoom-in"
                  onClick={() => setIsImageZoomed(true)}
                  priority
                />
                {/* Zoom icon */}
                <button
                  onClick={() => setIsImageZoomed(true)}
                  className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <FaExpand className="text-gray-700" />
                </button>
              </div>

              {/* Image navigation */}
              {productImages.length > 1 && (
                <>
                  <button
                    onClick={() =>
                      setSelectedImage((prev) =>
                        prev === 0 ? productImages.length - 1 : prev - 1
                      )
                    }
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-white transition"
                  >
                    <FaChevronLeft className="text-gray-700" />
                  </button>
                  <button
                    onClick={() =>
                      setSelectedImage((prev) =>
                        prev === productImages.length - 1 ? 0 : prev + 1
                      )
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-white transition"
                  >
                    <FaChevronRight className="text-gray-700" />
                  </button>
                </>
              )}
            </motion.div>

            {/* Thumbnail Gallery */}
            <div className="grid grid-cols-4 gap-3">
              {productImages.map((img, idx) => (
                <motion.button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`relative aspect-square rounded-lg overflow-hidden border-2 transition ${
                    selectedImage === idx
                      ? "border-purple-600 ring-2 ring-purple-300"
                      : "border-gray-200 hover:border-purple-400"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Image
                    src={img}
                    alt={`View ${idx + 1}`}
                    fill
                    className="object-cover"
                  />
                </motion.button>
              ))}
            </div>
          </div>

          {/* Right: Product Info */}
          <div>
            <div className="bg-white rounded-2xl shadow-xl p-8">
              {/* Title & Rating */}
              <h1 className="text-3xl font-bold text-gray-800 mb-3">
                {product.title}
              </h1>

              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      className={
                        i < Math.floor(product.rating || 4.5)
                          ? "text-yellow-400"
                          : "text-gray-300"
                      }
                    />
                  ))}
                  <span className="text-gray-600 ml-2">
                    {product.rating || 4.5} ({product.reviews?.length || 0} đánh
                    giá)
                  </span>
                </div>
                <span className="text-gray-400">|</span>
                <span className="text-gray-600">
                  {product.sales || 0} đã bán
                </span>
              </div>

              {/* Price */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 mb-6">
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl font-bold text-purple-600">
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(product.price)}
                  </span>
                  {product.originalPrice &&
                    product.originalPrice > product.price && (
                      <span className="text-xl text-gray-400 line-through">
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(product.originalPrice)}
                      </span>
                    )}
                </div>
              </div>

              {/* Product Details */}
              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3">
                  <FaRuler className="text-purple-600 text-xl" />
                  <span className="text-gray-600">
                    <strong>Kích thước:</strong>{" "}
                    {product.dimensions || "40x50cm"}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <FaPalette className="text-purple-600 text-xl" />
                  <span className="text-gray-600">
                    <strong>Số màu:</strong> {product.colors || 24} màu
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <FaCheckCircle className="text-purple-600 text-xl" />
                  <span className="text-gray-600">
                    <strong>Độ khó:</strong>{" "}
                    <span
                      className={`font-medium ${
                        product.difficulty === "easy"
                          ? "text-green-600"
                          : product.difficulty === "medium"
                          ? "text-yellow-600"
                          : "text-red-600"
                      }`}
                    >
                      {product.difficulty === "easy"
                        ? "Dễ"
                        : product.difficulty === "medium"
                        ? "Trung bình"
                        : "Khó"}
                    </span>
                  </span>
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="font-bold text-gray-800 mb-2">
                  Mô tả sản phẩm:
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {product.description ||
                    "Bộ tranh tô màu số hóa chất lượng cao, bao gồm canvas, bảng màu và hướng dẫn chi tiết. Phù hợp cho mọi lứa tuổi, giúp thư giãn và phát triển tính kiên nhẫn."}
                </p>
              </div>

              {/* Quantity Selector */}
              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-3">
                  Số lượng:
                </label>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border-2 border-gray-300 rounded-lg">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="px-4 py-2 hover:bg-gray-100 transition"
                    >
                      <FaMinus className="text-gray-600" />
                    </button>
                    <span className="px-6 py-2 font-bold text-lg border-x-2">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                      className="px-4 py-2 hover:bg-gray-100 transition"
                    >
                      <FaPlus className="text-gray-600" />
                    </button>
                  </div>
                  <span className="text-gray-500 text-sm">
                    (Tối đa 10 sản phẩm)
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <button
                  onClick={handleAddToCart}
                  className="flex items-center justify-center gap-2 bg-white border-2 border-purple-600 text-purple-600 px-6 py-4 rounded-xl font-bold hover:bg-purple-50 transition"
                >
                  <FaShoppingCart />
                  Thêm vào giỏ
                </button>
                <button
                  onClick={handleBuyNow}
                  className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-4 rounded-xl font-bold hover:shadow-xl transition"
                >
                  Mua ngay
                </button>
              </div>

              {/* Secondary Actions */}
              <div className="flex gap-3">
                <button
                  onClick={handleToggleFavorite}
                  className={`flex-1 flex items-center justify-center gap-2 border-2 px-4 py-3 rounded-lg font-medium transition ${
                    isFavorite(product.id)
                      ? "border-red-500 text-red-500 bg-red-50"
                      : "border-gray-300 text-gray-600 hover:border-red-500 hover:text-red-500"
                  }`}
                >
                  <FaHeart
                    className={isFavorite(product.id) ? "fill-current" : ""}
                  />
                  {isFavorite(product.id) ? "Đã yêu thích" : "Yêu thích"}
                </button>
                <button
                  onClick={handleShare}
                  className="flex-1 flex items-center justify-center gap-2 border-2 border-gray-300 text-gray-600 px-4 py-3 rounded-lg font-medium hover:border-purple-500 hover:text-purple-600 transition"
                >
                  <FaShare />
                  Chia sẻ
                </button>
              </div>

              {/* Guarantees */}
              <div className="mt-6 pt-6 border-t border-gray-200 space-y-3">
                <div className="flex items-center gap-3 text-gray-600">
                  <FaTruck className="text-green-600 text-xl" />
                  <span>Miễn phí vận chuyển đơn từ 200.000đ</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <FaShieldAlt className="text-blue-600 text-xl" />
                  <span>Đổi trả trong 7 ngày nếu có lỗi</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <FaCheckCircle className="text-purple-600 text-xl" />
                  <span>Chất lượng đảm bảo, hàng chính hãng</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section Placeholder */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Đánh giá sản phẩm
          </h2>
          <div className="text-center py-12 text-gray-500">
            <p className="text-lg mb-2">Chưa có đánh giá nào</p>
            <p className="text-sm">
              Hãy là người đầu tiên đánh giá sản phẩm này!
            </p>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Sản phẩm tương tự
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <Link
                  key={relatedProduct.id}
                  href={`/products/${relatedProduct.id}`}
                  className="group"
                >
                  <motion.div
                    whileHover={{ y: -8 }}
                    className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition"
                  >
                    <div className="relative aspect-square">
                      <Image
                        src={relatedProduct.imageUrl}
                        alt={relatedProduct.title}
                        fill
                        className="object-cover group-hover:scale-110 transition duration-300"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-purple-600 transition">
                        {relatedProduct.title}
                      </h3>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-purple-600">
                          {new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          }).format(relatedProduct.price)}
                        </span>
                        <div className="flex items-center gap-1 text-sm">
                          <FaStar className="text-yellow-400" />
                          <span>{relatedProduct.rating || 4.5}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Image Zoom Modal */}
      <AnimatePresence>
        {isImageZoomed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsImageZoomed(false)}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 cursor-zoom-out"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="relative max-w-5xl max-h-[90vh] w-full h-full"
            >
              <Image
                src={productImages[selectedImage]}
                alt={product.title}
                fill
                className="object-contain"
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsImageZoomed(false);
                }}
                className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full hover:bg-white/30 transition"
              >
                Đóng
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Mock data helpers
function getMockProduct(id: string): Product {
  return {
    id,
    title: "Tranh Tô Màu Phong Cảnh Núi Non",
    description:
      "Bộ tranh tô màu số hóa với chất lượng cao, bao gồm canvas in sẵn số, bộ màu acrylic đầy đủ, và cọ vẽ chuyên dụng. Phù hợp cho mọi lứa tuổi.",
    category: "landscape",
    price: 299000,
    originalPrice: 399000,
    imageUrl:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200",
    difficulty: "medium",
    dimensions: "40x50cm",
    colors: 24,
    status: "active",
    sales: 150,
    rating: 4.8,
    reviews: [],
    createdAt: new Date().toISOString(),
  };
}

function getMockRelatedProducts(): Product[] {
  return [
    {
      id: "p2",
      title: "Tranh Hoa Anh Đào",
      description: "Tranh hoa anh đào lãng mạn",
      category: "flowers",
      price: 199000,
      imageUrl:
        "https://images.unsplash.com/photo-1522383225653-ed111181a951?w=500",
      thumbnailUrl:
        "https://images.unsplash.com/photo-1522383225653-ed111181a951?w=200",
      difficulty: "easy",
      dimensions: "30x40cm",
      colors: 18,
      status: "active",
      sales: 200,
      rating: 4.9,
      reviews: [],
      createdAt: new Date().toISOString(),
    },
    {
      id: "p3",
      title: "Tranh Động Vật Dễ Thương",
      description: "Tranh động vật đáng yêu",
      category: "animals",
      price: 249000,
      imageUrl:
        "https://images.unsplash.com/photo-1425082661705-1834bfd09dca?w=500",
      thumbnailUrl:
        "https://images.unsplash.com/photo-1425082661705-1834bfd09dca?w=200",
      difficulty: "easy",
      dimensions: "35x45cm",
      colors: 20,
      status: "active",
      sales: 180,
      rating: 4.7,
      reviews: [],
      createdAt: new Date().toISOString(),
    },
  ];
}
