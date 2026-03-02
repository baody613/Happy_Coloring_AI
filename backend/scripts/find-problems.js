/**
 * Script to find duplicate products and products without images
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

async function findProblems() {
  console.log("🔍 Đang quét database...\n");

  const snapshot = await db.collection("products").get();
  console.log(`📊 Tổng số: ${snapshot.size} sản phẩm\n`);

  const titleMap = new Map();
  const noImage = [];
  const brokenImage = [];

  snapshot.forEach((doc) => {
    const data = doc.data();
    const title = data.title || "";
    const imageUrl = data.imageUrl || "";

    // Track duplicates by title
    if (!titleMap.has(title)) {
      titleMap.set(title, []);
    }
    titleMap.set(title, [...titleMap.get(title), { id: doc.id, ...data }]);

    // Find products without image
    if (!imageUrl || imageUrl === "" || imageUrl === "NONE") {
      noImage.push({ id: doc.id, title, imageUrl });
    }

    // Find products with broken image
    if (imageUrl.includes("404") || imageUrl.includes("error")) {
      brokenImage.push({ id: doc.id, title, imageUrl });
    }
  });

  // Find duplicates
  const duplicates = [];
  titleMap.forEach((products, title) => {
    if (products.length > 1) {
      duplicates.push({ title, count: products.length, products });
    }
  });

  // Print results
  console.log("═══════════════════════════════════════════════════\n");

  if (duplicates.length > 0) {
    console.log(`🔴 Tìm thấy ${duplicates.length} sản phẩm BỊ TRÙNG:\n`);
    duplicates.forEach((dup, i) => {
      console.log(`${i + 1}. "${dup.title}" - ${dup.count} bản sao:`);
      dup.products.forEach((p, j) => {
        console.log(`   ${j + 1}. ID: ${p.id}`);
        console.log(`      Image: ${p.imageUrl.substring(0, 80)}...`);
        console.log(`      Price: ${p.price.toLocaleString("vi-VN")}₫`);
      });
      console.log("");
    });
  } else {
    console.log("✅ Không có sản phẩm trùng lặp\n");
  }

  console.log("═══════════════════════════════════════════════════\n");

  if (noImage.length > 0) {
    console.log(`❌ Tìm thấy ${noImage.length} sản phẩm KHÔNG CÓ ẢNH:\n`);
    noImage.forEach((p, i) => {
      console.log(`${i + 1}. ID: ${p.id}`);
      console.log(`   Title: ${p.title}`);
      console.log(`   Image: ${p.imageUrl || "NONE"}\n`);
    });
  } else {
    console.log("✅ Tất cả sản phẩm đều có ảnh\n");
  }

  console.log("═══════════════════════════════════════════════════\n");

  if (brokenImage.length > 0) {
    console.log(`⚠️  Tìm thấy ${brokenImage.length} sản phẩm ẢNH LỖI:\n`);
    brokenImage.forEach((p, i) => {
      console.log(`${i + 1}. ID: ${p.id}`);
      console.log(`   Title: ${p.title}`);
      console.log(`   Image: ${p.imageUrl}\n`);
    });
  }

  console.log("═══════════════════════════════════════════════════\n");

  // Summary
  const totalProblems =
    duplicates.reduce((sum, d) => sum + d.count - 1, 0) +
    noImage.length +
    brokenImage.length;

  if (totalProblems > 0) {
    console.log(`\n💡 Tổng kết:`);
    console.log(
      `   - ${duplicates.reduce((sum, d) => sum + d.count - 1, 0)} sản phẩm trùng lặp cần xóa`,
    );
    console.log(`   - ${noImage.length} sản phẩm không có ảnh`);
    console.log(`   - ${brokenImage.length} sản phẩm ảnh lỗi`);
    console.log(`   = ${totalProblems} sản phẩm có vấn đề cần xử lý\n`);

    // Generate delete commands
    const idsToDelete = [];
    duplicates.forEach((dup) => {
      // Keep first, delete rest
      for (let i = 1; i < dup.products.length; i++) {
        idsToDelete.push(dup.products[i].id);
      }
    });
    noImage.forEach((p) => idsToDelete.push(p.id));
    brokenImage.forEach((p) => idsToDelete.push(p.id));

    if (idsToDelete.length > 0) {
      console.log(`📝 Lệnh xóa tự động:\n`);
      console.log(`node scripts/delete-products.js ${idsToDelete.join(" ")}\n`);
    }
  } else {
    console.log("✨ Database sạch sẽ, không có vấn đề!\n");
  }
}

findProblems()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Error:", error);
    process.exit(1);
  });
