# KỊCH BẢN THUYẾT TRÌNH — ĐỒ ÁN TỐT NGHIỆP

**Dự án:** Happy Coloring AI — Nền tảng thương mại điện tử Paint-by-Numbers tích hợp AI  
**Sinh viên:** Tống Bảo Duy — GCS210642  
**Trường:** Đại học Greenwich Việt Nam

---

> **Hướng dẫn sử dụng kịch bản:**  
> Các mốc **[SLIDE X]** in đậm là tín hiệu chuyển slide.  
> *Chữ nghiêng* là chỉ dẫn hành động — không đọc to.  
> Thời gian dự kiến toàn bài: **~12–15 phút** + Hỏi đáp.

---

## [SLIDE 1] — SLIDE TIÊU ĐỀ

*Bước lên, chào hội đồng, đứng thẳng tự nhiên.*

> "Kính thưa Ban Giám Khảo, kính thưa Quý Thầy Cô.  
>
> Em tên là **Tống Bảo Duy**, mã sinh viên **GCS210642**, chuyên ngành Công nghệ Thông tin tại Đại học Greenwich Việt Nam.  
>
> Đề tài Đồ án Tốt nghiệp của em có tên là **Happy Coloring AI** — một nền tảng thương mại điện tử tích hợp AI, cho phép người dùng vừa mua sản phẩm tranh tô màu theo số có sẵn, vừa có thể **tự tạo tranh cá nhân hóa** từ mô tả bằng ngôn ngữ tự nhiên, sử dụng mô hình Google Gemini 2.5 Flash.  
>
> Bài thuyết trình hôm nay được chia thành ba phần chính: **Công nghệ sử dụng**, **Tính năng hệ thống**, và **Tính năng Tạo ảnh AI** — đây là phần trọng tâm của đồ án. Kính mời Thầy Cô theo dõi."

---

## [SLIDE 2] — CÔNG NGHỆ — FRONTEND *(PHẦN 1 / ~2 phút)*

> "Đầu tiên, em xin trình bày về các công nghệ Frontend đã sử dụng.  
>
> Về **UI Framework**, em dùng **Next.js 14** với App Router, kết hợp **React 18** và **TypeScript**. Em chọn Next.js vì nó hỗ trợ **Server-Side Rendering** tích hợp sẵn — giúp cải thiện SEO cho các trang sản phẩm — và routing theo cấu trúc thư mục giúp quản lý hơn 30 trang một cách rõ ràng. **Tailwind CSS** giúp xây dựng giao diện responsive mà không cần viết CSS thủ công. **Framer Motion** tạo các animation mượt mà trên trang chủ và trang Generate.  
>
> Về **Quản lý State & Dữ liệu**, em sử dụng **Zustand** để quản lý state toàn cục — bao gồm giỏ hàng, trạng thái đăng nhập và danh sách yêu thích. Zustand nhẹ hơn Redux rất nhiều và không cần boilerplate. **Firebase SDK** phía client xử lý xác thực người dùng. Mọi HTTP request đều qua **Axios**, interceptor của nó tự động gắn Bearer Token và làm mới token khi hết hạn. Đặc biệt, utility `safeStorage.ts` kiểm tra `typeof window` trước mỗi lần truy cập localStorage — giải quyết vấn đề hydration SSR khi Next.js render phía server.  
>
> Cấu trúc thư mục frontend gồm: `app/` với 30+ trang, `components/`, `store/` với ba Zustand store, `lib/` chứa các API helper, và `hooks/`."

---

## [SLIDE 3] — CÔNG NGHỆ — BACKEND & CƠ SỞ DỮ LIỆU

