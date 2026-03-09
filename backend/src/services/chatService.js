import { db } from "../config/firebase.js";

// ─── Intent detection ─────────────────────────────────────────────────────────
const detectIntent = (message) => {
  const msg = message.toLowerCase();

  if (/(xin chào|chào|hello|hi\b|hey|alo)/i.test(msg)) return "greeting";

  if (/(đổi trả|hoàn tiền|bảo hành|khiếu nại|return|refund)/i.test(msg))
    return "return_policy";

  if (/(khuyến mãi|giảm giá|sale|voucher|coupon|ưu đãi|mã giảm)/i.test(msg))
    return "promotion";

  if (/(hướng dẫn|cách tô|tô như thế nào|tutorial|bắt đầu)/i.test(msg))
    return "tutorial";

  if (
    /(giá|price|bao nhiêu|rẻ|đắt|tiền|bảng giá|50k|100k|200k|dưới|trên|từ.*k|\d+k)/i.test(
      msg,
    )
  )
    return "price_inquiry";

  if (/(loại|thể loại|category|danh mục|chủ đề|có những gì|bán gì)/i.test(msg))
    return "category_inquiry";

  if (/(ai\b|tạo tranh|generate|tự tạo|custom|thiết kế riêng)/i.test(msg))
    return "ai_feature";

  if (/(ship|giao hàng|vận chuyển|delivery|bao lâu|thời gian giao)/i.test(msg))
    return "shipping";

  if (/(thanh toán|payment|pay|momo|visa|chuyển khoản|cod)/i.test(msg))
    return "payment";

  if (/(về|giới thiệu|store|shop|thương hiệu|yu ling|yuling)/i.test(msg))
    return "about";

  if (
    /(tìm|search|có.*tranh|muốn|recommend|gợi ý|động vật|phong cảnh|hoa|anime|mandala|người|trẻ em|mèo|chó|hươu|sư tử|hổ|báo)/i.test(
      msg,
    )
  )
    return "product_search";

  return "general";
};

// ─── Extract keywords ─────────────────────────────────────────────────────────
const extractKeywords = (message) => {
  const keywords = [];
  const msg = message.toLowerCase();

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
    "mèo",
    "chó",
    "hươu",
    "sư tử",
    "hổ",
    "báo",
    "thỏ",
    "gấu",
    "biển",
    "núi",
    "rừng",
    "thác",
    "làng quê",
  ];

  categories.forEach((cat) => {
    if (msg.includes(cat)) keywords.push(cat);
  });

  // Extract số tiền
  const priceMatch = msg.match(/(\d+)\s*(k|nghìn|ngàn)/i);
  if (priceMatch) keywords.push(`price:${parseInt(priceMatch[1]) * 1000}`);

  // Extract từ khoá tự do (danh từ >= 3 ký tự, không phải stopword)
  const stopWords = new Set([
    "tôi",
    "bạn",
    "có",
    "không",
    "và",
    "hoặc",
    "với",
    "cho",
    "của",
    "này",
    "kia",
    "mình",
    "muốn",
    "tìm",
  ]);
  const words = msg
    .split(/\s+/)
    .filter((w) => w.length >= 3 && !stopWords.has(w));
  words.forEach((w) => {
    if (!keywords.includes(w)) keywords.push(w);
  });

  return keywords;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const formatPrice = (price) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
    price,
  );

const getPriceRanges = (products) => {
  if (!products.length) return "Chưa có sản phẩm trong kho.";
  const prices = products.map((p) => p.price).filter(Boolean);
  if (!prices.length) return "Chưa có thông tin giá.";
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const under50 = products.filter((p) => p.price < 50000).length;
  const mid = products.filter(
    (p) => p.price >= 50000 && p.price <= 100000,
  ).length;
  const over100 = products.filter((p) => p.price > 100000).length;
  return (
    `• Dưới 50k: **${under50} sản phẩm**\n` +
    `• Từ 50k - 100k: **${mid} sản phẩm**\n` +
    `• Trên 100k: **${over100} sản phẩm**\n` +
    `• Giá thấp nhất: **${formatPrice(min)}**\n` +
    `• Giá cao nhất: **${formatPrice(max)}**`
  );
};

