import api from './api';

// ================== PRODUCT MANAGEMENT ==================

export const adminProductAPI = {
  // Get all products (including inactive)
  getAll: async (params?: { status?: string; limit?: number; page?: number }) => {
    const response = await api.get('/admin/products', { params });
    return response.data;
  },

  // Create new product
  create: async (productData: {
    title: string;
    description?: string;
    category?: string;
    price: number;
    imageUrl: string;
    thumbnailUrl?: string;
    difficulty?: 'easy' | 'medium' | 'hard';
    dimensions?: { width: number; height: number; unit: string };
    colors?: number;
  }) => {
    const response = await api.post('/admin/products', productData);
    return response.data;
  },

  // Update product
  update: async (productId: string, updateData: any) => {
    const response = await api.put(`/admin/products/${productId}`, updateData);
    return response.data;
  },

  // Delete product
  delete: async (productId: string) => {
    const response = await api.delete(`/admin/products/${productId}`);
    return response.data;
  },
};

// ================== ORDER MANAGEMENT ==================

export const adminOrderAPI = {
  // Get all orders
  getAll: async (params?: { status?: string; limit?: number; page?: number }) => {
    const response = await api.get('/admin/orders', { params });
    return response.data;
  },

  // Update order status
  updateStatus: async (
    orderId: string,
    status: 'pending' | 'processing' | 'shipping' | 'delivered' | 'cancelled'
  ) => {
    const response = await api.put(`/admin/orders/${orderId}`, { status });
    return response.data;
  },

  // Delete order
  delete: async (orderId: string) => {
    const response = await api.delete(`/admin/orders/${orderId}`);
    return response.data;
  },
};

// ================== USER MANAGEMENT ==================

export const adminUserAPI = {
  // Get all users
  getAll: async (params?: { limit?: number; page?: number }) => {
    const response = await api.get('/admin/users', { params });
    return response.data;
  },

  // Update user
  update: async (
    userId: string,
    updateData: {
      disabled?: boolean;
      displayName?: string;
      role?: string;
    }
  ) => {
    const response = await api.put(`/admin/users/${userId}`, updateData);
    return response.data;
  },

  // Delete user
  delete: async (userId: string) => {
    const response = await api.delete(`/admin/users/${userId}`);
    return response.data;
  },
};

// ================== STATISTICS ==================

export const adminStatsAPI = {
  // Get dashboard statistics
  getDashboardStats: async () => {
    const response = await api.get('/admin/stats');
    return response.data;
  },
};

// ================== SETTINGS MANAGEMENT ==================

export const adminSettingsAPI = {
  // Get all settings
  getAll: async () => {
    const response = await api.get('/admin/settings');
    return response.data;
  },

  // System Settings
  getSystemSettings: async () => {
    const response = await api.get('/admin/settings/system');
    return response.data;
  },

  updateSystemSettings: async (settings: {
    siteName?: string;
    siteDescription?: string;
    maintenanceMode?: boolean;
    allowRegistration?: boolean;
    maxImageSize?: number;
    defaultCurrency?: string;
    taxRate?: number;
    shippingFee?: number;
  }) => {
    const response = await api.put('/admin/settings/system', settings);
    return response.data;
  },

  // Payment Settings
  getPaymentSettings: async () => {
    const response = await api.get('/admin/settings/payment');
    return response.data;
  },

  updatePaymentSettings: async (settings: {
    paymentMethods?: {
      cod?: boolean;
      vnpay?: boolean;
      momo?: boolean;
      banking?: boolean;
    };
    vnpayConfig?: {
      tmnCode?: string;
      hashSecret?: string;
      url?: string;
    };
    momoConfig?: {
      partnerCode?: string;
      accessKey?: string;
      secretKey?: string;
    };
    bankingInfo?: {
      bankName?: string;
      accountNumber?: string;
      accountName?: string;
    };
  }) => {
    const response = await api.put('/admin/settings/payment', settings);
    return response.data;
  },

  // Email Settings
  getEmailSettings: async () => {
    const response = await api.get('/admin/settings/email');
    return response.data;
  },

  updateEmailSettings: async (settings: {
    smtpHost?: string;
    smtpPort?: number;
    smtpUser?: string;
    smtpPassword?: string;
    fromEmail?: string;
    fromName?: string;
    emailNotifications?: {
      orderConfirmation?: boolean;
      orderStatusUpdate?: boolean;
      newUserRegistration?: boolean;
      passwordReset?: boolean;
    };
  }) => {
    const response = await api.put('/admin/settings/email', settings);
    return response.data;
  },

  // Test email configuration
  testEmail: async (testEmail: string) => {
    const response = await api.post('/admin/settings/email/test', { testEmail });
    return response.data;
  },
};

// ================== COMBINED ADMIN API ==================

export const adminAPI = {
  products: adminProductAPI,
  orders: adminOrderAPI,
  users: adminUserAPI,
  stats: adminStatsAPI,
  settings: adminSettingsAPI,
};

export default adminAPI;
