/**
 * Script to delete ALL products from Firestore
 * Usage: node scripts/delete-all-products.js
 * WARNING: This will delete ALL products permanently!
 */

import admin from "firebase-admin";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "..", ".env") });

const privateKey = (() => {
  const base64 = process.env.FIREBASE_PRIVATE_KEY_BASE64;
  if (base64) return Buffer.from(base64, "base64").toString("utf8");
  return process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");
})();

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      privateKey,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    }),
  });
}

const db = admin.firestore();

async function deleteAllProducts() {
  console.log("🗑️  Fetching all products...");
  const snapshot = await db.collection("products").get();

  if (snapshot.empty) {
    console.log("✅ No products found");
    return;
  }

  console.log(`⚠️  Found ${snapshot.size} products`);
  console.log("🔄 Deleting...");

  const batch = db.batch();
  snapshot.docs.forEach((doc) => batch.delete(doc.ref));
  await batch.commit();

  console.log("✅ All products deleted successfully!");
}

deleteAllProducts()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Error:", error);
    process.exit(1);
  });
