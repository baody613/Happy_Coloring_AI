# Danh sách các hình ảnh và nội dung giải thích chi tiết (Figure Explanations)

Tài liệu này cung cấp phần giải thích chi tiết (explanation) cho từng hình ảnh/biểu đồ được tham chiếu trong báo cáo (BaoCao.md).

---

## Figure 1.1

**Tên hình/mô tả:** Screenshot of the Happy Coloring AI homepage (hero section)

**Hướng dẫn chụp/vẽ chi tiết:**
**Vị trí:** Trang chủ (`/`).
**Cách chụp/Vẽ:** Chụp phần trên cùng màn hình (Hero section) thấy rõ tiêu đề lớn 'Color with Pure Elegance' và các nút kêu gọi hành động (Call-to-Action).

**Giải thích chi tiết (Explanation):**
This figure visually illustrates the screenshot of the happy coloring ai homepage (hero section). It serves to highlight the specific UI layout, system architecture, or logical sequence mapped for this section of the project. Specifically, it demonstrates how the various components interact with each other and provides a clear visual reference for the concepts discussed in the surrounding text.

---

## Figure 2.1

**Tên hình/mô tả:** Use Case Diagram showing interactions between User, Admin, and System

**Hướng dẫn chụp/vẽ chi tiết:**
**Vị trí:** Công cụ vẽ biểu đồ (Draw.io, Lucidchart, v.v.).
**Cách chụp/Vẽ:** Xuất file ảnh sơ đồ Use Case bao phủ các nhóm tính năng của Khách hàng, Quản trị viên và Hệ thống.

**Giải thích chi tiết (Explanation):**
This figure visually illustrates the use case diagram showing interactions between user, admin, and system. It serves to highlight the specific UI layout, system architecture, or logical sequence mapped for this section of the project. Specifically, it demonstrates how the various components interact with each other and provides a clear visual reference for the concepts discussed in the surrounding text.

---

## Figure 3.1

**Tên hình/mô tả:** System Architecture Diagram (three-tier overview)

