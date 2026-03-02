# 🗑️ Hướng Dẫn Xóa Sản Phẩm

## 📋 Các Cách Xóa Sản Phẩm

### **1. Xem Danh Sách Sản Phẩm Hiện Có**

```powershell
cd backend
node scripts/show-seed-data.js
```

Sẽ hiển thị tất cả sản phẩm với ID, tên, category, giá...

---

### **2. Xóa Tất Cả Sản Phẩm** ⚠️

```powershell
cd backend
node scripts/delete-all-products.js
```

**Cảnh báo:** Lệnh này xóa 100% sản phẩm trong database!

---

### **3. Xóa Sản Phẩm Theo ID**

```powershell
cd backend

# Xóa 1 sản phẩm
node scripts/delete-products.js abc123def456

# Xóa nhiều sản phẩm
node scripts/delete-products.js id1 id2 id3
```

**Lấy ID từ đâu?**

- Chạy `node scripts/show-seed-data.js` để xem ID
- Hoặc xem trong console log khi sync sản phẩm
- Hoặc xem trong Firestore Console

---

### **4. Xóa Sản Phẩm Theo Tên**

```powershell
cd backend

# Xóa sản phẩm có tên "Doraemon"
node scripts/delete-products.js title:"Doraemon"

# Xóa nhiều theo tên
node scripts/delete-products.js title:"Doraemon" title:"Shinosuke"
```

---

### **5. Xóa Sản Phẩm Có Ảnh Firebase Storage**

```powershell
cd backend
node scripts/clean-firebase-products.js
```

Xóa tất cả sản phẩm có URL ảnh từ Firebase Storage (storage.googleapis.com)

---

## 🔍 Xóa Sản Phẩm Qua Firestore Console (Giao diện)

### **Bước 1:** Truy cập Firebase Console

```
https://console.firebase.google.com/project/paint-by-numbers-ai-607c4/firestore
```

### **Bước 2:** Vào collection `products`

### **Bước 3:**

- Click vào document muốn xóa
- Click nút 3 chấm ⋮
- Chọn "Delete document"

---

## 📝 Ví Dụ Thực Tế

### Ví dụ 1: Xem trước rồi xóa

```powershell
# Bước 1: Xem danh sách
node scripts/show-seed-data.js

# Bước 2: Copy ID của sản phẩm muốn xóa
# VD: "38kzvFtoXi8k9cviYYKn"

# Bước 3: Xóa
node scripts/delete-products.js 38kzvFtoXi8k9cviYYKn
```

### Ví dụ 2: Xóa tất cả rồi thêm mới

```powershell
# Xóa hết
node scripts/delete-all-products.js

# Thêm lại từ ảnh
node scripts/sync-local-products.js
```

### Ví dụ 3: Xóa theo tên

```powershell
# Xóa tất cả sản phẩm "em bé"
node scripts/delete-products.js title:"em bé"
```

---

## 🛡️ Lưu Ý Quan Trọng

### ⚠️ Không thể hoàn tác

- Khi xóa khỏi Firestore = **mất vĩnh viễn**
- Không có thùng rác để phục hồi
- Hãy chắc chắn trước khi xóa!

### 💾 Backup trước khi xóa

```powershell
# Export danh sách ra file
node scripts/show-seed-data.js > backup-products.txt
```

### 🖼️ Xóa ảnh trong thư mục

Nếu xóa sản phẩm, nhớ xóa ảnh tương ứng:

```
frontend/public/images/Products/
```

Hoặc để nguyên, script `sync-local-products.js` sẽ bỏ qua ảnh đã có sản phẩm.

---

## 🔄 Workflow Đề Xuất

### Khi muốn làm sạch database:

1. **Backup:**

   ```powershell
   node scripts/show-seed-data.js > backup.txt
   ```

2. **Xóa sản phẩm không cần:**

   ```powershell
   node scripts/delete-products.js title:"Tên sản phẩm không cần"
   ```

3. **Xác nhận:**

   ```powershell
   node scripts/show-seed-data.js
   ```

4. **Thêm sản phẩm mới (nếu cần):**
   ```powershell
   node scripts/sync-local-products.js
   ```

---

## 💡 Tips

- **Xóa nhanh:** Dùng `delete-all-products.js` nếu muốn reset hoàn toàn
- **Xóa chọn lọc:** Dùng `delete-products.js` với ID hoặc tên
- **Xóa theo loại:** Dùng `clean-firebase-products.js` cho ảnh Firebase
- **Verify:** Luôn chạy `show-seed-data.js` sau khi xóa để kiểm tra

---

## 📞 Debug

### Script không chạy?

```powershell
# Kiểm tra Firebase credentials
cd backend
node -e "console.log(process.env.FIREBASE_PROJECT_ID)"
```

### Không tìm thấy sản phẩm?

- Check tên chính xác (case-sensitive)
- Dùng Firestore Console để verify
- Xem log khi chạy script

---

**Chúc bạn quản lý sản phẩm hiệu quả!** 🎨
