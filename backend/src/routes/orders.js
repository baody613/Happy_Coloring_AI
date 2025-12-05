import express from "express";
import { authenticateUser } from "../middleware/auth.js";
import {
  createOrder,
  getOrderById,
  getOrdersByUserId,
  updateOrderStatus,
  cancelOrder,
} from "../services/index.js";
import { sendSuccess, sendError } from "../utils/helpers.js";
import {
  validate,
  createOrderSchema,
  updateOrderStatusSchema,
} from "../validators/index.js";

const router = express.Router();

// Create order
router.post(
  "/",
  authenticateUser,
  validate(createOrderSchema),
  async (req, res) => {
    try {
      const userId = req.user.uid;

      const order = await createOrder(userId, req.body);

      sendSuccess(res, order, "Order created successfully", 201);
    } catch (error) {
      console.error("Create order error:", error);
      sendError(res, error.message);
    }
  }
);

// Get user's orders
router.get("/user/:userId", authenticateUser, async (req, res) => {
  try {
    const { userId } = req.params;

    // Check if user is requesting their own orders
    if (userId !== req.user.uid) {
      return sendError(res, "Unauthorized", 403);
    }

    const { page = 1, limit = 10 } = req.query;

    const result = await getOrdersByUserId(
      userId,
      parseInt(page),
      parseInt(limit)
    );

    sendSuccess(res, result);
  } catch (error) {
    console.error("Get orders error:", error);
    sendError(res, error.message);
  }
});

// Get single order
router.get("/:orderId", authenticateUser, async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await getOrderById(orderId);

    if (!order) {
      return sendError(res, "Order not found", 404);
    }

    // Check if user is requesting their own order
    if (order.userId !== req.user.uid && req.user.role !== "admin") {
      return sendError(res, "Unauthorized", 403);
    }

    sendSuccess(res, order);
  } catch (error) {
    console.error("Get order error:", error);
    sendError(res, error.message);
  }
});

// Update order status (admin only)
router.put(
  "/:orderId/status",
  authenticateUser,
  validate(updateOrderStatusSchema),
  async (req, res) => {
    try {
      // TODO: Add admin check middleware
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

// Cancel order
router.post("/:orderId/cancel", authenticateUser, async (req, res) => {
  try {
    const { orderId } = req.params;
    const { reason } = req.body;

    const order = await getOrderById(orderId);

    if (!order) {
      return sendError(res, "Order not found", 404);
    }

    // Check if user is cancelling their own order
    if (order.userId !== req.user.uid && req.user.role !== "admin") {
      return sendError(res, "Unauthorized", 403);
    }

    // Check if order can be cancelled
    if (order.status === "delivered" || order.status === "cancelled") {
      return sendError(res, "Order cannot be cancelled", 400);
    }

    const cancelledOrder = await cancelOrder(orderId, reason);

    sendSuccess(res, cancelledOrder, "Order cancelled successfully");
  } catch (error) {
    console.error("Cancel order error:", error);
    sendError(res, error.message);
  }
});

export default router;
