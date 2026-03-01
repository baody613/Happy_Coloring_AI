import admin from "firebase-admin";
import dotenv from "dotenv";

dotenv.config();

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

// Sample product data
const sampleProducts = [
  {
    title: "Tranh Mèo Dễ Thương",
    description: "Bộ tranh tô màu theo số với hình ảnh mèo dễ thương, phù hợp cho người mới bắt đầu",
    category: "animals",
    price: 150000,
    imageUrl: "https://firebasestorage.googleapis.com/v0/b/paint-by-numbers-ai-607c4.firebasestorage.app/o/products%2Fsample-cat.jpg?alt=media",
    thumbnailUrl: "https://firebasestorage.googleapis.com/v0/b/paint-by-numbers-ai-607c4.firebasestorage.app/o/products%2Fsample-cat.jpg?alt=media",
    difficulty: "easy",
    dimensions: { width: 40, height: 50, unit: "cm" },
    colors: 24,
    status: "active",
    sales: 120,
    rating: 4.8,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    title: "Phong Cảnh Biển Hoàng Hôn",
    description: "Tranh phong cảnh biển lúc hoàng hôn, màu sắc rực rỡ và lãng mạn",
    category: "landscape",
    price: 200000,
    imageUrl: "https://firebasestorage.googleapis.com/v0/b/paint-by-numbers-ai-607c4.firebasestorage.app/o/products%2Fsample-sunset.jpg?alt=media",
    thumbnailUrl: "https://firebasestorage.googleapis.com/v0/b/paint-by-numbers-ai-607c4.firebasestorage.app/o/products%2Fsample-sunset.jpg?alt=media",
    difficulty: "medium",
    dimensions: { width: 50, height: 60, unit: "cm" },
    colors: 36,
    status: "active",
    sales: 85,
    rating: 4.9,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    title: "Hoa Hồng Đỏ",
    description: "Bộ tranh hoa hồng đỏ tuyệt đẹp, chi tiết sắc nét",
    category: "flowers",
    price: 180000,
    imageUrl: "https://firebasestorage.googleapis.com/v0/b/paint-by-numbers-ai-607c4.firebasestorage.app/o/products%2Fsample-rose.jpg?alt=media",
    thumbnailUrl: "https://firebasestorage.googleapis.com/v0/b/paint-by-numbers-ai-607c4.firebasestorage.app/o/products%2Fsample-rose.jpg?alt=media",
    difficulty: "medium",
    dimensions: { width: 40, height: 50, unit: "cm" },
    colors: 30,
    status: "active",
    sales: 95,
    rating: 4.7,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    title: "Cung Điện Cổ Đại",
    description: "Tranh kiến trúc cung điện châu Âu cổ kính và tráng lệ",
    category: "architecture",
    price: 250000,
    imageUrl: "https://firebasestorage.googleapis.com/v0/b/paint-by-numbers-ai-607c4.firebasestorage.app/o/products%2Fsample-palace.jpg?alt=media",
    thumbnailUrl: "https://firebasestorage.googleapis.com/v0/b/paint-by-numbers-ai-607c4.firebasestorage.app/o/products%2Fsample-palace.jpg?alt=media",
    difficulty: "hard",
    dimensions: { width: 60, height: 80, unit: "cm" },
    colors: 48,
    status: "active",
    sales: 45,
    rating: 4.6,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    title: "Chó Con Đáng Yêu",
    description: "Tranh chó con golden retriever đáng yêu, thích hợp làm quà tặng",
    category: "animals",
    price: 160000,
    imageUrl: "https://firebasestorage.googleapis.com/v0/b/paint-by-numbers-ai-607c4.firebasestorage.app/o/products%2Fsample-dog.jpg?alt=media",
    thumbnailUrl: "https://firebasestorage.googleapis.com/v0/b/paint-by-numbers-ai-607c4.firebasestorage.app/o/products%2Fsample-dog.jpg?alt=media",
    difficulty: "easy",
    dimensions: { width: 40, height: 50, unit: "cm" },
    colors: 24,
    status: "active",
    sales: 110,
    rating: 4.9,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

async function seedData() {
  try {
    console.log("🌱 Bắt đầu seed data vào Firestore...");

    // Seed products
    console.log("\n📦 Đang thêm sản phẩm...");
    for (const product of sampleProducts) {
      const docRef = await db.collection("products").add(product);
      console.log(`  ✅ Đã thêm: ${product.title} (ID: ${docRef.id})`);
    }

    console.log(`\n🎉 Hoàn tất! Đã thêm ${sampleProducts.length} sản phẩm.`);
    console.log("\n📊 Thống kê:");
    console.log(`  - Animals: ${sampleProducts.filter(p => p.category === 'animals').length}`);
    console.log(`  - Landscape: ${sampleProducts.filter(p => p.category === 'landscape').length}`);
    console.log(`  - Flowers: ${sampleProducts.filter(p => p.category === 'flowers').length}`);
    console.log(`  - Architecture: ${sampleProducts.filter(p => p.category === 'architecture').length}`);
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Lỗi khi seed data:", error);
    process.exit(1);
  }
}

seedData();
