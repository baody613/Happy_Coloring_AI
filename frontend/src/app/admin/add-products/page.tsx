"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { useAuthStore } from "@/store/authStore";
import { isAdmin } from "@/lib/adminConfig";
import { adminAPI } from "@/lib/adminAPI";
import { uploadProductImage, validateImageFile } from "@/lib/uploadHelpers";

interface Product {
  id: string;
  title: string;
  category?: string;
  price: number;
  imageUrl: string;
  difficulty: string;
  description?: string;
}

const EMPTY_FORM = {
  title: "",
  description: "",
  category: "paint-by-numbers",
  price: 0,
  imageUrl: "",
  thumbnailUrl: "",
  difficulty: "medium" as "easy" | "medium" | "hard",
  colors: 24,
  discountPercent: 0,
};

const CATEGORY_OPTIONS = [
  { value: "paint-by-numbers", label: "🖌️ Tô Màu" },
  { value: "animals", label: "🐾 Động Vật" },
  { value: "landscape", label: "🌄 Phong Cảnh" },
  { value: "flowers", label: "🌸 Hoa Lá" },
  { value: "architecture", label: "🏛️ Kiến Trúc" },
  { value: "abstract", label: "🎨 Trừu Tượng" },
  { value: "portrait", label: "🖼️ Chân Dung" },
  { value: "fantasy", label: "🌌 Huyền Bí" },
  { value: "ocean", label: "🌊 Đại Dương" },
  { value: "city", label: "🏙️ Thành Phố" },
];