> "Tiếp theo là phần **Backend**.  
>
> Server được xây dựng trên **Node.js + Express.js**, theo kiến trúc RESTful API. Em dùng **Firebase Admin SDK** phía server để xác minh token và truy cập Firestore, Firebase Storage. Về bảo mật, em tích hợp **Helmet** để thiết lập các HTTP security header chống XSS và clickjacking; **Morgan** để ghi log request; và **Express Rate Limit** giới hạn mỗi IP tối đa 100 request trong 15 phút — bảo vệ trước các cuộc tấn công brute-force, phù hợp với tiêu chuẩn OWASP Top 10. **Joi** xử lý validation đầu vào, **Nodemailer** gửi email đặt lại mật khẩu.  
>
> Về **AI APIs**, em sử dụng hai mô hình: **Gemini 2.5 Flash Image** để tạo tranh tô màu từ văn bản — đây là mô hình chính — và **Gemini 2.5 Flash Text** cho chatbot tư vấn sản phẩm. **MyMemory API** dịch prompt từ tiếng Việt sang tiếng Anh trước khi gửi cho Gemini.  
>
> Về **Cơ sở dữ liệu & Lưu trữ**, em dùng toàn bộ hệ sinh thái Firebase: **Firestore** lưu trữ dữ liệu dạng tài liệu NoSQL với 5 collection chính — Users, Products, Orders, Generations và Settings. **Firebase Auth** cung cấp JWT, **Firebase Storage** lưu trữ ảnh sản phẩm và ảnh AI.  
>
> Tổng cộng, backend có **49 API endpoint** trên 14 route file."

---

## [SLIDE 4] — LUỒNG HOẠT ĐỘNG HỆ THỐNG — 5 GIAI ĐOẠN

> "Để có cái nhìn tổng quan, đây là **luồng hoạt động** của hệ thống chia thành 5 giai đoạn.  
>
> **Giai đoạn 1 — Xác thực:** Người dùng đăng ký hoặc đăng nhập qua Firebase Auth. Component `AuthProvider` lắng nghe sự kiện `onAuthStateChanged` và cập nhật Zustand `authStore`. Mọi request tiếp theo đều mang **Bearer Token** trong header Authorization.  
>
> **Giai đoạn 2 — Duyệt & Mua hàng:** Sản phẩm được tải từ Firestore và hiển thị với bộ lọc đầy đủ theo danh mục, độ khó và giá. Người dùng thêm sản phẩm vào giỏ — giỏ hàng được Zustand persist kết hợp với localStorage, không mất dữ liệu khi tải lại trang.  
>
> **Giai đoạn 3 — Thanh toán:** Sau khi checkout, hệ thống xử lý thanh toán qua COD hoặc Chuyển khoản. Backend xác minh và cập nhật trạng thái đơn hàng lên Firestore.  
>
> **Giai đoạn 4 — Tạo ảnh AI:** Đây là giai đoạn đặc trưng nhất — người dùng nhập mô tả, hệ thống gọi Gemini để tạo ảnh và lưu kết quả lên Firebase Storage. Em sẽ trình bày chi tiết ở Phần 3.  
>
> **Giai đoạn 5 — Quản trị:** Admin đăng nhập vào dashboard riêng biệt với xác thực hai lớp, quản lý sản phẩm, đơn hàng, người dùng và cập nhật trạng thái đơn hàng."

---

## [SLIDE 5] — 7 NHÓM TÍNH NĂNG CHÍNH *(PHẦN 2 / ~4 phút)*

