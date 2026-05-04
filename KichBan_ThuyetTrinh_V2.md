# KỊCH BẢN THUYẾT TRÌNH — PHIÊN BẢN 2 (DEMO LIVE + Q&A CHI TIẾT)

**Dự án:** Happy Coloring AI — AI-Integrated Paint-by-Numbers E-Commerce Platform  
**Sinh viên:** Tống Bảo Duy — GCS210642  
**Phiên bản:** 2 — Tập trung vào demo live và phản biện kỹ thuật sâu  

---

> **Hướng dẫn sử dụng phiên bản 2:**  
> Phiên bản này thích hợp khi hội đồng **hỏi sâu về kỹ thuật** hoặc khi có thời gian **demo trực tiếp** trên trình duyệt.  
> Tổng thời lượng: **~15–18 phút** bao gồm demo.  
> Các phần in `[DEMO]` là hướng dẫn thao tác trực tiếp trên website.

---

## MỞ ĐẦU — [SLIDE 1]

*Chuẩn bị tab trình duyệt mở sẵn tại https://happy-coloring-ai.vercel.app. Đứng thẳng, nhìn vào hội đồng.*

> "Kính thưa Thầy/Cô trong hội đồng phản biện.
>
> Em tên là **Tống Bảo Duy**, mã số **GCS210642**. Em xin phép trình bày đồ án tốt nghiệp của mình.
>
> Trước khi vào phần slides, em muốn đặt một câu hỏi để mở đầu: **Bạn có bao giờ muốn tô màu một bức tranh do chính mình nghĩ ra không?** Không phải chọn từ catalogue có sẵn — mà là tranh từ trí tưởng tượng của chính mình?
>
> Đó chính xác là vấn đề mà **Happy Coloring AI** giải quyết. Hệ thống cho phép người dùng nhập mô tả bằng tiếng Việt — ví dụ 'con mèo đang ngủ trên mái nhà Hội An' — và nhận về một bộ tranh tô màu theo số hoàn chỉnh, sẵn sàng in và tô.
>
> Trong 15 phút tới, em sẽ trình bày kiến trúc hệ thống, demo live, và đặc biệt đi sâu vào phần kỹ thuật mà em đã nghiên cứu và xây dựng."

---

## PART 1 — PHÂN TÍCH VẤN ĐỀ VÀ GIẢI PHÁP [SLIDE 2]

> "Để hiểu tại sao đồ án này có ý nghĩa, em xin bắt đầu bằng **Context Analysis**.
>
> **Vấn đề thị trường:** Thị trường tranh tô màu toàn cầu đạt 1.2 tỷ USD năm 2023, tăng trưởng 6.1%/năm. Nhưng **100% sản phẩm hiện tại** đều là template cố định. Người dùng chỉ có thể chọn từ catalog — không thể tạo tranh cá nhân hoá.
>
> **Giải pháp kỹ thuật của em:** Kết hợp ba thành phần:
> - **E-commerce platform** đầy đủ: browse → cart → checkout → order tracking
> - **AI Generation** dùng Google Gemini 2.5 Flash Image: text → paint-by-numbers image  
> - **Admin system** quản lý toàn bộ vận hành
>
> **Điểm phân biệt so với các hệ thống tương tự:** Đây không chỉ là một chatbot AI hay một cửa hàng đơn thuần — mà là **tích hợp native** AI vào luồng thương mại điện tử. Ảnh AI được tạo có thể được thêm vào giỏ hàng, thanh toán, và đặt in ngay trong cùng một hệ thống."

---

## PART 2 — KIẾN TRÚC HỆ THỐNG [SLIDE 3 → SLIDE 4]

