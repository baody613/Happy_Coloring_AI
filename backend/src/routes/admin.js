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
import settingsRouter from "./admin/settings/settings.js";

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
router.use("/settings", settingsRouter);

export default router;
