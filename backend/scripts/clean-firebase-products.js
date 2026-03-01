/**
 * Script to delete all products with Firebase Storage URLs
 * Usage: node scripts/clean-firebase-products.js
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
  });
}

const db = admin.firestore();

async function deleteFirebaseStorageProducts() {
  console.log("🗑️  Deleting products with Firebase Storage URLs...\n");

  try {
    const snapshot = await db.collection("products").get();

    console.log(`Found ${snapshot.size} total products\n`);

    let deleted = 0;
    let kept = 0;

    for (const doc of snapshot.docs) {
      const data = doc.data();
      const imageUrl = data.imageUrl || "";

      // Delete if imageUrl contains storage.googleapis.com or firebasestorage
      if (
        imageUrl.includes("storage.googleapis.com") ||
        imageUrl.includes("firebasestorage")
      ) {
        await doc.ref.delete();
        console.log(`   ✅ Deleted: ${data.title}`);
        deleted++;
      } else {
        console.log(`   ⏭️  Kept: ${data.title}`);
        kept++;
      }
    }

    console.log("\n" + "=".repeat(50));
    console.log("📊 CLEANUP COMPLETED");
    console.log("=".repeat(50));
    console.log(`🗑️  Deleted: ${deleted} products`);
    console.log(`✅ Kept:    ${kept} products`);
    console.log("=".repeat(50));
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

deleteFirebaseStorageProducts()
  .then(() => {
    console.log("\n✨ Done!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n💥 Fatal error:", error);
    process.exit(1);
  });
