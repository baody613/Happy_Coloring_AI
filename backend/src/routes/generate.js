import express from "express";
import axios from "axios";
import FormData from "form-data";
import { db, storage } from "../config/firebase.js";
import { authenticateUser } from "../middleware/auth.js";
import sharp from "sharp";

const router = express.Router();

// Hugging Face configuration (Free API)
const HF_API_KEY = process.env.HUGGINGFACE_API_KEY || "hf_demo"; // Works without key for free tier
const HF_MODEL = "stabilityai/stable-diffusion-2-1"; // Free model

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
  userId
) {
  try {
    // Enhanced prompt for paint-by-numbers style
    const enhancedPrompt = `${prompt}, paint by numbers style, clear outlines, numbered sections, coloring book, ${style} art style, ${complexity} detail level`;

    let imageUrl;

    // Use Hugging Face Inference API (Free)
    try {
      console.log("Generating with Hugging Face:", HF_MODEL);
      imageUrl = await generateWithHuggingFace(enhancedPrompt);
      console.log("Hugging Face success! Image URL:", imageUrl);
    } catch (error) {
      console.error("Hugging Face error:", error.message);
      throw error;
    }

    // Download and process image
    const response = await fetch(imageUrl);
    const buffer = await response.arrayBuffer();

    // Convert to paint-by-numbers style (simplified colors + outlines)
    const processedBuffer = await sharp(Buffer.from(buffer))
      .resize(1024, 1024)
      .normalize()
      .modulate({ saturation: 1.2 })
      .toBuffer();

    // Upload to Firebase Storage
    const bucketName =
      process.env.FIREBASE_STORAGE_BUCKET ||
      "paint-by-numbers-ai-607c4.firebasestorage.app";
    const bucket = storage.bucket(bucketName);
    const filename = `generations/${userId}/${generationId}.png`;
    const file = bucket.file(filename);

    await file.save(processedBuffer, {
      metadata: {
        contentType: "image/png",
      },
    });

    // Make file public and get URL
    await file.makePublic();
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${filename}`;

    // Update generation record
    await db.collection("generations").doc(generationId).update({
      status: "completed",
      imageUrl: publicUrl,
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

// Generate with Stability AI
async function generateWithStabilityAI(prompt) {
  const formData = new FormData();
  formData.append("prompt", prompt);
  formData.append("output_format", "png");
  formData.append("aspect_ratio", "1:1");

  const response = await axios.post(
    `${STABILITY_API_HOST}/v2beta/stable-image/generate/sd3`,
    formData,
    {
      headers: {
// Generate with Hugging Face Inference API (Free)
async function generateWithHuggingFace(prompt) {
  console.log("Calling Hugging Face API...");
  
  const response = await axios.post(
    `https://api-inference.huggingface.co/models/${HF_MODEL}`,
    { inputs: prompt },
    {
      headers: {
        Authorization: `Bearer ${HF_API_KEY}`,
        "Content-Type": "application/json",
      },
      responseType: "arraybuffer",
      timeout: 120000, // 2 minutes timeout
    }
  );

  // Upload to Firebase Storage and return URL
  const buffer = Buffer.from(response.data);
  const tempFilename = `temp/${Date.now()}.png`;
  const bucketName =
    process.env.FIREBASE_STORAGE_BUCKET ||
    "paint-by-numbers-ai-607c4.firebasestorage.app";
  const bucket = storage.bucket(bucketName);
  const file = bucket.file(tempFilename);

  await file.save(buffer, {
    metadata: { contentType: "image/png" },
  });

  await file.makePublic();
  const imageUrl = `https://storage.googleapis.com/${bucketName}/${tempFilename}`;
  console.log("Image uploaded to:", imageUrl);
  return imageUrl;
}

export default router;
