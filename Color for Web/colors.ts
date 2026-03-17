/**
 * Yu Ling (Happy Coloring AI) — Brand Color Tokens
 * Copy file này vào bất kỳ project nào để dùng lại bộ màu
 */

// ─── 1. Brand Tokens (khớp tailwind.config.js) ───────────────────────────────
export const brand = {
  primary: "#d988b9", // Hồng tím chủ đạo
  accent: "#9c30e8", // Tím nhấn
  backgroundLight: "#fdfbfc", // Nền sáng
  backgroundDark: "#161218", // Nền tối
  surfaceLight: "#ffffff", // Card sáng
  surfaceDark: "#1f1922", // Card tối
};

// ─── 2. CSS Variables (khớp globals.css :root) ───────────────────────────────
export const cssVars = {
  magentaPrimary: "#e6007a",
  magentaDeep: "#ff1493",
  magentaHot: "#ff69b4",
  violetBlue: "#8a2be2",
  violetDark: "#9400d3",
  orchidDark: "#9932cc",
  orchidMedium: "#ba55d3",
  purpleBase: "#800080",
};

// ─── 3. Gradients (from → to) ────────────────────────────────────────────────
export const gradients = {
  main: { from: "#9333ea", to: "#db2777" }, // purple-600 → pink-600
  button: { from: "#a855f7", to: "#ec4899" }, // purple-500 → pink-500
  blueIndi: { from: "#3b82f6", to: "#6366f1" }, // blue-500 → indigo-500
  blueCyan: { from: "#3b82f6", to: "#06b6d4" }, // blue-500 → cyan-500
  green: { from: "#22c55e", to: "#10b981" }, // green-500 → emerald-500
  orange: { from: "#eab308", to: "#f97316" }, // yellow-500 → orange-500
  redPink: { from: "#ef4444", to: "#db2777" }, // red-500 → pink-600
  amber: { from: "#f59e0b", to: "#eab308" }, // amber-500 → yellow-500
  pageBg: { from: "#f9fafb", to: "#faf5ff" }, // gray-50 → purple-50
};

// ─── 4. Status Badge Colors ───────────────────────────────────────────────────
export const statusColors = {
  pending: {
    tailwind: "bg-yellow-100 text-yellow-700 border-yellow-200",
    bg: "#fef9c3",
    text: "#a16207",
    border: "#fef08a",
  },
  processing: {
    tailwind: "bg-blue-100 text-blue-700 border-blue-200",
    bg: "#dbeafe",
    text: "#1d4ed8",
    border: "#bfdbfe",
  },
  shipping: {
    tailwind: "bg-purple-100 text-purple-700 border-purple-200",
    bg: "#f3e8ff",
    text: "#7e22ce",
    border: "#e9d5ff",
  },
  delivered: {
    tailwind: "bg-green-100 text-green-700 border-green-200",
    bg: "#dcfce7",
    text: "#15803d",
    border: "#bbf7d0",
  },
  cancelled: {
    tailwind: "bg-red-100 text-red-700 border-red-200",
    bg: "#fee2e2",
    text: "#b91c1c",
    border: "#fecaca",
  },
};

// ─── 5. Common Text Colors ────────────────────────────────────────────────────
export const text = {
  heading: "#1f2937", // gray-800
  body: "#4b5563", // gray-600
  muted: "#9ca3af", // gray-400
  accent: "#9333ea", // purple-600
  link: "#9333ea", // purple-600
};

// ─── 6. Surface & Background ─────────────────────────────────────────────────
export const surface = {
  white: "#ffffff",
  pageBg: "#f9fafb", // gray-50
  purpleHint: "#faf5ff", // purple-50
  border: "#f3f4f6", // gray-100
};
