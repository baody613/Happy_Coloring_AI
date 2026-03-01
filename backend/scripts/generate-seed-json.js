// Script để seed products qua Admin API endpoint
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

const API_URL = 'http://localhost:3001/api';

// Product data với ảnh từ Firebase Storage
const products = [
  {
    title: "Tranh Gấu Ôm Hoa",
    description: "Tranh tô màu gấu dễ thương ôm hoa hồng, phù hợp cho người mới bắt đầu. Bộ tranh đầy đủ gồm khung canvas, bộ màu acrylic và cọ vẽ chuyên dụng.",
    category: "animals",
    price: 150000,
    imageUrl: "https://firebasestorage.googleapis.com/v0/b/paint-by-numbers-ai-607c4.firebasestorage.app/o/Products%2Fvn-11134207-7qukw-lhivm2cozyit44.webp?alt=media",
    thumbnailUrl: "https://firebasestorage.googleapis.com/v0/b/paint-by-numbers-ai-607c4.firebasestorage.app/o/Products%2Fvn-11134207-7qukw-lhivm2cozyit44.webp?alt=media",
    difficulty: "easy",
    dimensions: { width: 40, height: 50, unit: "cm" },
    colors: 24
  },
  {
    title: "Tranh Gấu Nâu",
    description: "Tranh gấu nâu đáng yêu với chi tiết sắc nét, thích hợp cho trẻ em và người lớn. Đã bao gồm tất cả dụng cụ cần thiết để hoàn thành tác phẩm.",
    category: "animals",
    price: 160000,
    imageUrl: "https://firebasestorage.googleapis.com/v0/b/paint-by-numbers-ai-607c4.firebasestorage.app/o/Products%2Fvn-11134207-7qukw-lhpux8ye0xxdfd.webp?alt=media",
    thumbnailUrl: "https://firebasestorage.googleapis.com/v0/b/paint-by-numbers-ai-607c4.firebasestorage.app/o/Products%2Fvn-11134207-7qukw-lhpux8ye0xxdfd.webp?alt=media",
    difficulty: "easy",
    dimensions: { width: 40, height: 50, unit: "cm" },
    colors: 20
  },
  {
    title: "Phong Cảnh Biển Hoàng Hôn",
    description: "Tranh phong cảnh biển lúc hoàng hôn, màu sắc rực rỡ. Bức tranh mang lại cảm giác thư giãn và bình yên cho không gian sống của bạn.",
    category: "landscape",
    price: 180000,
    imageUrl: "https://firebasestorage.googleapis.com/v0/b/paint-by-numbers-ai-607c4.firebasestorage.app/o/Products%2Fvn-11134207-7r98o-ll3aptopbjxy43.webp?alt=media",
    thumbnailUrl: "https://firebasestorage.googleapis.com/v0/b/paint-by-numbers-ai-607c4.firebasestorage.app/o/Products%2Fvn-11134207-7r98o-ll3aptopbjxy43.webp?alt=media",
    difficulty: "medium",
    dimensions: { width: 50, height: 60, unit: "cm" },
    colors: 36
  },
  {
    title: "Phong Cảnh Rừng Núi",
    description: "Tranh phong cảnh núi non hùng vĩ với rừng cây xanh mướt. Độ chi tiết cao phù hợp cho người có kinh nghiệm tô màu.",
    category: "landscape",
    price: 200000,
    imageUrl: "https://firebasestorage.googleapis.com/v0/b/paint-by-numbers-ai-607c4.firebasestorage.app/o/Products%2Fvn-11134207-7r98o-lobwjfn4i6x715.webp?alt=media",
    thumbnailUrl: "https://firebasestorage.googleapis.com/v0/b/paint-by-numbers-ai-607c4.firebasestorage.app/o/Products%2Fvn-11134207-7r98o-lobwjfn4i6x715.webp?alt=media",
    difficulty: "medium",
    dimensions: { width: 50, height: 60, unit: "cm" },
    colors: 32
  },
  {
    title: "Hoa Hồng Đỏ",
    description: "Bộ tranh hoa hồng đỏ tuyệt đẹp với chi tiết cánh hoa tinh xảo. Màu sắc tươi sáng, phù hợp làm quà tặng hoặc trang trí.",
    category: "flowers",
    price: 165000,
    imageUrl: "https://firebasestorage.googleapis.com/v0/b/paint-by-numbers-ai-607c4.firebasestorage.app/o/Products%2Fvn-11134207-7r98o-lpelucbhcr14.webp?alt=media",
    thumbnailUrl: "https://firebasestorage.googleapis.com/v0/b/paint-by-numbers-ai-607c4.firebasestorage.app/o/Products%2Fvn-11134207-7r98o-lpelucbhcr14.webp?alt=media",
    difficulty: "medium",
    dimensions: { width: 40, height: 50, unit: "cm" },
    colors: 28
  },
  {
    title: "Hoa Tulip Đỏ",
    description: "Tranh hoa tulip đỏ rực rỡ với nền trắng tao nhã. Thiết kế đơn giản nhưng đầy nghệ thuật, phù hợp với mọi lứa tuổi.",
    category: "flowers",
    price: 160000,
    imageUrl: "https://firebasestorage.googleapis.com/v0/b/paint-by-numbers-ai-607c4.firebasestorage.app/o/Products%2Fvn-11134207-7r98o-lpeclftajxwbc0.webp?alt=media",
    thumbnailUrl: "https://firebasestorage.googleapis.com/v0/b/paint-by-numbers-ai-607c4.firebasestorage.app/o/Products%2Fvn-11134207-7r98o-lpeclftajxwbc0.webp?alt=media",
    difficulty: "easy",
    dimensions: { width: 40, height: 50, unit: "cm" },
    colors: 18
  },
  {
    title: "Hoa Tulip Vàng",
    description: "Bức tranh hoa tulip vàng tươi sáng mang lại năng lượng tích cực. Chi tiết rõ ràng, dễ tô cho người mới bắt đầu.",
    category: "flowers",
    price: 160000,
    imageUrl: "https://firebasestorage.googleapis.com/v0/b/paint-by-numbers-ai-607c4.firebasestorage.app/o/Products%2Fvn-11134207-7r98o-lpeclftalgrgr5.webp?alt=media",
    thumbnailUrl: "https://firebasestorage.googleapis.com/v0/b/paint-by-numbers-ai-607c4.firebasestorage.app/o/Products%2Fvn-11134207-7r98o-lpeclftalgrgr5.webp?alt=media",
    difficulty: "easy",
    dimensions: { width: 40, height: 50, unit: "cm" },
    colors: 20
  },
  {
    title: "Bó Hoa Tulip Nhiều Màu",
    description: "Tranh bó hoa tulip đa sắc màu rực rỡ, tạo điểm nhấn cho không gian. Độ phức tạp trung bình với nhiều màu sắc phối hợp.",
    category: "flowers",
    price: 175000,
    imageUrl: "https://firebasestorage.googleapis.com/v0/b/paint-by-numbers-ai-607c4.firebasestorage.app/o/Products%2Fvn-11134207-7r98o-lpeclftao5lna5.webp?alt=media",
    thumbnailUrl: "https://firebasestorage.googleapis.com/v0/b/paint-by-numbers-ai-607c4.firebasestorage.app/o/Products%2Fvn-11134207-7r98o-lpeclftao5lna5.webp?alt=media",
    difficulty: "medium",
    dimensions: { width: 50, height: 60, unit: "cm" },
    colors: 30
  },
  {
    title: "Cung Điện Châu Âu",
    description: "Tranh kiến trúc cung điện châu Âu cổ kính và tráng lệ. Bức tranh phức tạp dành cho người có kinh nghiệm, với nhiều chi tiết kiến trúc tinh xảo.",
    category: "architecture",
    price: 220000,
    imageUrl: "https://firebasestorage.googleapis.com/v0/b/paint-by-numbers-ai-607c4.firebasestorage.app/o/Products%2Fvn-11134207-7r98o-lpeclftapk638e.webp?alt=media",
    thumbnailUrl: "https://firebasestorage.googleapis.com/v0/b/paint-by-numbers-ai-607c4.firebasestorage.app/o/Products%2Fvn-11134207-7r98o-lpeclftapk638e.webp?alt=media",
    difficulty: "hard",
    dimensions: { width: 60, height: 70, unit: "cm" },
    colors: 48
  },
  {
    title: "Núi Non Tuyết Phủ",
    description: "Tranh phong cảnh núi non phủ tuyết trắng hùng vĩ. Bức tranh mang đến cảm giác bình yên và thanh tĩnh cho không gian.",
    category: "landscape",
    price: 195000,
    imageUrl: "https://firebasestorage.googleapis.com/v0/b/paint-by-numbers-ai-607c4.firebasestorage.app/o/Products%2Fvn-11134207-7r98o-lsfn6f9n3ycf5.webp?alt=media",
    thumbnailUrl: "https://firebasestorage.googleapis.com/v0/b/paint-by-numbers-ai-607c4.firebasestorage.app/o/Products%2Fvn-11134207-7r98o-lsfn6f9n3ycf5.webp?alt=media",
    difficulty: "medium",
    dimensions: { width: 50, height: 60, unit: "cm" },
    colors: 34
  },
  {
    title: "Núi Non Hùng Vĩ",
    description: "Tranh dãy núi hùng vĩ với thiên nhiên hoang sơ. Thích hợp trang trí phòng khách, văn phòng với phong cách hiện đại.",
    category: "landscape",
    price: 200000,
    imageUrl: "https://firebasestorage.googleapis.com/v0/b/paint-by-numbers-ai-607c4.firebasestorage.app/o/Products%2Fvn-11134207-7r98o-lsfn6f9xqd4fd.webp?alt=media",
    thumbnailUrl: "https://firebasestorage.googleapis.com/v0/b/paint-by-numbers-ai-607c4.firebasestorage.app/o/Products%2Fvn-11134207-7r98o-lsfn6f9xqd4fd.webp?alt=media",
    difficulty: "medium",
    dimensions: { width: 50, height: 60, unit: "cm" },
    colors: 32
  },
  {
    title: "Phong Cảnh Sông Núi",
    description: "Tranh phong cảnh sông núi thơ mộng với màu sắc hài hòa. Độ khó vừa phải, phù hợp cho người đã có chút kinh nghiệm tô màu.",
    category: "landscape",
    price: 185000,
    imageUrl: "https://firebasestorage.googleapis.com/v0/b/paint-by-numbers-ai-607c4.firebasestorage.app/o/Products%2Fvn-11134207-7r98o-ky1ujdlcrnvd5a.webp?alt=media",
    thumbnailUrl: "https://firebasestorage.googleapis.com/v0/b/paint-by-numbers-ai-607c4.firebasestorage.app/o/Products%2Fvn-11134207-7r98o-ky1ujdlcrnvd5a.webp?alt=media",
    difficulty: "medium",
    dimensions: { width: 50, height: 60, unit: "cm" },
    colors: 30
  }
];

