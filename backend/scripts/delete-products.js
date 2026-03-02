/**
 * Script to delete specific products by ID or title
 * Usage:
 *   node scripts/delete-products.js <id1> <id2> <id3>
 *   node scripts/delete-products.js title:"Doraemon"
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

async function deleteProductById(id) {
  await db.collection("products").doc(id).delete();
  console.log(`✅ Deleted product: ${id}`);
}

async function deleteProductByTitle(title) {
  const snapshot = await db
    .collection("products")
    .where("title", "==", title)
    .get();

  if (snapshot.empty) {
    console.log(`❌ No product found with title: ${title}`);
    return 0;
  }

  const batch = db.batch();
  snapshot.docs.forEach((doc) => batch.delete(doc.ref));
  await batch.commit();

  console.log(`✅ Deleted ${snapshot.size} product(s) with title: ${title}`);
  return snapshot.size;
}

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log("❌ Please provide product IDs or titles to delete");
    console.log("\nUsage:");
    console.log("  node scripts/delete-products.js <id1> <id2> <id3>");
    console.log('  node scripts/delete-products.js title:"Product Name"');
    console.log("\nExample:");
    console.log("  node scripts/delete-products.js abc123 def456");
    console.log('  node scripts/delete-products.js title:"Doraemon"');
    return;
  }

  console.log("🗑️  Starting deletion...\n");

  for (const arg of args) {
    if (arg.startsWith("title:")) {
      const title = arg.substring(6).replace(/^["']|["']$/g, "");
      await deleteProductByTitle(title);
    } else {
      await deleteProductById(arg);
    }
  }

  console.log("\n✨ Done!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Error:", error);
    process.exit(1);
  });
