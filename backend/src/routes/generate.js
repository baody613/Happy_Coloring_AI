// ============================================================
// ROUTE: /api/generate
// Chức năng: Tạo tranh tô màu theo số bằng Google AI Studio
// Luồng: Frontend gửi prompt → Backend tạo record Firestore
//        → Gọi AI sinh ảnh (async) → Upload Storage
//        → Frontend polling mỗi 5s để lấy kết quả
// ============================================================

import express from "express";
import axios from "axios";
import { db } from "../config/firebase.js";
import { authenticateUser } from "../middleware/auth.js";
import { uploadToStorage } from "../utils/storageHelpers.js";

const router = express.Router();

// Lấy API key Google AI Studio từ biến môi trường (.env)
const GOOGLE_API_KEY = process.env.GOOGLE_AI_API_KEY;

// Danh sách model AI được dùng để tạo ảnh (thử lần lượt nếu lỗi)
const GOOGLE_IMAGE_MODELS = ["models/gemini-2.5-flash-image"];

// ============================================================
// PROMPT TEMPLATE – Hướng dẫn chi tiết gửi tới AI
// {{USER_PROMPT}}, {{STYLE}}, {{COMPLEXITY}} sẽ được thay thế
// bằng dữ liệu thật khi gọi buildLineArtPrompt()
// ============================================================
const LINE_ART_PROMPT_TEMPLATE = `You are a professional paint-by-numbers illustrator.
Create exactly one printable paint-by-numbers sheet.

User idea:
"{{USER_PROMPT}}"

Style: {{STYLE}}
Complexity: {{COMPLEXITY}}

Reference layout target:
- Main artwork is centered inside a clean rectangular frame.
- A horizontal color palette strip must be placed BELOW the artwork.

Hard requirements:
- Black-and-white line-art for the main painting area (no grayscale shading in the drawing).
- Clean, crisp outlines with closed regions suitable for painting.
- Large, readable numbers inside paint regions.
- Every closed region must have a number, and repeated color regions must reuse the same number.
- Show a numbered palette under the drawing using COLOR SWATCHES (colored blocks/circles), not color names.
- Palette format: each swatch shows only its number and visual color.
- Do NOT print color names anywhere.
- Palette numbers must match exactly the numbers used in paint regions.
- Keep the subject faithful to the user idea and visually similar in composition to the reference style.
- No watermark, no logo, no signature, no decorative border effects.
- Do not create a 18+ adult content, violent, or disturbing image. Keep it family-friendly.

Output quality target:
- High clarity, print-ready, easy for users to follow number-to-color mapping while painting.`;

/**
 * Thay thế các placeholder trong template bằng giá trị thực tế
 * @param {string} userPrompt - Mô tả của người dùng
 * @param {string} style      - Phong cách: "realistic", "cartoon", v.v.
 * @param {string} complexity - Độ phức tạp: "easy" | "medium" | "hard"
 */
function buildLineArtPrompt(userPrompt, style, complexity) {
  return LINE_ART_PROMPT_TEMPLATE.replace("{{USER_PROMPT}}", userPrompt)
    .replace("{{STYLE}}", style)
    .replace("{{COMPLEXITY}}", complexity);
}

// ============================================================
// ROUTE 1: POST /api/generate/paint-by-numbers
// Nhận yêu cầu từ frontend, tạo record Firestore,
// rồi kích hoạt quá trình tạo tranh AI chạy ngầm (async).
// Trả về 202 ngay lập tức kèm generationId để frontend polling.
// ============================================================
router.post("/paint-by-numbers", authenticateUser, async (req, res) => {
  try {
    // Lấy dữ liệu từ body request; style mặc định "realistic", complexity mặc định "medium"
    const { prompt, style = "realistic", complexity = "medium" } = req.body;
    const userId = req.user.uid; // UID người dùng từ Firebase Auth token

    // Validate: prompt bắt buộc phải có
    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    // Validate: prompt không quá 500 ký tự
    if (prompt.length > 500) {
      return res
        .status(400)
        .json({ error: "Prompt must be 500 characters or fewer" });
    }

    // Tạo document mới trong collection "generations" (Firestore tự sinh ID)
    const generationRef = db.collection("generations").doc();
    const generationId = generationRef.id;

    // Lưu thông tin ban đầu vào Firestore với status = "processing"
    await generationRef.set({
      id: generationId,
      userId, // để xác thực chủ sở hữu khi polling
      prompt,
      style,
      complexity,
      status: "processing", // trạng thái: đang xử lý
      imageUrl: "", // chưa có ảnh
      createdAt: new Date().toISOString(),
    });

    // Kích hoạt hàm tạo tranh AI chạy ngầm (KHÔNG await → không block response)
    generatePaintByNumbers(generationId, prompt, style, complexity);

    // Trả về 202 Accepted ngay lập tức kèm generationId
    // Frontend dùng generationId này để polling kiểm tra tiến trình
    res.status(202).json({
      message: "Generation started",
      generationId,
      status: "processing",
    });
  } catch (error) {
    console.error("Generation error:", error);
    res.status(500).json({ error: error.message });
  }
});

