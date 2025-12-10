# Hướng dẫn Deploy Frontend lên Vercel

## Cách 1: Deploy qua Vercel Dashboard (Khuyến nghị)

### Bước 1: Tạo tài khoản Vercel
1. Truy cập https://vercel.com/signup
2. Đăng ký bằng GitHub account (cùng account với repo)

### Bước 2: Import Project
1. Sau khi đăng nhập, click **"Add New..."** → **"Project"**
2. Chọn **"Import Git Repository"**
3. Tìm và chọn repository: `Happy_Coloring_AI`
4. Click **"Import"**

### Bước 3: Cấu hình Project

**Framework Preset:** Next.js (tự động detect)

**Root Directory:** `frontend`
- Click **"Edit"** ở mục Root Directory
- Chọn thư mục `frontend`

**Build and Output Settings:**
- Build Command: `npm run build` (mặc định)
- Output Directory: `.next` (mặc định)
- Install Command: `npm install` (mặc định)

**Environment Variables:**
Click **"Environment Variables"** và thêm:

```
NEXT_PUBLIC_API_URL=https://paint-by-numbers-back-end.onrender.com/api
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyCUNXrbM6BRtfcqP4EDiahDII2Ol1SXPbA
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=paint-by-numbers-ai-607c4.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=paint-by-numbers-ai-607c4
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=paint-by-numbers-ai-607c4.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=782451396352
NEXT_PUBLIC_FIREBASE_APP_ID=1:782451396352:web:2bf00b7eedc127e4162de5
NEXT_PUBLIC_ENV=production
```

### Bước 4: Deploy
1. Click **"Deploy"**
2. Đợi 3-5 phút cho quá trình build và deploy
3. Vercel sẽ tự động tạo URL: `https://your-app-name.vercel.app`

### Bước 5: Lấy Frontend URL
Sau khi deploy thành công:
1. Copy URL từ Vercel Dashboard (dạng: `https://happy-coloring-ai.vercel.app`)
2. URL này sẽ dùng để cấu hình CORS cho backend

---

## Cách 2: Deploy qua CLI (Alternative)

### Nếu mạng ổn định hơn, thử lại:

```powershell
# Cài Vercel CLI
npm install -g vercel

# Đăng nhập
vercel login

# Deploy
cd frontend
vercel

# Deploy production
vercel --prod
```

Làm theo hướng dẫn CLI:
- Confirm project settings
- Link to existing project hoặc tạo mới
- Chọn root directory: `./` (vì đã cd vào frontend)
- Override settings nếu cần

---

## Sau khi Deploy thành công

### 1. Cập nhật CORS trong Backend (Render)

Vào Render Dashboard → Service backend → Environment:

Thêm/Update biến:
```
CORS_ORIGIN=https://your-frontend-url.vercel.app
```

**Lưu ý:** Không có dấu `/` ở cuối URL

### 2. Test Frontend

Truy cập URL Vercel của bạn và test:
- Đăng ký/Đăng nhập
- Xem gallery
- Tạo tranh AI
- Thêm vào giỏ hàng

### 3. Check Logs nếu có lỗi

**Vercel:**
- Vào Dashboard → Project → Deployments
- Click vào deployment → View Function Logs

**Render (Backend):**
- Vào Dashboard → Service → Logs

---

## Troubleshooting

### Lỗi: Build failed
- Kiểm tra tất cả dependencies trong `package.json`
- Đảm bảo không có lỗi TypeScript
- Check Build Logs trên Vercel

### Lỗi: API connection failed
- Kiểm tra `NEXT_PUBLIC_API_URL` đã đúng chưa
- Kiểm tra CORS đã được cấu hình trong backend
- Đảm bảo backend đang chạy trên Render

### Lỗi: Firebase not initialized
- Kiểm tra tất cả Firebase env vars đã được thêm
- Đảm bảo các keys đúng format

---

## Custom Domain (Optional)

Sau khi deploy thành công, bạn có thể:
1. Vào Vercel Dashboard → Project → Settings → Domains
2. Thêm custom domain của bạn
3. Cấu hình DNS theo hướng dẫn

---

## Auto Deploy

Vercel tự động deploy khi:
- Push code mới lên branch `main`
- Mỗi Pull Request sẽ có Preview URL riêng

Để disable auto-deploy:
- Settings → Git → Deploy Hooks

---

## Tóm tắt URLs sau khi deploy

- **Frontend**: `https://your-app.vercel.app`
- **Backend**: `https://paint-by-numbers-back-end.onrender.com`
- **API**: `https://paint-by-numbers-back-end.onrender.com/api`

Nhớ cập nhật `CORS_ORIGIN` trong Render với URL frontend mới!
