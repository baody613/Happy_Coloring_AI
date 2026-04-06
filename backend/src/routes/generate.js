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

// Danh sách model Hugging Face (fallback khi Google thất bại)
const HF_IMAGE_MODELS = [
  "black-forest-labs/FLUX.1-schnell",
  "stabilityai/stable-diffusion-xl-base-1.0",
];

// ============================================================
// PROMPT TEMPLATE – Hướng dẫn chi tiết gửi tới AI
// {{USER_PROMPT}}, {{STYLE}}, {{COMPLEXITY}} sẽ được thay thế
// bằng dữ liệu thật khi gọi buildLineArtPrompt()
// ============================================================
// Số màu theo từng độ phức tạp (khớp với button UI)
const COMPLEXITY_CONFIG = {
  easy: {
    label: "Easy",
    colors: "12 to 20",
    detail: "simple bold shapes, very large paint regions, minimal detail",
  },
  medium: {
    label: "Medium",
    colors: "20 to 36",
    detail: "moderate detail, medium-sized paint regions, balanced composition",
  },
  hard: {
    label: "Hard",
    colors: "36 to 50",
    detail:
      "highly detailed, many small intricate regions, complex composition",
  },
};

// ============================================================
// PROMPT TEMPLATE – Hướng dẫn chi tiết gửi tới AI
// {{USER_PROMPT}}, {{STYLE}}, {{COLOR_COUNT}}, {{DETAIL}} sẽ được thay thế
// bằng dữ liệu thật khi gọi buildLineArtPrompt()
// ============================================================
const LINE_ART_PROMPT_TEMPLATE = `You are a professional paint-by-numbers illustrator. Your ONLY task is to draw EXACTLY the subject described below as a printable paint-by-numbers worksheet. Never substitute or ignore the subject.

=== SUBJECT TO DRAW (mandatory, do not change) ===
"{{USER_PROMPT}}"

=== PARAMETERS ===
- Art style: {{STYLE}}
- Number of distinct colors to use: {{COLOR_COUNT}} colors
- Detail level: {{DETAIL}}

=== MANDATORY LAYOUT (pixel-perfect) ===
- Top 75% of canvas: the main line-art drawing inside a thin rectangular border.
- Bottom 25% of canvas: a horizontal row of colored number swatches (the palette).
- A thin horizontal divider line separates the drawing from the palette.

=== STEP-BY-STEP DRAWING RULES ===
Step 1 – Draw the subject "{{USER_PROMPT}}" using only BLACK outlines on a WHITE background.
Step 2 – Divide the drawing into CLOSED regions. Every region must be fully enclosed by outlines.
Step 3 – Assign a color number (1, 2, 3 … up to {{COLOR_COUNT}}) to each region. Regions that will be the same color share the same number.
Step 4 – Print each region's number as a LARGE BOLD digit centered INSIDE that region. Every single region MUST have a visible number inside it. Do NOT leave any region without a number.
Step 5 – In the palette strip below, draw one colored swatch per number: a filled colored circle or square next to its number digit. Show all {{COLOR_COUNT}} colors.

=== STRICT PROHIBITIONS ===
- NO grayscale shading or gradients in the drawing area.
- NO color fills inside regions (keep regions white with only the number inside).
- Do not color in the picture. All regions must remain white/uncolored inside the drawing area.
- NO color names written anywhere.
- NO watermarks, logos, or signatures.
- NO adult, violent, or disturbing content.

=== QUALITY TARGET ===
High resolution (1024×1024), print-ready, clean and crisp so users can easily paint by following the numbers.`;

