# KỊCH BẢN THUYẾT TRÌNH — PHIÊN BẢN 2 (DEMO TRỰC TIẾP + HỎI ĐÁP KỸ THUẬT SÂU)

**Dự án:** Happy Coloring AI — Nền tảng thương mại điện tử Paint-by-Numbers tích hợp AI  
**Sinh viên:** Tống Bảo Duy — GCS210642  
**Phiên bản:** 2 — Tập trung vào demo trực tiếp và phản biện kỹ thuật chuyên sâu

---

> **Hướng dẫn dùng Phiên bản 2:**  
> Phiên bản này phù hợp nhất khi Hội đồng đặt **câu hỏi kỹ thuật chuyên sâu** hoặc khi có thời gian cho **demo trực tiếp trên trình duyệt**.  
> Thời gian dự kiến: **~15–18 phút** bao gồm cả demo.  
> Các mục ghi `[DEMO]` là hướng dẫn thao tác từng bước trên website thật.

---

## MỞ ĐẦU — [SLIDE 1]

*Mở sẵn tab trình duyệt tại https://happy-coloring-ai.vercel.app. Đứng thẳng, nhìn vào Hội đồng.*

> "Kính thưa Ban Giám Khảo, kính thưa Quý Thầy Cô.  
>
> Em tên là **Tống Bảo Duy**, mã sinh viên **GCS210642**. Hôm nay em xin trình bày Đồ án Tốt nghiệp của mình.  
>
> Trước khi vào slide, em muốn bắt đầu bằng một câu hỏi: **Thầy Cô có bao giờ muốn tô màu một bức tranh do chính mình nghĩ ra không?** Không phải chọn từ một danh mục cố định — mà là bức tranh sinh ra từ ý tưởng của bản thân?  
>
> Đó chính xác là vấn đề mà **Happy Coloring AI** giải quyết. Hệ thống cho phép người dùng nhập một mô tả — ví dụ 'con mèo đang ngủ trên mái ngói ở Hội An' — và nhận lại một bức tranh đánh số hoàn chỉnh, sẵn sàng để in.  
>
> Trong 15 phút tới, em sẽ trình bày kiến trúc hệ thống, chạy demo trực tiếp, và đi sâu vào các quyết định kỹ thuật đằng sau sản phẩm này."

---

## PHẦN 1 — PHÂN TÍCH VẤN ĐỀ VÀ GIẢI PHÁP [SLIDE 2]

> "Để hiểu tại sao đồ án này có ý nghĩa thực tiễn, em bắt đầu bằng phần **Phân tích bối cảnh**.  
>
> **Vấn đề thị trường:** Thị trường tranh tô màu theo số toàn cầu đạt 1.2 tỷ USD năm 2023, tăng trưởng 6.1% mỗi năm. Tuy nhiên, **100% sản phẩm hiện tại** đều dùng mẫu có sẵn cố định. Người mua chỉ có thể chọn từ danh mục — không thể cá nhân hóa.  
>
> **Giải pháp kỹ thuật** của em kết hợp ba thành phần:  
> - Một **nền tảng thương mại điện tử** hoàn chỉnh: duyệt sản phẩm → giỏ hàng → thanh toán → theo dõi đơn hàng  
> - **Tạo ảnh AI** dùng Google Gemini 2.5 Flash Image: văn bản → ảnh tranh tô màu  
> - **Hệ thống Quản trị** để vận hành toàn bộ  
>
> **Điểm khác biệt so với các hệ thống tương tự:** Đây không chỉ là một chatbot AI hay một cửa hàng đơn giản — đây là **tích hợp bản địa** của AI vào luồng thương mại điện tử. Tranh do AI tạo có thể được thêm vào giỏ hàng, thanh toán và gửi đi in, tất cả trong cùng một hệ thống."

---

## PHẦN 2 — KIẾN TRÚC HỆ THỐNG [SLIDE 3 → SLIDE 4]

