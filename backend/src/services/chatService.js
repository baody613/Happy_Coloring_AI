import { db } from "../config/firebase.js";

// Intent detection - phân loại ý định của người dùng
const detectIntent = (message) => {
  const msg = message.toLowerCase();

  // Chào hỏi
  if (/(xin chào|chào|hello|hi|hey)/i.test(msg)) {
    return "greeting";
  }

  // Tìm sản phẩm theo giá
  if (/(giá|price|bao nhiêu|rẻ|đắt|tiền)/i.test(msg)) {
    return "price_inquiry";
  }

  // Tìm theo danh mục
  if (/(loại|thể loại|category|danh mục|chủ đề)/i.test(msg)) {
    return "category_inquiry";
  }

  // Hỏi về AI/tính năng
  if (/(ai|tạo|generate|custom|vẽ)/i.test(msg)) {
    return "ai_feature";
  }

  // Hỏi về vận chuyển
  if (/(ship|giao hàng|vận chuyển|delivery)/i.test(msg)) {
    return "shipping";
  }

  // Hỏi về thanh toán
  if (/(thanh toán|payment|pay|momo|visa)/i.test(msg)) {
    return "payment";
  }

  // Tìm sản phẩm cụ thể (có từ khóa)
  if (/(tìm|search|có|muốn|recommend|gợi ý)/i.test(msg)) {
    return "product_search";
  }

  return "general";
};

// Extract keywords từ message
const extractKeywords = (message) => {
  const keywords = [];
  const msg = message.toLowerCase();

  // Danh mục phổ biến
  const categories = [
    "động vật",
    "phong cảnh",
    "hoa",
    "người",
    "trẻ em",
    "anime",
    "mandala",
    "animal",
    "landscape",
    "flower",
    "portrait",
  ];

  categories.forEach((cat) => {
    if (msg.includes(cat)) {
      keywords.push(cat);
    }
  });

  // Extract giá
  const priceMatch = msg.match(/(\d+)\s*(k|nghìn|ngàn)/i);
  if (priceMatch) {
    keywords.push(`price:${parseInt(priceMatch[1]) * 1000}`);
  }

  return keywords;
};

// Generate response dựa trên intent
const generateResponse = async (intent, message, keywords) => {
  switch (intent) {
    case "greeting":
      return {
        text:
          "Xin chào! 👋 Tôi là trợ lý của Yu Ling Store. Tôi có thể giúp bạn:\n\n" +
          "🎨 Tìm tranh tô màu theo chủ đề\n" +
          "💰 Tư vấn sản phẩm theo giá\n" +
          "✨ Giải thích về dịch vụ tạo tranh AI\n" +
          "🚚 Thông tin vận chuyển & thanh toán\n\n" +
          "Bạn cần tôi giúp gì?",
        suggestions: [
          "Tìm tranh giá rẻ",
          "Tạo tranh AI là gì?",
          "Có tranh động vật không?",
        ],
      };

    case "price_inquiry":
      const products = await searchProducts({ sortBy: "price" });
      const priceRanges = getPriceRanges(products);

      return {
        text:
          `💰 **Bảng giá tranh tô màu:**\n\n` +
          `${priceRanges}\n\n` +
          `Bạn muốn xem tranh ở mức giá nào?`,
        suggestions: ["Dưới 50k", "Từ 50k - 100k", "Trên 100k"],
        products: products.slice(0, 3),
      };

    case "category_inquiry":
      const categories = await getCategories();
      return {
        text:
          `📂 **Các danh mục tranh hiện có:**\n\n` +
          categories.map((cat) => `• ${cat.name}`).join("\n") +
          `\n\nBạn thích chủ đề nào?`,
        suggestions: categories.slice(0, 3).map((c) => c.name),
      };

    case "ai_feature":
      return {
        text:
          "✨ **Tạo Tranh AI - Độc Đáo Riêng Của Bạn**\n\n" +
          '🎯 Bạn chỉ cần mô tả ý tưởng (VD: "con mèo ngồi dưới trăng")\n' +
          "🤖 AI sẽ tạo tranh tô màu theo yêu cầu của bạn\n" +
          "🎨 Tranh được chia thành các vùng số để tô màu\n" +
          "📦 Giao file PDF + hướng dẫn tô\n\n" +
          "Giá: 50.000đ - 150.000đ tùy độ phức tạp\n" +
          "Thời gian: 1-2 ngày\n\n" +
          "Bạn muốn thử tạo tranh AI không?",
        suggestions: [
          "Tạo tranh AI ngay",
          "Xem mẫu tranh AI",
          "Giá tạo tranh AI",
        ],
      };

    case "shipping":
      return {
        text:
          "🚚 **Thông tin vận chuyển:**\n\n" +
          "📍 Giao hàng toàn quốc qua:\n" +
          "  • Giao Hàng Nhanh (2-3 ngày)\n" +
          "  • J&T Express (3-5 ngày)\n\n" +
          "💰 Phí ship: 15.000đ - 30.000đ\n" +
          "🎁 Miễn phí ship đơn từ 200.000đ\n\n" +
          "📦 Sản phẩm được đóng gói cẩn thận, kèm hướng dẫn tô màu!",
        suggestions: ["Xem sản phẩm", "Chính sách đổi trả"],
      };

    case "payment":
      return {
        text:
          "💳 **Phương thức thanh toán:**\n\n" +
          "✅ Chuyển khoản ngân hàng\n" +
          "✅ Ví điện tử (MoMo, ZaloPay)\n" +
          "✅ Thẻ Visa/Mastercard\n" +
          "✅ COD (Thanh toán khi nhận hàng)\n\n" +
          "🔒 Thanh toán an toàn, bảo mật 100%",
        suggestions: ["Xem sản phẩm", "Hướng dẫn đặt hàng"],
      };

    case "product_search":
      const searchResults = await searchProducts({ keywords });
      if (searchResults.length === 0) {
        return {
          text:
            "😅 Xin lỗi, tôi không tìm thấy sản phẩm phù hợp.\n\n" +
            "Bạn có thể:\n" +
            "• Thử từ khóa khác\n" +
            "• Xem tất cả sản phẩm\n" +
            "• Tạo tranh AI theo ý bạn",
          suggestions: ["Xem tất cả sản phẩm", "Tạo tranh AI"],
        };
      }

      return {
        text:
          `🎨 Tôi tìm được ${searchResults.length} sản phẩm phù hợp với "${message}":\n\n` +
          `Dưới đây là những sản phẩm tốt nhất:`,
        products: searchResults.slice(0, 5),
        suggestions: ["Xem thêm", "Lọc theo giá"],
      };

    default:
      return {
        text:
          "🤔 Tôi chưa hiểu rõ câu hỏi của bạn.\n\n" +
          "Bạn có thể hỏi tôi về:\n" +
          "• Tìm tranh tô màu\n" +
          "• Giá cả sản phẩm\n" +
          "• Tạo tranh AI\n" +
          "• Vận chuyển & thanh toán",
        suggestions: ["Tìm tranh", "Tạo tranh AI", "Bảng giá"],
      };
  }
};

