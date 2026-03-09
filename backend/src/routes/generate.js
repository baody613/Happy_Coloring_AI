import express from "express";
import { fal } from "@fal-ai/client";
import { db } from "../config/firebase.js";
import { authenticateUser } from "../middleware/auth.js";

const router = express.Router();

// Fal.ai configuration
fal.config({ credentials: process.env.FAL_KEY });
// Model: FLUX.1 schnell - nhanh, chất lượng cao
const FAL_MODEL = "fal-ai/flux/schnell";

// Generate paint-by-numbers from text prompt
router.post("/paint-by-numbers", authenticateUser, async (req, res) => {
  try {
    const { prompt, style = "realistic", complexity = "medium" } = req.body;
    const userId = req.user.uid;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
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
      createdAt: new Date().toISOString(),
    });

    // Start AI generation (async)
    generatePaintByNumbers(generationId, prompt, style, complexity, userId);

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
async function generatePaintByNumbers(
  generationId,
  prompt,
  style,
  complexity,
  userId,
) {
  try {
    // Enhanced prompt for paint-by-numbers style
    const enhancedPrompt = `${prompt}, paint by numbers style, clear outlines, numbered sections, coloring book, ${style} art style, ${complexity} detail level`;

    let imageUrl;

    // Use Fal.ai for generation
    try {
      console.log("Generating with Fal.ai:", FAL_MODEL);
      imageUrl = await generateWithFal(enhancedPrompt);
      console.log("Fal.ai success! Image URL:", imageUrl);
    } catch (error) {
      console.error("Fal.ai error:", error.message);
      throw error;
    }

    // Update generation record with Fal.ai URL directly
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

// Generate with Fal.ai (FLUX.1 schnell)
async function generateWithFal(prompt) {
  console.log("Calling Fal.ai API...");

  const result = await fal.subscribe(FAL_MODEL, {
    input: {
      prompt,
      image_size: "square_hd", // 1024x1024
      num_inference_steps: 4, // schnell chỉ cần 4 steps
      num_images: 1,
      enable_safety_checker: true,
    },
    logs: true,
    onQueueUpdate: (update) => {
      if (update.status === "IN_PROGRESS") {
        console.log(
          "Fal.ai progress:",
          update.logs?.map((l) => l.message).join(", "),
        );
      }
    },
  });

  const imageUrl = result.data?.images?.[0]?.url;
  if (!imageUrl) {
    throw new Error("Fal.ai did not return an image URL");
  }

  console.log("Fal.ai image URL:", imageUrl);
  return imageUrl;
}

export default router;