// ─── Search products ──────────────────────────────────────────────────────────
const searchProducts = async (filters = {}) => {
  try {
    let query = db.collection("products").limit(100);
    if (filters.category)
      query = query.where("category", "==", filters.category);

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
        difficulty: data.difficulty || "",
      });
    });

    if (filters.sortBy === "price") products.sort((a, b) => a.price - b.price);

    if (filters.keywords && filters.keywords.length > 0) {
      const scored = products.map((p) => {
        const searchText =
          `${p.title} ${p.description} ${p.category}`.toLowerCase();
        const score = filters.keywords.filter(
          (kw) =>
            !kw.startsWith("price:") && searchText.includes(kw.toLowerCase()),
        ).length;
        return { ...p, _score: score };
      });
      return scored
        .filter((p) => p._score > 0)
        .sort((a, b) => b._score - a._score);
    }

    return products;
  } catch (error) {
    console.error("Search products error:", error);
    return [];
  }
};

// ─── Get categories (fallback từ products nếu collection rỗng) ────────────────
const getCategories = async () => {
  try {
    const snapshot = await db.collection("categories").limit(20).get();
    if (!snapshot.empty) {
      const cats = [];
      snapshot.forEach((doc) => cats.push({ id: doc.id, ...doc.data() }));
      return cats;
    }
    // Fallback: derive from products
    const productsSnap = await db.collection("products").limit(100).get();
    const catSet = new Set();
    productsSnap.forEach((doc) => {
      const cat = doc.data().category;
      if (cat) catSet.add(cat);
    });
    return Array.from(catSet).map((name) => ({ name }));
  } catch (error) {
    console.error("Get categories error:", error);
    return [];
  }
};

