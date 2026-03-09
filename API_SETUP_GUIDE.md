# 🔧 HƯỚNG DẪN CÀI ĐẶT API - PAINT BY NUMBERS AI

> **Mục đích**: Setup API AI tạo tranh và Payment Gateway cho project

---

## 📋 MỤC LỤC

1. [Hugging Face API - AI Tạo Tranh](#1-hugging-face-api---ai-tạo-tranh)
2. [VNPay Payment Gateway](#2-vnpay-payment-gateway)
3. [MoMo Payment Gateway](#3-momo-payment-gateway)
4. [Kiểm tra cài đặt](#4-kiểm-tra-cài-đặt)

---

## 1. 🤖 HUGGING FACE API - AI TẠO TRANH

### Giới thiệu

Hugging Face là nền tảng AI cung cấp các model machine learning miễn phí. Project sử dụng model **Stable Diffusion 2.1** để tạo ảnh paint-by-numbers từ text prompt.

### Bước 1: Đăng ký tài khoản Hugging Face

1. **Truy cập**: https://huggingface.co/join
2. **Đăng ký** với email hoặc GitHub account
3. **Xác nhận email** (nếu có)

### Bước 2: Lấy API Token (MIỄN PHÍ)

1. **Đăng nhập** vào Hugging Face
2. **Click vào avatar** (góc phải trên) → **Settings**
3. **Chọn "Access Tokens"** ở menu bên trái
4. **Click "New token"**
5. **Điền thông tin**:
   - Name: `paint-by-numbers-ai`
   - Role: Chọn **"Read"** (đủ cho việc sử dụng)
6. **Click "Generate token"**
7. **Copy token** (dạng: `hf_xxxxxxxxxxxxxxxxxxxxxx`)
   - ⚠️ **LƯU Ý**: Token chỉ hiển thị 1 lần, hãy lưu lại!

### Bước 3: Thêm token vào Backend

**File**: `backend/.env`

Thêm dòng này vào cuối file:

```env
# Hugging Face AI
HF_TOKEN=hf_xxxxxxxxxxxxxxxxxxxxxx
HUGGINGFACE_API_KEY=hf_xxxxxxxxxxxxxxxxxxxxxx
```

> Thay `hf_xxxxxxxxxxxxxxxxxxxxxx` bằng token bạn vừa copy

### Bước 4: Cập nhật code (nếu cần)

**File**: `backend/src/routes/generate.js`

Đảm bảo code đọc token đúng:

```javascript
const HF_API_KEY = process.env.HUGGINGFACE_API_KEY || process.env.HF_TOKEN;
```

### Bước 5: Test API

1. **Restart backend**:

```bash
cd backend
npm start
```

2. **Test qua frontend**:
   - Đăng nhập vào app
   - Vào trang `/generate`
   - Nhập prompt: `a beautiful cat sitting on a chair`
   - Click "Generate"
   - Đợi 30-60 giây (free tier chậm hơn)
   - Ảnh sẽ được tạo và upload lên Firebase Storage

### Troubleshooting

**Lỗi: "Model is loading"**

- Model đang khởi động (free tier)
- Đợi 1-2 phút và thử lại

**Lỗi: "Authorization failed"**

- Token sai hoặc hết hạn
- Tạo token mới và cập nhật .env

**Lỗi: "Timeout"**

- Free tier có giới hạn request
- Đợi vài phút và thử lại
- Hoặc nâng cấp lên Hugging Face Pro ($9/month)

### Model sử dụng

```javascript
Model: stabilityai/stable-diffusion-2-1
URL: https://huggingface.co/stabilityai/stable-diffusion-2-1
License: CreativeML Open RAIL++-M License (Free for commercial use)
```

### Giới hạn Free Tier

- ✅ **Upload/Download**: Unlimited
- ✅ **API Calls**: 1,000 requests/month
- ✅ **Model Inference**: Có thể chậm (30-60s)
- ⚠️ **Rate Limit**: 1 request/10s

### Nâng cấp (Optional)

Nếu cần tốc độ nhanh hơn:

**Hugging Face Pro**: $9/month

- Inference nhanh hơn (5-10s)
- Priority access
- More API calls

**Link**: https://huggingface.co/pricing

---

## 2. 💳 VNPAY PAYMENT GATEWAY

### Giới thiệu

VNPay là cổng thanh toán trực tuyến phổ biến tại Việt Nam, hỗ trợ:

- Thẻ ATM nội địa
- Thẻ Visa/Mastercard
- Ví điện tử
- QR Code

### Bước 1: Đăng ký tài khoản VNPay Merchant

**⚠️ CHÚ Ý**: VNPay yêu cầu doanh nghiệp đăng ký (có giấy phép kinh doanh)

#### Đăng ký chính thức (Production):

1. **Truy cập**: https://vnpay.vn/
2. **Click "Đăng ký"** → **"Doanh nghiệp"**
3. **Chuẩn bị hồ sơ**:
   - Giấy phép kinh doanh
   - Chứng minh nhân dân/CCCD người đại diện
   - Website/App đã hoạt động
   - Mô tả ngành hàng kinh doanh
4. **Liên hệ**: hotline 1900 55 55 77 hoặc email: hotro@vnpay.vn
5. **Chờ duyệt**: 3-5 ngngày làm việc

#### Sandbox/Demo (Testing):

Cho môn học demo, bạn có thể dùng **Sandbox**:

1. **Truy cập**: https://sandbox.vnpayment.vn/devreg/
2. **Đăng ký tài khoản demo**
3. **Nhận credentials**:
   - `TMN Code`: Mã định danh merchant
   - `Hash Secret`: Key bảo mật

**Test Cards** (Sandbox):

```
Thẻ: 9704 0000 0000 0018
Tên: NGUYEN VAN A
Ngày phát hành: 03/07
OTP: 123456
```

### Bước 2: Cấu hình Backend

**File**: `backend/.env`

Thêm:

```env
# VNPay Configuration
VNPAY_TMN_CODE=YOUR_TMN_CODE
VNPAY_HASH_SECRET=YOUR_HASH_SECRET
VNPAY_URL=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
VNPAY_RETURN_URL=http://localhost:3000/payment/vnpay/callback

# Production URL (khi go-live):
# VNPAY_URL=https://vnpayment.vn/paymentv2/vpcpay.html
```

### Bước 3: Test thanh toán VNPay

1. Đặt hàng trên website
2. Chọn phương thức "VNPay"
3. Sẽ redirect đến trang thanh toán VNPay
4. Nhập thông tin thẻ test
5. Xác nhận OTP: `123456`
6. Quay về trang order-success

### Phí dịch vụ VNPay

- **Setup fee**: 5-10 triệu VNĐ (one-time)
- **Transaction fee**: 1.5-2% mỗi giao dịch
- **Monthly fee**: 300k-500k VNĐ/tháng

---

## 3. 💰 MOMO PAYMENT GATEWAY

### Giới thiệu

MoMo là ví điện tử phổ biến tại Việt Nam, cho phép thanh toán qua:

- Ví MoMo
- Thẻ ngân hàng liên kết
- QR Code

### Bước 1: Đăng ký MoMo Business

**⚠️ CHÚ Ý**: MoMo cũng yêu cầu doanh nghiệp đăng ký

#### Đăng ký Production:

1. **Truy cập**: https://business.momo.vn/
2. **Click "Đăng ký"**
3. **Chuẩn bị hồ sơ**:
   - Giấy phép kinh doanh
   - CMND/CCCD người đại diện
   - Website/App hoạt động
4. **Điền form đăng ký**
5. **Chờ duyệt**: 3-7 ngày làm việc

#### Sandbox/Demo (Testing):

1. **Truy cập**: https://developers.momo.vn/
2. **Đăng ký tài khoản developer**
3. **Vào "My Applications"**
4. **Tạo app mới**
5. **Nhận credentials**:
   - `Partner Code`: Mã đối tác
   - `Access Key`: Key truy cập
   - `Secret Key`: Key bảo mật

**Test Account** (Sandbox):

```
SĐT: 0963181714
OTP: Tự động approve
```

### Bước 2: Cấu hình Backend

**File**: `backend/.env`

Thêm:

```env
# MoMo Configuration
MOMO_PARTNER_CODE=YOUR_PARTNER_CODE
MOMO_ACCESS_KEY=YOUR_ACCESS_KEY
MOMO_SECRET_KEY=YOUR_SECRET_KEY
MOMO_ENDPOINT=https://test-payment.momo.vn/v2/gateway/api/create
MOMO_REDIRECT_URL=http://localhost:3000/payment/momo/callback
MOMO_IPN_URL=http://localhost:3001/api/payment/momo/ipn

# Production endpoint (khi go-live):
# MOMO_ENDPOINT=https://payment.momo.vn/v2/gateway/api/create
```

### Bước 3: Test thanh toán MoMo

1. Đặt hàng trên website
2. Chọn phương thức "MoMo"
3. Sẽ redirect đến MoMo payment page
4. Quét QR code bằng app MoMo hoặc nhập SĐT test
5. Xác nhận thanh toán
6. Quay về trang order-success

### Phí dịch vụ MoMo

- **Setup fee**: Miễn phí
- **Transaction fee**: 1.5-2.5% mỗi giao dịch
- **Monthly fee**: 0 VNĐ (chỉ tính phí giao dịch)

---

## 4. ✅ KIỂM TRA CÀI ĐẶT

### Checklist Backend `.env`

Kiểm tra file `backend/.env` có đầy đủ:

```env
# Firebase (✅ Đã có)
FIREBASE_PROJECT_ID=paint-by-numbers-ai-607c4
FIREBASE_CLIENT_EMAIL=...
FIREBASE_STORAGE_BUCKET=...
FIREBASE_PRIVATE_KEY_BASE64=...

# Server (✅ Đã có)
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Email (✅ Đã có)
EMAIL_USER=baody613@gmail.com
EMAIL_PASSWORD=znxuspltqxrieoll

# ⚠️ CẦN THÊM: Hugging Face AI
HF_TOKEN=hf_xxxxxx
HUGGINGFACE_API_KEY=hf_xxxxxx

# 🔄 TÙY CHỌN: VNPay (nếu cần thanh toán online)
VNPAY_TMN_CODE=your_code
VNPAY_HASH_SECRET=your_secret
VNPAY_URL=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
VNPAY_RETURN_URL=http://localhost:3000/payment/vnpay/callback

# 🔄 TÙY CHỌN: MoMo (nếu cần thanh toán online)
MOMO_PARTNER_CODE=your_code
MOMO_ACCESS_KEY=your_key
MOMO_SECRET_KEY=your_secret
MOMO_ENDPOINT=https://test-payment.momo.vn/v2/gateway/api/create
MOMO_REDIRECT_URL=http://localhost:3000/payment/momo/callback
MOMO_IPN_URL=http://localhost:3001/api/payment/momo/ipn
```

### Test API

**1. Test Hugging Face API**:

```bash
# Từ project root
cd backend
npm start

# Mở terminal khác
curl -X POST http://localhost:3001/api/generate/paint-by-numbers \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_FIREBASE_TOKEN" \
  -d '{"prompt":"a beautiful sunset"}'
```

**2. Test VNPay** (nếu đã setup):

- Vào `/checkout`
- Chọn "VNPay"
- Xem có redirect đến VNPay không

**3. Test MoMo** (nếu đã setup):

- Vào `/checkout`
- Chọn "MoMo"
- Xem có redirect đến MoMo không

### Restart Backend sau khi config

```bash
# Stop backend (Ctrl+C trong terminal đang chạy)

# Hoặc force kill
# Windows:
taskkill /F /IM node.exe

# Restart
cd backend
npm start
```

---

## 📚 TÀI LIỆU THAM KHẢO

### Hugging Face

- **Documentation**: https://huggingface.co/docs/api-inference
- **Models**: https://huggingface.co/models
- **Pricing**: https://huggingface.co/pricing

### VNPay

- **Website**: https://vnpay.vn/
- **API Docs**: https://sandbox.vnpayment.vn/apis/
- **Sandbox**: https://sandbox.vnpayment.vn/
- **Support**: hotro@vnpay.vn | 1900 55 55 77

### MoMo

- **Business**: https://business.momo.vn/
- **Developer**: https://developers.momo.vn/
- **API Docs**: https://developers.momo.vn/v3/docs
- **Support**: developers@momo.vn

---

## 💡 GỢI Ý CHO DEMO MÔN HỌC

### Tình huống 1: Chỉ cần demo AI tạo tranh

✅ **Cài đặt**:

- Hugging Face API (MIỄN PHÍ)

⏭️ **Bỏ qua**:

- VNPay/MoMo (chưa cần)

### Tình huống 2: Demo đầy đủ tính năng thanh toán

✅ **Cài đặt**:

- Hugging Face API
- VNPay Sandbox hoặc MoMo Sandbox

💡 **Lưu ý**:

- Dùng Sandbox cho demo
- Giải thích cho giáo viên đây là môi trường test
- Production cần đăng ký doanh nghiệp

### Tình huống 3: Chỉ demo mua hàng COD

✅ **Đã có**:

- COD (Cash On Delivery) đã hoạt động

⏭️ **Không cần cài thêm gì**

---

## ❓ FAQ - CÂU HỎI THƯỜNG GẶP

**Q1: Hugging Face API có miễn phí không?**

- ✅ Có, free tier cho 1,000 requests/tháng
- Đủ cho demo môn học
- Có thể chậm hơn paid tier

**Q2: Không đăng ký được VNPay/MoMo vì không có doanh nghiệp?**

- Dùng **Sandbox** cho demo
- Giải thích với giáo viên
- Hoặc chỉ demo COD payment

**Q3: AI tạo ảnh chậm quá?**

- Free tier của Hugging Face có thể chậm (30-60s)
- Model cần "warm up" lần đầu (1-2 phút)
- Nâng cấp Pro nếu cần ($9/month)

**Q4: Có thể dùng API khác thay Hugging Face không?**

- Có thể dùng:
  - OpenAI DALL-E (trả phí, $0.020/image)
  - Replicate Stable Diffusion (trả phí)
  - Local Stable Diffusion (cần GPU mạnh)

**Q5: Firebase Storage có giới hạn không?**

- Free tier: 5GB storage
- 1GB upload/day
- 50,000 reads/day
- Đủ cho demo

---

## 🚨 LƯU Ý QUAN TRỌNG

### Bảo mật

- ⚠️ **KHÔNG commit** .env file lên GitHub
- ⚠️ **KHÔNG share** API keys công khai
- ✅ Dùng `.gitignore` để exclude .env

### Production

- Khi deploy lên production:
  - Đổi VNPay/MoMo từ sandbox → production URL
  - Dùng credentials chính thức
  - Setup SSL certificate (HTTPS)
  - Configure domain cho callback URLs

### Demo môn học

- ✅ Hugging Face free tier là đủ
- ✅ Sandbox VNPay/MoMo cho demo thanh toán
- ✅ COD luôn hoạt động, không cần setup
- ✅ Giải thích rõ với giảng viên đây là môi trường test

---

## ✅ CHECKLIST TRƯỚC KHI DEMO

**Bắt buộc**:

- [ ] Hugging Face token đã thêm vào .env
- [ ] Backend restart sau khi config
- [ ] Test tạo ảnh AI thành công (1 lần)
- [ ] Email OTP hoạt động
- [ ] COD checkout hoạt động

**Tùy chọn** (nếu demo payment):

- [ ] VNPay sandbox credentials
- [ ] MoMo sandbox credentials
- [ ] Test redirect đến payment page
- [ ] Test callback URL

---

**🎯 Với hướng dẫn này, bạn đã sẵn sàng cho demo!**

Nếu có lỗi, xem phần Troubleshooting hoặc liên hệ support của từng platform.
