// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: '/api/auth/register',
    LOGIN: '/api/auth/login',
    PROFILE: '/api/auth/profile',
  },
  ADMIN: {
    PRODUCTS: '/api/admin/products',
    ORDERS: '/api/admin/orders',
    USERS: '/api/admin/users',
    STATS: '/api/admin/stats',
    SETTINGS: {
      BASE: '/api/admin/settings',
      SYSTEM: '/api/admin/settings/system',
      PAYMENT: '/api/admin/settings/payment',
      EMAIL: '/api/admin/settings/email',
      EMAIL_TEST: '/api/admin/settings/email/test',
    },
  },
  PRODUCTS: '/api/products',
  ORDERS: '/api/orders',
  USERS: '/api/users',
  GENERATE: '/api/generate',
  PASSWORD_RESET: '/api/password-reset',
};

// App Routes
export const APP_ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  PROFILE: '/profile',
  CART: '/cart',
  CHECKOUT: '/checkout',
  ORDER_SUCCESS: '/order-success',
  GALLERY: '/gallery',
  GENERATE: '/generate',
  FORGOT_PASSWORD: '/forgot-password',
  ADMIN: {
    DASHBOARD: '/admin',
    PRODUCTS: '/admin/products',
    ORDERS: '/admin/orders',
    USERS: '/admin/users',
    SETTINGS: '/admin/settings',
  },
};

// Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'authToken',
  REMEMBER_ME: 'rememberMe',
  CART: 'cart',
  FAVORITES: 'favorites',
};

// Order Status
export const ORDER_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  SHIPPING: 'shipping',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
} as const;

export const ORDER_STATUS_LABELS = {
  pending: 'Chờ xử lý',
  processing: 'Đang xử lý',
  shipping: 'Đang giao',
  delivered: 'Đã giao',
  cancelled: 'Đã hủy',
};

export const ORDER_STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  shipping: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

// Product Difficulty
export const DIFFICULTY_LEVELS = {
  EASY: 'easy',
  MEDIUM: 'medium',
  HARD: 'hard',
} as const;

export const DIFFICULTY_LABELS = {
  easy: 'Dễ',
  medium: 'Trung bình',
  hard: 'Khó',
};

export const DIFFICULTY_COLORS = {
  easy: 'bg-green-100 text-green-800',
  medium: 'bg-yellow-100 text-yellow-800',
  hard: 'bg-red-100 text-red-800',
};

// Payment Methods
export const PAYMENT_METHODS = {
  COD: 'cod',
  VNPAY: 'vnpay',
  MOMO: 'momo',
  BANKING: 'banking',
} as const;

export const PAYMENT_METHOD_LABELS = {
  cod: 'Thanh toán khi nhận hàng',
  vnpay: 'VNPay',
  momo: 'MoMo',
  banking: 'Chuyển khoản ngân hàng',
};

// User Roles
export const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin',
} as const;

// Validation Rules
export const VALIDATION = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_REGEX: /^[0-9]{10,11}$/,
  PASSWORD_MIN_LENGTH: 6,
  MAX_IMAGE_SIZE_MB: 10,
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
};

// Messages
export const MESSAGES = {
  SUCCESS: {
    LOGIN: 'Đăng nhập thành công!',
    REGISTER: 'Đăng ký thành công!',
    LOGOUT: 'Đăng xuất thành công!',
    UPDATE_PROFILE: 'Cập nhật thông tin thành công!',
    CREATE_ORDER: 'Đặt hàng thành công!',
    ADD_TO_CART: 'Đã thêm vào giỏ hàng!',
    REMOVE_FROM_CART: 'Đã xóa khỏi giỏ hàng!',
    SAVE_SETTINGS: 'Lưu cài đặt thành công!',
  },
  ERROR: {
    LOGIN: 'Đăng nhập thất bại!',
    REGISTER: 'Đăng ký thất bại!',
    UPDATE_PROFILE: 'Cập nhật thông tin thất bại!',
    CREATE_ORDER: 'Đặt hàng thất bại!',
    NETWORK: 'Lỗi kết nối mạng!',
    UNKNOWN: 'Đã có lỗi xảy ra!',
    UNAUTHORIZED: 'Bạn không có quyền truy cập!',
    INVALID_CREDENTIALS: 'Email hoặc mật khẩu không đúng!',
  },
};

// Default Settings
export const DEFAULT_SETTINGS = {
  CURRENCY: 'VND',
  TAX_RATE: 10,
  SHIPPING_FEE: 30000,
};
