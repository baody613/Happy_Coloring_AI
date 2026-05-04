# KỊCH BẢN THUYẾT TRÌNH — FINAL YEAR PROJECT

**Dự án:** Happy Coloring AI — AI-Integrated Paint-by-Numbers E-Commerce Platform  
**Sinh viên:** Tống Bảo Duy — GCS210642  
**Trường:** Greenwich University Vietnam  

---

> **Hướng dẫn sử dụng kịch bản:**  
> Phần in đậm `[SLIDE X]` là tín hiệu chuyển slide.  
> Phần in nghiêng là ghi chú hành động (không đọc to).  
> Thời lượng ước tính toàn bài: **~12–15 phút** + Q&A.

---

## [SLIDE 1] — TRANG BÌA

*Bước vào vị trí, chào hội đồng, ổn định tư thế.*

> "Kính chào Thầy/Cô trong hội đồng phản biện. Em tên là **Tống Bảo Duy**, mã số sinh viên **GCS210642**, ngành Công nghệ Thông tin, Đại học Greenwich Việt Nam.
>
> Đồ án tốt nghiệp của em có tên **Happy Coloring AI** — một nền tảng thương mại điện tử tích hợp trí tuệ nhân tạo, cho phép người dùng mua tranh tô màu theo số sẵn có **và** tự tạo tranh cá nhân hoá từ mô tả bằng tiếng Việt, được cung cấp sức mạnh bởi Google Gemini 2.5 Flash.
>
> Trong buổi thuyết trình hôm nay, em sẽ trình bày theo ba phần chính: **Công nghệ sử dụng**, **Các tính năng cốt lõi**, và **Chức năng tạo ảnh AI** — đây là phần trọng tâm nhất của đồ án. Em xin bắt đầu."

---

## [SLIDE 2] — TECHNOLOGY STACK — FRONTEND *(PART 1 / ~2 phút)*

> "Trước tiên, em xin giới thiệu về công nghệ frontend mà em đã lựa chọn.
>
> Về **UI Framework**, em dùng **Next.js 14** với App Router kết hợp **React 18** và **TypeScript**. Lý do chọn Next.js là vì nó hỗ trợ **Server-Side Rendering** ngay từ đầu, giúp cải thiện SEO cho trang sản phẩm, đồng thời hệ thống routing theo file-system rất sạch và dễ quản lý với hơn 30 trang. Em dùng **Tailwind CSS** để xây dựng giao diện responsive mà không cần viết CSS thủ công, và **Framer Motion** để tạo animation mượt mà trên trang chủ và trang Generate.
>
> Về **State & Data**, em dùng **Zustand** để quản lý global state — bao gồm giỏ hàng, trạng thái đăng nhập, và danh sách yêu thích. Zustand nhẹ hơn Redux rất nhiều, không cần boilerplate. **Firebase SDK** phía client đảm nhận xác thực người dùng trên trình duyệt. Mọi HTTP request đều đi qua **Axios** với interceptor tự động đính kèm Bearer Token và refresh token khi hết hạn. Đặc biệt, em có file `safeStorage.ts` để kiểm tra `typeof window` trước mỗi lần truy cập localStorage — giải quyết vấn đề SSR-safe khi Next.js render phía server.
>
> Cấu trúc thư mục frontend gồm `app/` với 30+ trang, `components/`, `store/` với ba store chính, `lib/` với các helper API, và `hooks/`."

---

## [SLIDE 3] — TECHNOLOGY STACK — BACKEND & DATABASE

> "Chuyển sang phía **Backend**.
>
> Server được xây dựng trên **Node.js + Express.js**, triển khai theo kiến trúc RESTful API. Em dùng **Firebase Admin SDK** phía server để xác minh token, truy xuất Firestore và Firebase Storage. Về bảo mật, em tích hợp **Helmet** để thiết lập các HTTP security header chống XSS, clickjacking; **Morgan** để ghi log request; và **Express Rate Limit** giới hạn 100 request mỗi 15 phút mỗi IP — phòng chống brute-force attack, đây là một trong các hướng dẫn của OWASP Top 10. Ngoài ra, **Joi** đảm nhận validate dữ liệu đầu vào, và **Nodemailer** gửi email reset mật khẩu.
>
> Về **AI APIs**, em sử dụng hai model khác nhau: **Gemini 2.5 Flash Image** để tạo ảnh tranh tô màu từ văn bản — đây là model chính, và **Gemini 2.5 Flash Text** cho chatbot tư vấn sản phẩm. **MyMemory API** dịch prompt từ tiếng Việt sang tiếng Anh trước khi gửi sang Gemini.
>
> Về **Database & Storage**, em dùng hoàn toàn hệ sinh thái Firebase: **Firestore** lưu trữ toàn bộ dữ liệu dưới dạng NoSQL với 5 collections chính — Users, Products, Orders, Generations, và Settings. **Firebase Auth** cung cấp JWT identity, **Firebase Storage** lưu ảnh sản phẩm và ảnh AI được tạo ra.
>
> Tổng cộng backend có **49 API endpoints** chia trên 14 file route."

