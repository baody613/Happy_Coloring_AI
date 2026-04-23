import express from "express";
import { requireAdmin } from "../middleware/auth.js";
import {
  getProductStats,
  getOrderStats,
  getUserStats,
} from "../services/index.js";
import { sendSuccess, sendError } from "../utils/helpers.js";
import usersRouter from "./admin/users.js";
import productsRouter from "./admin/products.js";
import ordersRouter from "./admin/orders.js";
const router = express.Router();

// Get overall admin statistics
router.get("/stats", requireAdmin, async (req, res) => {
  try {
    const [productStats, orderStats, userStats] = await Promise.all([
      getProductStats(),
      getOrderStats(),
      getUserStats(),
    ]);

    const stats = {
      totalOrders: orderStats.paidOrders ?? orderStats.total ?? 0,
      totalProducts:
        (productStats.active || 0) +
        (productStats.inactive || 0) +
        (productStats.total && !productStats.active && !productStats.inactive
          ? productStats.total
          : 0),
      totalUsers: userStats.total || 0,
      totalRevenue: orderStats.paidRevenue ?? orderStats.totalRevenue ?? 0,
      pendingOrders: orderStats.pending || 0,
      processingOrders: orderStats.processing || 0,
      shippingOrders: orderStats.shipping || 0,
      deliveredOrders: orderStats.delivered || 0,
      products: productStats,
      orders: orderStats,
      users: userStats,
      timestamp: new Date().toISOString(),
    };

    sendSuccess(res, stats);
  } catch (error) {
    console.error("Get admin stats error:", error);
    sendError(res, error.message);
  }
});

// Mount admin sub-routes
router.use("/users", usersRouter);
router.use("/products", productsRouter);
router.use("/orders", ordersRouter);

export default router;
