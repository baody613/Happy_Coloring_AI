# 💳 Payment Integration Guide - VNPay & MoMo

## 📋 Tổng quan

Hệ thống payment integration đã được triển khai hoàn chỉnh với hai cổng thanh toán phổ biến tại Việt Nam:

- **VNPay**: Hỗ trợ thẻ ATM, Visa, Mastercard
- **MoMo**: Ví điện tử MoMo
- **COD**: Thanh toán khi nhận hàng

## 🏗️ Kiến trúc

### Backend Structure

```
backend/
├── src/
│   ├── services/
│   │   └── paymentService.js      # VNPay & MoMo payment logic
│   └── routes/
│       └── payment.js              # Payment endpoints
```

### Frontend Structure

```
frontend/
├── src/
│   ├── lib/
│   │   └── paymentAPI.ts          # Payment API client
│   ├── app/
│   │   ├── checkout/
│   │   │   └── page.tsx           # Payment method selection
│   │   └── payment/
│       │       ├── vnpay/
│       │       │   └── callback/
│       │       │       └── page.tsx   # VNPay callback handler
│       │       └── momo/
│       │           └── callback/
│       │               └── page.tsx   # MoMo callback handler
```

## 🔌 API Endpoints

### 1. Create Payment

**POST** `/api/payment/create`

Tạo payment URL cho VNPay hoặc MoMo.

**Headers:**

```json
{
  "Authorization": "Bearer <firebase_token>",
  "Content-Type": "application/json"
}
```

**Request Body:**

```json
{
  "orderId": "order_id_here",
  "paymentMethod": "vnpay" | "momo" | "cod",
  "ipAddr": "127.0.0.1" // Optional
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "paymentUrl": "https://sandbox.vnpayment.vn/...",
    "txnRef": "orderId_timestamp",
    "paymentMethod": "vnpay"
  }
}
```

### 2. VNPay Callback

**GET** `/api/payment/vnpay/callback`

Xử lý kết quả thanh toán từ VNPay, tự động redirect về frontend.

**Query Parameters:**

- `vnp_ResponseCode`: Mã kết quả (00 = success)
- `vnp_TxnRef`: Transaction reference
- `vnp_Amount`: Số tiền (x100)
- `vnp_SecureHash`: Chữ ký bảo mật
- ... (và các params khác từ VNPay)

### 3. MoMo Callback

**GET** `/api/payment/momo/callback`

Xử lý kết quả thanh toán từ MoMo, tự động redirect về frontend.

**Query Parameters:**

- `resultCode`: 0 = success
- `orderId`: Order ID
- `amount`: Số tiền
- `transId`: Transaction ID
- `signature`: Chữ ký bảo mật

### 4. MoMo IPN (Webhook)

**POST** `/api/payment/momo/ipn`

Nhận thông báo từ MoMo server (Instant Payment Notification).

### 5. Get Transaction

**GET** `/api/payment/transaction/:orderId`

Lấy thông tin transaction theo order ID.

### 6. Verify Payment

**GET** `/api/payment/verify/:orderId`

Kiểm tra trạng thái thanh toán của đơn hàng.

## 🔐 Environment Variables

### Backend (.env)

```env
# VNPay Configuration
VNPAY_TMN_CODE=your_vnpay_tmn_code
VNPAY_HASH_SECRET=your_vnpay_hash_secret
VNPAY_URL=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
VNPAY_RETURN_URL=http://localhost:3000/payment/vnpay/callback

# MoMo Configuration
MOMO_PARTNER_CODE=your_momo_partner_code
MOMO_ACCESS_KEY=your_momo_access_key
MOMO_SECRET_KEY=your_momo_secret_key
MOMO_ENDPOINT=https://test-payment.momo.vn/v2/gateway/api/create
MOMO_REDIRECT_URL=http://localhost:3000/payment/momo/callback
MOMO_IPN_URL=http://localhost:5000/api/payment/momo/ipn

# Other
FRONTEND_URL=http://localhost:3000
API_URL=http://localhost:5000/api
```

### Frontend (.env.production)

```env
NEXT_PUBLIC_API_URL=https://your-backend-url.com/api
```

## 🔄 Payment Flow

### VNPay Flow

```
1. User chọn VNPay tại checkout
2. Frontend gọi POST /api/payment/create
3. Backend tạo VNPay URL với signature
4. Frontend redirect user tới VNPay
5. User nhập thông tin thẻ và thanh toán
6. VNPay redirect về /api/payment/vnpay/callback
7. Backend verify signature, update order status
8. Backend redirect tới /payment/vnpay/callback (frontend)
9. Frontend hiển thị kết quả và redirect tới /order-success
```

### MoMo Flow

