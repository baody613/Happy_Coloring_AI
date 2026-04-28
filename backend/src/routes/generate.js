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
// stars: hiển thị độ khó bằng ngôi sao in trên tờ tranh
// ============================================================
const COMPLEXITY_CONFIG = {
  easy: {
    label: "Easy",
    stars: "★☆☆",
    max: 16,
    detail: "simple bold shapes, very large paint regions, minimal detail",
  },
  medium: {
    label: "Medium",
    stars: "★★☆",
    max: 28,
    detail: "moderate detail, medium-sized paint regions, balanced composition",
  },
  hard: {
    label: "Hard",
    stars: "★★★",
    max: 44,
    detail:
      "highly detailed, many small intricate regions, complex composition",
  },
};

// ============================================================
// FRAME STYLE CONFIG – Mô tả kiểu khung tranh
// ============================================================
const FRAME_STYLE_CONFIG = {
  rectangular:
    "a clearly visible thick rectangular border/frame",
  oval:
    "a clearly visible thick oval or circular border/frame",
  decorative:
    "a decorative ornamental border/frame featuring simple floral or geometric patterns",
};

// ============================================================
// CONTENT MODERATION – Blocklist từ khóa không phù hợp
// Kiểm tra trước khi gửi prompt tới AI
// ============================================================
const BLOCKED_KEYWORDS = [
  // English – adult / explicit
  "nude", "naked", "sex", "porn", "explicit", "nsfw", "erotic", "hentai",
  "xxx", "adult content", "breast", "genitalia", "penis", "vagina",
  // English – violence / disturbing
  "gore", "blood", "kill", "murder", "suicide", "torture", "weapon",
  "gun", "rifle", "knife", "bomb", "terrorist",
  // Vietnamese – nội dung người lớn
  "khỏa thân", "tình dục", "khiêu dâm", "người lớn", "nội dung 18+",
  // Vietnamese – bạo lực
  "bạo lực", "máu", "giết", "đâm", "chém", "tự tử", "vũ khí",
].map((kw) => kw.toLowerCase());

/**
 * Trả về true nếu prompt chứa từ khóa bị chặn.
 */
function moderatePrompt(prompt) {
  const lower = prompt.toLowerCase();
  return BLOCKED_KEYWORDS.some((kw) => lower.includes(kw));
}

// Sinh danh sách số tuần tự: "1, 2, 3, 4, ... N"
function seqNumbers(max) {
  return Array.from({ length: max }, (_, i) => i + 1).join(", ");
}

// ============================================================
// PROMPT TEMPLATE – Hướng dẫn chi tiết gửi tới AI
// Placeholders được thay thế trong buildLineArtPrompt():
//   {{USER_PROMPT}}, {{STYLE}}, {{COLOR_MAX}}, {{SEQ_NUMBERS}},
//   {{DETAIL}}, {{FRAME_STYLE_DESC}}, {{COMPLEXITY_LABEL}},
//   {{COMPLEXITY_STARS}}, {{PALETTE_LAYOUT_DESC}}
// ============================================================
const LINE_ART_PROMPT_TEMPLATE = `⚠️ CONTENT SAFETY (non-negotiable): This artwork MUST be suitable for children of all ages. Strictly NO sexual, violent, scary, disturbing, or adult content of any kind. If the subject contains any such element, replace it with a generic child-friendly alternative.

You are a professional paint-by-numbers illustrator. Your ONLY task is to draw EXACTLY the subject described below as a printable paint-by-numbers worksheet. Never substitute or ignore the subject.

=== SUBJECT TO DRAW (mandatory, do not change) ===
"{{USER_PROMPT}}"

=== PARAMETERS ===
- Art style: {{STYLE}}
- Exact number of colors: {{COLOR_MAX}} colors
- Allowed color numbers: {{SEQ_NUMBERS}} — use ONLY these numbers, nothing else
- Detail level: {{DETAIL}}
- Frame style: {{FRAME_STYLE_DESC}}

=== MANDATORY LAYOUT (pixel-perfect) ===
- Very top strip (≈5% of canvas): a title area displaying the subject name "{{USER_PROMPT}}" in clear, readable text centered above the frame.
- Below the title (≈70% of canvas): the main line-art drawing enclosed inside {{FRAME_STYLE_DESC}}.
- Bottom-left corner of the drawing area: a small difficulty badge reading "{{COMPLEXITY_LABEL}} – {{COLOR_MAX}} colors {{COMPLEXITY_STARS}}" in small text.
- Bottom-right corner of the drawing area: a small box containing the text "Colored by: ___________" for the painter to sign.
- Bottom strip (≈25% of canvas): {{PALETTE_LAYOUT_DESC}}
- A thin horizontal divider line separates the drawing area from the palette strip.

=== STEP-BY-STEP DRAWING RULES ===
Step 1 – Draw the subject "{{USER_PROMPT}}" using ONLY BLACK outlines on a PURE WHITE background. No grayscale shading whatsoever.
Step 2 – Divide the drawing into CLOSED regions. Every region must be fully enclosed by outlines.
Step 3 – Assign colors using ONLY the sequential numbers: {{SEQ_NUMBERS}}. Start from 1. Each number represents one unique color. Regions sharing the same color use the same number.
Step 4 – Print each region's assigned number as a LARGE BOLD digit centered INSIDE that region. EVERY region must have exactly one number. No region may be left blank.
Step 5 – In the palette strip at the bottom, draw {{PALETTE_LAYOUT_DESC}} Each swatch is a FILLED COLORED square (use a naturally matching suggested color for the subject) with its number printed beside it. Numbers must be sequential: 1, 2, 3 … {{COLOR_MAX}}.

=== STRICT PROHIBITIONS ===
- Do NOT use any number larger than {{COLOR_MAX}} in the drawing or palette.
- Do NOT skip any number between 1 and {{COLOR_MAX}}.
- The drawing area MUST be strictly BLACK outlines on a PURE WHITE background. Any AI-added shading, color tinting, gradients, or background patterns inside the drawing area are STRICTLY FORBIDDEN.
- NO color fills inside regions in the drawing area — regions stay WHITE. Only the number digit is printed inside.
- NO color names written anywhere in the image.
- NO watermarks, logos, copyright text, or extra signatures (only the "Colored by:" box and difficulty badge defined above are allowed).
- NO adult, violent, scary, or disturbing content.

=== QUALITY TARGET ===
High resolution (1024x1024), print-ready, clean and crisp so users can easily paint by following the numbers.`;