---

## [SLIDE 4] — SYSTEM FLOW — 5 STAGES

> "Để có cái nhìn tổng thể, đây là **luồng hoạt động của hệ thống** gồm 5 giai đoạn.
>
> **Stage 1 — Authentication:** Người dùng đăng ký hoặc đăng nhập qua Firebase Auth. Component `AuthProvider` lắng nghe sự kiện `onAuthStateChanged` và cập nhật Zustand `authStore`. Mọi request sau đó đều gắn **Bearer Token** trong header.
>
> **Stage 2 — Browse & Shop:** Sản phẩm được tải từ Firestore và hiển thị với đầy đủ tính năng lọc theo danh mục, độ khó, giá tiền. Người dùng thêm vào giỏ hàng — giỏ hàng được persist bằng Zustand kết hợp localStorage, đảm bảo không mất dữ liệu khi refresh trang.
>
> **Stage 3 — Payment:** Sau khi checkout, hệ thống xử lý thanh toán COD hoặc Bank Transfer. Backend xác minh và cập nhật trạng thái đơn hàng trong Firestore.
>
> **Stage 4 — AI Generation:** Đây là giai đoạn đặc trưng nhất — người dùng nhập mô tả bằng tiếng Việt, hệ thống gọi Gemini để tạo ảnh và lưu lên Firebase Storage. Em sẽ trình bày chi tiết trong Part 3.
>
> **Stage 5 — Administration:** Admin đăng nhập vào dashboard riêng với xác thực hai lớp, quản lý sản phẩm, đơn hàng, người dùng và cập nhật trạng thái đơn."

---

## [SLIDE 5] — 7 CORE FEATURE GROUPS *(PART 2 / ~4 phút)*

> "Bước sang **Part 2**, em sẽ trình bày 7 nhóm tính năng cốt lõi của hệ thống.
>
> **Nhóm 1 — Authentication:** Đăng ký, đăng nhập, đăng xuất đầy đủ. Tính năng 'Remember me' lưu thông tin vào localStorage; nếu tắt thì dùng sessionStorage. Hỗ trợ reset mật khẩu qua email bằng Nodemailer.
>
> **Nhóm 2 — Products:** Danh sách sản phẩm có đầy đủ filter theo danh mục, độ khó, giá; phân trang. Phía admin có thể thêm, sửa, xoá sản phẩm và upload ảnh thẳng lên Firebase Storage.
>
> **Nhóm 3 — Cart:** Giỏ hàng dùng Zustand persist — trạng thái không mất khi reload. Người dùng có thể lưu sản phẩm vào 'yêu thích' để mua sau. Hệ thống có 3 voucher giảm giá: `YULING10` giảm 10%, `YULING20` giảm 20%, `GIAMGIA15` giảm 15%.
>
> **Nhóm 4 — Payment:** Hỗ trợ thanh toán COD và Bank Transfer. Hệ thống có callback verification để xác nhận giao dịch.
>
> **Nhóm 5 — Orders:** Đơn hàng đi qua vòng đời: pending → processing → shipping → delivered hoặc cancelled. Người dùng xem lịch sử đơn hàng; admin cập nhật trạng thái.
>
> **Nhóm 6 — AI Generation:** Đây là **tính năng flagship** — em sẽ đi sâu vào Part 3.
>
> **Nhóm 7 — Admin Dashboard:** Quản lý toàn diện sản phẩm, đơn hàng, người dùng, và cài đặt hệ thống. Có thống kê tổng quan cho admin."

---

## [SLIDE 6] — BACKEND ARCHITECTURE — LAYERED DESIGN

