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

// ================== COMBINED ADMIN API ==================

export const adminAPI = {
  products: adminProductAPI,
  orders: adminOrderAPI,
  users: adminUserAPI,
  stats: adminStatsAPI,
};

export default adminAPI;