> "Bước sang **Phần 2**, em sẽ trình bày 7 nhóm tính năng chính.  
>
> **Nhóm 1 — Xác thực:** Đầy đủ đăng ký, đăng nhập và đăng xuất. Tính năng 'Ghi nhớ đăng nhập' lưu thông tin vào localStorage; nếu tắt tính năng này, sessionStorage được dùng thay thế. Hỗ trợ đặt lại mật khẩu qua email bằng Nodemailer.  
>
> **Nhóm 2 — Sản phẩm:** Danh sách sản phẩm có bộ lọc đầy đủ theo danh mục, độ khó và giá, kèm phân trang. Admin có thể thêm, sửa, xóa sản phẩm và tải ảnh trực tiếp lên Firebase Storage.  
>
> **Nhóm 3 — Giỏ hàng:** Giỏ hàng dùng Zustand persist — state không mất khi reload trang. Người dùng có thể lưu sản phẩm vào danh sách 'yêu thích' để mua sau. Hệ thống hỗ trợ 3 mã giảm giá: `YULING10` giảm 10%, `YULING20` giảm 20%, và `GIAMGIA15` giảm 15%.  
>
> **Nhóm 4 — Thanh toán:** Hỗ trợ COD (Tiền mặt khi nhận hàng) và Chuyển khoản ngân hàng. Có luồng xác minh callback để xác nhận giao dịch.  
>
> **Nhóm 5 — Đơn hàng:** Đơn hàng trải qua vòng đời: chờ xác nhận → đang xử lý → đang giao → đã giao hoặc đã hủy. Người dùng xem lịch sử đơn hàng; admin cập nhật trạng thái.  
>
> **Nhóm 6 — Tạo ảnh AI:** Đây là **tính năng trọng tâm** — được trình bày chi tiết ở Phần 3.  
>
> **Nhóm 7 — Dashboard Quản trị:** Quản lý toàn diện sản phẩm, đơn hàng, người dùng và cài đặt hệ thống, kèm bảng thống kê tổng quan."

---

## [SLIDE 6] — KIẾN TRÚC BACKEND — THIẾT KẾ PHÂN TẦNG

> "Trước khi đi vào tính năng Tạo ảnh AI, em muốn trình bày **kiến trúc phân tầng** của backend — đây là một quyết định thiết kế quan trọng.  
>
> Luồng xử lý request đi qua 4 tầng. **Routes** tiếp nhận request và thực hiện validation đầu vào cơ bản — có 14 route file. Tiếp theo là tầng **Middleware** với hai file chính: `auth.js` xác minh Firebase ID Token và gắn `req.user`, còn `adminAuth.js` thực thi **xác thực admin hai lớp**. **Services** chứa toàn bộ business logic với 6 file. Cuối cùng là tầng **Firebase** xử lý Firestore, Storage và Auth.  
>
> Cơ chế xác thực hai lớp `adminAuth` hoạt động như sau: **Lớp 1** kiểm tra email trong biến môi trường `ADMIN_EMAILS` — nhanh, không cần truy vấn database. **Lớp 2** truy vấn Firestore để kiểm tra tài liệu user có `role = 'admin'` — chính xác và linh hoạt, cho phép cấp hoặc thu hồi quyền admin mà không cần deploy lại.  
>
> Về Services: `productService` xử lý CRUD, lọc và phân trang; `orderService` quản lý vòng đời đơn hàng; `userService` quản lý tài khoản và hồ sơ người dùng."

---

## [SLIDE 7] — TẠO ẢNH AI — TỔNG QUAN *(PHẦN 3 / ~5 phút — TÍNH NĂNG CỐT LÕI)*

> "Và bây giờ là **Phần 3** — phần quan trọng nhất của đồ án: **tính năng Tạo ảnh AI**.  
>
> Em sử dụng mô hình **Gemini 2.5 Flash Image** của Google AI Studio — một trong số rất ít mô hình **miễn phí** hỗ trợ tạo ảnh inline qua REST API thuần túy, không cần SDK nặng. Mô hình trả về ảnh dưới dạng **Base64 inline data** trong response body.  
>
> Tính năng hỗ trợ **3 mức độ phức tạp**:  
> - **Dễ (16 màu):** Đường viền dày (3–4px), vùng tô lớn tối thiểu 40×40px, phong cách cartoon đơn giản — phù hợp trẻ em.  
> - **Trung bình (28 màu):** Đường viền chuẩn (2–3px), bán thực tế, vùng tô tối thiểu 18×18px — phù hợp người lớn.  
> - **Khó (44 màu):** Đường viền mảnh (1.5–2px), nhiều vùng nhỏ đến 8×8px — dành cho người có kinh nghiệm.  
>
> Đây là **luồng xử lý 7 bước** mà em đã thiết kế — sẽ được trình bày chi tiết ở hai slide tiếp theo."

---

