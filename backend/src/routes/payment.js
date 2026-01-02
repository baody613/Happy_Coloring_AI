import express from "express";
import { authenticateUser } from "../middleware/auth.js";
import { db } from "../config/firebase.js";
import {
  createVNPayPayment,
  createMoMoPayment,
  verifyVNPayCallback,
  verifyMoMoCallback,
  getTransactionByOrderId,
} from "../services/paymentService.js";
import { getOrderById, updateOrderStatus } from "../services/orderService.js";
import { sendSuccess, sendError } from "../utils/helpers.js";

const router = express.Router();

/**
 * POST /api/payment/create
 * Create payment URL for VNPay or MoMo
 */
router.post("/create", authenticateUser, async (req, res) => {
  try {
    const { orderId, paymentMethod, ipAddr } = req.body;
    const userId = req.user.uid;

    // Validate input
    if (!orderId || !paymentMethod) {
      return sendError(res, "Order ID and payment method are required", 400);
    }

    if (!["vnpay", "momo", "cod"].includes(paymentMethod)) {
      return sendError(res, "Invalid payment method", 400);
    }

    // Get order details
    const order = await getOrderById(orderId);

    if (!order) {
      return sendError(res, "Order not found", 404);
    }

    // Verify order belongs to user
    if (order.userId !== userId) {
      return sendError(res, "Unauthorized", 403);
    }

    // Check if order is already paid
    if (order.paymentStatus === "paid") {
      return sendError(res, "Order already paid", 400);
    }

    // Handle COD - no payment URL needed
    if (paymentMethod === "cod") {
      return sendSuccess(res, {
        paymentMethod: "cod",
        message: "Order placed with COD payment",
      });
    }

    // Prepare order data
    const orderData = {
      orderId: order.id,
      amount: order.total,
      orderInfo: `Thanh toan don hang ${order.orderNumber || orderId}`,
      ipAddr: ipAddr || req.ip || "127.0.0.1",
    };

    let result;

    // Create payment based on method
    if (paymentMethod === "vnpay") {
      result = await createVNPayPayment(orderData);
    } else if (paymentMethod === "momo") {
      result = await createMoMoPayment(orderData);
    }

    sendSuccess(res, {
      paymentUrl: result.paymentUrl,
      txnRef: result.txnRef || result.requestId,
      paymentMethod,
    });
  } catch (error) {
    console.error("Create payment error:", error);
    sendError(res, error.message || "Failed to create payment");
  }
});

/**
 * GET /api/payment/vnpay/callback
 * VNPay return URL callback
 */
router.get("/vnpay/callback", async (req, res) => {
  try {
    const vnp_Params = req.query;

    // Verify callback
    const result = await verifyVNPayCallback(vnp_Params);

    if (result.success) {
      // Update order status
      await updateOrderStatus(result.orderId, "confirmed");

      // Update payment status in order
      const orderRef = db.collection("orders").doc(result.orderId);
      await orderRef.update({
        paymentStatus: "paid",
        paymentMethod: "vnpay",
        transactionId: result.txnRef,
        paidAt: new Date(),
      });
    }

    // Redirect to frontend with result
    const redirectUrl = `${process.env.FRONTEND_URL}/order-success?orderId=${
      result.orderId
    }&status=${
      result.success ? "success" : "failed"
    }&message=${encodeURIComponent(result.message)}`;

    res.redirect(redirectUrl);
  } catch (error) {
    console.error("VNPay callback error:", error);
    const redirectUrl = `${
      process.env.FRONTEND_URL
    }/order-success?status=error&message=${encodeURIComponent(
      "Payment verification failed"
    )}`;
    res.redirect(redirectUrl);
  }
});

/**
 * GET /api/payment/momo/callback
 * MoMo return URL callback
 */