> "Trước khi đi vào AI Generation, em muốn trình bày kiến trúc backend theo **Layered Design** — thiết kế theo lớp, vì đây là quyết định thiết kế quan trọng.
>
> Luồng xử lý đi qua 4 lớp: **Routes** nhận request và validate đầu vào cơ bản — có 14 file route. Tiếp theo là **Middleware** với hai file chính: `auth.js` xác minh Firebase ID Token và gắn `req.user`, còn `adminAuth.js` thực hiện xác thực quyền admin **hai lớp**. **Services** là nơi chứa toàn bộ business logic trong 6 file. Cuối cùng là lớp **Firebase** — Firestore, Storage, và Auth.
>
> Điểm đáng chú ý là cơ chế `adminAuth` hai lớp: **Lớp 1** kiểm tra email trong biến môi trường `ADMIN_EMAILS` — rất nhanh, không cần query database. **Lớp 2** query Firestore để kiểm tra trường `role = "admin"` — chính xác và linh hoạt, có thể cấp/thu hồi quyền admin mà không cần deploy lại.
>
> Về Services: `productService` đảm nhận CRUD, filtering, pagination; `orderService` quản lý vòng đời đơn hàng; `userService` quản lý tài khoản và profile."

---

## [SLIDE 7] — AI IMAGE GENERATION — OVERVIEW *(PART 3 / ~5 phút — CORE FEATURE)*

> "Và bây giờ là **Part 3** — phần quan trọng nhất của đồ án: **Tính năng tạo ảnh AI**.
>
> Em sử dụng model **Gemini 2.5 Flash Image** của Google AI Studio — đây là một trong số rất ít model **miễn phí** hỗ trợ sinh ảnh inline qua REST API. Model trả về ảnh dưới dạng **Base64 inline** trong response, không cần lưu qua bước trung gian.
>
> Tính năng cho phép người dùng chọn **3 mức độ phức tạp**:
> - **Easy (16 màu):** Nét dày 3–4px, vùng tô lớn tối thiểu 40×40px, phong cách cartoon đơn giản — phù hợp trẻ em.
> - **Medium (28 màu):** Nét tiêu chuẩn 2–3px, semi-realistic, vùng tô tối thiểu 18×18px — dành cho người lớn.
> - **Hard (44 màu):** Nét mảnh 1.5–2px, nhiều vùng nhỏ 8×8px, độ phức tạp cao — dành cho người có kinh nghiệm.
>
> Và đây là toàn bộ **7-bước xử lý** mà em đã thiết kế — em sẽ trình bày ngay slide tiếp theo."

---

## [SLIDE 8] — 7-STEP PROCESSING FLOW — BƯỚC 1 ĐẾN 4

> "**Bước 1 — User gửi request:** Frontend POST lên `/api/generate/paint-by-numbers` với Bearer Token. Route được bảo vệ bởi middleware `authenticateUser`. Trước khi gửi sang Gemini, **MyMemory API** dịch prompt tiếng Việt sang tiếng Anh.
>
> **Bước 2 — Backend phản hồi 202 Accepted ngay lập tức:** Đây là điểm thiết kế then chốt. Gemini có thể mất từ 30 đến 120 giây để tạo ảnh — nếu giữ kết nối mở, request sẽ timeout. Vì vậy, backend tạo ngay một document trong Firestore với `status: "processing"` và trả về HTTP 202 kèm `generationId`. Frontend nhận ID này và bắt đầu polling.
>
> **Bước 3 — Prompt Engineering:** Hàm `buildLineArtPrompt()` chạy ở background dưới dạng **fire-and-forget** — không có `await`, không block Event Loop của Node.js. Prompt được xây dựng với template: vai trò được gán là *'You are a professional paint-by-numbers illustrator'*, sau đó là các **hard requirements** như closed regions, numbered, màu sắc theo palette, không watermark, không nội dung 18+.
>
> **Bước 4 — Gọi Google AI Studio API:** `generateContent` được gọi với `responseModalities: ['TEXT', 'IMAGE']`. Model trả về mảng `parts[]`, em iterate qua mảng này để tìm `inlineData` chứa chuỗi Base64 PNG, sau đó convert sang `Buffer`."

---

## [SLIDE 9] — 7-STEP PROCESSING FLOW — BƯỚC 5 ĐẾN 7

> "**Bước 5 — Upload lên Firebase Storage:** Hàm `uploadToStorage()` tạo reference `generations/<tên-file>`, lưu buffer với `contentType: "image/png"`, gọi `makePublic()` để có public URL. Tại sao không trả thẳng Base64 về frontend? Vì một ảnh Base64 khoảng **500KB text** — quá nặng để lưu trong Firestore và không thể reuse được. URL public thì compact và permanent.
>
> **Bước 6 — Cập nhật Firestore:** Document được cập nhật:
> - Thành công: `status: "completed"` + `imageUrl` + `completedAt`
> - Thất bại: `status: "failed"` + error message
> - Nếu vượt quota Gemini → `RESOURCE_EXHAUSTED` → set failed
> - Nếu vi phạm nội dung → `INVALID_ARGUMENT` → set failed
> - Nếu Axios timeout sau 120 giây → set failed
>
> **Bước 7 — Frontend Polling:** Frontend gọi `GET /api/generate/status/:id` mỗi **5 giây**, tối đa **60 lần** — tức là timeout sau 5 phút. Server kiểm tra `userId` trong Firestore khớp với token để bảo mật — người dùng khác không thể xem kết quả của nhau. ID của interval được lưu trong `useRef` và `clearInterval` khi component unmount — không có memory leak. Khi ảnh sẵn sàng, người dùng có thể **download**, **thêm vào giỏ hàng**, hoặc **thêm vào yêu thích**."

