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
// COMPLEXITY CONFIG – Số màu theo từng độ phức tạp
// max: số màu tối đa (dùng để sinh danh sách số tuần tự)
// ============================================================
const COMPLEXITY_CONFIG = {
  easy: {
    label: "Easy",
    max: 16,
    detail: "simple bold shapes, very large paint regions, minimal detail",
  },
  medium: {
    label: "Medium",
    max: 28,
    detail: "moderate detail, medium-sized paint regions, balanced composition",
  },
  hard: {
    label: "Hard",
    max: 44,
    detail:
      "highly detailed, many small intricate regions, complex composition",
  },
};

// Sinh danh sách số tuần tự: "1, 2, 3, 4, ... N"
function seqNumbers(max) {
  return Array.from({ length: max }, (_, i) => i + 1).join(", ");
}

// ============================================================
// PROMPT TEMPLATE – Hướng dẫn chi tiết gửi tới AI
// {{USER_PROMPT}}, {{STYLE}}, {{COLOR_MAX}}, {{SEQ_NUMBERS}}, {{DETAIL}}
// sẽ được thay thế bằng dữ liệu thật khi gọi buildLineArtPrompt()
// ============================================================
const LINE_ART_PROMPT_TEMPLATE = `You are a professional paint-by-numbers illustrator. Your ONLY task is to draw EXACTLY the subject described below as a printable paint-by-numbers worksheet. Never substitute or ignore the subject.

=== SUBJECT TO DRAW (mandatory, do not change) ===
"{{USER_PROMPT}}"

=== PARAMETERS ===
- Art style: {{STYLE}}
- Exact number of colors: {{COLOR_MAX}} colors
- Allowed color numbers: {{SEQ_NUMBERS}} — use ONLY these numbers, nothing else
- Detail level: {{DETAIL}}

=== MANDATORY LAYOUT (pixel-perfect) ===
- Top 75% of canvas: the main line-art drawing inside a thin rectangular border.
- Bottom 25% of canvas: a horizontal row of colored number swatches (the palette).
- A thin horizontal divider line separates the drawing from the palette.

=== STEP-BY-STEP DRAWING RULES ===
Step 1 – Draw the subject "{{USER_PROMPT}}" using only BLACK outlines on a WHITE background. No grayscale shading.
Step 2 – Divide the drawing into CLOSED regions. Every region must be fully enclosed by outlines.
Step 3 – Assign colors using ONLY the sequential numbers: {{SEQ_NUMBERS}}. Start from 1. Each number represents one unique color. Regions sharing the same color use the same number.
Step 4 – Print each region's assigned number as a LARGE BOLD digit centered INSIDE that region. EVERY region must have exactly one number. No region may be left blank.
Step 5 – In the palette strip at the bottom, show exactly {{COLOR_MAX}} swatches in ORDER: swatch 1, swatch 2, swatch 3 … swatch {{COLOR_MAX}}. Each swatch is a filled colored square or circle with its number beside it. Numbers in the palette must be sequential: 1, 2, 3, 4 … {{COLOR_MAX}}.

=== STRICT PROHIBITIONS ===
- Do NOT use any number larger than {{COLOR_MAX}} in the drawing or palette.
- Do NOT skip any number between 1 and {{COLOR_MAX}}.
- NO grayscale shading or gradients in the drawing area.
- NO color fills inside regions — regions stay WHITE. Only the number digit is printed inside.
- Do not color in the picture. All regions must remain white/uncolored inside the drawing area.
- NO color names written anywhere.
- NO watermarks, logos, copyright text, or signatures.
- NO adult, violent, or disturbing content.

=== QUALITY TARGET ===
High resolution (1024x1024), print-ready, clean and crisp so users can easily paint by following the numbers.`;

function buildLineArtPrompt(userPrompt, style, complexity) {
  const cfg = COMPLEXITY_CONFIG[complexity] || COMPLEXITY_CONFIG.medium;
  return LINE_ART_PROMPT_TEMPLATE.replace(/{{USER_PROMPT}}/g, userPrompt)
    .replace(/{{STYLE}}/g, style)
    .replace(/{{COLOR_MAX}}/g, cfg.max)
    .replace(/{{SEQ_NUMBERS}}/g, seqNumbers(cfg.max))
    .replace(/{{DETAIL}}/g, cfg.detail);
}

