import express from "express";
import { authenticateUser } from "../../middleware/auth.js";
import { requireAdmin } from "../../middleware/adminAuth.js";
import {
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  updatePaymentStatus,
  getOrderStats,
  getOrderStatsByDateRange,
} from "../../services/index.js";
import { sendSuccess, sendError } from "../../utils/helpers.js";
import { validate, updateOrderStatusSchema } from "../../validators/index.js";

const router = express.Router();

// All routes require authentication and admin role
router.use(authenticateUser);
router.use(requireAdmin);

// Get all orders
router.get("/", async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      paymentMethod,
      startDate,
      endDate,
    } = req.query;

    const filters = {};
    if (status) filters.status = status;
    if (paymentMethod) filters.paymentMethod = paymentMethod;
    if (startDate) filters.startDate = startDate;
    if (endDate) filters.endDate = endDate;

    const result = await getAllOrders(parseInt(page), parseInt(limit), filters);

    sendSuccess(res, result);
  } catch (error) {
    console.error("Get orders error:", error);
    sendError(res, error.message);
  }
});

// Get order statistics
router.get("/stats", async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    let stats;
    if (startDate && endDate) {
      stats = await getOrderStatsByDateRange(startDate, endDate);
    } else {
      stats = await getOrderStats();
    }

    sendSuccess(res, stats);
  } catch (error) {
    console.error("Get order stats error:", error);
    sendError(res, error.message);
  }
});

// Get single order
router.get("/:orderId", async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await getOrderById(orderId);

    if (!order) {
      return sendError(res, "Order not found", 404);
    }

    sendSuccess(res, order);
  } catch (error) {
    console.error("Get order error:", error);
    sendError(res, error.message);
  }
});

// Update order status
router.put(
  "/:orderId/status",
  validate(updateOrderStatusSchema),
  async (req, res) => {
    try {
      const { orderId } = req.params;
      const { status } = req.body;

      const order = await updateOrderStatus(orderId, status);

      if (!order) {
        return sendError(res, "Order not found", 404);
      }

      sendSuccess(res, order, "Order status updated successfully");
    } catch (error) {
      console.error("Update order status error:", error);
      sendError(res, error.message);
    }
  }
);

// Update payment status
router.put("/:orderId/payment-status", async (req, res) => {
  try {
    const { orderId } = req.params;
    const { paymentStatus } = req.body;

    if (
      !paymentStatus ||
      !["pending", "paid", "failed"].includes(paymentStatus)
    ) {
      return sendError(res, "Invalid payment status", 400);
    }

    const order = await updatePaymentStatus(orderId, paymentStatus);

    if (!order) {
      return sendError(res, "Order not found", 404);
    }

    sendSuccess(res, order, "Payment status updated successfully");
  } catch (error) {
    console.error("Update payment status error:", error);
    sendError(res, error.message);
  }
});

export default router;