> "Về kiến trúc tổng thể, đây là hệ thống **Full-Stack** với hai service độc lập được deploy riêng biệt.
>
> **Frontend** — Next.js 14 App Router, deploy trên Vercel với CI/CD tự động. Mỗi push lên branch `main` trên GitHub là Vercel tự build và deploy. Zero downtime.
>
> **Backend** — Node.js + Express.js RESTful API, deploy trên Render. Tương tự, CI/CD qua GitHub webhook.
>
> **Database** — Firebase Firestore NoSQL, 5 collections: Users, Products, Orders, Generations, Settings.
>
> **Tại sao tách frontend và backend thay vì monolith?** Ba lý do:  
> 1. *Scale độc lập* — backend có thể scale riêng khi AI generation tăng tải  
> 2. *Deploy riêng biệt* — frontend có thể update giao diện mà không cần restart backend  
> 3. *Security boundary* — API keys và admin logic nằm hoàn toàn phía backend, frontend không bao giờ thấy
>
> **[SLIDE 4 — System Flow]**
>
> Luồng request đi như sau: Người dùng trên browser → HTTPS → Vercel CDN → Next.js → Axios gọi API → Express Router → Middleware (auth verify) → Service layer → Firebase. Response đi ngược lại. Toàn bộ đều qua HTTPS, không có HTTP nào."

---

## PART 3 — DEMO LIVE [~5 PHÚT]

*Chuyển sang tab trình duyệt, chia sẻ màn hình nếu có projector.*

### 3.1 — Demo Trang Chủ và Gallery

> "Đây là trang chủ live tại **happy-coloring-ai.vercel.app**. Em xin chú ý một số điểm kỹ thuật:
>
> — Animation 'Color with Pure Elegance' dùng **Framer Motion** với `staggerChildren` — các chữ xuất hiện lần lượt.  
> — Background có `backdrop-blur` và `parallax scroll` effect.  
> — Trang này là **Static Site Generated** — Next.js pre-render tĩnh, không cần server để serve HTML, rất nhanh."

*[DEMO] Scroll xuống, click Explore Gallery.*

> "Gallery có **filter theo category, difficulty, price range**. Filter không reload trang — state được quản lý trong Zustand, filter thay đổi query params trên URL, trang re-render tại client. Điều này giúp URL shareable — copy URL gửi cho bạn bè sẽ giữ nguyên filter."

### 3.2 — Demo AI Generation

*[DEMO] Click 'Generate AI Art' trên navbar, đăng nhập nếu cần.*

> "Đây là trang **Generate**. Em sẽ nhập một prompt tiếng Việt:
> `'con mèo màu cam đang ngủ trong rổ hoa'`
>
> Chọn độ phức tạp **Easy** — 16 màu, phù hợp demo.
>
> Click Generate. Ngay lập tức, backend trả về **HTTP 202 Accepted** — không phải 200. Lý do kỹ thuật quan trọng: Gemini cần 30–120 giây để sinh ảnh. Nếu giữ kết nối mở, request sẽ timeout. Backend ngay lập tức tạo document trong Firestore với status 'processing' và trả ID. Frontend bắt đầu **polling mỗi 5 giây**.
>
> Trong khi chờ, em có thể giải thích prompt đang được xử lý:  
> 1. MyMemory API dịch 'con mèo màu cam đang ngủ trong rổ hoa' → 'orange cat sleeping in a flower basket'  
> 2. Prompt được inject vào template 150+ từ với hard constraints về line art, numbered regions  
> 3. Google AI Studio trả Base64 PNG  
> 4. Upload lên Firebase Storage → public URL  
> 5. Firestore document update → frontend polling nhận 'completed' → hiển thị ảnh"

*[DEMO] Khi ảnh xuất hiện, chỉ ra numbered regions và color palette row.*

> "Đây là kết quả — bức tranh tô màu theo số hoàn chỉnh, có:  
> - Vùng vẽ chiếm 78% canvas trên  
> - Palette row ở 22% dưới với đầy đủ color swatches đánh số  
> - Mọi vùng đều được đánh số từ 1 đến 16
>
> Người dùng có thể **Download**, **Add to Cart**, hoặc **Add to Favorites** ngay tại đây."