---

## [SLIDE 10] — WHY GEMINI? PROMPT ENGINEERING

> "Một câu hỏi tự nhiên là: **tại sao chọn Gemini thay vì train model riêng?**
>
> Thứ nhất, Gemini là một trong số ít model **miễn phí** hỗ trợ sinh ảnh inline qua REST API thuần túy — không cần SDK nặng. Free tier của Google AI Studio đủ cho phạm vi đồ án này.
>
> Thứ hai, về **Prompt Engineering thay vì training:** Gemini đã được train trên hàng tỷ data points — không cần retrain từ đầu. Chiến lược của em là *'steer'* — dẫn hướng model bằng prompt chi tiết thay vì training lại. Cấu trúc prompt gồm ba phần: **Role assignment** → **Hard requirements** → **Runtime variables** (prompt người dùng + style + complexity). Kết quả là cùng một model nhưng **luôn output đúng định dạng** tranh tô màu theo số.
>
> **Đây là đóng góp kỹ thuật chính của em:** Em đã thiết kế hệ thống Prompt Engineering để ổn định output ra đúng layout 76%/24%, closed regions, numbered, circular color palette — và toàn bộ hệ thống async processing xung quanh nó."

---

## [SLIDE 11] — THANK YOU / Q&A

> "Vậy là em đã trình bày xong toàn bộ đồ án **Happy Coloring AI**.
>
> Để tóm tắt lại: em đã xây dựng và deploy thành công một nền tảng thương mại điện tử đầy đủ — tích hợp tính năng tạo ảnh AI bằng Google Gemini, kiến trúc async 7 bước, hệ thống admin hai lớp xác thực, và triển khai CI/CD trên Vercel và Render.
>
> Frontend live tại: **happy-coloring-ai.vercel.app**  
> Backend API tại: **paint-by-numbers-back-end.onrender.com**
>
> *Đọc câu kết, giọng bình tĩnh và tự tin:*
>
> 'That concludes my Final Year Project presentation. Thank you very much for your time and attention. I warmly welcome any questions or feedback from the panel.'
>
> Em xin cảm ơn Thầy/Cô và hội đồng. Em sẵn sàng trả lời bất kỳ câu hỏi nào."

---

## GỢI Ý TRẢ LỜI CÁC CÂU HỎI THƯỜNG GẶP

### "Tại sao chọn Firebase thay vì PostgreSQL/MySQL?"
> "Firestore là NoSQL document database phù hợp với schema linh hoạt của đồ án này — mỗi sản phẩm có thể có thuộc tính khác nhau. Hơn nữa, Firebase cung cấp trọn bộ Auth + Storage + Database trong một ecosystem, giúp giảm thời gian cấu hình và tích hợp, phù hợp với phạm vi đồ án cá nhân."

### "Hệ thống xử lý được bao nhiêu người dùng đồng thời?"
> "Backend deploy trên Render free tier với giới hạn tài nguyên, nhưng do kiến trúc async fire-and-forget, các generation request không block nhau. Giới hạn thực tế đến từ rate limit của Gemini API và Render."

### "Tại sao không dùng WebSocket thay vì polling?"
> "WebSocket phù hợp hơn cho real-time communication hai chiều. Trong trường hợp này, client chỉ cần biết khi nào generation xong — polling mỗi 5 giây là đủ và đơn giản hơn nhiều để implement, không cần duy trì persistent connection."

### "Bảo mật như thế nào với API Key của Gemini?"
> "API Key được lưu trong file `.env` phía backend và không bao giờ được hard-code hoặc expose ra client. File `.env` được thêm vào `.gitignore`. Trên Render, key được lưu dưới dạng environment variable được mã hoá."

### "Voucher code có thể bị brute-force không?"
> "Có rủi ro lý thuyết. Trong phiên bản hiện tại, rate limiting 100 req/15 min/IP làm chậm đáng kể. Để cải thiện, có thể hash voucher codes hoặc thêm CAPTCHA — đây là hướng phát triển trong tương lai."

---

*Cuối file — Tống Bảo Duy, GCS210642, Greenwich University Vietnam, 2025–2026*
