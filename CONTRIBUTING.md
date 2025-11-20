# 🤝 Contributing Guide

## Quy trình làm việc

### 1. Clone Repository
```bash
git clone https://github.com/baody613/Happy_Coloring_AI.git
cd Happy_Coloring_AI
```

### 2. Cài đặt Dependencies

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd frontend
npm install
```

### 3. Cấu hình Environment Variables

**Backend** (`backend/.env`):
```env
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-client-email
FIREBASE_PRIVATE_KEY=your-private-key
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

**Frontend** (`frontend/.env.local`):
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_IMGBB_API_KEY=your-imgbb-key
```

### 4. Chạy Development Server

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

## 📋 Quy tắc Git Workflow

### Branch Naming Convention
- `feature/payment-integration` - Tính năng mới
- `fix/login-error` - Sửa lỗi
- `hotfix/security-patch` - Sửa khẩn cấp
- `refactor/admin-components` - Tái cấu trúc code
- `docs/api-documentation` - Cập nhật tài liệu

### Commit Message Format
```
Type: Short description

Detailed explanation (if needed)

Examples:
- Add: User authentication with Firebase
- Fix: Image upload 400 error
- Update: Admin UI with gradient backgrounds
- Remove: Unused dependencies
- Refactor: Product form validation logic
```

### Workflow Steps

**1. Tạo branch mới:**
```bash
git checkout main
git pull origin main
git checkout -b feature/your-feature-name
```

**2. Code và commit thường xuyên:**
```bash
git add .
git commit -m "Add: feature description"
```

**3. Push lên GitHub:**
```bash
git push origin feature/your-feature-name
```

**4. Tạo Pull Request:**
- Vào GitHub repository
- Click "Compare & pull request"
- Điền mô tả chi tiết:
  - Tính năng làm gì?
  - Cách test?
  - Screenshots (nếu có UI changes)
- Request review từ teammates

**5. Code Review:**
- Teammates review code
- Thảo luận và sửa nếu cần
- Approve khi đạt yêu cầu

**6. Merge:**
- Sau khi approved → Merge vào main
- Xóa branch sau khi merge

## 🔄 Sync với Main Branch

**Trước khi bắt đầu làm việc:**
```bash
git checkout main
git pull origin main
git checkout your-branch
git merge main
```

**Nếu có conflict:**
1. Mở VS Code, sửa file conflict
2. Chọn "Accept Current Change" hoặc "Accept Incoming Change"
3. Commit:
```bash
git add .
git commit -m "Merge: resolve conflicts with main"
git push
```

## 📝 Code Standards

### JavaScript/TypeScript
- Sử dụng ES6+ syntax
- Async/await thay vì .then()
- Descriptive variable names
- Comment cho logic phức tạp

### React Components
- Functional components + Hooks
- Props type checking với TypeScript
- Single responsibility principle
- Reusable components trong `/components`

### CSS/Styling
- Tailwind CSS classes
- Responsive design (mobile-first)
- Consistent spacing và colors
- Follow existing design system

### API Routes
- RESTful conventions
- Proper error handling
- Input validation
- Authentication middleware

## 🧪 Testing

**Trước khi commit:**
1. Test tính năng mới thoroughly
2. Kiểm tra responsive design
3. Test trên Chrome & Edge
4. Đảm bảo không có console errors

**Trước khi tạo PR:**
1. Pull main branch mới nhất
2. Test lại sau khi merge
3. Build thành công: `npm run build`

## 🚫 Không Commit

- File `.env` và `.env.local`
- `node_modules/`
- Firebase service account keys
- Build outputs (`dist/`, `.next/`)
- Personal IDE settings (`.vscode/`, `.idea/`)

## 📞 Liên hệ & Hỗ trợ

**Khi gặp vấn đề:**
1. Tìm trong Issues đã có
2. Tạo Issue mới với:
   - Mô tả rõ ràng
   - Steps to reproduce
   - Screenshots/error logs
   - Environment info

**Team Communication:**
- Daily standup: Chia sẻ tiến độ
- Code review: Học hỏi lẫn nhau
- Pair programming: Giải quyết vấn đề khó

## 🎯 Best Practices

1. **Commit nhỏ và thường xuyên** - Dễ review và revert
2. **Pull main mỗi ngày** - Tránh conflict lớn
3. **Write meaningful commits** - Giúp hiểu lịch sử thay đổi
4. **Test before push** - Đảm bảo code chạy được
5. **Review kỹ trước approve** - Maintain code quality
6. **Document changes** - Update README nếu cần

---

**Happy Coding! 🎨✨**
