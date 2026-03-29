import express from "express";
import axios from "axios";
import { db } from "../config/firebase.js";
import { authenticateUser } from "../middleware/auth.js";
import { uploadToStorage } from "../utils/storageHelpers.js";

const router = express.Router();

const GOOGLE_API_KEY = process.env.GOOGLE_AI_API_KEY;
const GOOGLE_IMAGE_MODELS = ["models/gemini-2.5-flash-image"];

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

Output quality target:
- High clarity, print-ready, easy for users to follow number-to-color mapping while painting.`;

function buildLineArtPrompt(userPrompt, style, complexity) {
  return LINE_ART_PROMPT_TEMPLATE.replace("{{USER_PROMPT}}", userPrompt)
    .replace("{{STYLE}}", style)
    .replace("{{COMPLEXITY}}", complexity);
}

// Generate paint-by-numbers from text prompt
router.post("/paint-by-numbers", authenticateUser, async (req, res) => {
  try {
    const { prompt, style = "realistic", complexity = "medium" } = req.body;
    const userId = req.user.uid;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    if (prompt.length > 500) {
      return res.status(400).json({ error: "Prompt must be 500 characters or fewer" });
    }

    // Create generation record
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

    // Start AI generation (async)
    generatePaintByNumbers(generationId, prompt, style, complexity);

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

// Check generation status
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

    // Check if user owns this generation
    if (data.userId !== req.user.uid) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    res.json(data);
  } catch (error) {
    console.error("Status check error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Helper function to generate paint-by-numbers
async function generatePaintByNumbers(generationId, prompt, style, complexity) {
  try {
    const lineArtPrompt = buildLineArtPrompt(prompt.trim(), style, complexity);

    console.log("Generating with Google AI Studio image model...");
    const imageBuffer = await generateWithGoogleImage(lineArtPrompt);

    const fileName = `generation-${generationId}-lineart.png`;
    const imageUrl = await uploadToStorage(
      imageBuffer,
      fileName,
      "generations",
    );

    // Update generation record with uploaded generated image URL
    await db.collection("generations").doc(generationId).update({
      status: "completed",
      imageUrl,
      completedAt: new Date().toISOString(),
    });

    console.log(`✅ Generation ${generationId} completed`);
  } catch (error) {
    console.error("Generation processing error:", error);

    // Update generation record with error
    await db.collection("generations").doc(generationId).update({
      status: "failed",
      error: error.message,
      failedAt: new Date().toISOString(),
    });
  }
}

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
            parts: [
              {
                text: prompt,
              },
            ],
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

export default router;