> "Kiến trúc tổng thể là hệ thống **Full-Stack** với hai dịch vụ triển khai độc lập.  
>
> **Frontend** — Next.js 14 App Router, deploy trên Vercel với CI/CD tự động. Mỗi lần push lên nhánh `main` trên GitHub, Vercel tự động build và deploy. Không có downtime.  
>
> **Backend** — RESTful API Node.js + Express.js, deploy trên Render. Cùng cách tiếp cận CI/CD qua GitHub webhook.  
>
> **Database** — Firebase Firestore NoSQL với 5 collection: Users, Products, Orders, Generations và Settings.  
>
> **Tại sao tách frontend và backend thay vì dùng monolith?** Ba lý do:  
> 1. *Scale độc lập* — backend có thể scale riêng khi tải tạo ảnh AI tăng  
> 2. *Deploy độc lập* — cập nhật giao diện mà không cần restart backend  
> 3. *Ranh giới bảo mật* — API key và logic admin nằm hoàn toàn ở backend; frontend không bao giờ thấy chúng  
>
> **[SLIDE 4 — Luồng hệ thống]**  
>
> Luồng request là: Người dùng trên trình duyệt → HTTPS → Vercel CDN → Next.js → Axios gọi API → Express Router → Middleware (xác minh auth) → Service layer → Firebase. Response đi ngược lại theo cùng đường. Toàn bộ chạy qua HTTPS — không có HTTP thuần."

---

## PHẦN 3 — DEMO TRỰC TIẾP [~5 PHÚT]

*Chuyển sang tab trình duyệt và chia sẻ màn hình nếu có máy chiếu.*

### 3.1 — Demo Trang Chủ và Gallery

> "Đây là trang chủ trực tiếp tại **happy-coloring-ai.vercel.app**. Một số điểm kỹ thuật đáng chú ý:  
>
> — Animation 'Color with Pure Elegance' dùng **Framer Motion** với `staggerChildren` — mỗi từ xuất hiện theo thứ tự.  
> — Background có hiệu ứng `backdrop-blur` và `parallax scroll`.  
> — Trang này được **Static Site Generate** — Next.js pre-render thành HTML tĩnh, không cần server để phục vụ; tải rất nhanh."

*[DEMO] Cuộn xuống, nhấp Explore Gallery.*

> "Gallery có **lọc theo danh mục, độ khó và khoảng giá**. Bộ lọc không reload trang — state được quản lý trong Zustand, thay đổi bộ lọc cập nhật tham số URL query, trang re-render phía client. Điều này làm cho URL có thể chia sẻ — gửi link cho người khác giữ nguyên tất cả bộ lọc đang hoạt động."

### 3.2 — Demo Tạo Ảnh AI

*[DEMO] Nhấp 'Generate AI Art' trên navbar, đăng nhập nếu được yêu cầu.*

> "Đây là trang **Generate**. Em sẽ nhập prompt:  
> `'một con mèo cam đang ngủ trong giỏ hoa'`  
>
> Mức độ: **Dễ** — 16 màu, phù hợp cho demo.  
>
> Nhấn Generate. Backend ngay lập tức trả về **HTTP 202 Accepted** — không phải 200. Đây là quyết định kỹ thuật then chốt: Gemini có thể mất 30–120 giây để tạo ảnh. Nếu giữ kết nối mở, request sẽ timeout. Thay vào đó, backend tạo tài liệu Firestore với status 'processing' và trả về `generationId`. Frontend bắt đầu **polling mỗi 5 giây**.  
>
> Trong khi chờ, em có thể giải thích những gì đang xảy ra phía sau:  
> 1. MyMemory API dịch prompt sang tiếng Anh  
> 2. Prompt được nhúng vào template 150+ từ với ràng buộc cứng về line art và vùng đánh số  
> 3. Google AI Studio trả về PNG dạng Base64  
> 4. Upload lên Firebase Storage → lấy URL công khai  
> 5. Cập nhật tài liệu Firestore → frontend polling nhận 'completed' → hiển thị ảnh"

*[DEMO] Khi ảnh xuất hiện, chỉ ra các vùng đánh số và hàng bảng màu.*

> "Đây là kết quả — một bức tranh đánh số hoàn chỉnh với:  
> - Vùng vẽ chiếm 78% phía trên canvas  
> - Hàng bảng màu ở 22% phía dưới, với các ô màu được đánh số đầy đủ  
> - Mỗi vùng được đánh số từ 1 đến 16  
>
> Người dùng có thể **Tải xuống**, **Thêm vào giỏ** hoặc **Thêm vào yêu thích** ngay tại đây."

### 3.3 — Demo Bảng Quản Trị

*[DEMO] Đăng nhập bằng tài khoản admin, điều hướng đến /admin.*

> "Bảng quản trị chỉ truy cập được sau khi vượt qua **hai lớp xác thực**:  
> - Lớp 1: Email phải có trong biến môi trường `ADMIN_EMAILS`  
> - Lớp 2: Tài liệu user trong Firestore phải có `role: 'admin'`  
>
> Đây là dashboard với thống kê tổng quan. Em có thể thêm sản phẩm, tải ảnh trực tiếp lên Firebase Storage và quản lý đơn hàng qua pipeline: chờ xác nhận → đang xử lý → đang giao → đã giao."