### 3.3 — Demo Admin Panel

*[DEMO] Đăng nhập với tài khoản admin, vào /admin.*

> "Admin panel chỉ accessible sau khi pass **hai lớp xác thực**:
> - Lớp 1: Email phải có trong environment variable ADMIN_EMAILS  
> - Lớp 2: Firestore document phải có `role: 'admin'`
>
> Đây là dashboard với stats tổng quan. Em có thể thêm sản phẩm, upload ảnh trực tiếp lên Firebase Storage, quản lý đơn hàng theo pipeline: pending → processing → shipping → delivered."

---

## PART 4 — KỸ THUẬT SÂU: AI GENERATION SYSTEM [SLIDE 7 → 9]

> "Phần quan trọng nhất về mặt kỹ thuật là **thiết kế hệ thống async**.
>
> **Vấn đề:** HTTP request có timeout mặc định 30 giây. Gemini cần 30–120 giây. Conflict.
>
> **Giải pháp của em — Pattern: Job Queue nhẹ với Firestore:**
>
> ```
> Client                    Server                   Firebase
>   |                          |                         |
>   |── POST /generate ──────>|                         |
>   |                          |── Create doc (processing)──>|
>   |<─ 202 + generationId ───|                         |
>   |                          |                         |
>   |   (every 5 seconds)      |── Fire-and-forget task |
>   |── GET /status/:id ──────>|── AI generation ──────>Gemini
>   |<─ {status: processing} ─|                         |
>   |                          |<── Base64 image ───────|
>   |── GET /status/:id ──────>|── Upload Storage ──────>|
>   |<─ {status: completed,   |── Update doc ───────────>|
>   |    imageUrl: ...} ──────|                         |
> ```
>
> **Điểm kỹ thuật đáng chú ý:**
>
> Một: `generatePaintByNumbers()` chạy **không có `await`** — đây là intentional fire-and-forget. Nó không block Event Loop. Node.js có thể tiếp tục xử lý request khác trong khi generation đang chạy.
>
> Hai: Polling trên frontend dùng `setInterval` với ID được lưu trong `useRef`. Khi component unmount (người dùng navigate đi), `clearInterval` được gọi trong cleanup function của `useEffect`. Không có memory leak.
>
> Ba: Security trong polling — `GET /status/:id` kiểm tra `data.userId !== req.user.uid` trước khi trả dữ liệu. Người dùng A không thể lấy ảnh của người dùng B dù biết generationId."

---

## PART 5 — PROMPT ENGINEERING [SLIDE 10]

> "Prompt Engineering là **contribution kỹ thuật chính** của em — không phải training model, mà là 'steering' model.
>
> **Cấu trúc prompt 4 sections:**
>
> **Section 1 — Canvas Layout:** Chia canvas 1024×1024 thành 78% vùng vẽ + 22% palette. Đây là constraint cứng — nếu không có, Gemini sẽ generate ảnh thông thường.
>
> **Section 2 — Drawing Zone Rules:** Subject accuracy là critical — 'Draw X and nothing else. Do NOT replace, simplify, or omit any part.' Đây phòng chống hallucination. Line art rules: 'pure black outlines on pure white background ONLY. Zero grey tones, zero colour tints.' Nếu không có rule này, Gemini sẽ thêm shading và gradient.
>
> **Section 3 — Numbering Rules:** 'Every single region must contain exactly one small black number. Numbers outside range 1..N are forbidden. Every integer from 1 to N must appear at least once.' Constraints này đảm bảo tính usable của tranh.
>
> **Section 4 — Absolute Prohibitions:** Danh sách tường minh những gì KHÔNG được làm. Tôi nhận ra rằng AI models respond better to explicit prohibitions than implied constraints.
>
> **Kết quả:** Trước khi có Section 4, model thỉnh thoảng thêm watermark hoặc text labels. Sau khi thêm explicit prohibition, tỉ lệ lỗi giảm đáng kể."

---

