# 🚀 Payment Integration - Quick Start

## ✅ Đã hoàn thành

Payment integration cho VNPay, MoMo và COD đã được implement đầy đủ!

## 📦 Files đã tạo/cập nhật

### Backend

- ✅ `backend/src/services/paymentService.js` - Payment logic
- ✅ `backend/src/routes/payment.js` - Payment endpoints
- ✅ `backend/src/index.js` - Added payment routes
- ✅ `backend/.env.example` - Environment variables template

### Frontend

- ✅ `frontend/src/lib/paymentAPI.ts` - Payment API client
- ✅ `frontend/src/app/payment/vnpay/callback/page.tsx` - VNPay callback
- ✅ `frontend/src/app/payment/momo/callback/page.tsx` - MoMo callback
- ✅ `frontend/src/app/checkout/page.tsx` - Updated với payment methods
- ✅ `frontend/src/app/order-success/page.tsx` - Updated để hiển thị payment status

## 🔧 Setup nhanh

### 1. Backend Setup

```bash
cd backend

# Copy và edit environment variables
cp .env.example .env

# Edit .env file và thêm credentials:
# - VNPAY_TMN_CODE
# - VNPAY_HASH_SECRET
# - MOMO_PARTNER_CODE
# - MOMO_ACCESS_KEY
# - MOMO_SECRET_KEY

# Install dependencies (nếu chưa)
npm install

# Run
npm run dev
```

### 2. Frontend Setup

```bash
cd frontend

# Đã có .env.production, chỉ cần chạy
npm run dev
```

### 3. Đăng ký Test Account

**VNPay:**

1. Truy cập: https://sandbox.vnpayment.vn/merchant_webapi/
2. Đăng ký merchant test account
3. Lấy TMN Code và Hash Secret
4. Update vào backend/.env

**MoMo:**

1. Truy cập: https://developers.momo.vn
2. Đăng ký developer account
3. Tạo test application
4. Lấy Partner Code, Access Key, Secret Key
5. Update vào backend/.env

## 🧪 Test Payment Flow

### Test VNPay

1. Thêm sản phẩm vào cart
2. Checkout → Chọn "VNPay"
3. Sẽ redirect tới VNPay sandbox
4. Dùng test card từ VNPay docs
5. Sau khi thanh toán → redirect về /order-success

### Test MoMo

1. Thêm sản phẩm vào cart
2. Checkout → Chọn "MoMo E-Wallet"
3. Sẽ redirect tới MoMo test
4. Dùng test wallet
5. Sau khi thanh toán → redirect về /order-success

### Test COD

1. Thêm sản phẩm vào cart
2. Checkout → Chọn "COD"
3. Submit form → direct tới /order-success
4. Không cần payment gateway

## 🎯 Production Deployment

Khi deploy lên production:

### 1. Update URLs

```env
# backend/.env
VNPAY_URL=https://pay.vnpay.vn/paymentv2/vpcpay.html
MOMO_ENDPOINT=https://payment.momo.vn/v2/gateway/api/create
VNPAY_RETURN_URL=https://yourdomain.com/payment/vnpay/callback
MOMO_REDIRECT_URL=https://yourdomain.com/payment/momo/callback
MOMO_IPN_URL=https://your-api.com/api/payment/momo/ipn
FRONTEND_URL=https://yourdomain.com
```

### 2. Update Credentials

Thay test credentials bằng production credentials

### 3. Test Thoroughly

Test toàn bộ payment flow với real money (số tiền nhỏ)

## 📊 Database Collections

Payment tạo 1 collection mới:

### `transactions`

```javascript
{
  orderId: string,
  amount: number,
  paymentMethod: "vnpay" | "momo",
  status: "pending" | "success" | "failed",
  txnRef: string, // VNPay
  requestId: string, // MoMo
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

### `orders` (updated)

Thêm fields:

```javascript
{
  paymentMethod: "vnpay" | "momo" | "cod",
  paymentStatus: "pending" | "paid" | "failed",
  transactionId: string,
  paidAt: Timestamp
}
```

## 🔍 Monitoring

Check logs để debug:

```bash
# Backend logs
cd backend
npm run dev

# Xem console logs cho:
# - Payment creation
# - Callback verification
# - Order updates
```

## 📞 Support

Issues? Check:

1. [PAYMENT_INTEGRATION.md](./PAYMENT_INTEGRATION.md) - Full documentation
2. Backend console logs
3. Browser console logs
4. VNPay/MoMo developer portal logs

## ✨ Next Steps

Payment đã done! Có thể tiếp tục:

1. ✅ Email notifications khi thanh toán thành công
2. ✅ Admin dashboard để xem transactions
3. ✅ Refund functionality
4. ✅ Transaction history cho user
5. ✅ Payment analytics/reports

Enjoy! 🎉