---

## PHẦN 4 — KỸ THUẬT SÂU: HỆ THỐNG TẠO ẢNH AI [SLIDE 7 → 9]

> "Phần kỹ thuật quan trọng nhất là **thiết kế hệ thống bất đồng bộ**.  
>
> **Vấn đề:** HTTP request có timeout mặc định khoảng 30 giây. Gemini cần 30–120 giây. Đây là xung đột trực tiếp.  
>
> **Giải pháp của em — Pattern: Lightweight Job Queue với Firestore:**  
>
> ```
> Client                    Server                   Firebase
>   |                          |                         |
>   |── POST /generate ──────>|                         |
>   |                          |── Tạo doc (processing)──>|
>   |<─ 202 + generationId ───|                         |
>   |                          |                         |
>   |   (mỗi 5 giây)          |── Fire-and-forget task  |
>   |── GET /status/:id ──────>|── Tạo ảnh AI ─────────>Gemini
>   |<─ {status: processing} ─|                         |
>   |                          |<── Ảnh Base64 ──────────|
>   |── GET /status/:id ──────>|── Upload Storage ───────>|
>   |<─ {status: completed,   |── Cập nhật doc ──────────>|
>   |    imageUrl: ...} ──────|                         |
> ```
>
> **Các điểm kỹ thuật nổi bật:**  
>
> Một: `generatePaintByNumbers()` chạy **không có `await`** — đây là fire-and-forget có chủ đích. Nó không block Event Loop. Node.js có thể tiếp tục xử lý các request khác trong khi đang tạo ảnh.  
>
> Hai: Frontend polling dùng `setInterval` với ID lưu trong `useRef`. Khi component unmount — khi người dùng điều hướng đi — `clearInterval` được gọi trong hàm cleanup của `useEffect`. Không rò rỉ bộ nhớ.  
>
> Ba: Bảo mật trong polling — `GET /status/:id` kiểm tra `data.userId === req.user.uid` trước khi trả dữ liệu. Người dùng A không thể truy cập ảnh của người dùng B dù biết generationId."

---

## PHẦN 5 — PROMPT ENGINEERING [SLIDE 10]

> "Prompt Engineering là **đóng góp kỹ thuật chính** của em — không phải huấn luyện mô hình, mà là định hướng mô hình.  
>
> **Cấu trúc prompt 4 phần:**  
>
> **Phần 1 — Bố cục Canvas:** Chia canvas 1024×1024 thành 78% vùng vẽ + 22% bảng màu. Đây là ràng buộc cứng — không có nó, Gemini tạo ảnh thông thường không có cấu trúc.  
>
> **Phần 2 — Quy tắc Vùng vẽ:** Độ chính xác chủ đề rất quan trọng — 'Vẽ X và không có gì khác. KHÔNG thay thế, đơn giản hóa hay bỏ sót bất kỳ phần nào.' Điều này bảo vệ khỏi hallucination. Quy tắc line art: 'đường viền đen thuần trên nền trắng thuần ONLY. Không tông xám, không màu sắc.' Không có điều này, Gemini thêm bóng và gradient.  
>
> **Phần 3 — Quy tắc Đánh số:** 'Mỗi vùng phải chứa chính xác một số đen nhỏ. Số ngoài khoảng 1..N bị cấm. Mỗi số nguyên từ 1 đến N phải xuất hiện ít nhất một lần.' Các ràng buộc này đảm bảo bức tranh thực sự có thể sử dụng được.  
>
> **Phần 4 — Cấm tuyệt đối:** Danh sách rõ ràng những gì KHÔNG được phép. Em nhận thấy mô hình AI phản hồi tốt hơn với lệnh cấm tường minh hơn là ràng buộc ngụ ý.  
>
> **Kết quả:** Trước khi thêm Phần 4, mô hình đôi khi thêm watermark hoặc nhãn văn bản. Sau khi thêm lệnh cấm tường minh, tỷ lệ lỗi giảm đáng kể."

---

## PHẦN 6 — BẢO MẬT (OWASP TOP 10) [SLIDE 5 → 6]

