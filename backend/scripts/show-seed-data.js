/**
 * HƯỚNG DẪN SEED PRODUCTS VÀO FIRESTORE
 * 
 * Do Firebase credentials bị lỗi, bạn có 2 cách:
 * 
 * CÁCH 1: Import thủ công qua Firebase Console (KHUYẾN NGHỊ)
 * 1. Mở file: backend/scripts/products-seed-data.json
 * 2. Truy cập: https://console.firebase.google.com/project/paint-by-numbers-ai-607c4/firestore
 * 3. Click "Start collection" hoặc vào collection "products" nếu đã tồn tại
 * 4. Click "Add document"
 * 5. Chọn "Auto-ID" cho Document ID
 * 6. Copy từng object trong file JSON và dán vào form
 * 7. Lặp lại cho tất cả 12 products
 * 
 * CÁCH 2: Sử dụng Admin API (cần đăng nhập)
 * 1. Đảm bảo backend đang chạy: npm start
 * 2. Đăng nhập với tài khoản admin: baody613@gmail.com
 * 3. Lấy token từ localStorage hoặc sessionStorage
 * 4. Chạy: node scripts/seed-via-api.js <YOUR_AUTH_TOKEN>
 * 
 * CÁCH 3: Sử dụng Firebase Tools CLI
 * 1. Cài đặt: npm install -g firebase-tools
 * 2. Đăng nhập: firebase login
 * 3. Import: firebase firestore:import scripts/firestore-backup --project paint-by-numbers-ai-607c4
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Đọc dữ liệu products
const productsData = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'products-seed-data.json'), 'utf-8')
);

console.log('\n📦 DỮLIỆU PRODUCTS ĐÃ SẴN SÀNG\n');
console.log(`Tổng số products: ${productsData.length}`);
console.log('\nDanh sách products:\n');

productsData.forEach((product, index) => {
  console.log(`${index + 1}. ${product.title}`);
  console.log(`   Category: ${product.category}`);
  console.log(`   Price: ${product.price.toLocaleString('vi-VN')}₫`);
  console.log(`   Difficulty: ${product.difficulty}`);
  console.log(`   Image: ${product.imageUrl.substring(0, 80)}...`);
  console.log('');
});

console.log('\n✨ CÁCH NHANH NHẤT: COPY/PASTE VÀO FIREBASE CONSOLE\n');
console.log('1. Truy cập: https://console.firebase.google.com/project/paint-by-numbers-ai-607c4/firestore');
console.log('2. Tạo collection "products" (nếu chưa có)');
console.log('3. Click "Add document"');
console.log('4. Copy JSON của từng product bên dưới:\n');
console.log('='.repeat(80));

// In ra từng product để dễ copy
productsData.forEach((product, index) => {
  console.log(`\n// Product ${index + 1}: ${product.title}`);
  console.log(JSON.stringify(product, null, 2));
  console.log('='.repeat(80));
});

console.log('\n\n💡 TIP: Bạn cũng có thể mở file JSON trực tiếp:');
console.log(`   File: ${path.join(__dirname, 'products-seed-data.json')}`);
console.log('\n');
