# 📘 Hướng Dẫn Tự Thêm Sản Phẩm Vào Website

## 🎯 Cách Thêm Sản Phẩm Mới (Tự Động)

### **Bước 1: Chuẩn bị ảnh**

1. Lưu ảnh sản phẩm vào: `frontend/public/images/Products/`
2. Đặt tên file có ý nghĩa (VD: `phong-canh-hoang-hon.webp`, `doraemon.webp`)
3. Format ảnh: `.jpg`, `.png`, `.webp`, `.gif`
4. Kích thước đề xuất: 800x800px hoặc tỉ lệ 1:1

### **Bước 2: Chạy script sync**

Mở PowerShell trong thư mục project:

```powershell
# Di chuyển vào thư mục backend
cd backend

# Chạy script tự động tạo sản phẩm từ ảnh
node scripts/sync-local-products.js
```

Script sẽ:

- ✅ Quét tất cả ảnh trong `frontend/public/images/Products/`
- ✅ Tự động tạo tên sản phẩm từ tên file
- ✅ Random category, độ khó, số màu, giá
- ✅ Tạo description tự động
- ✅ Thêm vào Firestore database
- ✅ Bỏ qua ảnh đã tồn tại (không duplicate)

### **Bước 3: Xem kết quả**

Refresh trang gallery: http://localhost:3000/gallery

---

## 🔥 Xem Danh Sách Sản Phẩm Hiện Tại

```powershell
cd backend
node scripts/show-seed-data.js
```

---

## 🗑️ Xóa Sản Phẩm Không Cần

### Xóa sản phẩm từ Firebase Storage:

```powershell
cd backend
node scripts/clean-firebase-products.js
```

### Xóa tất cả sản phẩm:

```javascript
// Tạo file: backend/scripts/delete-all-products.js
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
  const snapshot = await db.collection("products").get();
  console.log(`🗑️  Deleting ${snapshot.size} products...`);

  const batch = db.batch();
  snapshot.docs.forEach((doc) => batch.delete(doc.ref));
  await batch.commit();

  console.log("✅ All products deleted!");
}

deleteAllProducts().catch(console.error);
```

Chạy: `node scripts/delete-all-products.js`

---

## ⚙️ Tùy Chỉnh Sản Phẩm

### Sửa thông tin tự động:

Mở file: `backend/scripts/sync-local-products.js`

```javascript
// Dòng 101-107: Thay đổi category
function getRandomCategory() {
  const categories = [
    "Động vật", // Thêm/xóa category ở đây
    "Thiên nhiên",
    "Phong cảnh",
    // ... thêm category mới
  ];
  return categories[Math.floor(Math.random() * categories.length)];
}

// Dòng 80-82: Thay đổi giá
function generatePrice(min = 150000, max = 500000) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
```

---

## 📝 Thêm Sản Phẩm Thủ Công (Qua Admin Panel)

### Tính năng đang phát triển!

Hiện tại sử dụng script, sau này sẽ có:

1. Admin Dashboard → Products → Add New
2. Form upload ảnh + điền thông tin
3. Auto-save vào Firestore

---

## 🚀 Quick Commands

```powershell
# 1. Thêm sản phẩm mới từ ảnh
cd backend
node scripts/sync-local-products.js

# 2. Xem danh sách
node scripts/show-seed-data.js

# 3. Xóa sản phẩm Firebase Storage
node scripts/clean-firebase-products.js

# 4. Test API
curl http://localhost:3001/api/products
```

---

## 💡 Tips

- **Tên file ảnh** ảnh hưởng đến tên sản phẩm (VD: `canh-chieu.webp` → "Canh Chieu")
- **Format ảnh**: Dùng `.webp` để tối ưu dung lượng
- **Kích thước**: 800x800px để load nhanh
- **Số lượng**: Không giới hạn, nhưng nên < 1000 sản phẩm
- **Update**: Chỉnh sửa file ảnh → xóa sản phẩm cũ → chạy lại script

---

## ❓ Troubleshooting

### Lỗi: "Firebase credentials not found"

```powershell
# Kiểm tra file .env trong backend/
cd backend
cat .env | Select-String "FIREBASE"
```

### Sản phẩm không hiển thị

1. Kiểm tra console.log trong browser (F12)
2. Test API: `Invoke-WebRequest http://localhost:3001/api/products`
3. Refresh cache: Ctrl + Shift + R

### Ảnh không load

- Đảm bảo file tồn tại: `frontend/public/images/Products/ten-file.webp`
- Kiểm tra đường dẫn trong database: phải là `/images/Products/ten-file.webp`
- Clear Next.js cache: Xóa folder `frontend/.next/`

---

## 📞 Support

Nếu gặp vấn đề, check:

1. Backend server đang chạy: http://localhost:3001/api/health
2. Firebase connection: Xem console log khi start backend
3. Image path: Debug trong gallery page console

Happy Painting! 🎨
