"""
HƯỚNG DẪN SEED PRODUCTS VÀO FIRESTORE

Đã tạo sẵn 12 products với ảnh từ Firebase Storage trong file:
📄 backend/scripts/products-seed-data.json

════════════════════════════════════════════════════════════════

CÁCH 1: THÊM THỦ CÔNG QUA FIREBASE CONSOLE (NHANH NHẤT - 5 phút)

1. Truy cập: https://console.firebase.google.com/project/paint-by-numbers-ai-607c4/firestore

2. Click nút "Start collection" (nếu chưa có) hoặc mở collection "products"

3. Thêm từng product:
   - Click "Add document"
   - Document ID: Chọn "Auto-ID"
   - Copy JSON từ file products-seed-data.json
   - Paste vào form (Firebase tự convert)
   - Click "Save"
   
4. Lặp lại cho 12 products

📋 DANH SÁCH PRODUCTS:
  1. Tranh Gấu Ôm Hoa (150,000₫) - animals, easy
  2. Tranh Gấu Nâu (160,000₫) - animals, easy
  3. Phong Cảnh Biển Hoàng Hôn (180,000₫) - landscape, medium
  4. Phong Cảnh Rừng Núi (200,000₫) - landscape, medium
  5. Hoa Hồng Đỏ (165,000₫) - flowers, medium
  6. Hoa Tulip Đỏ (160,000₫) - flowers, easy
  7. Hoa Tulip Vàng (160,000₫) - flowers, easy
  8. Bó Hoa Tulip Nhiều Màu (175,000₫) - flowers, medium
  9. Cung Điện Châu Âu (220,000₫) - architecture, hard
 10. Núi Non Tuyết Phủ (195,000₫) - landscape, medium
 11. Núi Non Hùng Vĩ (200,000₫) - landscape, medium
 12. Phong Cảnh Sông Núi (185,000₫) - landscape, medium

════════════════════════════════════════════════════════════════

CÁCH 2: SỬ DỤNG SCRIPT POWERSHELL (TỰ ĐỘNG)

Điều kiện: Đã có tài khoản admin (baody613@gmail.com)

Chạy lệnh:
  cd backend
  powershell -ExecutionPolicy Bypass -File scripts/seed-via-api.ps1

Script sẽ:
  - Đăng nhập với tài khoản admin
  - Tự động thêm 12 products qua Admin API
  - Hiển thị kết quả

════════════════════════════════════════════════════════════════

SAU KHI SEED XONG:

✅ Kiểm tra API:
   http://localhost:3001/api/products

✅ Xem trên Frontend:
   http://localhost:3000/gallery

✅ Kiểm tra Firestore:
   https://console.firebase.google.com/project/paint-by-numbers-ai-607c4/firestore

════════════════════════════════════════════════════════════════

📊 THỐNG KÊ DỮ LIỆU:
  - Animals: 2 products
  - Landscape: 5 products  
  - Flowers: 4 products
  - Architecture: 1 product
  
  Tổng cộng: 12 products
  Giá từ: 150,000₫ - 220,000₫
  Độ khó: easy (5), medium (6), hard (1)

"""

print(__doc__)