/**
 * Builds the final prompt string by substituting all placeholders.
 * @param {string} userPrompt  – translated English subject description
 * @param {string} style       – art style (e.g. "realistic")
 * @param {string} complexity  – "easy" | "medium" | "hard"
 * @param {string} frameStyle  – "rectangular" | "oval" | "decorative"
 */
function buildLineArtPrompt(userPrompt, style, complexity, frameStyle = "rectangular") {
  const cfg = COMPLEXITY_CONFIG[complexity] || COMPLEXITY_CONFIG.medium;
  const frameDesc =
    FRAME_STYLE_CONFIG[frameStyle] || FRAME_STYLE_CONFIG.rectangular;

  // Palette layout: 2 rows when color count > 20 to avoid tiny unreadable swatches
  const paletteLayoutDesc =
    cfg.max > 20
      ? `two horizontal rows of colored number swatches, with approximately ${Math.ceil(cfg.max / 2)} swatches per row (${cfg.max} swatches total).`
      : `a single horizontal row of ${cfg.max} colored number swatches.`;

  return LINE_ART_PROMPT_TEMPLATE
    .replace(/{{USER_PROMPT}}/g, userPrompt)
    .replace(/{{STYLE}}/g, style)
    .replace(/{{COLOR_MAX}}/g, cfg.max)
    .replace(/{{SEQ_NUMBERS}}/g, seqNumbers(cfg.max))
    .replace(/{{DETAIL}}/g, cfg.detail)
    .replace(/{{FRAME_STYLE_DESC}}/g, frameDesc)
    .replace(/{{COMPLEXITY_LABEL}}/g, cfg.label)
    .replace(/{{COMPLEXITY_STARS}}/g, cfg.stars)
    .replace(/{{PALETTE_LAYOUT_DESC}}/g, paletteLayoutDesc);
}

// ============================================================
// ROUTE 1: POST /api/generate/paint-by-numbers
// ============================================================
router.post("/paint-by-numbers", authenticateUser, async (req, res) => {
  try {
    const {
      prompt,
      style = "realistic",
      complexity = "medium",
      frameStyle = "rectangular",
    } = req.body;
    const userId = req.user.uid;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    if (prompt.length > 500) {
      return res
        .status(400)
        .json({ error: "Prompt must be 500 characters or fewer" });
    }

    // Kiểm tra nội dung không phù hợp trước khi gửi tới AI
    if (moderatePrompt(prompt)) {
      return res.status(400).json({
        error:
          "Nội dung không phù hợp. Vui lòng mô tả chủ đề thân thiện với trẻ em.",
      });
    }

    const validFrameStyles = Object.keys(FRAME_STYLE_CONFIG);
    const safeFrameStyle = validFrameStyles.includes(frameStyle)
      ? frameStyle
      : "rectangular";

    const generationRef = db.collection("generations").doc();
    const generationId = generationRef.id;

    await generationRef.set({
      id: generationId,
      userId,
      prompt,
      style,
      complexity,
      frameStyle: safeFrameStyle,
      status: "processing",
      imageUrl: "",
      createdAt: new Date().toISOString(),
    });

    // Chạy ngầm tiến trình (Fire-and-forget), thêm .catch để tránh unhandled promise rejection
    generatePaintByNumbers(generationId, prompt, style, complexity, safeFrameStyle).catch(
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
async function generatePaintByNumbers(generationId, prompt, style, complexity, frameStyle = "rectangular") {
  try {
    // 1. Dịch sang tiếng Anh (AI Render hiểu tiếng Anh tốt hơn tiếng Việt)
    const englishPrompt = await translatePromptToEnglish(prompt.trim());

    // 2. Xây dựng lệnh đưa cho AI
    const lineArtPrompt = buildLineArtPrompt(englishPrompt, style, complexity, frameStyle);

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