// ============================================================
// ROUTE 1: POST /api/generate/paint-by-numbers
// ============================================================
router.post("/paint-by-numbers", authenticateUser, async (req, res) => {
  try {
    const { prompt, style = "realistic", complexity = "medium" } = req.body;
    const userId = req.user.uid;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    if (prompt.length > 500) {
      return res
        .status(400)
        .json({ error: "Prompt must be 500 characters or fewer" });
    }

    const generationRef = db.collection("generations").doc();
    const generationId = generationRef.id;

    await generationRef.set({
      id: generationId,
      userId,
      prompt,
      style,
      complexity,
      status: "processing",
      imageUrl: "",
      createdAt: new Date().toISOString(),
    });

    // Chạy ngầm tiến trình (Fire-and-forget), thêm .catch để tránh unhandled promise rejection
    generatePaintByNumbers(generationId, prompt, style, complexity).catch(
      (err) => console.error("Background generation task failed:", err),
    );

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
// ============================================================
router.get("/status/:generationId", authenticateUser, async (req, res) => {
  try {
    const { generationId } = req.params;

    const generationDoc = await db
      .collection("generations")
      .doc(generationId)
      .get();

    if (!generationDoc.exists) {
      return res.status(404).json({ error: "Generation not found" });
    }

    const data = generationDoc.data();

    if (data.userId !== req.user.uid) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    res.json(data);
  } catch (error) {
    console.error("Status check error:", error);
    res.status(500).json({ error: error.message });
  }
});

// ============================================================
// HÀM HELPER: generatePaintByNumbers
// ============================================================
async function generatePaintByNumbers(generationId, prompt, style, complexity) {
  try {
    // 1. Dịch sang tiếng Anh (AI Render hiểu tiếng Anh tốt hơn tiếng Việt)
    const englishPrompt = await translatePromptToEnglish(prompt.trim());

    // 2. Xây dựng lệnh đưa cho AI
    const lineArtPrompt = buildLineArtPrompt(englishPrompt, style, complexity);

    let imageBuffer;

    console.log("Generating with Google AI Studio image model...");
    imageBuffer = await generateWithGoogleImage(lineArtPrompt);

    const fileName = `generation-${generationId}-lineart.png`;
    const imageUrl = await uploadToStorage(
      imageBuffer,
      fileName,
      "generations",
    );

    await db.collection("generations").doc(generationId).update({
      status: "completed",
      imageUrl,
      completedAt: new Date().toISOString(),
    });

    console.log(`Generation ${generationId} completed`);
  } catch (error) {
    console.error("Generation processing error:", error);

    await db.collection("generations").doc(generationId).update({
      status: "failed",
      error: error.message,
      failedAt: new Date().toISOString(),
    });
  }
}

// ============================================================
// HÀM HELPER: generateWithGoogleImage
// ============================================================
async function generateWithGoogleImage(prompt) {
  if (!GOOGLE_API_KEY) {
    throw new Error("GOOGLE_AI_API_KEY is missing in backend environment");
  }

  let lastError;

  for (const modelName of GOOGLE_IMAGE_MODELS) {
    try {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/${modelName}:generateContent?key=${GOOGLE_API_KEY}`;

      const payload = {
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          responseModalities: ["TEXT", "IMAGE"],
        },
      };

      const response = await axios.post(endpoint, payload, {
        headers: { "Content-Type": "application/json" },
        timeout: 120000,
      });

      const parts = response.data?.candidates?.[0]?.content?.parts || [];
      const imagePart = parts.find((part) => part.inlineData?.data);

      if (!imagePart?.inlineData?.data) {
        throw new Error(`No image data returned by ${modelName}`);
      }

      return Buffer.from(imagePart.inlineData.data, "base64");
    } catch (error) {
      lastError = error;
      console.error(`Google model ${modelName} failed:`, error.message);
    }
  }

  throw new Error(
    lastError?.response?.data?.error?.message ||
      lastError?.message ||
      "Google image generation failed",
  );
}

// ============================================================
// HÀM HELPER: translatePromptToEnglish
// Dùng MyMemory API (miễn phí, không cần key)
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
      console.log(`Translated prompt: "${prompt}" -> "${translated}"`);
      return translated;
    }
  } catch (err) {
    console.warn("Translation failed, using original prompt:", err.message);
  }
  return prompt;
}

export default router;
