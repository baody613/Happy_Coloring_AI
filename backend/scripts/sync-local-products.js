/**
 * Script to create products from local images (frontend/public/images/Products)
 * Usage: node scripts/sync-local-products.js
 */

import admin from "firebase-admin";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, "..", ".env") });

// Initialize Firebase Admin
const privateKey = (() => {
  const raw = process.env.FIREBASE_PRIVATE_KEY;
  const base64 = process.env.FIREBASE_PRIVATE_KEY_BASE64;

  if (base64) {
    return Buffer.from(base64, "base64").toString("utf8");
  }

  if (raw) {
    return raw.replace(/\\n/g, "\n");
  }

  return undefined;
})();

const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  privateKey,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
};

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  });
}

const db = admin.firestore();

// Path to local images
const IMAGES_PATH = path.join(__dirname, "..", "..", "frontend", "public", "images", "Products");
const IMAGE_URL_PREFIX = "/images/Products";

/**
 * Generate product name from filename
 */
function generateProductName(filename) {
  let name = filename.replace(/\.(jpg|jpeg|png|webp|gif)$/i, "");
  name = name.replace(/^vn-\d+-\w+-/, "");
  name = name.replace(/[_-]/g, " ");
  
  name = name
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");

  return name || "Paint by Numbers Art";
}

/**
 * Generate description
 */
function generateDescription(filename) {
  const name = generateProductName(filename);
  return `Bộ tranh tô màu theo số "${name}" - Tác phẩm nghệ thuật độc đáo với hướng dẫn chi tiết, màu sắc sinh động. Phù hợp cho mọi lứa tuổi và trình độ. Sản phẩm bao gồm canvas, bộ màu đầy đủ và cọ vẽ chất lượng cao.`;
}

/**
 * Generate random price between min and max
 */
function generatePrice(min = 150000, max = 500000) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

/**
 * Get random difficulty
 */
function getRandomDifficulty() {
  const difficulties = ["easy", "medium", "hard"];
  return difficulties[Math.floor(Math.random() * difficulties.length)];
}

/**
 * Get random category
 */
function getRandomCategory() {
  const categories = [
    "Động vật",
    "Thiên nhiên",
    "Phong cảnh",
    "Trừu tượng",
    "Hoa",
    "Chân dung",
    "Kiến trúc",
    "Fantasy",
  ];
  return categories[Math.floor(Math.random() * categories.length)];
}

/**
 * Check if product already exists with this image URL
 */
async function productExists(imageUrl) {
  const snapshot = await db
    .collection("products")
    .where("imageUrl", "==", imageUrl)
    .limit(1)
    .get();

  return !snapshot.empty;
}

/**
 * Create product from local image
 */
async function createProductFromImage(filename) {
  try {
    const imageUrl = `${IMAGE_URL_PREFIX}/${filename}`;

    // Check if product already exists
    const exists = await productExists(imageUrl);
    if (exists) {
      console.log(`   ⏭️  Skipped (already exists): ${filename}`);
      return { status: "skipped", file: filename };
    }

    const productData = {
      title: generateProductName(filename),
      description: generateDescription(filename),
      price: generatePrice(),
      imageUrl: imageUrl,
      thumbnailUrl: imageUrl,
      category: getRandomCategory(),
      difficulty: getRandomDifficulty(),
      colors: Math.floor(Math.random() * 30) + 10,
      dimensions: {
        width: 40,
        height: 50,
        unit: "cm",
      },
      status: "active",
      stock: Math.floor(Math.random() * 50) + 10,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    const docRef = await db.collection("products").add(productData);

    console.log(`   ✅ Created: ${productData.title} (ID: ${docRef.id})`);

    return { status: "created", file: filename, id: docRef.id };
  } catch (error) {
    console.error(`   ❌ Error creating product from ${filename}:`, error.message);
    return { status: "error", file: filename, error: error.message };
  }
}

/**
 * List all image files in local directory
 */
function listLocalImages() {
  try {
    if (!fs.existsSync(IMAGES_PATH)) {
      throw new Error(`Directory not found: ${IMAGES_PATH}`);
    }

    const files = fs.readdirSync(IMAGES_PATH);
    const imageFiles = files.filter((file) => {
      const ext = path.extname(file).toLowerCase();
      return [".jpg", ".jpeg", ".png", ".webp", ".gif"].includes(ext) &&
             !file.toLowerCase().includes("hướng dẫn");
    });

    return imageFiles;
  } catch (error) {
    console.error("Error listing local images:", error);
    throw error;
  }
}

/**
 * Main sync function
 */
async function syncProducts() {
  console.log("🚀 Starting Local Images to Firestore sync...\n");
  console.log("📦 Configuration:");
  console.log(`   Project ID: ${process.env.FIREBASE_PROJECT_ID}`);
  console.log(`   Images Path: ${IMAGES_PATH}`);
  console.log(`   URL Prefix: ${IMAGE_URL_PREFIX}`);
  console.log("");

  try {
    // List all images in local folder
    const files = listLocalImages();

    if (files.length === 0) {
      console.log("⚠️  No images found in local folder!");
      return;
    }

    console.log(`📁 Found ${files.length} images\n`);
    console.log("🔄 Processing images...\n");

    const results = {
      created: 0,
      skipped: 0,
      errors: 0,
    };

    // Process each image
    for (const file of files) {
      const result = await createProductFromImage(file);

      if (result.status === "created") results.created++;
      else if (result.status === "skipped") results.skipped++;
      else if (result.status === "error") results.errors++;
    }

    // Summary
    console.log("\n" + "=".repeat(50));
    console.log("📊 SYNC COMPLETED");
    console.log("=".repeat(50));
    console.log(`✅ Created:  ${results.created} products`);
    console.log(`⏭️  Skipped:  ${results.skipped} products (already exist)`);
    console.log(`❌ Errors:   ${results.errors} products`);
    console.log(`📁 Total:    ${files.length} images processed`);
    console.log("=".repeat(50));
  } catch (error) {
    console.error("\n❌ Sync failed:", error);
    process.exit(1);
  }
}

// Run sync
syncProducts()
  .then(() => {
    console.log("\n✨ Done!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n💥 Fatal error:", error);
    process.exit(1);
  });
