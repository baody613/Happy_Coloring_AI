# Hướng Dẫn Thêm Hình Ảnh

Thư mục này chứa 2 hình ảnh hướng dẫn hiển thị trong modal chi tiết sản phẩm:

## Yêu cầu:

1. **phu-kien-treo-tranh.jpg** 
   - Hình ảnh về phụ kiện đi kèm hộp tranh (đinh 3 chân, bộ định vị treo tranh, son bông đệ quét)
   - Kích thước đề xuất: 800x800px hoặc tỉ lệ 1:1
   - Format: JPG, PNG, hoặc WEBP

2. **huong-dan-to-mau.jpg**
   - Hình ảnh hướng dẫn cách tô màu tranh (6 bước từ tìm màu đến hoàn thiện)
   - Kích thước đề xuất: 800x800px hoặc tỉ lệ 1:1
   - Format: JPG, PNG, hoặc WEBP

## Cách thêm:

1. Lưu 2 hình ảnh của bạn vào thư mục này
2. Đổi tên theo đúng tên file trên HOẶC
3. Cập nhật đường dẫn trong file: `frontend/src/app/gallery/page.tsx` (tìm `/images/guides/`)

Nếu chưa có hình, hệ thống sẽ hiển thị placeholder màu xanh lá (phụ kiện) và màu hồng (hướng dẫn).
