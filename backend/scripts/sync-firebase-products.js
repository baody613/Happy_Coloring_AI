/**
 * Script to sync images from Firebase Storage Products folder to Firestore products
 * Usage: node scripts/sync-firebase-products.js
 */

import admin from "firebase-admin";
import dotenv from "dotenv";
import path from "path";
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
const storage = admin.storage();

/**
 * Generate product name from filename
 */
function generateProductName(filename) {
  // Remove extension and timestamp prefix
  let name = filename.replace(/\.(jpg|jpeg|png|webp|gif)$/i, "");
  name = name.replace(/^\d+-/, ""); // Remove timestamp prefix
  name = name.replace(/[_-]/g, " "); // Replace _ and - with spaces
  
  // Capitalize first letter of each word
  name = name
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");

  return name || "Paint by Numbers Art";
}

/**
 * Generate description based on filename
 */
function generateDescription(filename) {
  const name = generateProductName(filename);
  return `Bộ tranh tô màu theo số "${name}" - Một tác phẩm nghệ thuật tuyệt vời với hướng dẫn chi tiết và màu sắc đa dạng. Phù hợp cho mọi lứa tuổi và trình độ.`;
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
    "Animals",
    "Nature",
    "Landscape",
    "Abstract",
    "Flowers",
    "Portrait",
    "Architecture",
    "Fantasy",
  ];
  return categories[Math.floor(Math.random() * categories.length)];
}

/**
 * List all files in Storage Products folder
 */
async function listStorageFiles(folderPath = "Products") {
  try {
    const bucket = storage.bucket();
    const [files] = await bucket.getFiles({
      prefix: folderPath + "/",
    });

    const imageFiles = files.filter((file) => {
      const name = file.name.toLowerCase();
      return (
        name.match(/\.(jpg|jpeg|png|webp|gif)$/i) &&
        !name.includes("thumbnail") &&
        file.name !== folderPath + "/"
      );
    });

    console.log(`\n📁 Found ${imageFiles.length} images in ${folderPath}/\n`);

    return imageFiles;
  } catch (error) {
    console.error("Error listing storage files:", error);
    throw error;
  }
}

/**
 * Get public URL for a storage file
 */
function getPublicUrl(file) {
  const bucket = storage.bucket();
  return `https://storage.googleapis.com/${bucket.name}/${file.name}`;
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
 * Create product from storage image
 */
async function createProductFromImage(file) {
  try {
    const imageUrl = getPublicUrl(file);

    // Check if product already exists
    const exists = await productExists(imageUrl);
    if (exists) {
      console.log(`   ⏭️  Skipped (already exists): ${file.name}`);
      return { status: "skipped", file: file.name };
    }

    // Make file public if not already
    try {
      await file.makePublic();
    } catch (error) {
      // File might already be public, ignore error
    }

    const filename = path.basename(file.name);
    const productData = {
      title: generateProductName(filename),
      description: generateDescription(filename),
      price: generatePrice(),
      imageUrl: imageUrl,
      thumbnailUrl: imageUrl, // Use same image as thumbnail
      category: getRandomCategory(),
      difficulty: getRandomDifficulty(),
      colors: Math.floor(Math.random() * 30) + 10, // 10-40 colors
      dimensions: {
        width: 40,
        height: 50,
        unit: "cm",
      },
      status: "active",
      stock: Math.floor(Math.random() * 50) + 10, // 10-60 in stock
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    const docRef = await db.collection("products").add(productData);

    console.log(`   ✅ Created: ${productData.title} (ID: ${docRef.id})`);

    return { status: "created", file: file.name, id: docRef.id };
  } catch (error) {
    console.error(`   ❌ Error creating product from ${file.name}:`, error.message);
    return { status: "error", file: file.name, error: error.message };
  }
}

/**
 * Main sync function
 */
async function syncProducts() {
  console.log("🚀 Starting Firebase Storage to Firestore sync...\n");
  console.log("📦 Configuration:");
  console.log(`   Project ID: ${process.env.FIREBASE_PROJECT_ID}`);
  console.log(`   Storage Bucket: ${process.env.FIREBASE_STORAGE_BUCKET}`);
  console.log("");

  try {
    // List all images in Products folder
    const files = await listStorageFiles("Products");

    if (files.length === 0) {
      console.log("⚠️  No images found in Products folder!");
      return;
    }

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