**Hướng dẫn chụp/vẽ chi tiết:**
**Vị trí:** Công cụ vẽ biểu đồ Draw.io ([app.diagrams.net](https://app.diagrams.net/)).
**Cách chụp/Vẽ:** Tạo một sơ đồ khối (Block Diagram) chia làm 3 cụm lớn (dùng hình chữ nhật lớn có nét đứt bao quanh):

1. **Client Tier (Vercel):** Đặt các khối Web Browser, Next.js 14 App Router, Zustand State.
2. **Server Tier (Render Cloud):** Đặt các khối Node.js + Express API, JWT Auth Middleware. Kéo mũi tên kết nối từ Next.js xuống Express (ghi "HTTPS / REST API").
3. **Data/Service Tier (Google Cloud):** Chia nhỏ làm 2 cụm là _Firebase Platform_ (Auth, Firestore, Storage) và _Google Gemini API_. Kéo mũi tên từ Express qua các dịch vụ này (ghi "Firebase Admin SDK" hoặc "Axios HTTP").

**Giải thích chi tiết (Explanation):**
This figure visually illustrates the system architecture diagram (three-tier overview). It serves to highlight the specific UI layout, system architecture, or logical sequence mapped for this section of the project. Specifically, it demonstrates how the various components interact with each other and provides a clear visual reference for the concepts discussed in the surrounding text.

---

## Figure 3.2

**Tên hình/mô tả:** Authentication sequence diagram: Firebase Auth SDK → JWT issuance → Backend middleware verification

**Hướng dẫn chụp/vẽ chi tiết:**
**Vị trí:** Công cụ vẽ biểu đồ Sequence.
**Cách chụp/Vẽ:** Vẽ sơ đồ chuỗi thứ tự các bước khi User đăng nhập (Firebase nhận email/pass -> tạo JWT -> Backend xác thực JWT bằng Admin SDK).

**Giải thích chi tiết (Explanation):**
This figure visually illustrates the authentication sequence diagram: firebase auth sdk → jwt issuance → backend middleware verification. It serves to highlight the specific UI layout, system architecture, or logical sequence mapped for this section of the project. Specifically, it demonstrates how the various components interact with each other and provides a clear visual reference for the concepts discussed in the surrounding text.

---

## Figure 3.3

**Tên hình/mô tả:** AI Generation sequence diagram: prompt input → translation → Gemini call → Storage upload → Firestore update → polling

**Hướng dẫn chụp/vẽ chi tiết:**
**Vị trí:** Công cụ vẽ biểu đồ Sequence.
**Cách chụp/Vẽ:** Vẽ luồng dữ liệu từ khi bấm nút 'Generate', quá trình dịch ngôn ngữ, gọi Gemini API, lưu kết quả ảnh lên Storage, và trả URL vào Firestore.

**Giải thích chi tiết (Explanation):**
This figure visually illustrates the ai generation sequence diagram: prompt input → translation → gemini call → storage upload → firestore update → polling. It serves to highlight the specific UI layout, system architecture, or logical sequence mapped for this section of the project. Specifically, it demonstrates how the various components interact with each other and provides a clear visual reference for the concepts discussed in the surrounding text.

---

## Figure 4.1

**Tên hình/mô tả:** Frontend technology stack diagram showing component relationships

**Hướng dẫn chụp/vẽ chi tiết:**
**Vị trí:** Công cụ vẽ sơ đồ khối.
**Cách chụp/Vẽ:** Vẽ sơ đồ thể hiện mối quan hệ giữa Next.js (Khung chính), Zustand (Quản lý trạng thái), Tailwind (Giao diện) và Axios (Call API).

**Giải thích chi tiết (Explanation):**
This figure visually illustrates the frontend technology stack diagram showing component relationships. It serves to highlight the specific UI layout, system architecture, or logical sequence mapped for this section of the project. Specifically, it demonstrates how the various components interact with each other and provides a clear visual reference for the concepts discussed in the surrounding text.

---

## Figure 4.2

**Tên hình/mô tả:** Cloud infrastructure diagram: Vercel ↔ Render ↔ Firebase ↔ Google AI

**Hướng dẫn chụp/vẽ chi tiết:**
**Vị trí:** Công cụ vẽ sơ đồ hạ tầng.
**Cách chụp/Vẽ:** Trình bày mô hình hosting: Vercel (Front) kết nối tới Render (Back), gọi tới Firebase và Google AI.

**Giải thích chi tiết (Explanation):**
This figure visually illustrates the cloud infrastructure diagram: vercel ↔ render ↔ firebase ↔ google ai. It serves to highlight the specific UI layout, system architecture, or logical sequence mapped for this section of the project. Specifically, it demonstrates how the various components interact with each other and provides a clear visual reference for the concepts discussed in the surrounding text.

---

## Figure 5.1

**Tên hình/mô tả:** Firestore data model overview showing 4 collections and their relationships

**Hướng dẫn chụp/vẽ chi tiết:**
**Vị trí:** Công cụ vẽ ERD / Cấu trúc dữ liệu hoặc chụp giao diện Firebase Console.
**Cách chụp/Vẽ:** Sáng tác bảng (Table) hoặc cấu trúc Document JSON cho 4 collection chính: `users`, `products`, `orders`, `generations`.

**Giải thích chi tiết (Explanation):**
This figure visually illustrates the firestore data model overview showing 4 collections and their relationships. It serves to highlight the specific UI layout, system architecture, or logical sequence mapped for this section of the project. Specifically, it demonstrates how the various components interact with each other and provides a clear visual reference for the concepts discussed in the surrounding text.

---

## Figure 6.1

**Tên hình/mô tả:** Screenshot of the Registration page

**Hướng dẫn chụp/vẽ chi tiết:**
**Vị trí:** Trang Đăng ký (`/register`).
**Cách chụp/Vẽ:** Nhập thử thông tin vào form (email, pass đủ mạnh) rồi chụp màn hình form đăng ký.

**Giải thích chi tiết (Explanation):**
This figure visually illustrates the screenshot of the registration page. It serves to highlight the specific UI layout, system architecture, or logical sequence mapped for this section of the project. Specifically, it demonstrates how the various components interact with each other and provides a clear visual reference for the concepts discussed in the surrounding text.

---

## Figure 6.2

**Tên hình/mô tả:** Screenshot of the Login page

**Hướng dẫn chụp/vẽ chi tiết:**
**Vị trí:** Trang Đăng nhập (`/login`).
**Cách chụp/Vẽ:** Chụp giao diện form đăng nhập có chứa checkbox 'Remember Me'.

**Giải thích chi tiết (Explanation):**
This figure visually illustrates the screenshot of the login page. It serves to highlight the specific UI layout, system architecture, or logical sequence mapped for this section of the project. Specifically, it demonstrates how the various components interact with each other and provides a clear visual reference for the concepts discussed in the surrounding text.

---

## Figure 6.3

**Tên hình/mô tả:** Axios interceptor flow: request token injection and automatic 401 retry logic

**Hướng dẫn chụp/vẽ chi tiết:**
**Vị trí:** Công cụ vẽ sơ đồ (Flowchart).
**Cách chụp/Vẽ:** Sơ đồ logic hoạt động của Axios Interceptor (kiểm tra token, tự động call lại khi báo lỗi 401).

**Giải thích chi tiết (Explanation):**
This figure visually illustrates the axios interceptor flow: request token injection and automatic 401 retry logic. It serves to highlight the specific UI layout, system architecture, or logical sequence mapped for this section of the project. Specifically, it demonstrates how the various components interact with each other and provides a clear visual reference for the concepts discussed in the surrounding text.

---

## Figure 6.4

**Tên hình/mô tả:** Screenshot of the Forgot Password page (email input and success state)

**Hướng dẫn chụp/vẽ chi tiết:**
**Vị trí:** Trang Quên mật khẩu (`/forgot-password`).
**Cách chụp/Vẽ:** Nhập một email và chụp lại giao diện lúc thông báo 'Đã gửi link đặt lại mật khẩu' thành công hiển thị ở góc.

**Giải thích chi tiết (Explanation):**
This figure visually illustrates the screenshot of the forgot password page (email input and success state). It serves to highlight the specific UI layout, system architecture, or logical sequence mapped for this section of the project. Specifically, it demonstrates how the various components interact with each other and provides a clear visual reference for the concepts discussed in the surrounding text.

---

## Figure 6.5

**Tên hình/mô tả:** Screenshot of the Gallery page with filter options and masonry product grid

**Hướng dẫn chụp/vẽ chi tiết:**
**Vị trí:** Trang Thư viện Danh sách SP (`/gallery`).
**Cách chụp/Vẽ:** Mở sẵn các bộ lọc (chọn thử tag độ khó 'Medium'), chụp toàn cảnh lưới ảnh xếp dạng gạch (masonry) và thanh lọc bên trên/trái.

**Giải thích chi tiết (Explanation):**
This figure visually illustrates the screenshot of the gallery page with filter options and masonry product grid. It serves to highlight the specific UI layout, system architecture, or logical sequence mapped for this section of the project. Specifically, it demonstrates how the various components interact with each other and provides a clear visual reference for the concepts discussed in the surrounding text.

---

## Figure 6.6

**Tên hình/mô tả:** Screenshot of the Profile page "Favourites" tab

**Hướng dẫn chụp/vẽ chi tiết:**
**Vị trí:** Trang Cá nhân (`/profile`).
**Cách chụp/Vẽ:** Chuyển qua tab 'Favourites' (Yêu thích) để lấy hình các sản phẩm có hiển thị icon trái tim đỏ ở góc/thẻ.

**Giải thích chi tiết (Explanation):**
This figure visually illustrates the screenshot of the profile page "favourites" tab. It serves to highlight the specific UI layout, system architecture, or logical sequence mapped for this section of the project. Specifically, it demonstrates how the various components interact with each other and provides a clear visual reference for the concepts discussed in the surrounding text.

---

## Figure 6.7

**Tên hình/mô tả:** Screenshot of the Shopping Cart page

**Hướng dẫn chụp/vẽ chi tiết:**
**Vị trí:** Trang Giỏ hàng (`/cart`).
**Cách chụp/Vẽ:** Add sẵn 2-3 sản phẩm vào giỏ, chụp lại cảnh các dòng SP có hiển thị Input tăng/giảm số lượng và cục tính rổ tổng tiền bên cạnh.

**Giải thích chi tiết (Explanation):**
This figure visually illustrates the screenshot of the shopping cart page. It serves to highlight the specific UI layout, system architecture, or logical sequence mapped for this section of the project. Specifically, it demonstrates how the various components interact with each other and provides a clear visual reference for the concepts discussed in the surrounding text.

---

## Figure 6.8

**Tên hình/mô tả:** Screenshot of the Checkout page with shipping form

**Hướng dẫn chụp/vẽ chi tiết:**
**Vị trí:** Trang Thanh toán (`/checkout`).
**Cách chụp/Vẽ:** Điền các thông tin vận chuyển vào form bên trái và phần Order Summary (tóm tắt tiền) bên phải màn hình.

**Giải thích chi tiết (Explanation):**
This figure visually illustrates the screenshot of the checkout page with shipping form. It serves to highlight the specific UI layout, system architecture, or logical sequence mapped for this section of the project. Specifically, it demonstrates how the various components interact with each other and provides a clear visual reference for the concepts discussed in the surrounding text.

---

## Figure 6.9

**Tên hình/mô tả:** Screenshot of the Order Success confirmation page

**Hướng dẫn chụp/vẽ chi tiết:**
**Vị trí:** Trang Đặt hàng thành công (`/order-success`).
**Cách chụp/Vẽ:** Chụp màn hình có icon checkmark màu xanh báo đơn đặt thành công và hiển thị rõ mã ID đơn hàng.

**Giải thích chi tiết (Explanation):**
This figure visually illustrates the screenshot of the order success confirmation page. It serves to highlight the specific UI layout, system architecture, or logical sequence mapped for this section of the project. Specifically, it demonstrates how the various components interact with each other and provides a clear visual reference for the concepts discussed in the surrounding text.

---

## Figure 6.10

**Tên hình/mô tả:** Screenshot of the AI Generate page: prompt input area, complexity selector buttons

**Hướng dẫn chụp/vẽ chi tiết:**
**Vị trí:** Trang Tạo ảnh (`/generate`).
**Cách chụp/Vẽ:** Giao diện lúc TÌNH TRẠNG CHƯA TẠO, đang gõ dở văn bản vô khung textarea và chọn 1 nút độ khó (Easy/Medium/Hard).

**Giải thích chi tiết (Explanation):**
This figure visually illustrates the screenshot of the ai generate page: prompt input area, complexity selector buttons. It serves to highlight the specific UI layout, system architecture, or logical sequence mapped for this section of the project. Specifically, it demonstrates how the various components interact with each other and provides a clear visual reference for the concepts discussed in the surrounding text.

---

## Figure 6.11

**Tên hình/mô tả:** Example of a completed AI-generated paint-by-numbers image showing numbered regions and colour palette strip at the bottom

**Hướng dẫn chụp/vẽ chi tiết:**
**Vị trí:** Trang Tạo ảnh (`/generate`).
**Cách chụp/Vẽ:** Giao diện lúc ảnh AI ĐÃ TRẢ VỀ HOÀN CHỈNH, hiển thị bản vẽ line-art (lưới số có viền báo vùng tô) kèm dải màu (palette) nằm bên dưới, hiện thêm nút 'Add to Cart'.

**Giải thích chi tiết (Explanation):**
This figure visually illustrates the example of a completed ai-generated paint-by-numbers image showing numbered regions and colour palette strip at the bottom. It serves to highlight the specific UI layout, system architecture, or logical sequence mapped for this section of the project. Specifically, it demonstrates how the various components interact with each other and provides a clear visual reference for the concepts discussed in the surrounding text.

---

## Figure 6.12

**Tên hình/mô tả:** Screenshot of the Admin Dashboard with statistics cards and order status breakdown

**Hướng dẫn chụp/vẽ chi tiết:**
**Vị trí:** Trang Dashboard Quản trị (`/admin`).
**Cách chụp/Vẽ:** Chụp bao quát các khối thẻ thống kê vuông vức (doanh thu, số đơn, số user) hiện ngang hàng và phần biểu đồ/bảng tròn chia tỉ lệ đơn hàng ở bên dưới.

**Giải thích chi tiết (Explanation):**
This figure visually illustrates the screenshot of the admin dashboard with statistics cards and order status breakdown. It serves to highlight the specific UI layout, system architecture, or logical sequence mapped for this section of the project. Specifically, it demonstrates how the various components interact with each other and provides a clear visual reference for the concepts discussed in the surrounding text.

---

## Figure 6.13

**Tên hình/mô tả:** Screenshot of the Admin Products page with product list table and add/edit modal

**Hướng dẫn chụp/vẽ chi tiết:**
**Vị trí:** Trang Quản lý Sản phẩm Admin (`/admin/products`).
**Cách chụp/Vẽ:** Chụp bao quát khung viền bảng Danh sách list sản phẩm có các nút Action Sửa/Xóa. Có thể ghép lúc bấm nút 'Add Product' để bảng pop-up/modal Form (nhập Tên, Giá, Ảnh) hiện nổi lên giữa panel.

**Giải thích chi tiết (Explanation):**
This figure visually illustrates the screenshot of the admin products page with product list table and add/edit modal. It serves to highlight the specific UI layout, system architecture, or logical sequence mapped for this section of the project. Specifically, it demonstrates how the various components interact with each other and provides a clear visual reference for the concepts discussed in the surrounding text.

---

## Figure 7.1

**Tên hình/mô tả:** Two-layer authorisation diagram: client-side redirect guard and server-side middleware guard

**Hướng dẫn chụp/vẽ chi tiết:**
**Vị trí:** Công cụ vẽ sơ đồ phân quyền / bảo mật.
**Cách chụp/Vẽ:** Vẽ cấu trúc bảo mật 2 lớp: Client side redirect (đẩy Admin chưa login quay lại trang đăng nhập bằng middleware) kết hợp Backend side middleware (Từ chối 403 API nếu JWT không chứa Admin/Email thuộc whitelist).

**Giải thích chi tiết (Explanation):**
This figure visually illustrates the two-layer authorisation diagram: client-side redirect guard and server-side middleware guard. It serves to highlight the specific UI layout, system architecture, or logical sequence mapped for this section of the project. Specifically, it demonstrates how the various components interact with each other and provides a clear visual reference for the concepts discussed in the surrounding text.

---

## Figure 8.1

**Tên hình/mô tả:** Error propagation flow diagram: source (Firebase / Gemini / Firestore) → backend response → frontend user message

**Hướng dẫn chụp/vẽ chi tiết:**
**Vị trí:** Công cụ vẽ Flow xử lý và báo Lỗi HTTP.
**Cách chụp/Vẽ:** Sơ đồ mô tả quy trình ném thông báo: Ví dụ Gemini API lỗi hoặc hết lượt gọi -> Trả lỗi về Backend catch và set status=500 -> Frontend dùng thư viện Axios bắt mã 500 và hiện `react-hot-toast` popup lỗi màu đỏ góc phải.

**Giải thích chi tiết (Explanation):**
This figure visually illustrates the error propagation flow diagram: source (firebase / gemini / firestore) → backend response → frontend user message. It serves to highlight the specific UI layout, system architecture, or logical sequence mapped for this section of the project. Specifically, it demonstrates how the various components interact with each other and provides a clear visual reference for the concepts discussed in the surrounding text.

---

## Figure 9.1

**Tên hình/mô tả:** Annotated screenshot of the full Homepage showing all 6 sections

**Hướng dẫn chụp/vẽ chi tiết:**
**Vị trí:** Trang chủ (`/`).
**Cách chụp/Vẽ:** Dùng chức năng 'Full page screenshot' của Chrome/Edge extension. Cắt dài dọc xuống theo trang, khoanh vùng vuông đỏ/tím ghi chú đánh dấu vào 6 thành phần: Nhóm Banner Hero (1), Sản phẩm Hot (2), Card About Me (3), Các bước mua (4), Why Choose Me (5), Nút CTA chân trang (6).

**Giải thích chi tiết (Explanation):**
This figure visually illustrates the annotated screenshot of the full homepage showing all 6 sections. It serves to highlight the specific UI layout, system architecture, or logical sequence mapped for this section of the project. Specifically, it demonstrates how the various components interact with each other and provides a clear visual reference for the concepts discussed in the surrounding text.

---

## Figure 9.2

**Tên hình/mô tả:** Screenshot of the Gallery page with filters applied and masonry grid

**Hướng dẫn chụp/vẽ chi tiết:**
**Vị trí:** Trang Thư viện (`/gallery`).
**Cách chụp/Vẽ:** Chụp lúc đang kéo kéo thử thanh trượt giá (Price Slider filter) và kết quả được lọc rỗng hoặc list SP ngắn hơn.

**Giải thích chi tiết (Explanation):**
This figure visually illustrates the screenshot of the gallery page with filters applied and masonry grid. It serves to highlight the specific UI layout, system architecture, or logical sequence mapped for this section of the project. Specifically, it demonstrates how the various components interact with each other and provides a clear visual reference for the concepts discussed in the surrounding text.

---

## Figure 9.3

**Tên hình/mô tả:** Screenshot of the Generate page: left — input state; right — result display state

**Hướng dẫn chụp/vẽ chi tiết:**
**Vị trí:** Trang Tạo ảnh (`/generate`) - Ghép ảnh.
**Cách chụp/Vẽ:** Đặt 2 mảnh màn hình vào 1 khung: Nửa hình 1 (bấm nút Generate text) đối sánh với Nửa hình 2 (bức tranh Output) ngay bên hông.

**Giải thích chi tiết (Explanation):**
This figure visually illustrates the screenshot of the generate page: left — input state; right — result display state. It serves to highlight the specific UI layout, system architecture, or logical sequence mapped for this section of the project. Specifically, it demonstrates how the various components interact with each other and provides a clear visual reference for the concepts discussed in the surrounding text.

---

## Figure 9.4

**Tên hình/mô tả:** Screenshot of the Profile page showing the three tabs

**Hướng dẫn chụp/vẽ chi tiết:**
**Vị trí:** Trang Cá nhân (`/profile`).
**Cách chụp/Vẽ:** Focus màn hình thấy đường chỉ kẻ ngầm (Tab điều hướng ngang) chuyển đổi giữa My Info (Tài khoản), Favourites (Lưu trữ ảnh yêu thích) và My Orders (Đơn mua cũ).

**Giải thích chi tiết (Explanation):**
This figure visually illustrates the screenshot of the profile page showing the three tabs. It serves to highlight the specific UI layout, system architecture, or logical sequence mapped for this section of the project. Specifically, it demonstrates how the various components interact with each other and provides a clear visual reference for the concepts discussed in the surrounding text.

---

## Figure 9.5

**Tên hình/mô tả:** Screenshot of the Admin Dashboard with statistics cards

**Hướng dẫn chụp/vẽ chi tiết:**
**Vị trí:** Trang Quản trị Dashboard (`/admin`).
**Cách chụp/Vẽ:** Phóng to cận cảnh phần 4 thẻ khung chứa tiền/số lượng (Statistic Cards nổi bật) ngay dòng top của Dashboard.

**Giải thích chi tiết (Explanation):**
This figure visually illustrates the screenshot of the admin dashboard with statistics cards. It serves to highlight the specific UI layout, system architecture, or logical sequence mapped for this section of the project. Specifically, it demonstrates how the various components interact with each other and provides a clear visual reference for the concepts discussed in the surrounding text.

---

## Figure 9.6

**Tên hình/mô tả:** Screenshot of the Admin Orders management table with status filter

**Hướng dẫn chụp/vẽ chi tiết:**
**Vị trí:** Trang Quản lý Đơn hàng (`/admin/orders`).
**Cách chụp/Vẽ:** Chụp tại bàn thao tác lúc Dropdown Box (Dấu thả đổi quy trình Giao hàng từ Pending sang Shipping/Delivered) đang được xổ xuống dài.

**Giải thích chi tiết (Explanation):**
This figure visually illustrates the screenshot of the admin orders management table with status filter. It serves to highlight the specific UI layout, system architecture, or logical sequence mapped for this section of the project. Specifically, it demonstrates how the various components interact with each other and provides a clear visual reference for the concepts discussed in the surrounding text.

---

## Figure 9.7

**Tên hình/mô tả:** Screenshot of the Admin Products page with the product add/edit modal

**Hướng dẫn chụp/vẽ chi tiết:**
**Vị trí:** Modal Quản lý SP (`/admin/products`).
**Cách chụp/Vẽ:** Phóng to hoàn toàn vô form khung hộp thoại nhập thêm Cột/Thông số chi tiết Product như Difficulty, Dimensions và nút Upload Ảnh.

**Giải thích chi tiết (Explanation):**
This figure visually illustrates the screenshot of the admin products page with the product add/edit modal. It serves to highlight the specific UI layout, system architecture, or logical sequence mapped for this section of the project. Specifically, it demonstrates how the various components interact with each other and provides a clear visual reference for the concepts discussed in the surrounding text.

---

## Figure 9.8

**Tên hình/mô tả:** Screenshot of the Contact page showing the info panel and contact form

**Hướng dẫn chụp/vẽ chi tiết:**
**Vị trí:** Trang Liên hệ (`/contact`).
**Cách chụp/Vẽ:** Chụp nửa trên là Block form Send Email bám sát khung, kèm nửa dưới là khối FAQ (Câu hỏi thường gặp đóng/mở kiểu accordion).

**Giải thích chi tiết (Explanation):**
This figure visually illustrates the screenshot of the contact page showing the info panel and contact form. It serves to highlight the specific UI layout, system architecture, or logical sequence mapped for this section of the project. Specifically, it demonstrates how the various components interact with each other and provides a clear visual reference for the concepts discussed in the surrounding text.

---

## Figure 10.1

**Tên hình/mô tả:** CI/CD pipeline diagram: GitHub repository → Vercel (frontend) and GitHub → Render (backend)

**Hướng dẫn chụp/vẽ chi tiết:**
**Vị trí:** Công cụ vẽ sơ đồ hạ tầng Pipeline.
**Cách chụp/Vẽ:** Mũi tên từ IDE Code lên nhánh repo của Github -> chia 2 hướng: Mũi kích hoạt hệ thống Auto Build của Frontend sang server Vercel, mũi thứ 2 kích hoạt Script Node/Express qua Webhook sang nền tảng Backend Render Node.js.

**Giải thích chi tiết (Explanation):**
This figure visually illustrates the ci/cd pipeline diagram: github repository → vercel (frontend) and github → render (backend). It serves to highlight the specific UI layout, system architecture, or logical sequence mapped for this section of the project. Specifically, it demonstrates how the various components interact with each other and provides a clear visual reference for the concepts discussed in the surrounding text.

---
