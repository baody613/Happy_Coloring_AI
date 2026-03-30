<div align="center">

# 🎨 Happy Coloring AI

### Nền tảng tranh tô màu số hóa thông minh

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Node.js](https://img.shields.io/badge/Node.js-18+-green?style=for-the-badge&logo=node.js)
![Firebase](https://img.shields.io/badge/Firebase-Firestore-orange?style=for-the-badge&logo=firebase)
![Vercel](https://img.shields.io/badge/Deployed-Vercel-black?style=for-the-badge&logo=vercel)

**[🌐 Xem Demo Live](https://happy-coloring-ai.vercel.app)** &nbsp;|&nbsp; **[📖 API Docs](#-api-endpoints)**

> Nền tảng thương mại điện tử cho phép người dùng mua tranh tô màu số hóa có sẵn hoặc tạo tranh tùy chỉnh theo ý tưởng của mình bằng AI.

</div>

---

## ✨ Tính năng chính

| Tính năng                  | Mô tả                                                |
| -------------------------- | ---------------------------------------------------- |
| 🤖 **AI Image Generation** | Nhập mô tả, AI tạo ra tranh tô màu số hóa hoàn chỉnh |
| 🖼️ **Gallery**             | Thư viện tranh có sẵn với nhiều chủ đề đa dạng       |
| 🛒 **Shopping Cart**       | Giỏ hàng, lưu sau, và thanh toán trực tuyến          |
| ❤️ **Yêu thích**           | Lưu tranh yêu thích để xem lại sau                   |
| 📦 **Order Management**    | Theo dõi và quản lý đơn hàng theo thời gian thực     |
| 💬 **AI Chatbot**          | Hỗ trợ khách hàng tự động bằng AI                    |
| 🔐 **Authentication**      | Đăng ký / đăng nhập an toàn qua Firebase             |
| 👑 **Admin Panel**         | Quản lý sản phẩm, người dùng, đơn hàng toàn diện     |

---

## 🛠️ Công nghệ sử dụng

### Frontend

| Công nghệ                   | Vai trò                                  |
| --------------------------- | ---------------------------------------- |
| **Next.js 14** (App Router) | React framework, SSR                     |
| **TypeScript**              | Type safety                              |
| **Tailwind CSS**            | Styling                                  |
| **Zustand**                 | State management (cart, auth, favorites) |
| **Framer Motion**           | Animations                               |

### Backend

| Công nghệ              | Vai trò                  |
| ---------------------- | ------------------------ |
| **Node.js + Express**  | REST API server          |
| **Firebase Firestore** | Database                 |
| **Firebase Auth**      | Authentication           |
| **Firebase Storage**   | Lưu trữ ảnh              |
| **Google Gemini AI**   | Tạo tranh tô màu bằng AI |

### Deployment

| Thành phần | Nền tảng                                                      |
| ---------- | ------------------------------------------------------------- |
| Frontend   | **Vercel** — `https://happy-coloring-ai.vercel.app`           |
| Backend    | **Render** — `https://paint-by-numbers-back-end.onrender.com` |

---

## 📁 Cấu trúc dự án

```
paint-by-numbers-ai/
├── frontend/                    # Next.js 14 App
│   └── src/
│       ├── app/                 # Pages (App Router)
│       │   ├── page.tsx         # Homepage
│       │   ├── generate/        # Tạo tranh AI
│       │   ├── gallery/         # Thư viện tranh
│       │   ├── products/        # Danh sách sản phẩm
│       │   ├── cart/            # Giỏ hàng
│       │   ├── checkout/        # Thanh toán
│       │   ├── profile/         # Trang cá nhân
│       │   └── admin/           # Trang quản trị
│       ├── components/          # React components dùng chung
│       ├── store/               # Zustand stores (auth, cart, favorites)
│       ├── lib/                 # API clients & Firebase config
│       ├── hooks/               # Custom hooks
│       ├── utils/               # Helper functions
│       ├── constants/           # App constants
│       └── types/               # TypeScript types
│
├── backend/                     # Express REST API
│   └── src/
│       ├── routes/              # API routes
│       ├── services/            # Business logic
│       ├── middleware/          # Auth & admin middleware
│       ├── validators/          # Request validation
│       ├── utils/               # Helper functions
│       └── config/              # Firebase config
│
└── README.md
```

---

## 🚀 Cài đặt và chạy local

### Yêu cầu

- Node.js 18+
- npm hoặc yarn
- Tài khoản Firebase (Firestore, Auth, Storage)
- Google AI API Key (Gemini)

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

# CORS
FRONTEND_URL=http://localhost:3000
```

Chạy backend:

```bash
npm run dev
```

Backend sẽ chạy tại: `http://localhost:5000`

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

### 🔐 Authentication

| Method | Endpoint             | Mô tả             |
| ------ | -------------------- | ----------------- |
| `POST` | `/api/auth/register` | Đăng ký tài khoản |
| `POST` | `/api/auth/login`    | Đăng nhập         |
| `POST` | `/api/auth/logout`   | Đăng xuất         |

### 🤖 AI Generation

| Method | Endpoint                         | Mô tả                          |
| ------ | -------------------------------- | ------------------------------ |
| `POST` | `/api/generate/paint-by-numbers` | Tạo tranh tô màu từ prompt     |
| `GET`  | `/api/generate/status/:id`       | Kiểm tra trạng thái generation |

### 🖼️ Products

| Method   | Endpoint            | Mô tả                       |
| -------- | ------------------- | --------------------------- |
| `GET`    | `/api/products`     | Danh sách sản phẩm          |
| `GET`    | `/api/products/:id` | Chi tiết sản phẩm           |
| `POST`   | `/api/products`     | Tạo sản phẩm _(admin)_      |
| `PUT`    | `/api/products/:id` | Cập nhật sản phẩm _(admin)_ |
| `DELETE` | `/api/products/:id` | Xóa sản phẩm _(admin)_      |

### 📦 Orders

| Method | Endpoint                      | Mô tả                         |
| ------ | ----------------------------- | ----------------------------- |
| `POST` | `/api/orders`                 | Tạo đơn hàng                  |
| `GET`  | `/api/orders/user/:userId`    | Đơn hàng của user             |
| `GET`  | `/api/orders/:orderId`        | Chi tiết đơn hàng             |
| `PUT`  | `/api/orders/:orderId/status` | Cập nhật trạng thái _(admin)_ |
| `POST` | `/api/orders/:orderId/cancel` | Hủy đơn hàng                  |

### 👑 Admin

| Method | Endpoint                        | Mô tả                 |
| ------ | ------------------------------- | --------------------- |
| `GET`  | `/api/admin/users`              | Danh sách người dùng  |
| `PUT`  | `/api/admin/users/:userId/role` | Phân quyền người dùng |
| `GET`  | `/api/admin/orders`             | Tất cả đơn hàng       |
| `GET`  | `/api/admin/orders/stats`       | Thống kê đơn hàng     |
| `GET`  | `/api/admin/products/stats`     | Thống kê sản phẩm     |

---

## 🎯 Luồng sử dụng

```
1. Đăng ký / Đăng nhập
        ↓
2. Duyệt Gallery hoặc nhập mô tả để tạo tranh AI
        ↓
3. Thêm tranh vào giỏ hàng
        ↓
4. Điền thông tin và thanh toán
        ↓
5. Theo dõi trạng thái đơn hàng
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

- **Firebase Authentication** — quản lý người dùng an toàn
- **JWT tokens** — xác thực API requests
- **CORS** — chỉ cho phép domain được cấu hình
- **Input validation** — kiểm tra đầu vào trước khi xử lý
- **Rate limiting** — chống spam và DDoS

---

## 📦 Deployment

### Frontend → Vercel

```bash
cd frontend
vercel deploy --prod
```

### Backend → Render

Push code lên GitHub → Render tự động deploy khi có commit mới vào nhánh `main`.

---

## 📄 License

MIT License © 2025 Yu Ling Store
