# 🎨 Color Palette — Yu Ling (Happy Coloring AI)

---

## 1. Brand Colors (Tailwind Custom — `tailwind.config.js`)

| Tên Token          | Hex       | Tailwind Class                | Mô Tả               |
| ------------------ | --------- | ----------------------------- | ------------------- |
| `primary`          | `#d988b9` | `bg-primary` / `text-primary` | Hồng tím chủ đạo    |
| `accent`           | `#9c30e8` | `bg-accent` / `text-accent`   | Tím nhấn            |
| `background-light` | `#fdfbfc` | `bg-background-light`         | Nền sáng            |
| `background-dark`  | `#161218` | `bg-background-dark`          | Nền tối (dark mode) |
| `surface-light`    | `#ffffff` | `bg-surface-light`            | Bề mặt card (sáng)  |
| `surface-dark`     | `#1f1922` | `bg-surface-dark`             | Bề mặt card (tối)   |

---

## 2. CSS Variables (`:root` — `globals.css`)

```css
--magenta-primary: #e6007a /* Đỏ Magenta */ --magenta-deep: #ff1493
  /* Hồng đậm (Deep Pink) */ --magenta-hot: #ff69b4 /* Hồng sáng (Hot Pink) */
  --violet-blue: #8a2be2 /* Tím xanh (Violet Blue) */ --violet-dark: #9400d3
  /* Tím đậm */ --orchid-dark: #9932cc /* Tím lan đậm */
  --orchid-medium: #ba55d3 /* Tím lan vừa (Medium Orchid) */
  --purple-base: #800080 /* Tím thuần */;
```

---

## 3. Gradient Chủ Đạo (dùng nhiều nhất trong UI)

| Tên Gradient       | Tailwind Class                  | Hex From → To         |
| ------------------ | ------------------------------- | --------------------- |
| Gradient chính     | `from-purple-600 to-pink-600`   | `#9333ea` → `#db2777` |
| Gradient button    | `from-purple-500 to-pink-500`   | `#a855f7` → `#ec4899` |
| Gradient xanh tím  | `from-blue-500 to-indigo-500`   | `#3b82f6` → `#6366f1` |
| Gradient xanh nhạt | `from-blue-500 to-cyan-500`     | `#3b82f6` → `#06b6d4` |
| Gradient xanh lá   | `from-green-500 to-emerald-500` | `#22c55e` → `#10b981` |
| Gradient cam vàng  | `from-yellow-500 to-orange-500` | `#eab308` → `#f97316` |
| Gradient đỏ hồng   | `from-red-500 to-pink-600`      | `#ef4444` → `#db2777` |
| Gradient vàng mật  | `from-amber-500 to-yellow-500`  | `#f59e0b` → `#eab308` |
| Gradient tối nền   | `from-gray-50 to-purple-50`     | `#f9fafb` → `#faf5ff` |

---

## 4. Màu Trạng Thái Đơn Hàng / Badge

| Trạng Thái | Badge Class                                       |
| ---------- | ------------------------------------------------- |
| Chờ xử lý  | `bg-yellow-100 text-yellow-700 border-yellow-200` |
| Đang xử lý | `bg-blue-100 text-blue-700 border-blue-200`       |
| Đang giao  | `bg-purple-100 text-purple-700 border-purple-200` |
| Đã giao    | `bg-green-100 text-green-700 border-green-200`    |
| Đã hủy     | `bg-red-100 text-red-700 border-red-200`          |

---

## 5. Màu Text Phổ Biến

| Mục Đích              | Tailwind Class                                              | Hex       |
| --------------------- | ----------------------------------------------------------- | --------- |
| Tiêu đề gradient      | `text-transparent bg-clip-text from-purple-600 to-pink-600` | —         |
| Text chính            | `text-gray-800`                                             | `#1f2937` |
| Text phụ              | `text-gray-600`                                             | `#4b5563` |
| Text mờ               | `text-gray-400`                                             | `#9ca3af` |
| Text link / accent    | `text-purple-600`                                           | `#9333ea` |
| Text giá / quan trọng | `text-purple-600`                                           | `#9333ea` |

---

## 6. Màu Nền Card & Bề Mặt

| Mục Đích     | Tailwind Class    | Hex       |
| ------------ | ----------------- | --------- |
| Card trắng   | `bg-white`        | `#ffffff` |
| Nền trang    | `bg-gray-50`      | `#f9fafb` |
| Nền tím nhạt | `bg-purple-50`    | `#faf5ff` |
| Border card  | `border-gray-100` | `#f3f4f6` |

---

## 7. Cách Dùng Nhanh (Copy-Paste)

### Button chính

```html
<button
  class="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all hover:scale-105"
>
  Nhấn đây
</button>
```

### Card

```html
<div class="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">...</div>
```

### Tiêu đề gradient

```html
<h1
  class="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"
>
  Tiêu đề
</h1>
```

### Badge trạng thái

```html
<span
  class="px-3 py-1 bg-purple-100 text-purple-700 border border-purple-200 rounded-full text-xs font-semibold"
>
  Đang giao
</span>
```

### Icon box gradient

```html
<div
  class="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-2xl shadow-lg"
>
  🎨
</div>
```