// Search products helper
const searchProducts = async (filters = {}) => {
  try {
    let query = db.collection("products");

    // Apply filters
    if (filters.category) {
      query = query.where("category", "==", filters.category);
    }

    if (filters.sortBy === "price") {
      query = query.orderBy("price", "asc");
    } else {
      query = query.orderBy("createdAt", "desc");
    }

    query = query.limit(10);

    const snapshot = await query.get();
    const products = [];

    snapshot.forEach((doc) => {
      const data = doc.data();
      products.push({
        id: doc.id,
        title: data.title || data.name || "Sản phẩm",
        price: data.price || 0,
        imageUrl: data.imageUrl || "",
        category: data.category || "",
        description: data.description || "",
      });
    });

    // Filter by keywords if provided
    if (filters.keywords && filters.keywords.length > 0) {
      return products.filter((p) => {
        const searchText =
          `${p.title} ${p.description} ${p.category}`.toLowerCase();
        return filters.keywords.some((kw) =>
          searchText.includes(kw.toLowerCase())
        );
      });
    }

    return products;
  } catch (error) {
    console.error("Search products error:", error);
    return [];
  }
};

// Get categories helper
const getCategories = async () => {
  try {
    const snapshot = await db.collection("categories").limit(10).get();
    const categories = [];

    snapshot.forEach((doc) => {
      categories.push({ id: doc.id, ...doc.data() });
    });

    return categories;
  } catch (error) {
    console.error("Get categories error:", error);
    return [];
  }
};

// Get price ranges
const getPriceRanges = (products) => {
  if (products.length === 0) return "Chưa có sản phẩm";

  const prices = products.map((p) => p.price).filter((p) => p);
  const min = Math.min(...prices);
  const max = Math.max(...prices);

  return (
    `• Giá thấp nhất: ${formatPrice(min)}\n` +
    `• Giá cao nhất: ${formatPrice(max)}\n` +
    `• Giá phổ biến: 50.000đ - 100.000đ`
  );
};

// Format price
const formatPrice = (price) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
};

// Main chat handler
export const handleChatMessage = async (message) => {
  try {
    const intent = detectIntent(message);
    const keywords = extractKeywords(message);

    const response = await generateResponse(intent, message, keywords);

    return {
      success: true,
      response,
    };
  } catch (error) {
    console.error("Chat service error:", error);
    return {
      success: false,
      response: {
        text: "😅 Xin lỗi, tôi gặp lỗi. Vui lòng thử lại sau.",
        suggestions: ["Thử lại", "Xem sản phẩm"],
      },
    };
  }
};
