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
  const hasFilter =
    filters.status ||
    filters.userId ||
    filters.paymentMethod ||
    filters.startDate ||
    filters.endDate ||
    filters.search ||
    filters.isAIProduct;

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
  if (filters.startDate) {
    query = query.where("createdAt", ">=", filters.startDate);
  }
  if (filters.endDate) {
    query = query.where("createdAt", "<=", filters.endDate);
  }

  // Only use Firestore orderBy when there are no equality/range filters
  // to avoid requiring composite indexes. When filters are active we
  // fetch all matching docs and sort in JS instead.
  if (!hasFilter) {
    query = query.orderBy("createdAt", "desc");
  }

  // Get total count and all docs (needed for JS-side sorting + pagination)
  const totalSnapshot = await query.get();

  let allDocs = totalSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  // Apply search filtering in JS
  if (filters.search) {
    const q = filters.search.toLowerCase();
    allDocs = allDocs.filter(
      (o) =>
        o.id.toLowerCase().includes(q) ||
        (o.orderNumber || "").toLowerCase().includes(q) ||
        (o.shippingAddress?.fullName || "").toLowerCase().includes(q) ||
        (o.shippingAddress?.phone || "").includes(q),
    );
  }

  // Apply AI product filtering in JS
  if (filters.isAIProduct) {
    allDocs = allDocs.filter((order) => {
      if (!Array.isArray(order.items)) return false;
      return order.items.some(
        (item) =>
          Boolean(item?.isAIProduct) ||
          item?.category === "ai-products" ||
          item?.category === "Sản Phẩm AI",
      );
    });
  }

  const total = allDocs.length;

  // Sort by createdAt descending in JS when filters are active
  if (hasFilter) {
    allDocs.sort((a, b) => {
      const toMs = (v) => {
        if (!v) return 0;
        if (typeof v.toDate === "function") return v.toDate().getTime();
        return new Date(v).getTime();
      };
      return toMs(b.createdAt) - toMs(a.createdAt);
    });
  }

  // Apply pagination in JS
  const skip = (page - 1) * limit;
  const orders = allDocs.slice(skip, skip + limit);

  return {
    orders,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
    },
  };
};

// Get orders by user ID
export const getOrdersByUserId = async (userId, page = 1, limit = 10) => {
  return getAllOrders(page, limit, { userId });
};

// Server-side voucher table — single source of truth
const VALID_VOUCHERS = {
  YULING10: 10,
  YULING20: 20,
  YULING30: 30,
  GIAMGIA15: 15,
  KHAITRUONG: 25,
};

const validateVoucher = (code) => {
  if (!code) return 0;
  return VALID_VOUCHERS[String(code).toUpperCase()] || 0;
};

// Create new order
export const createOrder = async (userId, orderData) => {
  const orderNumber = generateOrderNumber();

  // Validate voucher server-side — never trust client-sent discount
  const serverDiscount = validateVoucher(orderData.voucherCode);

  const newOrder = {
    orderNumber,
    userId,
    items: orderData.items,
    shippingAddress: orderData.shippingAddress,
    totalAmount: orderData.totalAmount,
    paymentMethod: orderData.paymentMethod,
    voucherCode:
      serverDiscount > 0 ? String(orderData.voucherCode).toUpperCase() : null,
    voucherDiscount: serverDiscount,
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

  const PAID_PAYMENT_STATUSES = new Set([
    "paid",
    "success",
    "completed",
    "done",
  ]);
  const PAID_ORDER_STATUSES = new Set([
    "processing",
    "shipping",
    "delivered",
    "confirmed",
    "completed",
  ]);

  const getOrderAmount = (order) => {
    const amount = order.totalAmount ?? order.total ?? 0;
    return Number(amount) || 0;
  };

  const isPaidOrder = (order) => {
    const paymentStatus = String(order.paymentStatus || "").toLowerCase();
    const status = String(order.status || "").toLowerCase();
    return (
      PAID_PAYMENT_STATUSES.has(paymentStatus) ||
      PAID_ORDER_STATUSES.has(status)
    );
  };

  const total = orders.length;
  const totalRevenue = orders
    .filter((o) => o.status !== "cancelled")
    .reduce((sum, o) => sum + getOrderAmount(o), 0);

  // Single pass to compute both paidOrders count and paidRevenue
  const { paidOrders, paidRevenue } = orders.reduce(
    (acc, o) => {
      if (isPaidOrder(o)) {
        acc.paidOrders += 1;
        acc.paidRevenue += getOrderAmount(o);
      }
      return acc;
    },
    { paidOrders: 0, paidRevenue: 0 },
  );

  return {
    total,
    pending: orders.filter((o) => o.status === "pending").length,
    processing: orders.filter((o) => o.status === "processing").length,
    shipping: orders.filter((o) => o.status === "shipping").length,
    delivered: orders.filter((o) => o.status === "delivered").length,
    cancelled: orders.filter((o) => o.status === "cancelled").length,
    totalRevenue,
    paidOrders,
    paidRevenue,
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
