import { db } from "../config/firebase.js";
import { formatDate, generateId } from "../utils/helpers.js";

/**
 * Order Service - handles all order-related database operations
 */

// Generate order number
const generateOrderNumber = () => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `ORD-${timestamp}-${random}`;
};

// Get order by ID
export const getOrderById = async (orderId) => {
  const orderDoc = await db.collection("orders").doc(orderId).get();
  if (!orderDoc.exists) {
    return null;
  }
  return { id: orderDoc.id, ...orderDoc.data() };
};

// Get all orders with pagination and filters
export const getAllOrders = async (page = 1, limit = 10, filters = {}) => {
  let query = db.collection("orders");

  // Apply filters
  if (filters.status) {
    query = query.where("status", "==", filters.status);
  }

  if (filters.userId) {
    query = query.where("userId", "==", filters.userId);
  }

  if (filters.paymentMethod) {
    query = query.where("paymentMethod", "==", filters.paymentMethod);
  }

  // Date range
  if (filters.startDate) {
    query = query.where("createdAt", ">=", filters.startDate);
  }

  if (filters.endDate) {
    query = query.where("createdAt", "<=", filters.endDate);
  }

  // Get total count
  const totalSnapshot = await query.get();
  const total = totalSnapshot.size;

  // Apply sorting
  query = query.orderBy("createdAt", "desc");

  // Apply pagination
  const skip = (page - 1) * limit;
  query = query.offset(skip).limit(limit);

  const snapshot = await query.get();
  const orders = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

  return {
    orders,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

// Get orders by user ID
export const getOrdersByUserId = async (userId, page = 1, limit = 10) => {
  return getAllOrders(page, limit, { userId });
};

// Create new order
export const createOrder = async (userId, orderData) => {
  const orderNumber = generateOrderNumber();

  const newOrder = {
    orderNumber,
    userId,
    items: orderData.items,
    shippingAddress: orderData.shippingAddress,
    totalAmount: orderData.totalAmount,
    paymentMethod: orderData.paymentMethod,
    status: "pending",
    paymentStatus: "pending",
    createdAt: formatDate(),
    updatedAt: formatDate(),
  };

  const docRef = await db.collection("orders").add(newOrder);
  return { id: docRef.id, ...newOrder };
};

// Update order
export const updateOrder = async (orderId, updateData) => {
  const order = await getOrderById(orderId);
  if (!order) {
    return null;
  }

  const updates = {
    ...updateData,
    updatedAt: formatDate(),
  };

  await db.collection("orders").doc(orderId).update(updates);
  return getOrderById(orderId);
};

// Update order status
export const updateOrderStatus = async (orderId, status) => {
  return updateOrder(orderId, { status });
};

// Update payment status
export const updatePaymentStatus = async (orderId, paymentStatus) => {
  return updateOrder(orderId, { paymentStatus });
};

// Cancel order
export const cancelOrder = async (orderId, reason = "") => {
  return updateOrder(orderId, {
    status: "cancelled",
    cancelReason: reason,
    cancelledAt: formatDate(),
  });
};

// Get order stats
export const getOrderStats = async () => {
  const ordersSnapshot = await db.collection("orders").get();
  const orders = ordersSnapshot.docs.map((doc) => doc.data());

  const total = orders.length;
  const totalRevenue = orders
    .filter((o) => o.status !== "cancelled")
    .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  return {
    total,
    pending: orders.filter((o) => o.status === "pending").length,
    processing: orders.filter((o) => o.status === "processing").length,
    shipping: orders.filter((o) => o.status === "shipping").length,
    delivered: orders.filter((o) => o.status === "delivered").length,
    cancelled: orders.filter((o) => o.status === "cancelled").length,
    totalRevenue,
    averageOrderValue: total > 0 ? totalRevenue / total : 0,
  };
};

// Get order stats by date range
export const getOrderStatsByDateRange = async (startDate, endDate) => {
  const snapshot = await db
    .collection("orders")
    .where("createdAt", ">=", startDate)
    .where("createdAt", "<=", endDate)
    .get();

  const orders = snapshot.docs.map((doc) => doc.data());
  const totalRevenue = orders
    .filter((o) => o.status !== "cancelled")
    .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  return {
    total: orders.length,
    totalRevenue,
    averageOrderValue: orders.length > 0 ? totalRevenue / orders.length : 0,
  };
};
