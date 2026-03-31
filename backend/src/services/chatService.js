import axios from "axios";
import { db } from "../config/firebase.js";

const GEMINI_API_KEY = process.env.GOOGLE_AI_API_KEY;

// Lấy sản phẩm active từ Firestore đưa vào context cho AI
const getProductsSummary = async () => {
  try {
    const snap = await db
      .collection("products")
      .where("status", "==", "active")
      .limit(30)
      .get();
    const lines = [];
    snap.forEach((doc) => {
      const d = doc.data();
      lines.push(
        `- ${d.title} | ${d.category} | ${(d.price || 0).toLocaleString("vi-VN")}đ | Độ khó: ${d.difficulty}`,
      );
    });
    return lines.length ? lines.join("\n") : "(Chưa có sản phẩm)";
  } catch {
    return "(Không thể tải sản phẩm)";
  }
};

const buildSystemPrompt = (productsList) =>
  `
Bạn là trợ lý AI của Yu Ling Store - cửa hàng tranh tô màu số hóa (paint-by-numbers).
Trả lời tiếng Việt, thân thiện, ngắn gọn, dùng emoji phù hợp.

THÔNG TIN Cửa HÀNG:
- Giá: 50.000đ - 350.000đ
- Thanh toán: COD, MoMo, VNPay, chuyển khoản
- Giao hàng: toàn quốc, miễn phí từ 200.000đ, 2-5 ngày
- Đổi trả: 7 ngày nếu lỗi sản phẩm
- Voucher: YULING10 (10%), YULING20 (20%), GIAMGIA15 (15%)
- Tạo tranh AI: trang generate trên website

SẢN PHẨM HIỆN CÓ:
${productsList}

QUY TẮC: Không bịa thông tin. Nếu không biết thì nói thật.
`.trim();

export const handleChatMessage = async (message, history = []) => {
  try {
    const productsList = await getProductsSummary();

    // Gemini nhận vào mảng contents[] với role "user" | "model"
    const contents = [
      // Cặp đầu: đưa system prompt vào như 1 cặp hội thoại
      { role: "user", parts: [{ text: buildSystemPrompt(productsList) }] },
      {
        role: "model",
        parts: [
          {
            text: "Xin chào! 👋 Tôi là trợ lý Yu Ling Store. Bạn cần tôi giúp gì?",
          },
        ],
      },
      // Lịch sử hội thoại trước (để AI nhớ ngữ cảnh)
      ...history.map((h) => ({
        role: h.sender === "user" ? "user" : "model",
        parts: [{ text: h.text }],
      })),
      // Tin nhắn mới nhất
      { role: "user", parts: [{ text: message }] },
    ];

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

    const { data } = await axios.post(
      url,
      {
        contents,
        generationConfig: { temperature: 0.7, maxOutputTokens: 512 },
      },
      { timeout: 15000 },
    );

    const text =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "😅 Xin lỗi, không thể trả lời lúc này.";

    return { success: true, response: { text } };
  } catch (error) {
    console.error("Chat error:", error.response?.data || error.message);
    return {
      success: false,
      response: { text: "😅 Lỗi kết nối. Thử lại sau!" },
    };
  }
};
