# 🎨 HƯỚNG DẪN DEMO PROJECT - PAINT BY NUMBERS AI

> **Dự án**: Website E-Commerce bán tranh tô màu theo số kết hợp AI  
> **Công nghệ**: Next.js 14, Node.js, Firebase, Hugging Face AI

---

## 📋 MỤC LỤC

1. [Giới thiệu dự án](#giới-thiệu-dự-án)
2. [Công nghệ sử dụng](#công-nghệ-sử-dụng)
3. [Tính năng chính](#tính-năng-chính)
4. [Hướng dẫn khởi động](#hướng-dẫn-khởi-động)
5. [Demo flow chính](#demo-flow-chính)
6. [Các điểm nổi bật](#các-điểm-nổi-bật)

---

## 🎯 GIỚI THIỆU DỰ ÁN

**Paint by Numbers AI** là một nền tảng thương mại điện tử kết hợp công nghệ AI, cho phép:

- 🛍️ **Người dùng**: Mua sắm tranh tô màu theo số
- 🤖 **AI Generation**: Tạo ảnh paint-by-numbers từ text prompt
- 👨‍💼 **Admin**: Quản lý sản phẩm, đơn hàng
- 💬 **Chatbot**: Hỗ trợ khách hàng 24/7

---

## 💻 CÔNG NGHỆ SỬ DỤNG

### Frontend

- **Next.js 14** (App Router, Server Components)
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Zustand** - State management

### Backend

- **Node.js + Express**
- **Firebase Admin SDK**
  - Authentication
  - Firestore Database
  - Firebase Storage
- **Nodemailer** - Email service (Gmail SMTP)
- **Joi** - Validation

### AI Integration

- **Hugging Face API** - Image generation
- Model: stabilityai/stable-diffusion-2-1

### Deployment Ready

- Firebase Hosting
- Render / Railway (Backend)
- Vercel (Frontend)

---

## ✨ TÍNH NĂNG CHÍNH

### 1. 🔐 Xác thực người dùng

- Đăng ký / Đăng nhập
- Firebase Authentication
- Quên mật khẩu với OTP qua email
- Show/hide password toggle

### 2. 🛍️ Mua sắm

- **Gallery hiển thị sản phẩm**
  - Lọc theo danh mục, giá, độ khó
  - Sắp xếp theo giá, tên, độ phổ biến
  - Xem fullscreen ảnh sản phẩm
- **Chi tiết sản phẩm**
  - Thông tin đầy đủ
  - Hình ảnh, giá, mô tả
  - Thêm vào giỏ hàng / Yêu thích
- **Giỏ hàng**
  - Chọn nhiều sản phẩm
  - Cập nhật số lượng
  - Áp dụng voucher giảm giá
- **Checkout**
  - Nhập thông tin giao hàng
  - Chọn phương thức thanh toán (COD, VNPay, MoMo)
  - Xác nhận đơn hàng

### 3. 🤖 AI Generation

- Nhập text prompt
- Tạo ảnh paint-by-numbers bằng AI
- Tự động upload lên Firebase Storage
- Lưu vào gallery cá nhân

### 4. 👨‍💼 Quản trị Admin

- **Đăng nhập admin**: `admin@paintbynumbers.com` / `admin123`
- **Quản lý sản phẩm**
  - Thêm / Sửa / Xóa sản phẩm
  - Upload ảnh lên Firebase Storage
  - Badge "NEW" cho sản phẩm mới thêm
- **Quản lý đơn hàng**
  - Xem danh sách đơn hàng
  - Cập nhật trạng thái đơn hàng
  - Xem chi tiết đơn hàng

### 5. 💬 Chatbot AI

- Hỗ trợ khách hàng
- Trả lời câu hỏi về sản phẩm
- Hướng dẫn mua hàng

### 6. 📧 Email Service

- Gửi OTP quên mật khẩu
- Nodemailer + Gmail SMTP
- HTML email template

---

## 🚀 HƯỚNG DẪN KHỞI ĐỘNG

### Yêu cầu hệ thống

- Node.js 18+
- npm hoặc yarn
- Firebase project (đã setup sẵn)

### Bước 1: Clone project

```bash
git clone https://github.com/baody613/Happy_Coloring_AI.git
cd paint-by-numbers-ai
```

### Bước 2: Cài đặt dependencies

**Backend**:

```bash
cd backend
npm install
```

**Frontend**:

```bash
cd frontend
npm install
```

### Bước 3: Kiểm tra .env files

**Backend** `.env`:

```env
PORT=3001
NODE_ENV=development

# Firebase Admin SDK
FIREBASE_PROJECT_ID=paint-by-numbers-ai-607c4
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-...@paint-by-numbers-ai-607c4.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----...-----END PRIVATE KEY-----
FIREBASE_STORAGE_BUCKET=paint-by-numbers-ai-607c4.firebasestorage.app

# Email Service
EMAIL_USER=baody613@gmail.com
EMAIL_PASSWORD=znxuspltqxrieoll

# Hugging Face
HF_TOKEN=hf_...
```

**Frontend** `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=paint-by-numbers-ai-607c4.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=paint-by-numbers-ai-607c4
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=paint-by-numbers-ai-607c4.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=479...
NEXT_PUBLIC_FIREBASE_APP_ID=1:479...
```

### Bước 4: Khởi động server

**Terminal 1 - Backend**:

```bash
cd backend
npm start
```

✅ Backend chạy tại: `http://localhost:3001`

**Terminal 2 - Frontend**:

```bash
cd frontend
npm run dev
```

✅ Frontend chạy tại: `http://localhost:3000`

### Bước 5: Mở trình duyệt

Truy cập: `http://localhost:3000`

---

## 🎬 DEMO FLOW CHÍNH

### Flow 1: Người dùng mua hàng (5 phút)

1. **Đăng ký tài khoản**
   - Vào `/register`
   - Nhập email, password, tên
   - Đăng ký thành công → Auto login

2. **Duyệt gallery**
   - Vào `/gallery`
   - Xem 28 sản phẩm
   - Lọc theo danh mục / giá / độ khó
   - Click vào sản phẩm để xem chi tiết

3. **Thêm vào giỏ hàng**
   - Chọn sản phẩm
   - Click "Thêm vào giỏ hàng"
   - Toast notification hiện lên
   - Icon giỏ hàng hiển thị số lượng

4. **Checkout**
   - Vào `/cart`
   - Tick chọn sản phẩm muốn mua
   - Click "Thanh toán"
   - Nhập thông tin giao hàng:
     - Họ tên, SĐT, địa chỉ
   - Chọn phương thức thanh toán: COD
   - Click "Đặt hàng"

5. **Xác nhận đơn hàng**
   - Redirect tới `/order-success`
   - Hiển thị thông báo thành công
   - Animation chúc mừng
   - Đơn hàng được lưu vào Firestore

### Flow 2: Quên mật khẩu (2 phút)

1. **Yêu cầu reset password**
   - Click "Quên mật khẩu?"
   - Nhập email đã đăng ký
   - Click "Gửi mã OTP"

2. **Nhận OTP qua email**
   - Email được gửi tự động qua Gmail SMTP
   - Mã OTP 6 số, hết hạn sau 10 phút

3. **Đặt mật khẩu mới**
   - Nhập mã OTP
   - Nhập mật khẩu mới (có nút show/hide)
   - Xác nhận mật khẩu
   - Reset thành công

### Flow 3: Admin quản lý sản phẩm (3 phút)

1. **Đăng nhập admin**
   - Email: `admin@paintbynumbers.com`
   - Password: `admin123`

2. **Vào admin dashboard**
   - URL: `/admin/products`
   - Xem danh sách 28 sản phẩm

3. **Thêm sản phẩm mới**
   - Click "Thêm sản phẩm mới"
   - Nhập thông tin:
     - Title, Description
     - Category, Price
     - Difficulty, Colors
   - Upload ảnh từ máy
   - Ảnh tự động upload lên Firebase Storage
   - Click "Thêm sản phẩm"
   - Badge "NEW" màu xanh xuất hiện với animation

4. **Chỉnh sửa sản phẩm**
   - Click "Sửa" trên sản phẩm
   - Thay đổi thông tin
   - Upload ảnh mới (optional)
   - Lưu thay đổi

5. **Xóa sản phẩm**
   - Click "Xóa"
   - Confirm xóa
   - Sản phẩm bị xóa khỏi database

### Flow 4: AI Generation (2 phút)

1. **Vào trang Generate**
   - URL: `/generate`
   - Nhập text prompt (tiếng Anh)
   - Ví dụ: "a beautiful sunset over the ocean"

2. **Tạo ảnh bằng AI**
   - Click "Generate"
   - Loading animation
   - Hugging Face API tạo ảnh
   - Kết quả hiển thị

3. **Lưu ảnh**
   - Ảnh tự động upload lên Firebase Storage
   - Lưu vào generation history
   - Có thể download ảnh

---

## 🌟 CÁC ĐIỂM NỔI BẬT

### 1. Architecture Design

- **Frontend**: Server Components + Client Components (Next.js 14 App Router)
- **Backend**: RESTful API với Express
- **Database**: Firestore NoSQL
- **File Storage**: Firebase Storage
- **Authentication**: Firebase Auth với JWT tokens

### 2. Security

- ✅ Bearer token authentication
- ✅ Admin role-based access control
- ✅ Input validation với Joi schemas
- ✅ CORS protection
- ✅ Environment variables cho sensitive data

### 3. User Experience

- ✅ Loading states trong tất cả API calls
- ✅ Toast notifications cho feedback
- ✅ Framer Motion animations
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Show/hide password toggle
- ✅ Fullscreen image viewer

### 4. Performance

- ✅ Next.js Image optimization
- ✅ Lazy loading components
- ✅ Pagination cho products/orders
- ✅ Zustand state management (lightweight)
- ✅ Firebase Cloud Storage CDN

### 5. Code Quality

- ✅ TypeScript cho type safety
- ✅ ESLint + Prettier
- ✅ Component reusability
- ✅ Clean folder structure
- ✅ Comprehensive error handling

### 6. Developer Experience

- ✅ Hot reload (development)
- ✅ Clear error messages
- ✅ Console logs đã remove (production-ready)
- ✅ Documentation đầy đủ
- ✅ Git version control với meaningful commits

---

## 📊 DATABASE STRUCTURE

### Collections

#### `users`

```javascript
{
  uid: string,
  email: string,
  displayName: string,
  role: "user" | "admin",
  createdAt: timestamp
}
```

#### `products`

```javascript
{
  id: string,
  title: string,
  description: string,
  category: string,
  price: number,
  imageUrl: string, // Firebase Storage URL hoặc /images/Products/...
  thumbnailUrl: string,
  difficulty: "easy" | "medium" | "hard",
  colors: number,
  dimensions: { width, height, unit },
  status: "active" | "inactive" | "deleted",
  sales: number,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

#### `orders`

```javascript
{
  id: string,
  userId: string,
  items: [
    {
      productId: string,
      title: string,
      quantity: number,
      price: number,
      imageUrl: string
    }
  ],
  shippingAddress: {
    fullName: string,
    phone: string,
    address: string,
    city: string,
    district: string,
    ward: string
  },
  totalAmount: number,
  originalAmount: number,
  voucherCode: string,
  voucherDiscount: number,
  paymentMethod: "cod" | "vnpay" | "momo",
  status: "pending" | "confirmed" | "shipping" | "delivered" | "cancelled",
  note: string,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

#### `generations`

```javascript
{
  id: string,
  userId: string,
  prompt: string,
  imageUrl: string,
  status: "processing" | "completed" | "failed",
  createdAt: timestamp
}
```

---

## 🔧 TROUBLESHOOTING

### Backend không khởi động

```bash
# Kiểm tra port 3001 có bị chiếm không
netstat -ano | findstr :3001

# Kill process nếu cần
taskkill /PID <PID> /F

# Restart backend
cd backend
npm start
```

### Frontend không kết nối backend

- Kiểm tra `NEXT_PUBLIC_API_URL` trong `.env.local`
- Phải là `http://localhost:3001/api`
- Restart frontend sau khi sửa .env

### Email OTP không gửi

- Kiểm tra `EMAIL_USER` và `EMAIL_PASSWORD` trong backend `.env`
- Gmail App Password phải đúng (16 ký tự)
- Bật "Less secure app access" trong Gmail (nếu cần)

### Firebase errors

- Kiểm tra Firebase credentials trong .env
- Ensure `FIREBASE_PRIVATE_KEY` có đầy đủ `-----BEGIN PRIVATE KEY-----` và `-----END PRIVATE KEY-----`
- Replace `\n` bằng newlines thật trong private key

---

## 📝 CHECKLIST TRƯỚC KHI DEMO

- [ ] Backend đang chạy (port 3001)
- [ ] Frontend đang chạy (port 3000)
- [ ] Database có ít nhất 10 sản phẩm
- [ ] Tài khoản admin đã tạo
- [ ] Email service hoạt động
- [ ] Firebase Storage có quyền upload
- [ ] Hugging Face token còn valid
- [ ] Browser đã clear cache
- [ ] Internet connection stable

---

## 📞 CONTACT & REPOSITORY

- **GitHub Repository**: https://github.com/baody613/Happy_Coloring_AI.git
- **Developer Email**: baody613@gmail.com
- **Firebase Project**: paint-by-numbers-ai-607c4

---

## 🎓 KẾT LUẬN

Dự án **Paint by Numbers AI** thể hiện:

1. ✅ **Kỹ năng fullstack**: Frontend (Next.js) + Backend (Node.js) + Database (Firestore)
2. ✅ **Integration**: Firebase services, AI API, Email service
3. ✅ **Best practices**: Security, validation, error handling, clean code
4. ✅ **User-centric**: UX/UI design, responsive, animations
5. ✅ **Production-ready**: Optimized, documented, deployment-ready

**Thời gian hoàn thành**: 3 tháng  
**Số dòng code**: ~15,000 lines  
**Số features**: 20+ features  
**Tech stack**: 10+ technologies

---

**💡 TIP CHO DEMO**:

- Chuẩn bị trước các account (user + admin)
- Có sản phẩm mẫu trong database
- Test flow trước khi demo
- Giải thích design decisions
- Nhấn mạnh challenges và solutions
- Highlight scalability và future improvements

**Chúc bạn demo thành công! 🚀**