```
1. User chọn MoMo tại checkout
2. Frontend gọi POST /api/payment/create
3. Backend gọi MoMo API để tạo payment
4. MoMo trả về payUrl
5. Frontend redirect user tới MoMo app/web
6. User xác nhận thanh toán
7. MoMo redirect về /api/payment/momo/callback
8. Backend verify signature, update order status
9. MoMo gọi IPN webhook (tùy chọn)
10. Backend redirect tới /payment/momo/callback (frontend)
11. Frontend hiển thị kết quả và redirect tới /order-success
```

### COD Flow

```
1. User chọn COD tại checkout
2. Frontend tạo order trực tiếp
3. Order status = "pending", paymentStatus = "pending"
4. Redirect tới /order-success
5. Admin sẽ confirm khi nhận được tiền COD
```

## 🔒 Security Features

### VNPay

- ✅ HMAC SHA512 signature verification
- ✅ Secure hash validation
- ✅ Amount tampering protection
- ✅ Transaction reference validation

### MoMo

- ✅ HMAC SHA256 signature
- ✅ IPN webhook for double verification
- ✅ Request ID uniqueness
- ✅ Partner code validation

## 💾 Database Schema

### Transactions Collection

```javascript
{
  orderId: string,
  txnRef: string,           // VNPay only
  requestId: string,        // MoMo only
  amount: number,
  paymentMethod: "vnpay" | "momo" | "cod",
  status: "pending" | "success" | "failed",
  createdAt: Timestamp,
  updatedAt: Timestamp,

  // VNPay specific
  vnpayParams: Object,
  vnpayResponse: Object,
  responseCode: string,

  // MoMo specific
  momoParams: Object,
  momoResponse: Object,
  transId: string,
  resultCode: number
}
```

### Orders Collection (Updated Fields)

```javascript
{
  // ... existing fields
  paymentMethod: "vnpay" | "momo" | "cod",
  paymentStatus: "pending" | "paid" | "failed",
  transactionId: string,
  paidAt: Timestamp
}
```

## 🧪 Testing

### Test Credentials

**VNPay Sandbox:**

- URL: https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
- Test cards: Xem tại VNPay sandbox documentation

**MoMo Test:**

- URL: https://test-payment.momo.vn/v2/gateway/api/create
- Test wallet: Tạo ví test trên MoMo developer portal

### Local Testing

```bash
# Backend
cd backend
npm install
npm run dev

# Frontend
cd frontend
npm install
npm run dev
```

## 📝 Response Codes

### VNPay Response Codes

- `00`: Giao dịch thành công
- `07`: Trừ tiền thành công, giao dịch đang chờ
- `09`: Thẻ chưa đăng ký dịch vụ
- `10`: Thẻ hết hạn
- `11`: Thẻ bị khóa
- `12`: Sai mật khẩu
- `24`: Giao dịch bị hủy
- `51`: Tài khoản không đủ số dư
- [Full list...](https://sandbox.vnpayment.vn/apis/docs/bang-ma-loi/)

### MoMo Result Codes

- `0`: Success
- `1`: Failed (general)
- `9`: Transaction denied by user
- `1000`: Transaction initiated
- `1001`: Insufficient balance
- `1004`: Transaction amount exceeded
- [Full list...](https://developers.momo.vn/v3/#/docs/error_code)

## 🚀 Deployment

### Production Checklist

- [ ] Update VNPAY_URL to production
- [ ] Update MOMO_ENDPOINT to production
- [ ] Set correct FRONTEND_URL and API_URL
- [ ] Configure real credentials (không commit vào git!)
- [ ] Test payment flow trên production
- [ ] Setup monitoring cho payment errors
- [ ] Configure webhook IPN URL với public domain
- [ ] Enable HTTPS cho tất cả endpoints

### Environment Setup

```bash
# Backend production
cp .env.example .env.production
# Điền credentials thật vào .env.production

# Frontend production
# Update frontend/.env.production với backend URL thật
```

## 🐛 Debugging

### Common Issues

1. **Signature không khớp**

   - Kiểm tra VNPAY_HASH_SECRET / MOMO_SECRET_KEY
   - Verify thứ tự params khi tạo signature
   - Check encoding (UTF-8)

2. **Callback không redirect**

   - Kiểm tra VNPAY_RETURN_URL / MOMO_REDIRECT_URL
   - Verify FRONTEND_URL correct
   - Check CORS settings

3. **Transaction không lưu vào DB**
   - Check Firebase connection
   - Verify collection permissions
   - Log error trong backend

### Debug Logs

```javascript
// Enable trong development
console.log("Payment data:", orderData);
console.log("Signature:", signature);
console.log("Callback params:", callbackData);
```

## 📧 Support

- VNPay Support: https://vnpay.vn/lien-he/
- MoMo Developer: https://developers.momo.vn
- Project Issues: [GitHub Issues]

## 📄 License

MIT License - Feel free to use in your projects!