export default function AddProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading: authLoading } = useAuthStore();

  const editProductId = searchParams.get("id");
  const isEditing = !!editProductId;

  const [loading, setLoading] = useState(true);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [priceDisplay, setPriceDisplay] = useState("");
  const [formData, setFormData] = useState({ ...EMPTY_FORM });

  const salePrice = useMemo(() => {
    if (!formData.discountPercent || formData.discountPercent <= 0) return null;
    return Math.round(formData.price * (1 - formData.discountPercent / 100));
  }, [formData.price, formData.discountPercent]);

  const badgeImg =
    'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23f3f4f6" width="200" height="200"/%3E%3Ctext fill="%239ca3af" x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle"%3ENo image%3C/text%3E%3C/svg%3E';

  const pageTitle = useMemo(
    () => (isEditing ? "Chỉnh Sửa Sản Phẩm" : "Thêm Sản Phẩm Mới"),
    [isEditing],
  );

  useEffect(() => {
    const initPage = async () => {
      if (authLoading) return;

      if (!user) {
        router.push("/login");
        return;
      }

      if (!isAdmin(user.email)) {
        router.push("/");
        return;
      }

      if (editProductId) {
        try {
          const data = await adminAPI.products.getAll({ limit: 200 });
          const list = data?.data?.products || data?.products || [];
          const product = list.find(
            (item: Product) => item.id === editProductId,
          );

          if (!product) {
            toast.error("Không tìm thấy sản phẩm để chỉnh sửa!");
            router.push("/admin/products");
            return;
          }

          const basePrice = (product as any).originalPrice || product.price;
          const existingDiscount =
            (product as any).discountPercent ||
            (product.originalPrice && product.originalPrice > product.price
              ? Math.round(
                  ((product.originalPrice - product.price) /
                    product.originalPrice) *
                    100,
                )
              : 0);
          setPriceDisplay(
            Math.floor(basePrice / 1000).toLocaleString("vi-VN"),
          );
          setFormData({
            title: product.title,
            description: product.description || "",
            category: product.category || "paint-by-numbers",
            price: basePrice,
            imageUrl: product.imageUrl,
            thumbnailUrl: product.imageUrl,
            difficulty: (product.difficulty || "medium") as
              | "easy"
              | "medium"
              | "hard",
            colors: 24,
            discountPercent: existingDiscount,
          });
        } catch {
          toast.error("Không thể tải dữ liệu sản phẩm!");
          router.push("/admin/products");
          return;
        }
      }

      setLoading(false);
    };

    initPage();
  }, [authLoading, user, router, editProductId]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateImageFile(file);
    if (!validation.valid) {
      toast.error(validation.error || "File không hợp lệ!");
      return;
    }

    try {
      setUploadingImage(true);
      setUploadProgress(0);
      const imageUrl = await uploadProductImage(
        file,
        editProductId || undefined,
        (p) => setUploadProgress(Math.round(p)),
      );
      setFormData((prev) => ({ ...prev, imageUrl, thumbnailUrl: imageUrl }));
      toast.success("Ảnh đã được tải lên thành công!");
    } catch (error) {
      toast.error("Có lỗi khi tải ảnh lên! " + (error as Error).message);
    } finally {
      setUploadingImage(false);
      setUploadProgress(0);
    }
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numbers = e.target.value.replace(/\D/g, "");
    setFormData((prev) => ({
      ...prev,
      price: numbers ? parseInt(numbers, 10) * 1000 : 0,
    }));
    setPriceDisplay(
      numbers ? parseInt(numbers, 10).toLocaleString("vi-VN") : "",
    );
  };

  const closeForm = () => {
    router.push("/admin/products");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error("Vui lòng nhập tên sản phẩm!");
      return;
    }

    if (formData.price <= 0) {
      toast.error("Vui lòng nhập giá hợp lệ!");
      return;
    }

    if (!formData.imageUrl) {
      toast.error("Vui lòng tải lên hoặc nhập URL hình ảnh!");
      return;
    }

    const toastId = toast.loading(
      isEditing ? "Đang cập nhật sản phẩm..." : "Đang thêm sản phẩm...",
    );

    const discountPercent = formData.discountPercent || 0;
    const basePrice = formData.price;
    const finalPrice =
      discountPercent > 0
        ? Math.round(basePrice * (1 - discountPercent / 100))
        : basePrice;
    const finalOriginalPrice: number | undefined =
      discountPercent > 0 ? basePrice : undefined;

    const submitData = {
      title: formData.title,
      description: formData.description,
      category: formData.category,
      imageUrl: formData.imageUrl,
      thumbnailUrl: formData.thumbnailUrl,
      difficulty: formData.difficulty,
      colors: formData.colors,
      discountPercent,
      price: finalPrice,
      originalPrice: finalOriginalPrice,
    };

    try {
      if (isEditing && editProductId) {
        await adminAPI.products.update(editProductId, submitData);
      } else {
        await adminAPI.products.create(submitData);
      }

      toast.success(
        isEditing
          ? "Cập nhật sản phẩm thành công!"
          : "Thêm sản phẩm thành công!",
        { id: toastId },
      );
      router.push("/admin/products");
    } catch (error) {
      toast.error(
        "Có lỗi xảy ra: " +
          ((error as any)?.response?.data?.message || (error as Error).message),
        { id: toastId },
      );
    }
  };

  if (loading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl text-purple-600">Đang tải...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50 py-8">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="mb-8">
          <Link
            href="/admin/products"
            className="text-purple-600 hover:text-purple-700 hover:underline mb-3 inline-flex items-center gap-2 font-medium transition-colors"
          >
            <span>← Quay lại Gallery Sản Phẩm</span>
          </Link>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            {pageTitle}
          </h1>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-gray-800">
            <span className="text-3xl">{isEditing ? "✏️" : "➕"}</span>
            {pageTitle}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700">
                  Tên Sản Phẩm *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, title: e.target.value }))
                  }
                  placeholder="Nhập tên sản phẩm..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 placeholder-gray-400"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700">
                  Giá Gốc *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={priceDisplay}
                    onChange={handlePriceChange}
                    placeholder="0"
                    className="w-full px-4 py-3 pr-20 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 placeholder-gray-400"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">
                    .000 VND
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Ví dụ: Nhập &quot;150&quot; = 150.000 VND
                </p>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700">
                  🏷️ Giảm Giá (%)
                </label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={formData.discountPercent || ""}
                  onChange={(e) => {
                    const val = Math.min(
                      100,
                      Math.max(0, parseInt(e.target.value, 10) || 0),
                    );
                    setFormData((p) => ({ ...p, discountPercent: val }));
                  }}
                  placeholder="0 = không giảm"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 placeholder-gray-400"
                />
                {salePrice !== null && salePrice > 0 ? (
                  <p className="text-sm mt-2 text-green-700 font-semibold">
                    🎉 Giá bán:{" "}
                    <span className="text-red-600">
                      {salePrice.toLocaleString("vi-VN")} VND
                    </span>{" "}
                    <span className="text-gray-400 line-through text-xs">
                      {formData.price.toLocaleString("vi-VN")} VND
                    </span>
                  </p>
                ) : (
                  <p className="text-xs text-gray-500 mt-1">
                    Nhập 1–100 để áp dụng khuyến mãi
                  </p>
                )}
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold mb-2 text-gray-700">
                  Hinh Anh *{" "}
                  <span className="text-xs text-gray-500 ml-1">
                    (JPG, PNG, WebP - Max 5MB)
                  </span>
                </label>
                <div className="space-y-3">
                  <label className="inline-block cursor-pointer">
                    <div className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-400 to-orange-400 hover:shadow-lg text-white rounded-lg font-semibold transition-all hover:scale-105">
                      📁{" "}
                      {uploadingImage
                        ? `Đang tải... ${uploadProgress}%`
                        : "Tải Hình Ảnh Lên Storage"}
                    </div>
                    <input
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp"
                      onChange={handleImageUpload}
                      disabled={uploadingImage}
                      className="hidden"
                    />
                  </label>
                  {uploadingImage && (
                    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-pink-400 to-orange-400 h-full transition-all"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  )}

                  {formData.imageUrl && (
                    <div className="p-4 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50">
                      <p className="text-sm font-semibold text-gray-700 mb-2">
                        ✨ Xem trước:
                      </p>
                      <img
                        src={formData.imageUrl}
                        alt="Preview"
                        className="w-40 h-40 object-cover rounded-lg shadow-md border border-gray-200"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = badgeImg;
                        }}
                      />
                      <p className="text-xs text-gray-500 mt-2">
                        {formData.imageUrl.includes("firebasestorage")
                          ? "🔥 Firebase Storage"
                          : "🌐 URL bên ngoài"}
                      </p>
                    </div>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700">
                  Danh Mục
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {CATEGORY_OPTIONS.map((cat) => (
                    <button
                      key={cat.value}
                      type="button"
                      onClick={() =>
                        setFormData((p) => ({ ...p, category: cat.value }))
                      }
                      className={`px-3 py-2 rounded-lg border text-sm font-medium text-left transition-colors ${
                        formData.category === cat.value
                          ? "bg-purple-600 text-white border-purple-600"
                          : "bg-white text-gray-700 border-gray-300 hover:border-purple-300"
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700">
                  Độ Khó
                </label>
                <select
                  value={formData.difficulty}
                  onChange={(e) =>
                    setFormData((p) => ({
                      ...p,
                      difficulty: e.target.value as "easy" | "medium" | "hard",
                    }))
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-gray-900 bg-white"
                >
                  <option value="easy">🟢 Dễ</option>
                  <option value="medium">🟡 Trung Bình</option>
                  <option value="hard">🔴 Khó</option>
                </select>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700 mt-4">
                    Số Màu
                  </label>
                  <select
                    value={formData.colors}
                    onChange={(e) =>
                      setFormData((p) => ({
                        ...p,
                        colors: parseInt(e.target.value),
                      }))
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-gray-900 bg-white"
                  >
                    <option value={10}>10 ~ 20 màu</option>

                    <option value={20}>20 ~ 36 màu</option>
                    <option value={24}>36 + màu</option>
                  </select>
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold mb-2 text-gray-700">
                  Mô Tả
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((p) => ({
                      ...p,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Mô tả chi tiết..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-gray-900 placeholder-gray-400 resize-none"
                  rows={3}
                />
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:shadow-xl text-white px-8 py-3 rounded-xl font-semibold transition-all hover:scale-105"
              >
                {isEditing ? "💾 Cập Nhật" : "➕ Thêm Mới"}
              </button>
              <button
                type="button"
                onClick={closeForm}
                className="bg-gray-500 hover:bg-gray-600 text-white px-8 py-3 rounded-xl font-semibold transition-all"
              >
                Hủy
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