console.log('📝 Tạo file products.json để import thủ công vào Firestore...\n');

// Xuất ra JSON file
import fs from 'fs';

const productsWithTimestamp = products.map(p => ({
  ...p,
  status: 'active',
  sales: Math.floor(Math.random() * 150) + 30,
  rating: (Math.random() * 0.5 + 4.5).toFixed(1),
  reviews: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
}));

fs.writeFileSync(
  path.join(__dirname, 'products-seed-data.json'),
  JSON.stringify(productsWithTimestamp, null, 2)
);

console.log('✅ Đã tạo file: scripts/products-seed-data.json');
console.log(`📊 Tổng số: ${products.length} products`);
console.log('\n📋 Thống kê:');
console.log(`   - Animals: ${products.filter(p => p.category === 'animals').length}`);
console.log(`   - Landscape: ${products.filter(p => p.category === 'landscape').length}`);
console.log(`   - Flowers: ${products.filter(p => p.category === 'flowers').length}`);
console.log(`   - Architecture: ${products.filter(p => p.category === 'architecture').length}`);
console.log('\n💡 HƯỚNG DẪN IMPORT VÀO FIRESTORE:');
console.log('1. Truy cập: https://console.firebase.google.com/project/paint-by-numbers-ai-607c4/firestore');
console.log('2. Click "Start collection" → Tên collection: "products"');
console.log('3. Thêm từng document bằng cách copy/paste từ file JSON');
console.log('4. Hoặc sử dụng Firebase CLI: firebase firestore:delete --all-collections');
console.log('5. Rồi import: firebase firestore:restore scripts/products-seed-data.json\n');