function buildLineArtPrompt(userPrompt, style, complexity) {
  const cfg = COMPLEXITY_CONFIG[complexity] || COMPLEXITY_CONFIG.medium;
  return LINE_ART_PROMPT_TEMPLATE.replace(/{{USER_PROMPT}}/g, userPrompt)
    .replace("{{STYLE}}", style)
    .replace(/{{COLOR_COUNT}}/g, cfg.colors)
    .replace("{{DETAIL}}", cfg.detail);
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

    let imageBuffer;

    // Bước 2: Thử Google AI trước, nếu thất bại dùng Hugging Face
    try {
      console.log("Generating with Google AI Studio image model...");
      imageBuffer = await generateWithGoogleImage(lineArtPrompt);
    } catch (googleError) {
      console.warn(
        "Google AI failed, falling back to Hugging Face:",
        googleError.message,
      );
      imageBuffer = await generateWithHuggingFace(
        prompt.trim(),
        style,
        complexity,
      );
    }

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

// ============================================================
// HÀM HELPER: translatePromptToEnglish
// Dùng MyMemory API (miễn phí, không cần key) để dịch prompt
// tiếng Việt (hoặc bất kỳ ngôn ngữ nào) sang tiếng Anh trước
// khi gửi cho Hugging Face (chỉ hiểu tiếng Anh).
// ============================================================
async function translatePromptToEnglish(prompt) {
  try {
    const encoded = encodeURIComponent(prompt);
    const res = await axios.get(
      `https://api.mymemory.translated.net/get?q=${encoded}&langpair=vi|en`,
      { timeout: 10000 },
    );
    const translated = res.data?.responseData?.translatedText?.trim();
    if (translated && translated !== prompt) {
      console.log(`Translated prompt: "${prompt}" → "${translated}"`);
      return translated;
    }
  } catch (err) {
    console.warn("Translation failed, using original prompt:", err.message);
  }
  return prompt;
}

// ============================================================
// HÀM HELPER: generateWithHuggingFace
// Fallback khi Google AI thất bại (ví dụ: quota 429).
// Gọi Hugging Face Inference API với model sinh ảnh miễn phí.
// Trả về Buffer nhị phân ảnh PNG.
// ============================================================
async function generateWithHuggingFace(userPrompt, style, complexity) {
  const HF_TOKEN = process.env.HF_TOKEN || process.env.HUGGINGFACE_API_KEY;
  if (!HF_TOKEN) {
    throw new Error("HF_TOKEN is missing in backend environment");
  }

  // Dịch prompt sang tiếng Anh (FLUX.1-schnell chỉ hiểu tiếng Anh)
  const englishPrompt = await translatePromptToEnglish(userPrompt);

  // FLUX là diffusion model: chỉ hiểu keyword ngắn, không đọc instruction.
  // Kỹ thuật đúng: subject đặt ĐẦU với weight cao, rồi mới đến style keywords.
  // negative_prompt không được FLUX.1-schnell hỗ trợ nên không dùng.
  const cfg = COMPLEXITY_CONFIG[complexity] || COMPLEXITY_CONFIG.medium;
  const styleKeyword = style !== "realistic" ? `${style} art style, ` : "";

  const hfPrompt = [
    // Subject đặt đầu tiên = trọng số cao nhất với diffusion model
    englishPrompt,
    styleKeyword,
    // Paint-by-numbers visual keywords (diffusion model hiểu theo hình ảnh)
    "paint by numbers coloring book page",
    "black ink line art on white paper",
    "thick bold black outlines",
    "every region has a bold number printed inside",
    "numbered regions 1 2 3 4 5 6 7 8",
    "numbered color palette swatches at bottom of page",
    "clean white background",
    "no color fill in regions",
    "printable worksheet",
    // Số màu theo complexity
    `${cfg.colors} distinct color regions`,
    cfg.detail,
  ]
    .filter(Boolean)
    .join(", ");

  console.log(`HF prompt: ${hfPrompt}`);

  let lastError;
  for (const model of HF_IMAGE_MODELS) {
    try {
      console.log(`Trying Hugging Face model: ${model}`);
      const response = await axios.post(
        `https://router.huggingface.co/hf-inference/models/${model}`,
        {
          inputs: hfPrompt,
          parameters: {
            num_inference_steps: 8,
            guidance_scale: 9.0,
            width: 1024,
            height: 1024,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${HF_TOKEN}`,
            "Content-Type": "application/json",
            Accept: "image/png",
          },
          responseType: "arraybuffer",
          timeout: 120000,
        },
      );
      console.log(`✅ Hugging Face model ${model} succeeded`);
      return Buffer.from(response.data);
    } catch (error) {
      lastError = error;
      const msg = error.response?.data
        ? Buffer.from(error.response.data).toString()
        : error.message;
      console.error(`HF model ${model} failed:`, msg);
    }
  }

  throw new Error(
    `All Hugging Face models failed. Last error: ${
      lastError?.message || "unknown"
    }`,
  );
}

export default router;
