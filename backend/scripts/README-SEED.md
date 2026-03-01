# 🌱 HƯỚNG DẪN SEED PRODUCTS VÀO FIRESTORE

Đã tạo sẵn **12 products** với ảnh thật từ Firebase Storage.

## 📁 Files đã tạo

- ✅ `products-seed-data.json` - Dữ liệu 12 products (JSON format)
- ✅ `seed-via-api.ps1` - Script PowerShell tự động seed qua API
- ✅ `generate-seed-json.js` - Script tạo JSON file
- ✅ `README-SEED.md` - File hướng dẫn này

---

## 🚀 CÁCH 1: Thêm thủ công qua Firebase Console (KHUYẾN NGHỊ)

**Thời gian:** ~5-10 phút

### Bước 1: Mở Firestore Console
Truy cập: [Firebase Firestore Console](https://console.firebase.google.com/project/paint-by-numbers-ai-607c4/firestore)

### Bước 2: Tạo collection (nếu chưa có)
- Click **"Start collection"**
- Collection ID: `products`
- Click **Next**

### Bước 3: Thêm từng product
1. Click **"Add document"**
2. Document ID: Chọn **"Auto-ID"**
3. Mở file `products-seed-data.json`
4. Copy JSON của 1 product (từ `{` đến `}`)
5. Click vào tab **"Import"** hoặc paste thủ công vào form
6. Click **"Save"**
7. Lặp lại cho 12 products

### 📋 Danh sách 12 products:

| # | Tên sản phẩm | Giá | Category | Độ khó | Màu |
|---|-------------|-----|----------|--------|-----|
| 1 | Tranh Gấu Ôm Hoa | 150,000₫ | animals | easy | 24 |
| 2 | Tranh Gấu Nâu | 160,000₫ | animals | easy | 20 |
| 3 | Phong Cảnh Biển Hoàng Hôn | 180,000₫ | landscape | medium | 36 |
| 4 | Phong Cảnh Rừng Núi | 200,000₫ | landscape | medium | 32 |
| 5 | Hoa Hồng Đỏ | 165,000₫ | flowers | medium | 28 |
| 6 | Hoa Tulip Đỏ | 160,000₫ | flowers | easy | 18 |
| 7 | Hoa Tulip Vàng | 160,000₫ | flowers | easy | 20 |
| 8 | Bó Hoa Tulip Nhiều Màu | 175,000₫ | flowers | medium | 30 |
| 9 | Cung Điện Châu Âu | 220,000₫ | architecture | hard | 48 |
| 10 | Núi Non Tuyết Phủ | 195,000₫ | landscape | medium | 34 |
| 11 | Núi Non Hùng Vĩ | 200,000₫ | landscape | medium | 32 |
| 12 | Phong Cảnh Sông Núi | 185,000₫ | landscape | medium | 30 |

---

## ⚡ CÁCH 2: Tự động seed qua API

**Yêu cầu:** 
- Backend đang chạy (`npm start` trong thư mục backend)
- Có tài khoản admin: `baody613@gmail.com`

### Chạy script:

**Cách A: Dùng Auth Token (KHUYẾN NGHỊ - dễ hơn)**

1. Đăng nhập vào frontend: http://localhost:3000/login
2. Mở DevTools (F12) > Application > Local Storage
3. Copy giá trị của `authToken`
4. Chạy:

```powershell
cd backend
.\scripts\seed-simple.ps1 "YOUR_AUTH_TOKEN_HERE"
```

**Cách B: Dùng mật khẩu (tự động login)**

```powershell
cd backend
.\scripts\seed-via-api.ps1
# Nhập mật khẩu khi được hỏi
```

Script sẽ:
1. ✅ Đăng nhập với tài khoản admin (hoặc dùng token có sẵn)
2. ✅ Gọi API `/api/admin/products` để tạo từng product
3. ✅ Hiển thị progress và kết quả

---

## 🔍 KIỂM TRA SAU KHI SEED

### 1. Kiểm tra qua API
```powershell
(Invoke-WebRequest -Uri "http://localhost:3001/api/products" -UseBasicParsing).Content | ConvertFrom-Json
```

Kết quả mong đợi:
```json
{
  "success": true,
  "data": {
    "products": [...12 products...],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 12,
      "totalPages": 1
    }
  }
}
```

### 2. Xem trên Frontend
Truy cập: http://localhost:3000/gallery

Sẽ hiển thị 12 sản phẩm với:
- ✅ Ảnh thật từ Firebase Storage
- ✅ Thông tin đầy đủ (title, price, category, difficulty)
- ✅ Có thể filter, sort
- ✅ Thêm vào giỏ hàng được

### 3. Kiểm tra Firestore
Truy cập: https://console.firebase.google.com/project/paint-by-numbers-ai-607c4/firestore

Sẽ thấy collection `products` với 12 documents

---

## 📊 THỐNG KÊ DỮ LIỆU

### Theo Category:
- 🐻 **Animals:** 2 products (17%)
- 🏔️ **Landscape:** 5 products (42%)
- 🌸 **Flowers:** 4 products (33%)
- 🏛️ **Architecture:** 1 product (8%)

### Theo Độ khó:
- 🟢 **Easy:** 5 products (42%)
- 🟡 **Medium:** 6 products (50%)
- 🔴 **Hard:** 1 product (8%)

### Giá:
- **Thấp nhất:** 150,000₫
- **Cao nhất:** 220,000₫
- **Trung bình:** ~177,500₫

---

## ❓ XỬ LÝ LỖI

### Lỗi: "Request had invalid authentication credentials"
**Nguyên nhân:** Firebase Admin SDK credentials không đúng

**Giải pháp:**
1. Sử dụng **CÁCH 1** (thêm thủ công)
2. Hoặc kiểm tra lại `.env`:
   - `FIREBASE_PROJECT_ID`
   - `FIREBASE_PRIVATE_KEY`
   - `FIREBASE_CLIENT_EMAIL`

### Lỗi: "Cannot connect to localhost:3001"
**Nguyên nhân:** Backend chưa chạy

**Giải pháp:**
```powershell
cd backend
npm start
```

### Lỗi: "Unauthorized"
**Nguyên nhân:** Tài khoản không phải admin

**Giải pháp:**
- Sử dụng tài khoản: `baody613@gmail.com`
- Hoặc thêm email vào file `lib/adminConfig.ts`

---

## 💡 GHI CHÚ

- Tất cả ảnh đều từ **Firebase Storage** (thư mục `Products/`)
- URL ảnh: `https://firebasestorage.googleapis.com/v0/b/paint-by-numbers-ai-607c4.firebasestorage.app/o/Products%2F...`
- Mỗi product có:
  - `title`, `description`
  - `category`, `difficulty`
  - `price` (VND)
  - `imageUrl`, `thumbnailUrl`
  - `dimensions` (object: width, height, unit)
  - `colors` (số màu)
  - `status`, `sales`, `rating`
  - `createdAt`, `updatedAt`

---

## 🎯 NEXT STEPS

Sau khi seed xong:

1. ✅ Test Gallery page: http://localhost:3000/gallery
2. ✅ Test Product Detail page
3. ✅ Test Add to Cart
4. ✅ Test Admin Products Management: http://localhost:3000/admin/products
5. ✅ Deploy lên Render/Vercel

---

**Created:** January 30, 2026  
**Products:** 12 items  
**Images:** Firebase Storage  
**Format:** JSON