// ─── Generate response ────────────────────────────────────────────────────────
const generateResponse = async (intent, message, keywords) => {
  const msg = message.toLowerCase();

  switch (intent) {
    case "greeting":
      return {
        text:
          "Xin chào! 👋 Tôi là **Yu Ling Assistant** - trợ lý mua sắm của Yu Ling Store.\n\n" +
          "Tôi có thể giúp bạn:\n" +
          "🎨 Tìm tranh tô màu theo chủ đề & giá\n" +
          "💰 Tư vấn sản phẩm phù hợp túi tiền\n" +
          "✨ Giải thích tính năng tạo tranh AI\n" +
          "🚚 Thông tin vận chuyển & thanh toán\n\n" +
          "Bạn cần tôi giúp gì nào?",
        suggestions: ["Tìm tranh giá rẻ", "Bảng giá", "Tạo tranh AI là gì?"],
      };

    case "price_inquiry": {
      const allProducts = await searchProducts({ sortBy: "price" });
      let filteredProducts = allProducts;
      let rangeLabel = "";

      if (/(dưới|under|<)\s*50/.test(msg) || /50[._]?000/.test(msg)) {
        filteredProducts = allProducts.filter((p) => p.price < 50000);
        rangeLabel = "dưới 50.000đ";
      } else if (/(50k?\s*[-–]\s*100k?|từ\s*50|50.*đến.*100)/i.test(msg)) {
        filteredProducts = allProducts.filter(
          (p) => p.price >= 50000 && p.price <= 100000,
        );
        rangeLabel = "từ 50k - 100k";
      } else if (/(trên|over|>)\s*100/.test(msg)) {
        filteredProducts = allProducts.filter((p) => p.price > 100000);
        rangeLabel = "trên 100.000đ";
      }

      if (rangeLabel) {
        if (filteredProducts.length === 0) {
          return {
            text: `😅 Hiện chưa có sản phẩm **${rangeLabel}**. Bạn thử khoảng giá khác nhé!`,
            suggestions: ["Dưới 50k", "Từ 50k - 100k", "Trên 100k"],
          };
        }
        return {
          text: `🎨 Có **${filteredProducts.length} sản phẩm ${rangeLabel}**, đây là một số gợi ý:`,
          suggestions: ["Dưới 50k", "Từ 50k - 100k", "Trên 100k"],
          products: filteredProducts.slice(0, 5),
        };
      }

      return {
        text: `💰 **Bảng giá tranh tô màu Yu Ling Store:**\n\n${getPriceRanges(allProducts)}\n\nBạn muốn xem mức giá nào?`,
        suggestions: ["Dưới 50k", "Từ 50k - 100k", "Trên 100k"],
        products: allProducts.slice(0, 3),
      };
    }

    case "category_inquiry": {
      const cats = await getCategories();
      if (!cats.length) {
        return {
          text: "😅 Hiện chưa có thông tin danh mục. Bạn thử xem tất cả sản phẩm nhé!",
          suggestions: ["Xem tất cả sản phẩm", "Tạo tranh AI"],
        };
      }
      return {
        text:
          `📂 **Các danh mục tranh hiện có (${cats.length} loại):**\n\n` +
          cats.map((c) => `• ${c.name || c.id}`).join("\n") +
          `\n\nBạn thích chủ đề nào?`,
        suggestions: cats.slice(0, 3).map((c) => `Tìm tranh ${c.name || c.id}`),
      };
    }

    case "ai_feature":
      return {
        text:
          "✨ **Tạo Tranh AI - Độc Đáo Riêng Của Bạn**\n\n" +
          "🎯 Chỉ cần mô tả ý tưởng bằng tiếng Việt\n" +
          '   VD: _"con mèo đội mũ phù thủy ngồi uống cà phê"_\n\n' +
          "🤖 AI (FLUX.1) sẽ tạo ảnh theo mô tả của bạn\n" +
          "🎨 Tranh phong cách paint-by-numbers, đường viền rõ ràng\n" +
          "⚡ Thời gian tạo: chỉ ~5-10 giây\n\n" +
          "👉 Truy cập **Tạo Tranh** trên menu để thử ngay!",
        suggestions: ["Tạo tranh AI ngay", "Bảng giá", "Xem tranh mẫu"],
      };

    case "shipping":
      return {
        text:
          "🚚 **Thông tin vận chuyển:**\n\n" +
          "📍 Giao hàng toàn quốc qua:\n" +
          "  • Giao Hàng Nhanh: 2-3 ngày\n" +
          "  • J&T Express: 3-5 ngày\n\n" +
          "💰 Phí ship: 15.000đ - 30.000đ\n" +
          "🎁 **Miễn phí ship** đơn từ 200.000đ\n\n" +
          "📦 Đóng gói cẩn thận, kèm hướng dẫn tô màu!",
        suggestions: ["Bảng giá", "Thanh toán thế nào?", "Chính sách đổi trả"],
      };

    case "payment":
      return {
        text:
          "💳 **Phương thức thanh toán:**\n\n" +
          "✅ Chuyển khoản ngân hàng\n" +
          "✅ Ví điện tử (MoMo, ZaloPay)\n" +
          "✅ Thẻ Visa/Mastercard\n" +
          "✅ COD - thanh toán khi nhận hàng\n\n" +
          "🔒 Thanh toán qua Stripe, bảo mật 100%",
        suggestions: ["Xem sản phẩm", "Phí vận chuyển?"],
      };

    case "return_policy":
      return {
        text:
          "🔄 **Chính sách đổi trả:**\n\n" +
          "✅ Đổi trả trong vòng **7 ngày** kể từ ngày nhận hàng\n" +
          "✅ Sản phẩm còn nguyên vẹn, chưa mở hộp\n" +
          "✅ Hoàn tiền 100% nếu sản phẩm bị lỗi do nhà sản xuất\n\n" +
          "📞 Liên hệ hỗ trợ qua email hoặc chat để được xử lý nhanh!",
        suggestions: ["Liên hệ hỗ trợ", "Xem sản phẩm"],
      };

    case "promotion":
      return {
        text:
          "🎉 **Mã giảm giá hiện có:**\n\n" +
          "🏷️ `YULING10` — Giảm **10%** toàn bộ đơn hàng\n" +
          "🏷️ `YULING20` — Giảm **20%** cho đơn từ 200k\n" +
          "🏷️ `GIAMGIA15` — Giảm **15%** cho khách mới\n\n" +
          "💡 Nhập mã ở trang Giỏ Hàng khi thanh toán!",
        suggestions: ["Xem sản phẩm", "Bảng giá"],
      };

    case "tutorial":
      return {
        text:
          "🖌️ **Hướng dẫn tô màu tranh số hóa:**\n\n" +
          "1️⃣ Mở hộp, trải canvas lên bàn phẳng\n" +
          "2️⃣ Tìm số trên canvas tương ứng với số trên lọ màu\n" +
          "3️⃣ Tô từ vùng nhỏ → lớn, từ trên xuống dưới\n" +
          "4️⃣ Chờ màu khô trước khi tô vùng kế bên\n" +
          "5️⃣ Tô 2-3 lớp để màu đều và đẹp\n\n" +
          "🎨 Mẹo: Bắt đầu từ màu sáng nhất, tô cuối màu tối!",
        suggestions: ["Xem sản phẩm", "Tạo tranh AI"],
      };

    case "about":
      return {
        text:
          "🏪 **Về Yu Ling Store:**\n\n" +
          "🎨 Chuyên cung cấp tranh tô màu số hóa chất lượng cao\n" +
          "🤖 Tích hợp AI để tạo tranh theo ý muốn của bạn\n" +
          "🌟 Hơn 1000+ mẫu tranh đa dạng chủ đề\n" +
          "🚚 Giao hàng toàn quốc, đóng gói cẩn thận\n\n" +
          "💌 Sứ mệnh: Mang niềm vui tô màu đến mọi nhà!",
        suggestions: ["Xem sản phẩm", "Tạo tranh AI", "Bảng giá"],
      };

    case "product_search": {
      const results = await searchProducts({ keywords });
      if (!results.length) {
        return {
          text:
            `😅 Không tìm thấy sản phẩm phù hợp với "_${message}_".\n\n` +
            "Bạn có thể:\n" +
            "• Thử từ khóa khác (VD: hoa, động vật, phong cảnh)\n" +
            "• Hoặc tạo tranh AI theo ý bạn!",
          suggestions: ["Xem tất cả sản phẩm", "Tạo tranh AI", "Bảng giá"],
        };
      }
      return {
        text: `🎨 Tìm được **${results.length} sản phẩm** phù hợp:`,
        products: results.slice(0, 5),
        suggestions: ["Xem thêm", "Lọc theo giá", "Tìm chủ đề khác"],
      };
    }

    default:
      return {
        text:
          "🤔 Tôi chưa hiểu rõ câu hỏi của bạn.\n\n" +
          "Bạn có thể hỏi tôi về:\n" +
          "• 🎨 Tìm tranh tô màu\n" +
          "• 💰 Giá cả & khuyến mãi\n" +
          "• ✨ Tạo tranh AI\n" +
          "• 🚚 Vận chuyển & thanh toán\n" +
          "• 🔄 Chính sách đổi trả",
        suggestions: ["Tìm tranh", "Bảng giá", "Tạo tranh AI"],
      };
  }
};

// ─── Main chat handler ────────────────────────────────────────────────────────
export const handleChatMessage = async (message) => {
  try {
    const intent = detectIntent(message);
    const keywords = extractKeywords(message);
    const response = await generateResponse(intent, message, keywords);
    return { success: true, response };
  } catch (error) {
    console.error("Chat service error:", error);
    return {
      success: false,
      response: {
        text: "😅 Xin lỗi, tôi gặp lỗi kỹ thuật. Vui lòng thử lại sau!",
        suggestions: ["Thử lại", "Xem sản phẩm"],
      },
    };
  }
};