## [SLIDE 8] — LUỒNG XỬ LÝ 7 BƯỚC — BƯỚC 1 ĐẾN 4

> "**Bước 1 — Người dùng gửi request:** Frontend POST đến `/api/generate/paint-by-numbers` kèm Bearer Token. Route được bảo vệ bởi middleware `authenticateUser`. Trước khi gửi cho Gemini, **MyMemory API** dịch prompt tiếng Việt sang tiếng Anh.  
>
> **Bước 2 — Backend phản hồi ngay với 202 Accepted:** Đây là quyết định thiết kế then chốt. Gemini có thể mất 30–120 giây để tạo ảnh — nếu giữ kết nối mở sẽ gây timeout. Thay vào đó, backend lập tức tạo tài liệu Firestore với `status: 'processing'` và trả về HTTP 202 kèm `generationId`. Frontend nhận ID này và bắt đầu polling.  
>
> **Bước 3 — Prompt Engineering:** Hàm `buildLineArtPrompt()` chạy ở nền dưới dạng **fire-and-forget** — không có `await`, không block Event Loop của Node.js. Prompt được lắp ghép từ template: mô hình được gán vai trò *'một illustrator paint-by-numbers chuyên nghiệp'*, tiếp theo là các **ràng buộc cứng** như vùng kín, đánh số, màu theo bảng màu, không watermark, không nội dung không phù hợp.  
>
> **Bước 4 — Gọi Google AI Studio API:** `generateContent` được gọi với `responseModalities: ['TEXT', 'IMAGE']`. Mô hình trả về mảng `parts[]`; em duyệt qua để tìm phần tử `inlineData` chứa chuỗi Base64 PNG, sau đó chuyển sang `Buffer`."

---

## [SLIDE 9] — LUỒNG XỬ LÝ 7 BƯỚC — BƯỚC 5 ĐẾN 7

> "**Bước 5 — Upload lên Firebase Storage:** Hàm `uploadToStorage()` tạo reference dưới `generations/<tên-file>`, lưu buffer với `contentType: 'image/png'` và gọi `makePublic()` để lấy URL công khai. Tại sao không trả Base64 thẳng về frontend? Vì ảnh Base64 nặng khoảng **500 KB văn bản** — quá lớn để lưu trong Firestore và không thể tái sử dụng. URL công khai nhỏ gọn và bền vững.  
>
> **Bước 6 — Cập nhật Firestore:** Tài liệu được cập nhật:  
> - Thành công: `status: 'completed'` + `imageUrl` + `completedAt`  
> - Thất bại: `status: 'failed'` + thông báo lỗi  
> - Vượt quota Gemini → `RESOURCE_EXHAUSTED` → đặt failed  
> - Vi phạm chính sách nội dung → `INVALID_ARGUMENT` → đặt failed  
> - Axios timeout sau 120 giây → đặt failed  
>
> **Bước 7 — Frontend Polling:** Frontend gọi `GET /api/generate/status/:id` mỗi **5 giây**, tối đa **60 lần** — tức 5 phút timeout. Server xác minh `userId` trong Firestore khớp với token — ngăn người dùng A xem kết quả của người dùng B. ID interval được lưu trong `useRef` và `clearInterval` được gọi khi component unmount — không rò rỉ bộ nhớ. Khi ảnh sẵn sàng, người dùng có thể **Tải xuống**, **Thêm vào giỏ hàng** hoặc **Thêm vào yêu thích**."

---

## [SLIDE 10] — TẠI SAO CHỌN GEMINI? PROMPT ENGINEERING

