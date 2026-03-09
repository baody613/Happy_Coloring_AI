# 🔄 HƯỚNG DẪN REDEPLOY FRONTEND - FIX MOCK PRODUCTS

## ❓ VẤN ĐỀ

Website production (paint-by-numbers-ai-607c4.web.app) đang hiển thị **data cũ/mock products** thay vì products mới từ Firebase.

**Nguyên nhân**: Build frontend cũ chưa được update sau khi thay đổi products.

## ✅ GIẢI PHÁP

Rebuild và redeploy frontend với production config mới.

---

## 📝 BƯỚC 1: BUILD FRONTEND

### Windows PowerShell:

```powershell
# Di chuyển vào folder frontend
cd N:\Project-Final-year\paint-by-numbers-ai\frontend

# Build production
npm run build

# Chờ 1-2 phút để build xong
```

**Build sẽ**:
- ✅ Sử dụng `.env.production`
- ✅ API URL: `https://paint-by-numbers-back-end.onrender.com/api`
- ✅ Tạo folder `.next/` với build mới
- ⏱️ Thời gian: 1-2 phút

### Kết quả mong đợi:

```
✓ Compiled successfully
✓ Linting and checking validity of types
✓ Collecting page data
✓ Generating static pages (XX/XX)
✓ Finalizing page optimization

Route (app)                              Size     First Load JS
┌ ○ /                                    XXX kB   XXX kB
├ ○ /gallery                             XXX kB   XXX kB
...
```

---

## 📝 BƯỚC 2: DEPLOY LÊN FIREBASE HOSTING

### Option A: Firebase CLI (Recommended)

```powershell
# Đảm bảo đang ở folder root
cd N:\Project-Final-year\paint-by-numbers-ai

# Deploy
firebase deploy --only hosting

# Hoặc nếu có multiple sites:
firebase deploy --only hosting:paint-by-numbers-ai-607c4
```

**Deploy sẽ**:
- ✅ Upload build mới lên Firebase Hosting
- ✅ Update CDN cache
- ✅ Website live sau 30-60 giây
- ⏱️ Thời gian: 1-2 phút

### Option B: Firebase Console (Manual)

1. **Mở**: https://console.firebase.google.com/
2. **Chọn project**: paint-by-numbers-ai-607c4
3. **Hosting** → **Upload new version**
4. **Upload folder**: `frontend/.next/` hoặc `frontend/out/`
5. **Deploy**

---

## 📝 BƯỚC 3: KIỂM TRA

### 3.1. Clear Browser Cache

**Chrome/Edge**:
```
Ctrl + Shift + Delete
→ Chọn "Cached images and files"
→ Clear data
```

Hoặc:
```
Ctrl + F5 (Hard refresh)
```

### 3.2. Test Website

1. **Mở**: https://paint-by-numbers-ai-607c4.web.app/gallery
2. **Kiểm tra**:
   - ✅ Products có ảnh từ Firebase mới không?
   - ✅ Số lượng products đúng không?
   - ✅ Click vào product xem chi tiết

### 3.3. Check API Connection

**F12** → **Console** → Xem có lỗi API không:

```
✅ Good: Fetching from https://paint-by-numbers-back-end.onrender.com/api
❌ Bad: Fetching from http://localhost:3001/api
```

---

## 🔍 TROUBLESHOOTING

### Lỗi: "Build failed"

**Kiểm tra**:
```powershell
# Xem log chi tiết
npm run build 2>&1 | Tee-Object -FilePath build.log

# Kiểm tra .env.production
cat frontend\.env.production
```

**Fix**:
- Đảm bảo `NEXT_PUBLIC_API_URL` có giá trị
- Đảm bảo Firebase config đầy đủ

### Lỗi: "Firebase deploy failed"

**Kiểm tra**:
```powershell
# Login lại Firebase
firebase login

# List projects
firebase projects:list

# Set project
firebase use paint-by-numbers-ai-607c4
```

### Website vẫn hiển thị data cũ

**Có thể do**:
1. **Browser cache** → Hard refresh (Ctrl+F5)
2. **CDN cache** → Đợi 5-10 phút
3. **Service Worker** → Clear site data trong DevTools

**Fix CDN cache**:
- Firebase Console → Hosting → Invalidate cache
- Hoặc đợi 10-15 phút

---

## 🚀 SCRIPT TỰ ĐỘNG (ALL IN ONE)

Tạo file `redeploy.ps1`:

```powershell
# redeploy.ps1
Write-Host "🔄 Starting frontend redeploy..." -ForegroundColor Cyan

# Build
Write-Host "`n📦 Building frontend..." -ForegroundColor Yellow
cd frontend
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed!" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Build successful!" -ForegroundColor Green

# Deploy
Write-Host "`n🚀 Deploying to Firebase..." -ForegroundColor Yellow
cd ..
firebase deploy --only hosting

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Deploy failed!" -ForegroundColor Red
    exit 1
}

Write-Host "`n✅ Deploy successful!" -ForegroundColor Green
Write-Host "🌐 Website: https://paint-by-numbers-ai-607c4.web.app" -ForegroundColor Cyan
Write-Host "⏱️ Wait 1-2 minutes for CDN update, then refresh browser" -ForegroundColor Yellow
```

**Chạy**:
```powershell
.\redeploy.ps1
```

---

## ⚡ QUICK COMMANDS

```powershell
# Build + Deploy một lệnh
cd frontend && npm run build && cd .. && firebase deploy --only hosting

# Build + Deploy + Open browser
cd frontend && npm run build && cd .. && firebase deploy --only hosting && start https://paint-by-numbers-ai-607c4.web.app/gallery
```

---

## 📊 CHECKLIST

**Trước khi deploy**:
- [ ] Backend Render đang chạy OK
- [ ] Products đã update trong Firebase Firestore
- [ ] File `.env.production` có API URL đúng
- [ ] Đã login Firebase CLI: `firebase login`

**Sau khi deploy**:
- [ ] Clear browser cache (Ctrl+F5)
- [ ] Test gallery page
- [ ] Test product detail page
- [ ] Test admin panel (nếu cần)
- [ ] Check console không có lỗi API

---

## 💡 LƯU Ý

### API URL trong Production

File `.env.production` hiện tại:
```env
NEXT_PUBLIC_API_URL=https://paint-by-numbers-back-end.onrender.com/api
```

**Nếu muốn đổi backend URL**:
1. Sửa `.env.production`
2. Rebuild: `npm run build`
3. Redeploy: `firebase deploy --only hosting`

### Build Types

**Development** (local):
- Uses `.env.local`
- API: `http://localhost:3001/api`
- Hot reload

**Production** (Firebase Hosting):
- Uses `.env.production`
- API: `https://paint-by-numbers-back-end.onrender.com/api`
- Static build

---

## 🎯 KẾT QUẢ MONG ĐỢI

Sau khi hoàn thành:

✅ Website production hiển thị products từ Firebase mới nhất
✅ Images từ Firebase Storage
✅ API calls đến Render backend
✅ No console errors
✅ Fast load time

---

**Thời gian tổng**: 5-7 phút (build + deploy + CDN cache)

**Nếu vẫn lỗi**: Screenshot và gửi lại để debug tiếp!
