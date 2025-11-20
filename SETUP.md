# Hướng Dẫn Setup Chi Tiết

## 📋 Yêu Cầu Hệ Thống

- Node.js 18+
- npm hoặc yarn
- Git
- Tài khoản Firebase
- Tài khoản Replicate (cho AI generation)

## 🔧 Setup Firebase

### 1. Tạo Firebase Project

1. Truy cập [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" và làm theo hướng dẫn
3. Enable Google Analytics (tùy chọn)

### 2. Enable Authentication

1. Vào **Authentication** > **Sign-in method**
2. Enable **Email/Password**
3. (Tùy chọn) Enable Google, Facebook authentication

### 3. Create Firestore Database

1. Vào **Firestore Database** > **Create database**
2. Chọn **Production mode** hoặc **Test mode**
3. Chọn location gần Việt Nam nhất (asia-southeast1)

### 4. Setup Firebase Storage

1. Vào **Storage** > **Get Started**
2. Chọn security rules (có thể chỉnh sau)
3. Chọn location (giống Firestore)

### 5. Lấy Firebase Config

1. Vào **Project Settings** (⚙️ icon)
2. Scroll xuống **Your apps**
3. Click **</>** (Web app)
4. Register app và copy config

### 6. Tạo Service Account (cho Backend)

1. **Project Settings** > **Service accounts**
2. Click **Generate new private key**
3. Save file JSON (đặt tên `firebase-adminsdk.json`)
4. Copy `project_id`, `private_key`, `client_email` vào `.env`

## 🤖 Setup Replicate API

1. Truy cập [Replicate](https://replicate.com/)
2. Sign up/Login
3. Vào [Account Settings > API Tokens](https://replicate.com/account/api-tokens)
4. Tạo new token và copy

## 🚀 Cài Đặt Backend

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env
```

### Cấu hình `.env`:

```env
PORT=5000
NODE_ENV=development

# Firebase Admin SDK
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com

# AI API
REPLICATE_API_TOKEN=r8_xxxxxxxxxxxxxxxxxxxx

# Storage
FIREBASE_STORAGE_BUCKET=your-project.appspot.com

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

**Lưu ý:** `FIREBASE_PRIVATE_KEY` phải giữ nguyên format với `\n` (newline)

### Chạy Backend:

```bash
npm run dev
```

Server sẽ chạy tại: `http://localhost:5000`

## 🎨 Cài Đặt Frontend

```bash
cd frontend

# Install dependencies
npm install

# Create .env.local file
cp .env.local.example .env.local
```

### Cấu hình `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000

# Firebase Config (từ Firebase Console)
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:xxxxxxxxxxxxxxxx
```

### Chạy Frontend:

```bash
npm run dev
```

App sẽ chạy tại: `http://localhost:3000`

## 🗄️ Setup Database Collections

### Tạo collections trong Firestore:

1. **users**

```json
{
  "uid": "string",
  "email": "string",
  "displayName": "string",
  "phoneNumber": "string",
  "address": "object",
  "orders": "array",
  "favorites": "array",
  "createdAt": "timestamp"
}
```

2. **products**

```json
{
  "id": "string",
  "title": "string",
  "description": "string",
  "category": "string",
  "price": "number",
  "imageUrl": "string",
  "thumbnailUrl": "string",
  "difficulty": "string",
  "dimensions": "string",
  "colors": "number",
  "status": "string",
  "sales": "number",
  "rating": "number",
  "createdAt": "timestamp"
}
```

3. **orders**

```json
{
  "id": "string",
  "userId": "string",
  "items": "array",
  "shippingAddress": "object",
  "totalAmount": "number",
  "paymentMethod": "string",
  "status": "string",
  "createdAt": "timestamp"
}
```

4. **generations**

```json
{
  "id": "string",
  "userId": "string",
  "prompt": "string",
  "style": "string",
  "complexity": "string",
  "status": "string",
  "imageUrl": "string",
  "createdAt": "timestamp"
}
```

### Setup Firestore Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == userId;
    }

    // Products collection
    match /products/{productId} {
      allow read: if true;
      allow write: if request.auth != null;
    }

    // Orders collection
    match /orders/{orderId} {
      allow read, write: if request.auth.uid == resource.data.userId;
    }

    // Generations collection
    match /generations/{generationId} {
      allow read, write: if request.auth.uid == resource.data.userId;
    }
  }
}
```

### Setup Storage Rules:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /generations/{userId}/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth.uid == userId;
    }
  }
}
```

## 🧪 Test Application

### 1. Test Backend API:

```bash
# Health check
curl http://localhost:5000/health

# Get boards (should return empty array initially)
curl http://localhost:5000/api/products
```

### 2. Test Frontend:

1. Mở browser: `http://localhost:3000`
2. Đăng ký tài khoản mới
3. Thử tạo tranh bằng AI
4. Thử add product vào cart

## 🐛 Troubleshooting

### Lỗi Firebase Connection:

- Kiểm tra Firebase config trong `.env`
- Verify private key format (phải có `\n`)
- Check Firebase project settings

### Lỗi Replicate API:

- Verify API token
- Check API quota/limits
- Test với prompt đơn giản trước

### Lỗi CORS:

- Check `FRONTEND_URL` trong backend `.env`
- Verify cors configuration trong `index.js`

### Port already in use:

```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Change port in .env if needed
PORT=5001
```

## 📦 Seed Sample Data (Optional)

Tạo file `backend/seed.js`:

```javascript
// Script to add sample products to Firestore
// Run: node seed.js
```

## 🚢 Production Deployment

### Backend (Railway/Render):

1. Push code to GitHub
2. Connect repository
3. Add environment variables
4. Deploy

### Frontend (Vercel):

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Firebase:

- Enable billing for production usage
- Setup custom domain
- Configure production security rules

## 📞 Support

Nếu gặp vấn đề:

1. Check logs: `npm run dev` trong terminal
2. Check browser console (F12)
3. Review Firebase console for errors
4. Check API responses in Network tab

## ✅ Checklist

- [ ] Firebase project created
- [ ] Firestore database enabled
- [ ] Storage enabled
- [ ] Authentication enabled
- [ ] Service account downloaded
- [ ] Replicate API key obtained
- [ ] Backend .env configured
- [ ] Frontend .env.local configured
- [ ] Dependencies installed
- [ ] Backend running on port 5000
- [ ] Frontend running on port 3000
- [ ] Can register new user
- [ ] Can view products
- [ ] Can generate image with AI