// ============================================================
// ROUTE 2: GET /api/generate/status/:generationId
// Frontend gọi route này mỗi 5 giây để kiểm tra trạng thái.
// Khi status = "completed" → trả về imageUrl để hiển thị ảnh.
// Khi status = "failed"    → trả về thông tin lỗi.
// ============================================================
router.get("/status/:generationId", authenticateUser, async (req, res) => {
  try {
    const { generationId } = req.params;

    // Lấy document từ Firestore theo generationId
    const generationDoc = await db
      .collection("generations")
      .doc(generationId)
      .get();

    // Nếu không tìm thấy document → báo lỗi 404
    if (!generationDoc.exists) {
      return res.status(404).json({ error: "Generation not found" });
    }

    const data = generationDoc.data();

    // Bảo mật: chỉ chủ sở hữu mới được xem kết quả của mình
    if (data.userId !== req.user.uid) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    // Trả về toàn bộ dữ liệu (status, imageUrl, error, v.v.)
    res.json(data);
  } catch (error) {
    console.error("Status check error:", error);
    res.status(500).json({ error: error.message });
  }
});

// ============================================================
// HÀM HELPER: generatePaintByNumbers
// Chạy ngầm (không await từ route), thực hiện 3 bước:
//   1. Xây dựng prompt → gọi Google AI → nhận ảnh Base64
//   2. Upload ảnh lên Firebase Storage → lấy URL công khai
//   3. Cập nhật Firestore: status = "completed" + imageUrl
// Nếu lỗi: cập nhật Firestore: status = "failed" + error
// ============================================================
async function generatePaintByNumbers(generationId, prompt, style, complexity) {
  try {
    // Bước 1: Xây dựng prompt hoàn chỉnh từ template
    const lineArtPrompt = buildLineArtPrompt(prompt.trim(), style, complexity);

    console.log("Generating with Google AI Studio image model...");

    // Bước 2: Gọi Google AI Studio → nhận dữ liệu ảnh dạng Buffer nhị phân
    const imageBuffer = await generateWithGoogleImage(lineArtPrompt);

    // Bước 3: Upload Buffer lên Firebase Storage, lấy URL truy cập công khai
    const fileName = `generation-${generationId}-lineart.png`;
    const imageUrl = await uploadToStorage(
      imageBuffer,
      fileName,
      "generations", // thư mục lưu trong Storage
    );

    // Bước 4: Cập nhật Firestore → báo hoàn thành + lưu URL ảnh
    await db.collection("generations").doc(generationId).update({
      status: "completed",
      imageUrl, // URL ảnh trên Firebase Storage
      completedAt: new Date().toISOString(),
    });

    console.log(`✅ Generation ${generationId} completed`);
  } catch (error) {
    console.error("Generation processing error:", error);

    // Nếu có lỗi bất kỳ → cập nhật Firestore thành "failed"
    await db.collection("generations").doc(generationId).update({
      status: "failed",
      error: error.message,
      failedAt: new Date().toISOString(),
    });
  }
}

// ============================================================
// HÀM HELPER: generateWithGoogleImage
// Gọi trực tiếp Google Generative Language API để tạo ảnh.
// - Gửi prompt dạng text
// - Yêu cầu responseModalities: ["TEXT", "IMAGE"] → AI trả về ảnh
// - Ảnh trả về dạng base64 (inlineData) → chuyển sang Buffer
// - Thử lần lượt từng model trong GOOGLE_IMAGE_MODELS
// ============================================================
async function generateWithGoogleImage(prompt) {
  // Kiểm tra API key có tồn tại không
  if (!GOOGLE_API_KEY) {
    throw new Error("GOOGLE_AI_API_KEY is missing in backend environment");
  }

  let lastError;

  // Thử từng model trong danh sách (hiện tại chỉ có 1 model)
  for (const modelName of GOOGLE_IMAGE_MODELS) {
    try {
      // URL endpoint của Google Generative Language API
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/${modelName}:generateContent?key=${GOOGLE_API_KEY}`;

      // Payload gửi lên API: chứa prompt text + yêu cầu trả về ảnh
      const payload = {
        contents: [
          {
            parts: [
              {
                text: prompt, // prompt đầy đủ từ LINE_ART_PROMPT_TEMPLATE
              },
            ],
          },
        ],
        generationConfig: {
          responseModalities: ["TEXT", "IMAGE"], // bắt buộc để AI sinh ảnh
        },
      };

      // Gửi POST request, timeout 2 phút (AI cần thời gian xử lý)
      const response = await axios.post(endpoint, payload, {
        headers: { "Content-Type": "application/json" },
        timeout: 120000, // 120 giây = 2 phút
      });

      // Lấy danh sách các phần trong response của AI
      const parts = response.data?.candidates?.[0]?.content?.parts || [];

      // Tìm phần chứa dữ liệu ảnh (inlineData.data là chuỗi base64)
      const imagePart = parts.find((part) => part.inlineData?.data);

      // Nếu không có ảnh trong response → ném lỗi
      if (!imagePart?.inlineData?.data) {
        throw new Error(`No image data returned by ${modelName}`);
      }

      // Chuyển chuỗi base64 thành Buffer nhị phân PNG để upload Storage
      return Buffer.from(imagePart.inlineData.data, "base64");
    } catch (error) {
      // Ghi nhận lỗi và thử model tiếp theo (nếu có)
      lastError = error;
      console.error(`Google model ${modelName} failed:`, error.message);
    }
  }

  // Tất cả model đều thất bại → ném lỗi cuối cùng lên trên
  throw new Error(
    lastError?.response?.data?.error?.message ||
      lastError?.message ||
      "Google image generation failed",
  );
}

export default router;