> "Câu hỏi tự nhiên đặt ra là: **tại sao chọn Gemini thay vì tự huấn luyện mô hình?**  
>
> Thứ nhất, Gemini là một trong số rất ít mô hình **miễn phí** hỗ trợ tạo ảnh inline qua REST API thuần túy. Gói miễn phí của Google AI Studio đủ đáp ứng quy mô đồ án này.  
>
> Thứ hai, về **Prompt Engineering so với huấn luyện mô hình:** Gemini đã được huấn luyện trên hàng tỷ dữ liệu — không cần huấn luyện lại từ đầu. Chiến lược của em là *định hướng* mô hình bằng prompt chi tiết. Cấu trúc prompt gồm ba phần: **Gán vai trò** → **Ràng buộc cứng** → **Biến runtime** (prompt người dùng + phong cách + độ phức tạp). Kết quả là cùng một mô hình luôn **xuất ra đúng định dạng paint-by-numbers**.  
>
> **Đây là đóng góp kỹ thuật chính của em:** Em đã thiết kế hệ thống Prompt Engineering có cấu trúc để tạo ra một cách đáng tin cậy bố cục 78%/22%, vùng kín, đánh số và hàng bảng màu — cùng với toàn bộ pipeline xử lý bất đồng bộ bao quanh nó."

---

## [SLIDE 11] — CẢM ƠN / HỎI ĐÁP

> "Như vậy là em đã hoàn thành bài thuyết trình về **Happy Coloring AI**.  
>
> Tóm lại: Em đã xây dựng và triển khai thành công một nền tảng thương mại điện tử hoàn chỉnh — tích hợp tính năng tạo ảnh AI qua Google Gemini, kiến trúc xử lý bất đồng bộ 7 bước, hệ thống xác thực admin hai lớp và CI/CD pipeline trên cả Vercel và Render.  
>
> Frontend trực tiếp: **happy-coloring-ai.vercel.app**  
> Backend API: **paint-by-numbers-back-end.onrender.com**  
>
> *Nói phần kết luận thật bình tĩnh và tự tin:*  
>
> 'Em xin kết thúc bài thuyết trình Đồ án Tốt nghiệp tại đây. Cảm ơn Thầy Cô đã dành thời gian lắng nghe. Em rất mong nhận được câu hỏi và góp ý từ Hội đồng.'  
>
> Em xin sẵn sàng trả lời câu hỏi. Xin cảm ơn."

---

## GỢI Ý TRẢ LỜI CÂU HỎI THƯỜNG GẶP

### "Tại sao chọn Firebase thay vì PostgreSQL / MySQL?"
> "Firestore là cơ sở dữ liệu NoSQL phù hợp với schema linh hoạt của đồ án — mỗi sản phẩm có thể có các thuộc tính khác nhau. Hơn nữa, Firebase gói gọn Auth, Storage và Database trong một hệ sinh thái, giảm đáng kể thời gian cấu hình và tích hợp — lý tưởng cho đồ án cá nhân."

### "Hệ thống chịu được bao nhiêu người dùng đồng thời?"
> "Backend đang chạy trên gói miễn phí của Render với tài nguyên hạn chế. Tuy nhiên, nhờ kiến trúc fire-and-forget bất đồng bộ, các request tạo ảnh không chặn lẫn nhau. Điểm nghẽn thực sự nằm ở giới hạn rate của Gemini API và tài nguyên compute của Render."

### "Tại sao dùng polling thay vì WebSocket?"
> "WebSocket phù hợp với giao tiếp hai chiều thời gian thực như chat. Ở đây, client chỉ cần biết khi nào tạo ảnh xong — polling mỗi 5 giây là đủ và đơn giản hơn nhiều, không cần duy trì kết nối liên tục."

### "Gemini API key được bảo vệ như thế nào?"
> "API key được lưu trong file `.env` ở backend và không bao giờ hard-code hay để lộ ra phía client. File `.env` được liệt kê trong `.gitignore`. Trên Render, nó được lưu dưới dạng biến môi trường mã hóa."

### "Mã voucher có thể bị brute-force không?"
> "Về lý thuyết có rủi ro này. Ở phiên bản hiện tại, rate limiting 100 request/15 phút/IP làm chậm đáng kể mọi nỗ lực brute-force. Các cải tiến trong tương lai — như hash mã voucher hoặc thêm CAPTCHA — đã được lên kế hoạch."

---

*Kết thúc file — Tống Bảo Duy, GCS210642, Đại học Greenwich Việt Nam, 2025–2026*