> "Em muốn đề cập riêng về bảo mật, vì đây là tiêu chí đánh giá quan trọng.  
>
> **A1 — Broken Access Control:** Mọi route nhạy cảm đều yêu cầu Bearer Token. Route admin có xác thực hai lớp. Endpoint trạng thái đơn hàng kiểm tra quyền sở hữu. Người dùng chỉ có thể CRUD dữ liệu của chính mình.  
>
> **A2 — Cryptographic Failures:** Không có mật khẩu nào lưu trong database — toàn bộ xác thực qua Firebase Auth (do Google quản lý). JWT token được Firebase ký bằng RS256.  
>
> **A3 — Injection:** Prompt người dùng được sanitize để xóa template marker `{{` và `}}` trước khi nhúng vào template prompt. SQL/NoSQL injection không áp dụng vì Firestore dùng SDK, không dùng query chuỗi.  
>
> **A4 — Insecure Design:** Whitelist CORS chỉ cho phép các domain cụ thể. Rate limiting 100 request/15 phút/IP. Helmet.js thiết lập 14 HTTP security header bao gồm HSTS, X-Frame-Options và CSP.  
>
> **A5 — Security Misconfiguration:** `.env` nằm trong `.gitignore`. API key chỉ tồn tại dưới dạng biến môi trường backend. Firebase Security Rules hạn chế đọc/ghi dựa trên trạng thái xác thực.  
>
> **A6 — Vulnerable Components:** Tất cả dependency được kiểm tra với `npm audit`. Không có lỗ hổng high hoặc critical nào trong dependency production."

---

## KẾT LUẬN [SLIDE 11]

> "Tóm lại những gì em đã đạt được:  
>
> **Về chức năng:** Một hệ thống thương mại điện tử hoàn chỉnh với tính năng tạo ảnh AI độc đáo, chạy ổn định trên cloud. Đây không phải prototype — đây là bản triển khai production thực tế.  
>
> **Về kỹ thuật:** Em đã giải quyết bài toán tạo ảnh AI bất đồng bộ bằng pattern lightweight job queue với Firestore và polling. Em đã thiết kế hệ thống Prompt Engineering có cấu trúc để định hướng đầu ra của Gemini thành đúng định dạng paint-by-numbers.  
>
> **Về học thuật:** Đồ án tích hợp kiến thức từ nhiều môn học: Lập trình Web, Cơ sở Dữ liệu, Kỹ thuật Phần mềm, Điện toán Đám mây và Bảo mật.  
>
> **Hướng phát triển tương lai:**  
> - Tích hợp cổng thanh toán (VNPay / MoMo)  
> - Thay polling bằng WebSocket để theo dõi tiến độ tạo ảnh real-time  
> - Tinh chỉnh prompt theo phong cách nghệ thuật (màu nước, sơn dầu, v.v.)  
> - Progressive Web App (PWA) cho di động  
>
> Như vậy là em đã hoàn thành bài thuyết trình. Em rất trân trọng mọi câu hỏi từ Hội đồng và sẵn sàng thảo luận về bất kỳ khía cạnh kỹ thuật nào.  
>
> 'Xin cảm ơn Thầy Cô rất nhiều. Em sẵn sàng nhận câu hỏi.'"

---

## HỎI ĐÁP KỸ THUẬT SÂU — GỢI Ý TRẢ LỜI

---

### "Tại sao dùng polling thay vì WebSocket hoặc Server-Sent Events?"

> "Đây là câu hỏi rất hay. Em đã xem xét cả ba cách tiếp cận:  
>
> **WebSocket:** Phù hợp nhất cho giao tiếp hai chiều real-time như chat. Nhưng việc tạo ảnh chỉ cần thông báo một chiều — server chỉ cần báo 'xong rồi'. Dùng WebSocket ở đây là over-engineering.  
>
> **Server-Sent Events (SSE):** Gần hơn với công cụ phù hợp — server đẩy sự kiện. Tuy nhiên, gói miễn phí của Render có giới hạn kết nối và không xử lý tốt keep-alive connection.  
>
> **Polling:** Đơn giản, stateless, hoạt động với bất kỳ load balancer nào, không tốn connection slot. Với interval 5 giây và tối đa 60 lần (timeout 5 phút), tổng chi phí là 60 GET request nhẹ — hoàn toàn chấp nhận được.  
>
> Nếu scale lên production với nhiều người dùng đồng thời, SSE sẽ là bước nâng cấp tự nhiên tiếp theo."

---

### "Điều gì xảy ra nếu Gemini API bị lỗi?"