## PART 6 — BẢO MẬT (OWASP TOP 10) [SLIDE 5 → 6]

> "Em muốn nói riêng về bảo mật vì đây là tiêu chí đánh giá quan trọng.
>
> **A1 — Broken Access Control:** Mọi route nhạy cảm đều require Bearer Token. Admin routes có double-layer auth. Order status endpoint kiểm tra ownership. User chỉ CRUD được data của chính mình.
>
> **A2 — Cryptographic Failures:** Không có password được lưu trong database — toàn bộ authentication qua Firebase Auth (Google-managed). JWT tokens được Firebase ký bằng RS256.
>
> **A3 — Injection:** Prompt từ người dùng được sanitize để loại bỏ template markers `{{` và `}}` trước khi inject vào prompt template. SQL/NoSQL injection không applicable vì Firestore dùng SDK, không phải string queries.
>
> **A4 — Insecure Design:** CORS whitelist chỉ cho phép domain cụ thể. Rate limiting 100 req/15min/IP. Helmet.js thiết lập 14 HTTP security headers bao gồm HSTS, X-Frame-Options, CSP.
>
> **A5 — Security Misconfiguration:** `.env` trong `.gitignore`. API keys chỉ trong backend environment variables. Firebase Security Rules restrict read/write theo authentication status.
>
> **A6 — Vulnerable Components:** Tất cả dependencies được audit bằng `npm audit`. Không có high/critical vulnerability trong production dependencies."

---

## KẾT LUẬN [SLIDE 11]

> "Để tóm tắt những gì em đã đạt được:
>
> **Về chức năng:** Một hệ thống thương mại điện tử đầy đủ với tính năng AI generation độc đáo, chạy ổn định trên cloud. Không phải prototype — đây là production deployment.
>
> **Về kỹ thuật:** Em đã giải quyết vấn đề async AI generation với pattern job queue nhẹ dùng Firestore + polling. Em đã thiết kế prompt engineering có cấu trúc để ổn định output của Gemini thành đúng định dạng tranh tô màu.
>
> **Về học thuật:** Đồ án này tích hợp kiến thức từ nhiều module: Web Development, Database Systems, Software Engineering, Cloud Computing, và Security.
>
> **Hướng phát triển tương lai:**  
> - Tích hợp cổng thanh toán VNPay/MoMo  
> - WebSocket thay polling cho real-time generation progress  
> - Fine-tune prompt cho từng style (watercolor, oil painting, etc.)  
> - Progressive Web App (PWA) cho mobile
>
> Em xin kết thúc phần trình bày tại đây. Em trân trọng mọi câu hỏi từ hội đồng và sẵn sàng giải thích chi tiết bất kỳ khía cạnh kỹ thuật nào.
>
> *Nói tiếng Anh cho phần kết:*
> 'Thank you very much for your time. I'm ready for your questions.'"

---

## CÂU HỎI PHẢN BIỆN KỸ THUẬT SÂU — GỢI Ý TRẢ LỜI

---

### "Tại sao dùng polling thay vì WebSocket hay Server-Sent Events?"

> "Đây là câu hỏi rất hay. Em đã cân nhắc cả ba phương án:
>
> **WebSocket:** Phù hợp cho bi-directional real-time communication như chat. Nhưng generation là one-way notification — server chỉ cần báo 'xong rồi'. WebSocket sẽ over-engineer.
>
> **Server-Sent Events (SSE):** Closer to what we need — server pushes events. Nhưng Render free tier có connection limit và không keep-alive connections tốt.
>
> **Polling:** Đơn giản, stateless, hoạt động với bất kỳ load balancer nào, không tốn connection slot. Với interval 5 giây và max 60 lần (5 phút timeout), tổng cost là 60 lightweight GET requests — chấp nhận được.
>
> Nếu scale lên production với nhiều concurrent users, SSE sẽ là upgrade tự nhiên tiếp theo."

---

### "Nếu Gemini API down, hệ thống xử lý thế nào?"

