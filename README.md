<div align="center">

# 🎨 Happy Coloring AI

### Nền tảng tranh tô màu số hóa tích hợp AI

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Node.js](https://img.shields.io/badge/Node.js-18+-green?style=for-the-badge&logo=node.js)
![Firebase](https://img.shields.io/badge/Firebase-Firestore-orange?style=for-the-badge&logo=firebase)
![Vercel](https://img.shields.io/badge/Frontend-Vercel-black?style=for-the-badge&logo=vercel)
![Render](https://img.shields.io/badge/Backend-Render-46E3B7?style=for-the-badge&logo=render)
![Gemini](https://img.shields.io/badge/AI-Gemini_2.5_Flash-4285F4?style=for-the-badge&logo=google)

**[🌐 Demo Live](https://happy-coloring-ai.vercel.app)** &nbsp;|&nbsp; **[🔌 API](https://paint-by-numbers-back-end.onrender.com)** &nbsp;|&nbsp; **[📖 API Docs](https://paint-by-numbers-back-end.onrender.com/api-docs)**

> Nền tảng thương mại điện tử cho phép người dùng mua tranh tô màu số hóa có sẵn **hoặc** tạo tranh tùy chỉnh từ mô tả tiếng Việt bằng Google Gemini AI.

</div>

---

## ✨ Tính năng chính

| Tính năng | Mô tả |
|---|---|
| 🤖 **AI Image Generation** | Nhập mô tả tiếng Việt, AI dịch và tạo tranh tô màu số hóa hoàn chỉnh |
| 🎨 **3 mức độ phức tạp** | Dễ (16 màu), Trung bình (28 màu), Khó (44 màu) |
| 🖼️ **Gallery** | Thư viện tranh có sẵn, lọc theo danh mục / độ khó / giá |
| 🛒 **Shopping Cart** | Giỏ hàng persistent (Zustand + localStorage), mã giảm giá |
| ❤️ **Yêu thích** | Lưu tranh yêu thích, persistent qua reload |
| 📦 **Order Management** | Vòng đời đơn hàng: chờ → xử lý → giao → hoàn thành / hủy |
| 💬 **AI Chatbot** | Tư vấn sản phẩm tự động bằng Gemini 2.5 Flash Text |
| 🔐 **Authentication** | Đăng ký / đăng nhập qua Firebase Auth + JWT (RS256) |
| 🏦 **Thanh toán** | COD và Chuyển khoản ngân hàng |
| 👑 **Admin Panel** | Quản lý sản phẩm, đơn hàng, người dùng với xác thực 2 lớp |
| 📊 **Swagger Docs** | Tài liệu API tương tác tại `/api-docs` |

---

## 🛠️ Công nghệ sử dụng

### Frontend

| Công nghệ | Phiên bản | Vai trò |
|---|---|---|
| **Next.js** (App Router) | 14 | React framework, SSR/SSG, file-system routing |
| **React** | 18 | UI library, Concurrent Rendering |
| **TypeScript** | 5 | Static typing, type safety |
| **Tailwind CSS** | 3 | Utility-first styling, responsive |
| **Zustand** | 4 | Global state (cart, auth, favorites) với persist |
| **Framer Motion** | 10 | Animations, staggerChildren, transitions |
| **Axios** | 1.6 | HTTP client với interceptor tự động gắn Bearer Token |
| **Firebase SDK** | 11 | Client-side auth, onAuthStateChanged |
| **react-hot-toast** | 2 | Toast notifications |
| **react-icons** | 4 | Icon library tổng hợp |

### Backend

| Công nghệ | Phiên bản | Vai trò |
|---|---|---|
| **Node.js** | 18+ | Runtime, non-blocking I/O, Event Loop |
| **Express.js** | 4 | REST API framework, 49 endpoints / 14 route file |
| **Firebase Admin SDK** | 10 | Xác minh JWT, truy cập Firestore/Storage phía server |
| **Helmet** | 7 | 14 HTTP security header (HSTS, CSP, X-Frame-Options…) |
| **express-rate-limit** | 7 | Giới hạn 100 req / 15 phút / IP |
| **Joi** | 17 | Schema validation đầu vào |
| **Morgan** | 1 | HTTP request logging |
| **Nodemailer** | 8 | Gửi email đặt lại mật khẩu |
| **cors** | 2 | CORS whitelist theo domain |
| **dotenv** | 16 | Quản lý biến môi trường |
| **swagger-jsdoc / swagger-ui-express** | 6/5 | Tự động sinh tài liệu API OpenAPI |

### Database & Storage

| Dịch vụ | Vai trò |
|---|---|
| **Firebase Firestore** | NoSQL document DB — 5 collection: Users, Products, Orders, Generations, Settings |
| **Firebase Authentication** | Quản lý tài khoản, JWT RS256 |
| **Firebase Storage** | Lưu ảnh sản phẩm và ảnh AI tạo ra |

### AI & API ngoài

| Dịch vụ | Vai trò |
|---|---|
| **Gemini 2.5 Flash Image** | Tạo tranh tô màu từ prompt (trả về Base64 PNG) |
| **Gemini 2.5 Flash Text** | Chatbot tư vấn sản phẩm |
| **MyMemory API** | Dịch prompt tiếng Việt → tiếng Anh trước khi gửi Gemini |

### Triển khai

| Thành phần | Nền tảng | URL |
|---|---|---|
| Frontend | **Vercel** (CI/CD từ GitHub) | `https://happy-coloring-ai.vercel.app` |
| Backend | **Render** (CI/CD từ GitHub) | `https://paint-by-numbers-back-end.onrender.com` |
| Docs | Swagger UI | `https://paint-by-numbers-back-end.onrender.com/api-docs` |

---

## 📁 Cấu trúc dự án

```
paint-by-numbers-ai/
├── frontend/                    # Next.js 14 App
│   └── src/
│       ├── app/                 # Pages (App Router)
│       │   ├── page.tsx         # Trang chủ
│       │   ├── generate/        # Tạo tranh AI
│       │   ├── gallery/         # Thư viện tranh
│       │   ├── products/[id]/   # Chi tiết sản phẩm
│       │   ├── cart/            # Giỏ hàng
│       │   ├── checkout/        # Thanh toán
│       │   ├── order-success/   # Xác nhận đơn hàng
│       │   ├── profile/         # Trang cá nhân & lịch sử đơn
│       │   ├── login/           # Đăng nhập
│       │   ├── register/        # Đăng ký
│       │   ├── forgot-password/ # Quên mật khẩu
│       │   └── admin/           # Dashboard quản trị
│       │       ├── page.tsx     # Thống kê tổng hợp
│       │       ├── products/    # Quản lý sản phẩm
│       │       ├── add-products/# Thêm sản phẩm
│       │       ├── orders/      # Quản lý đơn hàng
│       │       └── users/       # Quản lý người dùng
│       ├── components/          # React components dùng chung
│       ├── store/               # Zustand stores (authStore, cartStore, favoriteStore)
│       ├── lib/                 # API clients, Firebase config, helpers
│       ├── hooks/               # Custom React hooks
│       └── types/               # TypeScript type definitions
│
├── backend/                     # Express REST API
│   └── src/
│       ├── index.js             # Entry point, middleware setup
│       ├── routes/              # 14 route files, 49 endpoints
│       │   ├── auth.js          # Đăng ký, lấy profile
│       │   ├── generate.js      # Tạo ảnh AI, polling status
│       │   ├── products.js      # Sản phẩm (public + admin)
│       │   ├── orders.js        # Đơn hàng, voucher
│       │   ├── users.js         # Profile người dùng
│       │   ├── payment.js       # Thông tin chuyển khoản
│       │   └── admin/           # Routes quản trị
│       │       ├── users.js     # Quản lý users
│       │       ├── products.js  # Quản lý sản phẩm
│       │       └── orders.js    # Quản lý đơn hàng
│       ├── middleware/          # auth.js, adminAuth.js (xác thực 2 lớp)
│       ├── services/            # Business logic (6 service files)
│       ├── validators/          # Joi schemas
│       ├── utils/               # helpers.js, storageHelpers.js
│       └── config/              # firebase.js, swagger.js
│
├── KichBan_ThuyetTrinh.md       # Kịch bản thuyết trình V1 (Tiếng Anh)
├── KichBan_ThuyetTrinh_V2.md    # Kịch bản thuyết trình V2 (Tiếng Anh)
├── KichBan_ThuyetTrinh_VI.md    # Kịch bản thuyết trình V1 (Tiếng Việt)
├── KichBan_ThuyetTrinh_V2_VI.md # Kịch bản thuyết trình V2 (Tiếng Việt)
├── Tech.md                      # Giải thích chi tiết từng công nghệ
└── README.md
```

---

## 🚀 Cài đặt và chạy local

### Yêu cầu

- Node.js 18+
- npm hoặc yarn
- Tài khoản Firebase (Firestore, Auth, Storage)
- Google AI Studio API Key (Gemini)

---

### 1. Clone repository

```bash
git clone https://github.com/baody613/Happy_Coloring_AI.git
cd paint-by-numbers-ai
```

---

### 2. Cài đặt Backend

```bash
cd backend
npm install
```

Tạo file `backend/.env`:

```env
PORT=5000
NODE_ENV=development

# Firebase Admin SDK
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=your_client_email
FIREBASE_PRIVATE_KEY="your_private_key"
FIREBASE_STORAGE_BUCKET=your_project.appspot.com

# Google Gemini AI
GOOGLE_AI_API_KEY=your_gemini_api_key

# CORS — cho phép nhiều domain, phân cách bằng dấu phẩy
FRONTEND_URL=http://localhost:3002,http://localhost:3000

# Admin emails (phân cách bằng dấu phẩy)
ADMIN_EMAILS=admin@example.com

# Nodemailer — gửi email đặt lại mật khẩu
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_gmail@gmail.com
SMTP_PASS=your_app_password
SMTP_FROM=your_gmail@gmail.com

# Thông tin chuyển khoản ngân hàng
BANK_ENABLED=true
BANK_NAME=Vietcombank
BANK_ACCOUNT_NUMBER=1234567890
BANK_ACCOUNT_NAME=TONG BAO DUY
BANK_QR_URL=https://your-qr-image-url
```

Chạy backend:

```bash
npm run dev
```

Backend sẽ chạy tại: `http://localhost:5000`  
Swagger Docs: `http://localhost:5000/api-docs`

---

### 3. Cài đặt Frontend

```bash
cd frontend
npm install
```

Tạo file `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

Chạy frontend:

```bash
npm run dev
```

Frontend sẽ chạy tại: `http://localhost:3002`

---

## 📝 API Endpoints

> Tài liệu tương tác đầy đủ có tại **[/api-docs](https://paint-by-numbers-back-end.onrender.com/api-docs)**

### 🔐 Authentication — `/api/auth`

| Method | Endpoint | Auth | Mô tả |
|---|---|---|---|
| `POST` | `/api/auth/register` | — | Đăng ký tài khoản |
| `GET` | `/api/auth/profile/:uid` | ✅ | Lấy profile từ Firebase Auth |

### 🤖 AI Generation — `/api/generate`

| Method | Endpoint | Auth | Mô tả |
|---|---|---|---|
| `POST` | `/api/generate/paint-by-numbers` | ✅ | Tạo tranh tô màu từ prompt — trả về 202 + `generationId` |
| `GET` | `/api/generate/status/:id` | ✅ | Polling trạng thái (processing / completed / failed) |

### 🖼️ Products — `/api/products`

| Method | Endpoint | Auth | Mô tả |
|---|---|---|---|
| `GET` | `/api/products` | — | Danh sách sản phẩm (lọc, phân trang) |
| `GET` | `/api/products/categories` | — | Danh sách danh mục |
| `GET` | `/api/products/:id` | — | Chi tiết sản phẩm |
| `POST` | `/api/products` | 👑 Admin | Tạo sản phẩm |
| `PUT` | `/api/products/:id` | 👑 Admin | Cập nhật sản phẩm |
| `DELETE` | `/api/products/:id` | 👑 Admin | Xóa sản phẩm |

### 📦 Orders — `/api/orders`

| Method | Endpoint | Auth | Mô tả |
|---|---|---|---|
| `POST` | `/api/orders/validate-voucher` | — | Kiểm tra mã giảm giá |
| `POST` | `/api/orders` | ✅ | Tạo đơn hàng |
| `GET` | `/api/orders/user/:userId` | ✅ | Đơn hàng của user |
| `GET` | `/api/orders/:orderId` | ✅ | Chi tiết đơn hàng |
| `PUT` | `/api/orders/:orderId/status` | 👑 Admin | Cập nhật trạng thái đơn |
| `POST` | `/api/orders/:orderId/cancel` | ✅ | Hủy đơn hàng |

### 👤 Users — `/api/users`

| Method | Endpoint | Auth | Mô tả |
|---|---|---|---|
| `GET` | `/api/users/:userId` | ✅ | Lấy profile người dùng |
| `PUT` | `/api/users/:userId` | ✅ | Cập nhật profile |

### 🏦 Payment — `/api/payment`

| Method | Endpoint | Auth | Mô tả |
|---|---|---|---|
| `GET` | `/api/payment/banking-info` | — | Thông tin chuyển khoản ngân hàng |

### 👑 Admin — `/api/admin`

| Method | Endpoint | Mô tả |
|---|---|---|
| `GET` | `/api/admin/stats` | Thống kê tổng hợp (đơn, sản phẩm, doanh thu, users) |
| `GET` | `/api/admin/users` | Danh sách tất cả người dùng (lọc, tìm kiếm, phân trang) |
| `GET` | `/api/admin/users/stats` | Thống kê người dùng |
| `PUT` | `/api/admin/users/:userId` | Cập nhật user (disable/enable, displayName) |
| `PUT` | `/api/admin/users/:userId/role` | Phân quyền người dùng |
| `DELETE` | `/api/admin/users/:userId` | Xóa người dùng |
| `GET` | `/api/admin/orders` | Tất cả đơn hàng (lọc, tìm kiếm, phân trang) |
| `GET` | `/api/admin/orders/stats` | Thống kê đơn hàng (theo ngày, theo trạng thái) |
| `PUT` | `/api/admin/orders/:orderId/status` | Cập nhật trạng thái đơn |
| `PUT` | `/api/admin/orders/:orderId/payment` | Cập nhật trạng thái thanh toán |
| `GET` | `/api/admin/products` | Tất cả sản phẩm kể cả inactive |
| `POST` | `/api/admin/products` | Tạo sản phẩm |
| `PUT` | `/api/admin/products/:id` | Cập nhật sản phẩm |
| `DELETE` | `/api/admin/products/:id` | Xóa sản phẩm |
| `GET` | `/api/admin/products/stats` | Thống kê sản phẩm |

### 🎫 Mã giảm giá hiện có

| Mã | Giảm |
|---|---|
| `YULING10` | 10% |
| `YULING20` | 20% |
| `YULING30` | 30% |
| `GIAMGIA15` | 15% |
| `KHAITRUONG` | 25% |

---

## 🎯 Luồng sử dụng

```
1. Đăng ký / Đăng nhập (Firebase Auth)
        ↓
2a. Duyệt Gallery → Thêm vào giỏ hàng
        hoặc
2b. Tạo tranh AI → Nhập mô tả tiếng Việt → Chọn độ khó
        ↓
3. Giỏ hàng → Áp dụng mã giảm giá (tuỳ chọn)
        ↓
4. Checkout → Chọn phương thức thanh toán (COD / Chuyển khoản)
        ↓
5. Theo dõi trạng thái đơn hàng (pending → processing → shipping → delivered)
```

---

## 🤖 Luồng hoạt động AI tạo tranh

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND                             │
│                                                             │
│  User nhập prompt + chọn độ phức tạp                        │
│         │                                                   │
│         ▼                                                   │
│  handleGenerate() → POST /api/generate/paint-by-numbers     │
│         │                                                   │
│         ▼                                                   │
│  Nhận { generationId } → pollGenerationStatus(id)           │
│         │                                                   │
│         ▼                                                   │
│  Mỗi 5 giây: GET /api/generate/status/:id ─────────────┐    │
│         │                                              │    │
│         ▼ status = "completed"                         │    │
│  setGeneratedImage(imageUrl) → Hiện ảnh + nút tải      │    │
│                                                        │    │
└─────────────────────────────────────────────────────────────┘
         Polling liên tục mỗi 5s ◄──────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                         BACKEND                             │
│                                                             │
│  POST /paint-by-numbers                                     │
│    │                                                        │
│    ├─ Validate prompt (bắt buộc, ≤500 ký tự)                │
│    │                                                        │
│    ├─ Tạo document Firestore                                │
│    │    { status: "processing", imageUrl: "" }              │
│    │                                                        │
│    ├─ Gọi generatePaintByNumbers() ← KHÔNG await            │
│    │    (chạy ngầm, không chặn response)                    │
│    │                                                        │
│    └─ Trả về 202 + generationId ngay lập tức                │
│                                                             │
│  ════════════════════════════════════════════════════════   │
│                                                             │
│  generatePaintByNumbers() [chạy ngầm]                       │
│    │                                                        │
│    ├─ buildLineArtPrompt() → ghép template + user data      │
│    │                                                        │
│    ├─ generateWithGoogleImage(prompt)                       │
│    │    └─ POST → Google AI Studio API                      │
│    │         model: gemini-2.5-flash-image                  │
│    │         timeout: 120 giây                              │
│    │         ← Nhận base64 ảnh                              │
│    │         └─ Buffer.from(base64, "base64")               │
│    │                                                        │
│    ├─ uploadToStorage(buffer) → Firebase Storage            │
│    │    └─ Lấy imageUrl công khai                           │
│    │                                                        │
│    └─ Cập nhật Firestore                                    │
│         { status: "completed", imageUrl: "..." }            │
│         hoặc { status: "failed", error: "..." }             │
│                                                             │
│  GET /status/:generationId                                  │
│    ├─ Đọc document Firestore                                │
│    ├─ Kiểm tra userId = req.user.uid (bảo mật)              │
│    └─ Trả về toàn bộ data (status, imageUrl, error)         │
│                                                             │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    FIREBASE / GOOGLE                        │
│                                                             │
│  Firestore  ← lưu trạng thái generation (processing/        │
│               completed/failed) + metadata                  │
│                                                             │
│  Storage    ← lưu file PNG ảnh tranh AI                     │
│               path: generations/{fileName}.png              │
│                                                             │
│  Google AI  ← nhận prompt → sinh ảnh base64                 │
│  Studio API    model: gemini-2.5-flash-image                │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Giải thích thiết kế

| Quyết định                  | Lý do                                                           |
| --------------------------- | --------------------------------------------------------------- |
| **Async + Polling**         | Google AI mất 30–90s, nếu chờ thẳng sẽ timeout HTTP             |
| **Firestore làm queue**     | Backend ghi trạng thái, frontend đọc — tách biệt hoàn toàn      |
| **Upload Firebase Storage** | Ảnh lưu vĩnh viễn, không phụ thuộc vào session hay RAM server   |
| **Prompt engineering**      | Template cố định đảm bảo AI luôn ra đúng định dạng tranh tô màu |
| **Kiểm tra userId**         | Chỉ chủ sở hữu mới được xem kết quả — bảo mật dữ liệu           |

---

## 🔐 Bảo mật

| Biện pháp | Chi tiết |
|---|---|
| **Firebase Authentication** | JWT RS256, không lưu mật khẩu trong DB |
| **Xác thực admin 2 lớp** | Layer 1: `ADMIN_EMAILS` env var; Layer 2: `role = "admin"` trong Firestore |
| **Helmet.js** | 14 HTTP security header (HSTS, CSP, X-Frame-Options, XSS-Protection…) |
| **Rate Limiting** | 100 req / 15 phút / IP — chống brute-force và spam |
| **CORS Whitelist** | Chỉ cho phép domain frontend được cấu hình |
| **Joi Validation** | Kiểm tra và làm sạch mọi input đầu vào |
| **Prompt Sanitization** | Xóa ký tự `{{` `}}` khỏi prompt trước khi nhúng vào template Gemini |
| **IDOR Protection** | Mọi endpoint kiểm tra `userId === req.user.uid` trước khi trả dữ liệu |
| **dotenv + .gitignore** | API key và credentials không bao giờ commit lên GitHub |

---

## 📦 Deployment

### Frontend → Vercel

```bash
cd frontend
vercel deploy --prod
```

### Backend → Render

Push code lên GitHub → Render tự động build và deploy khi có commit mới vào nhánh `main`.

---

## 📄 License

MIT License © 2025–2026 Tong Bao Duy — GCS210642 — Greenwich University Vietnam
