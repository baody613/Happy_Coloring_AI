ư# HƯỚNG DẪN THÊM DỮ LIỆU VÀO FIRESTORE

## Bước 1: Vào Firestore Database

1. Mở Firebase Console: https://console.firebase.google.com
2. Chọn project: `paint-by-numbers-ai-607c4`
3. Click vào **Firestore Database** ở menu bên trái
4. Click **Start collection**

## Bước 2: Tạo Collection "products"

1. Collection ID: `products`
2. Click **Next**

## Bước 3: Thêm Documents (Sản phẩm)

### Sản phẩm 1: Tranh Gấu Dễ Thương

```
Document ID: [Auto-ID]

Fields:
title (string): "Tranh Gấu Ôm Hoa"
description (string): "Tranh tô màu gấu dễ thương ôm hoa hồng, phù hợp cho người mới bắt đầu"
category (string): "animals"
price (number): 150000
imageUrl (string): "https://firebasestorage.googleapis.com/v0/b/paint-by-numbers-ai-607c4.firebasestorage.app/o/Products%2Fvn-11134207-7qukw-lhivm2cozyit44.webp?alt=media"
thumbnailUrl (string): "https://firebasestorage.googleapis.com/v0/b/paint-by-numbers-ai-607c4.firebasestorage.app/o/Products%2Fvn-11134207-7qukw-lhivm2cozyit44.webp?alt=media"
difficulty (string): "easy"
colors (number): 24
status (string): "active"
sales (number): 120
rating (number): 4.8
createdAt (string): "2026-01-08T00:00:00.000Z"
updatedAt (string): "2026-01-08T00:00:00.000Z"
```

### Sản phẩm 2: Tranh Biển

```
Document ID: [Auto-ID]

Fields:
title (string): "Phong Cảnh Biển Hoàng Hôn"
description (string): "Tranh phong cảnh biển lúc hoàng hôn, màu sắc rực rỡ"
category (string): "landscape"
price (number): 180000
imageUrl (string): "https://firebasestorage.googleapis.com/v0/b/paint-by-numbers-ai-607c4.firebasestorage.app/o/Products%2Fvn-11134207-7r98o-ll3aptopbjxy43.webp?alt=media"
thumbnailUrl (string): "https://firebasestorage.googleapis.com/v0/b/paint-by-numbers-ai-607c4.firebasestorage.app/o/Products%2Fvn-11134207-7r98o-ll3aptopbjxy43.webp?alt=media"
difficulty (string): "medium"
colors (number): 36
status (string): "active"
sales (number): 85
rating (number): 4.9
createdAt (string): "2026-01-08T00:00:00.000Z"
updatedAt (string): "2026-01-08T00:00:00.000Z"
```

### Sản phẩm 3: Tranh Hoa

```
Document ID: [Auto-ID]

Fields:
title (string): "Hoa Tulip Đỏ"
description (string): "Bộ tranh hoa tulip đỏ tuyệt đẹp, chi tiết sắc nét"
category (string): "flowers"
price (number): 160000
imageUrl (string): "https://firebasestorage.googleapis.com/v0/b/paint-by-numbers-ai-607c4.firebasestorage.app/o/Products%2Fvn-11134207-7r98o-lpeclftalgrgr5.webp?alt=media"
thumbnailUrl (string): "https://firebasestorage.googleapis.com/v0/b/paint-by-numbers-ai-607c4.firebasestorage.app/o/Products%2Fvn-11134207-7r98o-lpeclftalgrgr5.webp?alt=media"
difficulty (string): "medium"
colors (number): 30
status (string): "active"
sales (number): 95
rating (number): 4.7
createdAt (string): "2026-01-08T00:00:00.000Z"
updatedAt (string): "2026-01-08T00:00:00.000Z"
```

### Sản phẩm 4: Tranh Cung Điện

```
Document ID: [Auto-ID]

Fields:
title (string): "Cung Điện Châu Âu"
description (string): "Tranh kiến trúc cung điện châu Âu cổ kính và tráng lệ"
category (string): "architecture"
price (number): 220000
imageUrl (string): "https://firebasestorage.googleapis.com/v0/b/paint-by-numbers-ai-607c4.firebasestorage.app/o/Products%2Fvn-11134207-7r98o-lpeclftapk638e.webp?alt=media"
thumbnailUrl (string): "https://firebasestorage.googleapis.com/v0/b/paint-by-numbers-ai-607c4.firebasestorage.app/o/Products%2Fvn-11134207-7r98o-lpeclftapk638e.webp?alt=media"
difficulty (string): "hard"
colors (number): 48
status (string): "active"
sales (number): 45
rating (number): 4.6
createdAt (string): "2026-01-08T00:00:00.000Z"
updatedAt (string): "2026-01-08T00:00:00.000Z"
```

### Sản phẩm 5: Tranh Phong Cảnh

```
Document ID: [Auto-ID]

Fields:
title (string): "Núi Non Hùng Vĩ"
description (string): "Tranh phong cảnh núi non tuyệt đẹp, thích hợp trang trí phòng khách"
category (string): "landscape"
price (number): 200000
imageUrl (string): "https://firebasestorage.googleapis.com/v0/b/paint-by-numbers-ai-607c4.firebasestorage.app/o/Products%2Fvn-11134207-7r98o-lsfn6f9xqd4fd.webp?alt=media"
thumbnailUrl (string): "https://firebasestorage.googleapis.com/v0/b/paint-by-numbers-ai-607c4.firebasestorage.app/o/Products%2Fvn-11134207-7r98o-lsfn6f9xqd4fd.webp?alt=media"
difficulty (string): "medium"
colors (number): 32
status (string): "active"
sales (number): 78
rating (number): 4.8
createdAt (string): "2026-01-08T00:00:00.000Z"
updatedAt (string): "2026-01-08T00:00:00.000Z"
```

## Bước 4: Lưu và Kiểm tra

1. Click **Save** sau khi thêm mỗi document
2. Tiếp tục thêm các sản phẩm còn lại
3. Sau khi thêm xong, test API:
   - Truy cập: http://localhost:3001/api/products
   - Kiểm tra frontend: http://localhost:3000/gallery

## Tips:

- Có thể copy/paste các fields để thêm nhanh
- Thay đổi imageUrl cho phù hợp với ảnh bạn đã upload
- Có thể dùng file ảnh bất kỳ trong Storage/Products folder