> "Em đã thiết kế đường dẫn degradation graceful:  
>
> 1. Nếu Gemini trả về lỗi, `generatePaintByNumbers()` bắt ngoại lệ và cập nhật tài liệu Firestore thành `status: 'failed'` kèm thông báo lỗi.  
> 2. Trên frontend, khi polling nhận `status: 'failed'`, hiển thị thông báo lỗi cho người dùng với tùy chọn thử lại.  
> 3. Mảng `GOOGLE_IMAGE_MODELS` hiện có một mô hình, nhưng kiến trúc cho phép thêm mô hình dự phòng — nếu mô hình chính lỗi, thử mô hình tiếp theo.  
> 4. Hết quota API → lỗi `RESOURCE_EXHAUSTED` → bắt và đặt failed với thông báo 'quota exceeded'."

---

### "Firestore có nhược điểm gì so với SQL cho hệ thống thương mại điện tử?"

> "Có những đánh đổi thực sự:  
>
> **Nhược điểm của Firestore:**  
> - Không có ACID transaction xuyên collection — nếu tạo đơn hàng thành công nhưng cập nhật tồn kho thất bại, cần transaction bù thủ công  
> - Không có join phức tạp — truy vấn 'đơn hàng kèm chi tiết sản phẩm' cần hai round trip hoặc denormalize dữ liệu  
> - Không có aggregation pipeline như MongoDB — COUNT và SUM phải tính trong code ứng dụng  
>
> **Lý do em vẫn chọn:**  
> - Phạm vi đồ án không có quản lý tồn kho, nên vấn đề transaction không quan trọng  
> - Firebase Auth + Firestore trong cùng hệ sinh thái giảm đáng kể độ phức tạp tích hợp  
> - Real-time listener của Firestore sẽ có giá trị trong bản nâng cấp WebSocket tương lai  
>
> Nếu scale lên hệ thống production thực sự với quản lý tồn kho, em sẽ cân nhắc PostgreSQL hoặc hybrid: PostgreSQL cho dữ liệu giao dịch, Firestore cho session người dùng và tính năng real-time."

---

### "Code của em có thể bị tấn công như thế nào? Em đã bảo vệ ra sao?"

> "Em xác định 4 bề mặt tấn công chính:  
>
> **1. Bypass xác thực:** Firebase ID Token được xác minh phía server qua `auth.verifyIdToken()` — token giả mạo hoặc hết hạn đều bị từ chối. Không có 'remember token' tùy chỉnh nào lưu trong database.  
>
> **2. IDOR (Insecure Direct Object Reference):** Tất cả endpoint truy cập dữ liệu đều kiểm tra quyền sở hữu. Ví dụ, `GET /orders/:id` trả về 403 nếu `order.userId !== req.user.uid`.  
>
> **3. Prompt injection:** Prompt người dùng được sanitize để xóa `{{` và `}}` trước khi nhúng vào template prompt Gemini. Rate limit 100 request/15 phút ngăn các nỗ lực brute-force generation.  
>
> **4. Mass assignment:** Khi cập nhật hồ sơ user hoặc đơn hàng, em destructure tường minh chỉ các field được phép thay vì dùng `Object.assign(doc, req.body)`. Điều này ngăn người dùng inject `role: 'admin'` vào request body."

---

### "Tại sao không dùng Next.js API Routes thay vì backend Express riêng?"

> "Câu hỏi rất xác đáng. Next.js API Routes — hay thậm chí Server Actions trong Next.js 14 — có thể thay thế một backend Express đơn giản.  
>
> Lý do em tách ra:  
>
> **1. Giới hạn Firebase Admin SDK trên Vercel Serverless.** Vercel function có timeout thực thi 10 giây trên gói miễn phí. Tạo ảnh Gemini cần tới 120 giây — đơn giản là không thể chạy trong Vercel function. Cần server persistent.  
>
> **2. Background task.** Pattern fire-and-forget đòi hỏi server phải còn hoạt động sau khi response đã được gửi. Serverless function không hỗ trợ điều này.  
>
> **3. Swagger documentation.** Em có endpoint `/api-docs` với UI tương tác đầy đủ — dễ implement trên Express.  
>
> Nếu tính năng AI generation không có yêu cầu long-running, em sẽ dùng Next.js Server Actions cho đơn giản."

---

*Kết thúc file — Tống Bảo Duy, GCS210642, Đại học Greenwich Việt Nam, 2025–2026*  
*Phiên bản 2 — Demo Trực tiếp + Phản biện Kỹ thuật Chuyên sâu*
