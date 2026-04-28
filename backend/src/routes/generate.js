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
    detail:
      "simplified cartoon style with thick outlines (3-4px). Large flat regions, minimum 40x40px each. Only 5-10 main recognisable shapes. Bold, child-friendly composition with very minimal fine detail.",
  },
  medium: {
    label: "Medium",
    max: 28,
    detail:
      "semi-realistic illustrative style with standard outlines (2-3px). Medium regions (minimum 18x18px). 15-25 distinct shapes with a balanced level of detail. Suitable for adults with some painting experience.",
  },
  hard: {
    label: "Hard",
    max: 44,
    detail:
      "realistic detailed style with fine outlines (1.5-2px). Many small intricate regions (as small as 8x8px). 35-50 distinct shapes with rich texture, shadows as outlines, and complex overlapping elements.",
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
const LINE_ART_PROMPT_TEMPLATE = `Generate a PAINT-BY-NUMBERS WORKSHEET that looks exactly like a professionally printed paint-by-numbers kit sold in art stores.

Subject to draw: "{{USER_PROMPT}}"

════════════════════════════════════════
SECTION 1 — OVERALL CANVAS (1024×1024 px)
════════════════════════════════════════
• Top 78% of the canvas  →  DRAWING ZONE enclosed in a thin solid black rectangular border
• 2px solid black horizontal rule divides drawing zone from palette
• Bottom 22% of the canvas  →  COLOUR PALETTE ROW on a pure white background

════════════════════════════════════════
SECTION 2 — DRAWING ZONE (top 78%)
════════════════════════════════════════
SUBJECT ACCURACY (critical):
  Draw "{{USER_PROMPT}}" and nothing else. The subject must be immediately recognisable, fill the entire drawing zone, and match the description word for word. Do NOT replace, simplify, or omit any part of the subject.

ART STYLE:
  {{DETAIL}}
  The composition must be dense — every part of the drawing zone covered with meaningful shapes, not empty white space.

LINE ART RULES (strictly enforced):
  • Use pure black (#000000) outlines on a pure white (#ffffff) background ONLY
  • Zero grey tones, zero colour tints, zero gradients, zero drop-shadows, zero halftones anywhere in the drawing zone
  • All outlines must be fully CLOSED — every shape/region is a completely enclosed area with no gaps or open endpoints

NUMBERING RULES (strictly enforced):
  • Divide the entire drawing into enclosed regions. Every single region — large or tiny — must contain exactly one small black number
  • The number indicates which colour to paint that region
  • Size the numbers proportionally: large regions get slightly larger digits; small regions get smaller digits. Numbers must always be legible but should NOT dominate the region — they are subtle guide markers
  • Use ONLY the integers 1 through {{COLOR_MAX}}. Numbers outside this range are forbidden
  • Every integer from 1 to {{COLOR_MAX}} must appear at least once in the drawing
  • Numbers are plain black digits — no circles, boxes, or backgrounds around them in the drawing zone

════════════════════════════════════════
SECTION 3 — COLOUR PALETTE ROW (bottom 22%)
════════════════════════════════════════
  • Display exactly {{COLOR_MAX}} swatches in strict ascending order: 1, 2, 3 … {{COLOR_MAX}}
  • Each swatch is a FILLED SOLID-COLOUR CIRCLE (approx. 30–36 px diameter)
  • The integer (1–{{COLOR_MAX}}) is printed in BOLD BLACK in the centre of the circle, contrasting clearly against the fill colour
  • Circles are spaced evenly across the full width on a pure white strip
  • Choose colours that are visually distinct from one another and appropriate for "{{USER_PROMPT}}"
  • Zero missing swatches, zero out-of-order swatches, zero duplicate numbers

════════════════════════════════════════
SECTION 4 — ABSOLUTE PROHIBITIONS
════════════════════════════════════════
  ✗ Any number greater than {{COLOR_MAX}} anywhere on the image
  ✗ Any integer between 1 and {{COLOR_MAX}} that is missing from either the drawing or the palette
  ✗ Any colour fill, grey shading, or tint inside drawing regions (regions must stay pure white)
  ✗ Any text other than single digits (no colour names, labels, titles, watermarks, signatures)
  ✗ Drawing a different subject instead of "{{USER_PROMPT}}"

Final output: 1024×1024 px, crisp print-ready black-and-white line art with numbered regions, plus a fully populated colour palette row at the bottom.`;

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