> "Em đã thiết kế graceful degradation:
>
> 1. Nếu Gemini trả lỗi, `generatePaintByNumbers()` catch exception và update Firestore document sang `status: 'failed'` với error message.
> 2. Phía frontend, khi polling nhận `status: 'failed'`, hiển thị error message cho user và offer retry.
> 3. `GOOGLE_IMAGE_MODELS` array hiện có một model, nhưng kiến trúc cho phép thêm fallback models — nếu model chính fail, thử model tiếp theo.
> 4. API key quota exhausted → `RESOURCE_EXHAUSTED` error → caught và set failed với message 'quota exceeded'."

---

### "Firestore NoSQL có nhược điểm gì so với SQL cho hệ thống thương mại điện tử?"

> "Thực sự có một số trade-off quan trọng:
>
> **Nhược điểm của Firestore:**
> - Không có ACID transactions across collections — nếu create order thành công nhưng update inventory fail, cần compensating transaction manual
> - Không có complex joins — query 'orders kèm theo product details' cần 2 round trips hoặc denormalization
> - Không có aggregation pipeline như MongoDB — COUNT, SUM cần code tay
>
> **Lý do em vẫn chọn:**
> - Scope của đồ án chưa có inventory management (số lượng tồn kho) nên transaction issue chưa critical
> - Firebase Auth + Firestore cùng ecosystem giảm integration complexity đáng kể
> - Real-time listener của Firestore sẽ có ích khi upgrade lên WebSocket pattern
>
> Nếu scale lên hệ thống thực tế với inventory management, em sẽ cân nhắc PostgreSQL hoặc hybrid: PostgreSQL cho transactional data, Firestore cho user sessions và real-time features."

---

### "Code của em có thể bị tấn công bằng cách nào? Em đã phòng chống thế nào?"

> "Em xác định 4 attack surface chính:
>
> **1. Authentication bypass:** Firebase ID Token được verify phía server bằng `auth.verifyIdToken()` — token giả hoặc expired đều bị reject. Không có 'remember token' custom nào được lưu trong database.
>
> **2. IDOR (Insecure Direct Object Reference):** Tất cả endpoints truy xuất data đều check ownership. Ví dụ GET /orders/:id sẽ trả 403 nếu `order.userId !== req.user.uid`.
>
> **3. Prompt injection:** User prompt được sanitize để remove `{{` và `}}` trước khi inject vào Gemini prompt template. Rate limit 100/15min ngăn brute-force generation.
>
> **4. Mass assignment:** Khi update user profile hoặc order, em explicitly destructure chỉ các field được phép thay vì `Object.assign(doc, req.body)`. Người dùng không thể tự set `role: 'admin'` bằng cách inject vào request body."

---

### "Tại sao không dùng Next.js API Routes thay vì backend Express riêng biệt?"

> "Câu hỏi rất valid. Next.js API Routes hoặc thậm chí Server Actions trong Next.js 14 hoàn toàn có thể thay thế một backend Express đơn giản.
>
> Lý do em chọn tách riêng:
>
> **1. Firebase Admin SDK có giới hạn trên Vercel Serverless.** Vercel function có memory limit 1GB và execution timeout 10 giây (free plan). Trong khi Gemini generation cần đến 120 giây — không thể chạy trong Vercel function. Cần một persistent server.
>
> **2. Background tasks.** Fire-and-forget pattern cần server tồn tại sau khi response đã được gửi đi. Serverless functions không hỗ trợ điều này.
>
> **3. Swagger documentation.** Em có `/api-docs` endpoint với UI documentation đầy đủ — dễ implement trên Express.
>
> Nếu AI generation không có yêu cầu long-running, em sẽ dùng Next.js Server Actions cho simplicity."

---

*Cuối file — Tống Bảo Duy, GCS210642, Greenwich University Vietnam, 2025–2026*  
*Phiên bản 2 — Demo Live + Phản biện Kỹ thuật Sâu*