router.get("/momo/callback", async (req, res) => {
  try {
    const callbackData = req.query;

    // Verify callback
    const result = await verifyMoMoCallback(callbackData);

    if (result.success) {
      // Update order status
      await updateOrderStatus(result.orderId, "confirmed");

      // Update payment status in order
      const orderRef = db.collection("orders").doc(result.orderId);
      await orderRef.update({
        paymentStatus: "paid",
        paymentMethod: "momo",
        transactionId: result.transId,
        paidAt: new Date(),
      });
    }

    // Redirect to frontend with result
    const redirectUrl = `${process.env.FRONTEND_URL}/order-success?orderId=${
      result.orderId
    }&status=${
      result.success ? "success" : "failed"
    }&message=${encodeURIComponent(result.message)}`;

    res.redirect(redirectUrl);
  } catch (error) {
    console.error("MoMo callback error:", error);
    const redirectUrl = `${
      process.env.FRONTEND_URL
    }/order-success?status=error&message=${encodeURIComponent(
      "Payment verification failed"
    )}`;
    res.redirect(redirectUrl);
  }
});

/**
 * POST /api/payment/momo/ipn
 * MoMo IPN (Instant Payment Notification) webhook
 */
router.post("/momo/ipn", async (req, res) => {
  try {
    const ipnData = req.body;

    console.log("MoMo IPN received:", ipnData);

    // Verify IPN
    const result = await verifyMoMoCallback(ipnData);

    if (result.success) {
      // Update order status
      await updateOrderStatus(result.orderId, "confirmed");

      // Update payment status
      const orderRef = db.collection("orders").doc(result.orderId);
      await orderRef.update({
        paymentStatus: "paid",
        paymentMethod: "momo",
        transactionId: result.transId,
        paidAt: new Date(),
      });

      // Send success response to MoMo
      res.status(200).json({
        partnerCode: ipnData.partnerCode,
        orderId: ipnData.orderId,
        requestId: ipnData.requestId,
        resultCode: 0,
        message: "Success",
      });
    } else {
      res.status(200).json({
        partnerCode: ipnData.partnerCode,
        orderId: ipnData.orderId,
        requestId: ipnData.requestId,
        resultCode: 1,
        message: result.message,
      });
    }
  } catch (error) {
    console.error("MoMo IPN error:", error);
    res.status(500).json({
      resultCode: 1,
      message: "Internal server error",
    });
  }
});

/**
 * GET /api/payment/transaction/:orderId
 * Get transaction details by order ID
 */
router.get("/transaction/:orderId", authenticateUser, async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user.uid;

    // Get order to verify ownership
    const order = await getOrderById(orderId);

    if (!order) {
      return sendError(res, "Order not found", 404);
    }

    // Verify order belongs to user (or user is admin)
    if (order.userId !== userId && req.user.role !== "admin") {
      return sendError(res, "Unauthorized", 403);
    }

    // Get transaction
    const transaction = await getTransactionByOrderId(orderId);

    if (!transaction) {
      return sendError(res, "Transaction not found", 404);
    }

    sendSuccess(res, transaction);
  } catch (error) {
    console.error("Get transaction error:", error);
    sendError(res, error.message);
  }
});

/**
 * GET /api/payment/verify/:orderId
 * Verify payment status of an order
 */
router.get("/verify/:orderId", authenticateUser, async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user.uid;

    // Get order
    const order = await getOrderById(orderId);

    if (!order) {
      return sendError(res, "Order not found", 404);
    }

    // Verify ownership
    if (order.userId !== userId && req.user.role !== "admin") {
      return sendError(res, "Unauthorized", 403);
    }

    // Get transaction
    const transaction = await getTransactionByOrderId(orderId);

    sendSuccess(res, {
      orderId: order.id,
      orderStatus: order.status,
      paymentStatus: order.paymentStatus || "pending",
      paymentMethod: order.paymentMethod,
      transactionId: order.transactionId,
      paidAt: order.paidAt,
      transaction: transaction || null,
    });
  } catch (error) {
    console.error("Verify payment error:", error);
    sendError(res, error.message);
  }
});

export default router;
