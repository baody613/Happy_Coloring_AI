# GIẢI THÍCH CÔNG NGHỆ & FRAMEWORK SỬ DỤNG TRONG DỰ ÁN

**Dự án:** Happy Coloring AI — Nền tảng thương mại điện tử Paint-by-Numbers tích hợp AI

---

## MỤC LỤC

1. [Frontend](#1-frontend)
2. [Backend](#2-backend)
3. [Cơ sở dữ liệu & Lưu trữ](#3-cơ-sở-dữ-liệu--lưu-trữ)
4. [AI & API bên ngoài](#4-ai--api-bên-ngoài)
5. [Triển khai & CI/CD](#5-triển-khai--cicd)

---

## 1. FRONTEND

### Next.js 14 (App Router)
- **Công dụng:** Framework chính để xây dựng toàn bộ giao diện người dùng với hơn 30 trang.
- **Tại sao dùng:** Next.js hỗ trợ **Server-Side Rendering (SSR)** và **Static Site Generation (SSG)** tích hợp sẵn. Trang sản phẩm dùng SSR giúp Google có thể crawl nội dung → tăng SEO. Trang chủ dùng SSG → render thành HTML tĩnh, tải cực nhanh mà không cần server. Hệ thống routing theo cấu trúc thư mục (`app/`) giúp quản lý 30+ trang một cách rõ ràng mà không cần cấu hình router thủ công.
- **Điểm đặc biệt trong dự án:** `safeStorage.ts` kiểm tra `typeof window !== 'undefined'` trước mọi lần đọc localStorage — giải quyết lỗi hydration khi Next.js render phía server không có `window` object.

---

### React 18
- **Công dụng:** Thư viện UI cốt lõi — mọi giao diện đều được xây dựng từ các React Component.
- **Tại sao dùng:** React dùng Virtual DOM để cập nhật giao diện hiệu quả, chỉ render lại phần thay đổi thay vì toàn bộ trang. React 18 bổ sung **Concurrent Rendering** giúp ứng dụng phản hồi mượt mà hơn khi xử lý nhiều tác vụ đồng thời (ví dụ: polling trạng thái tạo ảnh trong khi người dùng vẫn điều hướng trang).

---

### TypeScript
- **Công dụng:** Ngôn ngữ lập trình thay thế JavaScript thuần — thêm kiểu tĩnh (static typing) vào toàn bộ code frontend.
- **Tại sao dùng:** TypeScript phát hiện lỗi **ngay lúc viết code** thay vì lúc chạy. Ví dụ: nếu API trả về `imageUrl` là `string` nhưng code dùng nó như `object`, TypeScript báo lỗi ngay trong editor. Trong dự án có nhiều kiểu dữ liệu phức tạp (Product, Order, Generation...), TypeScript giúp tránh hàng chục lỗi runtime tiềm ẩn.

---

### Tailwind CSS
- **Công dụng:** Framework CSS utility-first để xây dựng toàn bộ giao diện responsive.
- **Tại sao dùng:** Thay vì viết file `.css` riêng cho từng component, Tailwind cho phép áp dụng style trực tiếp trong JSX bằng class ngắn gọn (`flex`, `bg-white`, `text-lg`, `hover:opacity-80`...). Kết quả: không cần đặt tên class, không có CSS conflict, và file cuối cùng sau build chỉ chứa đúng những style thực sự dùng đến (tree-shaking CSS). Đặc biệt hữu ích khi xây dựng giao diện responsive vì Tailwind có prefix `sm:`, `md:`, `lg:` rõ ràng.

---

### Framer Motion
- **Công dụng:** Thư viện animation dành riêng cho React.
- **Tại sao dùng:** CSS animation thuần không đủ linh hoạt cho các hiệu ứng phức tạp như animation theo thứ tự (`staggerChildren` — mỗi từ xuất hiện lần lượt trên trang chủ) hay transition khi component mount/unmount. Framer Motion cung cấp API khai báo (`initial`, `animate`, `exit`) dễ đọc và dễ kiểm soát hơn nhiều so với `@keyframes` thuần.
- **Dùng ở đâu:** Trang chủ (hero text animation), trang Generate (loading spinner), các card sản phẩm khi hover.

---

### Zustand
- **Công dụng:** Thư viện quản lý state toàn cục (global state management).
- **Tại sao dùng thay vì Redux:** Redux đòi hỏi nhiều boilerplate (actions, reducers, store config). Zustand cho phép tạo store chỉ với vài dòng code và đọc/cập nhật state bằng hook đơn giản `useStore()`. Kích thước bundle nhỏ hơn (~3kb so với Redux ~17kb).
- **Ba store chính trong dự án:**
  - `authStore` — lưu thông tin user đăng nhập, token, trạng thái loading
  - `cartStore` — lưu danh sách sản phẩm trong giỏ hàng, persist sang localStorage
  - `favoriteStore` — lưu danh sách sản phẩm yêu thích, persist sang localStorage
- **Tính năng persist:** Zustand kết hợp với `localStorage` để state không mất khi người dùng tải lại trang — giỏ hàng và yêu thích vẫn còn sau khi đóng trình duyệt.

---

### Axios (Frontend)
- **Công dụng:** HTTP client để gọi tất cả các API từ frontend đến backend.
- **Tại sao không dùng `fetch` thuần:** Axios tự động parse JSON response, có hệ thống **interceptor** mạnh mẽ. Trong dự án, interceptor được cấu hình để:
  1. Tự động đính kèm `Authorization: Bearer <token>` vào mọi request
  2. Khi token hết hạn (lỗi 401), tự động làm mới token từ Firebase rồi thử lại request
  Nếu dùng `fetch` thuần, phải viết lại logic này ở mọi nơi gọi API.

---

### Firebase SDK (Client)
- **Công dụng:** SDK Firebase chạy trong trình duyệt — xử lý xác thực người dùng phía client.
- **Tại sao dùng:** Firebase Auth cung cấp toàn bộ luồng đăng nhập (email/mật khẩu, Google OAuth) mà không cần tự xây dựng hệ thống xác thực. `onAuthStateChanged` listener tự động phát hiện khi người dùng đăng nhập/đăng xuất → cập nhật `authStore` → toàn bộ UI phản ứng ngay lập tức.

---

### react-hot-toast
- **Công dụng:** Hiển thị thông báo popup (toast notifications) — thành công, lỗi, loading.
- **Tại sao dùng:** Thay vì dùng `alert()` của trình duyệt (xấu và block UI) hoặc tự build component notification, `react-hot-toast` cung cấp toast đẹp, có animation, tự biến mất sau vài giây và hỗ trợ promise (hiển thị loading → tự chuyển thành thành công/lỗi).

---

### react-icons
- **Công dụng:** Thư viện icon tổng hợp — bao gồm Font Awesome, Material Icons, Heroicons... trong một package.
- **Tại sao dùng:** Thay vì tải nhiều font icon riêng lẻ, `react-icons` cho phép import đúng icon cần dùng dưới dạng React component, giúp tree-shaking loại bỏ icon không dùng khỏi bundle.

---

## 2. BACKEND

### Node.js
- **Công dụng:** Runtime environment để chạy JavaScript phía server.
- **Tại sao dùng:** Node.js dùng mô hình **non-blocking I/O** và **Event Loop** — nghĩa là trong khi đợi Gemini API trả về ảnh (30–120 giây), server không bị block mà vẫn xử lý được các request khác đến cùng lúc. Đây là lý do kỹ thuật cốt lõi cho phép pattern **fire-and-forget** hoạt động hiệu quả trong dự án.

---

### Express.js
- **Công dụng:** Web framework để xây dựng RESTful API — định nghĩa routes, middleware và xử lý request/response.
- **Tại sao dùng:** Express là framework Node.js phổ biến nhất, tối giản và linh hoạt. Nó cho phép tổ chức 49 API endpoint thành 14 route file riêng biệt, áp dụng middleware theo từng route (ví dụ: chỉ route `/admin` mới chạy qua `adminAuth`). Không có kiến trúc cứng nhắc — dễ tùy chỉnh theo nhu cầu.

---

### Firebase Admin SDK
- **Công dụng:** SDK Firebase chạy **phía server** — xác minh JWT token, truy cập Firestore và Firebase Storage với quyền admin.
- **Tại sao cần SDK riêng phía server:** Firebase SDK client chạy trong trình duyệt chỉ có quyền hạn chế theo Firebase Security Rules. Admin SDK dùng **Service Account** (file JSON chứa khóa riêng) để có quyền admin đầy đủ — có thể đọc/ghi bất kỳ tài liệu nào, xác minh token của bất kỳ user nào. Điều này bắt buộc phải giữ phía server, không được để lộ ra client.

---

### Helmet
- **Công dụng:** Middleware bảo mật — tự động thiết lập 14 HTTP security header.
- **Các header quan trọng nó thêm vào:**
  - `X-Frame-Options: DENY` — ngăn website bị nhúng vào iframe (chống Clickjacking)
  - `X-XSS-Protection` — kích hoạt bộ lọc XSS của trình duyệt
  - `Strict-Transport-Security` (HSTS) — buộc trình duyệt chỉ dùng HTTPS
  - `Content-Security-Policy` — kiểm soát nguồn tải script/style/image
- **Tại sao dùng:** Chỉ cần thêm `app.use(helmet())` là có ngay 14 lớp bảo vệ — tương đương hàng giờ cấu hình thủ công.

---

### express-rate-limit
- **Công dụng:** Giới hạn số lượng request từ một IP trong một khoảng thời gian.
- **Cấu hình trong dự án:** Tối đa **100 request / 15 phút / IP**.
- **Tại sao dùng:** Không có rate limit, kẻ tấn công có thể:
  - Brute-force mật khẩu (thử hàng nghìn mật khẩu tự động)
  - Spam endpoint tạo ảnh AI để tiêu hết quota Gemini
  - Làm sập server bằng DoS attack
  Rate limit là biện pháp phòng thủ đầu tiên và đơn giản nhất chống lại các tấn công này — phù hợp với OWASP Top 10 (A7 — Identification and Authentication Failures).

---

### Joi
- **Công dụng:** Thư viện validation — kiểm tra và làm sạch dữ liệu đầu vào từ request.
- **Tại sao dùng:** Không thể tin tưởng bất kỳ dữ liệu nào đến từ client. Joi cho phép định nghĩa schema rõ ràng: `prompt` phải là string, độ dài từ 3 đến 500 ký tự; `complexity` phải là một trong `['easy', 'medium', 'hard']`... Nếu request không hợp lệ, trả về lỗi 400 ngay lập tức mà không chạm đến database hay Gemini API.

---

### Morgan
- **Công dụng:** Middleware ghi log HTTP request — ghi lại mọi request đến server (method, URL, status code, thời gian phản hồi).
- **Tại sao dùng:** Khi có lỗi xảy ra trên production, log của Morgan cho biết chính xác request nào gây ra lỗi, từ IP nào, lúc mấy giờ. Không có log, việc debug trên production gần như không thể.

---

### Nodemailer
- **Công dụng:** Thư viện gửi email — dùng để gửi email đặt lại mật khẩu.
- **Tại sao dùng:** Firebase Auth không hỗ trợ tùy chỉnh nội dung email đặt lại mật khẩu trên gói miễn phí. Nodemailer cho phép gửi email HTML đẹp với nội dung tùy chỉnh (tên người dùng, link reset có thời hạn) qua SMTP của Gmail.

---

### Cors
- **Công dụng:** Middleware kiểm soát Cross-Origin Resource Sharing — quy định website nào được phép gọi API.
- **Tại sao dùng:** Không có CORS, trình duyệt sẽ chặn mọi request từ `happy-coloring-ai.vercel.app` đến backend vì chúng ở hai domain khác nhau. CORS middleware được cấu hình **whitelist** — chỉ cho phép domain của frontend (Vercel) và localhost trong môi trường dev. Các domain khác bị từ chối ngay tại tầng này.

---

### dotenv
- **Công dụng:** Load biến môi trường từ file `.env` vào `process.env`.
- **Tại sao dùng:** API keys, thông tin kết nối database, Service Account credentials... không được hard-code trong source code (sẽ bị lộ khi push lên GitHub). `dotenv` giúp tách biệt **cấu hình** khỏi **code** — file `.env` nằm trong `.gitignore` và không bao giờ commit.

---

### swagger-jsdoc + swagger-ui-express
- **Công dụng:** Tự động tạo tài liệu API tương tác tại endpoint `/api-docs`.
- **Tại sao dùng:** Với 49 API endpoint, tài liệu viết tay sẽ nhanh chóng lỗi thời. `swagger-jsdoc` đọc comment JSDoc trong code route để tự động tạo spec OpenAPI. `swagger-ui-express` render spec đó thành giao diện web tương tác — có thể test API trực tiếp trên trình duyệt mà không cần Postman.

---

### Nodemon (Dev)
- **Công dụng:** Tool tự động khởi động lại server khi phát hiện thay đổi file trong quá trình phát triển.
- **Tại sao dùng:** Không có nodemon, mỗi lần sửa code phải dừng server (`Ctrl+C`) rồi chạy lại thủ công. Nodemon theo dõi file system và tự restart — tiết kiệm đáng kể thời gian trong quá trình dev.

---

## 3. CƠ SỞ DỮ LIỆU & LƯU TRỮ

### Firebase Firestore
- **Công dụng:** Cơ sở dữ liệu NoSQL dạng tài liệu (document database) — lưu trữ toàn bộ dữ liệu ứng dụng.
- **Cấu trúc 5 collection trong dự án:**
  | Collection | Lưu gì |
  |---|---|
  | `users` | Thông tin người dùng: tên, email, địa chỉ, role |
  | `products` | Sản phẩm: tên, giá, danh mục, độ khó, ảnh URL |
  | `orders` | Đơn hàng: danh sách sản phẩm, tổng tiền, trạng thái, địa chỉ giao |
  | `generations` | Lịch sử tạo ảnh AI: prompt, imageUrl, status, userId |
  | `settings` | Cài đặt hệ thống: voucher codes, thông báo |
- **Tại sao NoSQL thay vì SQL:** Schema linh hoạt — mỗi sản phẩm có thể có số lượng thuộc tính khác nhau mà không cần ALTER TABLE. Firestore cũng hỗ trợ **real-time listener** — có thể subscribe vào collection và nhận cập nhật tức thì khi có thay đổi.

---

### Firebase Authentication
- **Công dụng:** Hệ thống xác thực người dùng — quản lý đăng ký, đăng nhập và cấp JWT token.
- **Tại sao dùng thay vì tự xây dựng:** Xây dựng hệ thống xác thực an toàn từ đầu (hash mật khẩu, quản lý session, chống brute-force...) tốn nhiều thời gian và dễ có lỗ hổng bảo mật. Firebase Auth xử lý tất cả điều này, đã được kiểm chứng bảo mật bởi Google, và cung cấp JWT (RS256) mà backend có thể xác minh độc lập mà không cần gọi về Firebase mỗi request.

---

### Firebase Storage
- **Công dụng:** Dịch vụ lưu trữ file — lưu ảnh sản phẩm và ảnh AI được tạo ra.
- **Tại sao dùng:** Lưu file nhị phân (ảnh) trong Firestore là không thể (giới hạn 1MB/document). Firebase Storage tích hợp sẵn với Firebase Auth (có thể cấu hình Security Rules theo user), cung cấp URL công khai ổn định cho mỗi file, và được host trên Google CDN — tải nhanh từ mọi vị trí địa lý.
- **Dùng cho tạo ảnh AI:** Gemini trả về ảnh dạng Base64 (~500KB văn bản) → không thể lưu trong Firestore → upload lên Storage → lấy URL ngắn gọn (~100 ký tự) → lưu URL vào Firestore.

---

## 4. AI & API BÊN NGOÀI

### Google Gemini 2.5 Flash Image
- **Công dụng:** Mô hình AI tạo ảnh — nhận prompt văn bản và trả về ảnh PNG dạng Base64.
- **Tại sao chọn mô hình này:** Đây là một trong số rất ít mô hình **miễn phí** hỗ trợ tạo ảnh inline qua REST API thuần, không cần cài SDK nặng. Gói miễn phí Google AI Studio đủ cho quy mô đồ án. Mô hình có khả năng tạo line art chất lượng cao khi được hướng dẫn đúng bằng Prompt Engineering.
- **Cách gọi:** POST đến Google AI Studio API với `responseModalities: ['TEXT', 'IMAGE']` → response chứa mảng `parts[]` → tìm phần tử có `inlineData.mimeType === 'image/png'` → decode Base64.

---

### Google Gemini 2.5 Flash Text
- **Công dụng:** Mô hình AI ngôn ngữ — dùng cho chatbot tư vấn sản phẩm trong ứng dụng.
- **Tại sao dùng mô hình riêng cho text:** Mô hình Image nặng hơn và tốn quota hơn mô hình Text. Dùng mô hình Text nhẹ hơn cho chatbot giúp tiết kiệm quota và phản hồi nhanh hơn (vài giây thay vì 30–120 giây).

---

### MyMemory API
- **Công dụng:** API dịch thuật miễn phí — dịch prompt của người dùng từ **tiếng Việt sang tiếng Anh** trước khi gửi cho Gemini.
- **Tại sao cần bước dịch:** Gemini được huấn luyện chủ yếu trên dữ liệu tiếng Anh. Prompt tiếng Anh cho kết quả chính xác và nhất quán hơn đáng kể so với prompt tiếng Việt. MyMemory là API dịch miễn phí, không cần key cho lượng dùng nhỏ — phù hợp với quy mô đồ án.

---

## 5. TRIỂN KHAI & CI/CD

### Vercel
- **Công dụng:** Nền tảng triển khai frontend — host và serve ứng dụng Next.js.
- **Tại sao dùng:** Vercel được tạo ra bởi chính team Next.js — tích hợp hoàn hảo, zero-config. Tính năng nổi bật:
  - **CI/CD tự động:** Mỗi lần push lên GitHub → Vercel tự build và deploy, không cần thao tác thủ công
  - **Global CDN:** Trang web được phục vụ từ server gần người dùng nhất → tải nhanh
  - **Preview Deployments:** Mỗi Pull Request có URL preview riêng để test trước khi merge
  - Gói miễn phí đủ dùng cho đồ án

---

### Render
- **Công dụng:** Nền tảng triển khai backend — host và chạy Express.js server.
- **Tại sao dùng:** Render hỗ trợ **persistent server** (server chạy liên tục 24/7) — điều kiện bắt buộc cho pattern fire-and-forget (server phải còn sống sau khi đã trả response). Không giống Vercel (serverless, function tắt sau khi xử lý xong), Render duy trì process Node.js chạy liên tục. CI/CD tương tự Vercel — push lên GitHub là tự deploy.

---

### GitHub
- **Công dụng:** Nền tảng lưu trữ source code và quản lý phiên bản với Git.
- **Vai trò trong CI/CD:** GitHub là trung tâm kết nối — khi push code lên GitHub:
  - Vercel webhook nhận tín hiệu → build và deploy frontend mới
  - Render webhook nhận tín hiệu → build và deploy backend mới
  Toàn bộ pipeline tự động, không cần SSH vào server hay chạy lệnh deploy thủ công.

---

*Tống Bảo Duy — GCS210642 — Đại học Greenwich Việt Nam — 2025–2026*
