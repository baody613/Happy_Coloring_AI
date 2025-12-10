# Hướng dẫn Deploy Backend lên Render

## Chuẩn bị

### 1. Các thay đổi đã được thực hiện

- ✅ Server lắng nghe trên `0.0.0.0` để Render có thể truy cập
- ✅ Hỗ trợ cả biến `CORS_ORIGIN` và `FRONTEND_URL`
- ✅ Health check endpoint tại `/api/health`

### 2. Các bước deploy

#### Bước 1: Tạo dịch vụ mới trên Render

1. Đăng nhập vào [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"Web Service"**
3. Kết nối repository GitHub của bạn
4. Chọn repository: `Happy_Coloring_AI`

#### Bước 2: Cấu hình Service

Điền các thông tin sau:

**Basic Settings:**

- **Name**: `paint-by-numbers-backend` (hoặc tên bạn muốn)
- **Region**: Chọn gần bạn nhất
- **Branch**: `main`
- **Root Directory**: `backend`
- **Environment**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm start`

**Advanced Settings:**

- **Health Check Path**: `/api/health`
- **Auto-Deploy**: `Yes` (tự động deploy khi push code)

#### Bước 3: Cấu hình Environment Variables

Click vào tab **"Environment"** và thêm các biến sau:

**Bắt buộc:**

```
NODE_ENV=production
PORT=10000
```

**Firebase Admin SDK:**

```
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project-id.iam.gserviceaccount.com
FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
```

**Firebase Private Key** (Chọn 1 trong 2 cách):

**Cách 1 - Base64 (Khuyến nghị cho Render):**

```bash
# Trên Windows PowerShell, mã hóa private key thành base64:
$privateKey = Get-Content "path/to/serviceAccountKey.json" | ConvertFrom-Json
$base64 = [Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes($privateKey.private_key))
Write-Output $base64
```

Sau đó thêm biến:

```
FIREBASE_PRIVATE_KEY_BASE64=<kết quả base64 ở trên>
```

**Cách 2 - Escaped String:**

```
FIREBASE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\nMIIEvQIBAD...\n-----END PRIVATE KEY-----\n
```

⚠️ Chú ý: Phải thay thế tất cả xuống dòng bằng `\n`

**CORS và Security:**

```
CORS_ORIGIN=https://your-frontend-app.vercel.app
JWT_SECRET=<tạo một chuỗi ngẫu nhiên dài>
```

**API Keys:**

```
REPLICATE_API_TOKEN=r8_xxxxx
SENDGRID_API_KEY=SG.xxxxx (optional)
```

**Rate Limiting:**

```
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

#### Bước 4: Deploy

1. Click **"Create Web Service"**
2. Render sẽ bắt đầu build và deploy
3. Đợi 5-10 phút cho lần deploy đầu tiên

## Lấy Firebase Service Account Key

1. Vào [Firebase Console](https://console.firebase.google.com/)
2. Chọn project của bạn
3. Vào **Project Settings** (⚙️) → **Service Accounts**
4. Click **"Generate new private key"**
5. Lưu file JSON vừa tải về

## Kiểm tra sau khi Deploy

### 1. Kiểm tra Health Check

Truy cập URL Render của bạn:

```
https://your-app.onrender.com/api/health
```

Kết quả mong đợi:

```json
{
  "status": "ok",
  "message": "Server is running"
}
```

### 2. Kiểm tra Logs

Vào Render Dashboard → Service của bạn → Tab **"Logs"** để xem logs

### 3. Các lỗi thường gặp

**Lỗi: "Health check failed"**

- Kiểm tra biến `PORT` có được set đúng không (thường là 10000)
- Đảm bảo server đang lắng nghe trên `0.0.0.0`

**Lỗi: "Firebase initialization failed"**

- Kiểm tra lại `FIREBASE_PRIVATE_KEY` hoặc `FIREBASE_PRIVATE_KEY_BASE64`
- Đảm bảo `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL` đúng
- Thử dùng Base64 encoding thay vì escaped string

**Lỗi: "npm install failed"**

- Kiểm tra `package.json` có đúng không
- Đảm bảo `rootDir` được set là `backend`

**Lỗi: CORS**

- Thêm URL Render vào `CORS_ORIGIN`
- Format: `https://your-app.onrender.com` (không có dấu `/` ở cuối)

## Cập nhật Frontend

Sau khi backend deploy thành công, cập nhật API URL trong frontend:

**File: `frontend/src/lib/api.ts`**

```typescript
const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://your-backend.onrender.com";
```

**File: `frontend/.env.production`**

```
NEXT_PUBLIC_API_URL=https://your-backend.onrender.com
```

## Sử dụng Blueprint (Tự động)

Nếu muốn deploy nhanh hơn, sử dụng file `render.yaml`:

1. Push code lên GitHub
2. Vào Render Dashboard
3. Click **"New +"** → **"Blueprint"**
4. Chọn repository
5. Render sẽ tự động đọc `render.yaml` và tạo service
6. Chỉ cần thêm các biến môi trường secret (Firebase keys, JWT secret, etc.)

## Lưu ý về Free Tier

⚠️ Render Free Tier có một số giới hạn:

- Service sẽ sleep sau 15 phút không hoạt động
- Request đầu tiên sau khi sleep sẽ mất ~1 phút để wake up
- 750 giờ/tháng miễn phí

💡 **Giải pháp**: Sử dụng cron job để ping health check endpoint mỗi 10 phút để giữ service luôn hoạt động.

## Hỗ trợ

Nếu gặp vấn đề, kiểm tra:

1. Logs trên Render Dashboard
2. Đảm bảo tất cả environment variables đã được set
3. Test local trước với `npm start` trong thư mục `backend`
4. Kiểm tra Firebase permissions và quota
