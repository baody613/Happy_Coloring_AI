import express from "express";
import { db } from "../config/firebase.js";
import { authenticateUser } from "../middleware/auth.js";

const router = express.Router();

// Create order
router.post("/", authenticateUser, async (req, res) => {
  try {
    const { items, shippingAddress, totalAmount, paymentMethod } = req.body;
    const userId = req.user.uid;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: "Order items are required" });
    }

    if (!shippingAddress) {
      return res.status(400).json({ error: "Shipping address is required" });
    }

    const orderRef = db.collection("orders").doc();

    const orderData = {
      id: orderRef.id,
      userId,
      items,
      shippingAddress,
      totalAmount: parseFloat(totalAmount),
      paymentMethod: paymentMethod || "cod",
      status: "pending",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await orderRef.set(orderData);

    // Update user's orders
    await db
      .collection("users")
      .doc(userId)
      .update({
        orders: admin.firestore.FieldValue.arrayUnion(orderRef.id),
      });

    res.status(201).json({
      message: "Order created successfully",
      order: orderData,
    });
  } catch (error) {
    console.error("Create order error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Get user's orders
router.get("/user/:userId", authenticateUser, async (req, res) => {
  try {
    const { userId } = req.params;

    // Check if user is requesting their own orders
    if (userId !== req.user.uid) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const ordersSnapshot = await db
      .collection("orders")
      .where("userId", "==", userId)
      .orderBy("createdAt", "desc")
      .get();

    const orders = [];
    ordersSnapshot.forEach((doc) => {
      orders.push({ id: doc.id, ...doc.data() });
    });

    res.json({ orders });
  } catch (error) {
    console.error("Get orders error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Get single order
router.get("/:orderId", authenticateUser, async (req, res) => {
  try {
    const { orderId } = req.params;

    const orderDoc = await db.collection("orders").doc(orderId).get();

    if (!orderDoc.exists) {
      return res.status(404).json({ error: "Order not found" });
    }

    const orderData = orderDoc.data();

    // Check if user owns this order
    if (orderData.userId !== req.user.uid) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    res.json({ id: orderDoc.id, ...orderData });
  } catch (error) {
    console.error("Get order error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Update order status
router.put("/:orderId", authenticateUser, async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: "Status is required" });
    }

    const validStatuses = [
      "pending",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
    ];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    await db.collection("orders").doc(orderId).update({
      status,
      updatedAt: new Date().toISOString(),
    });

    res.json({
      message: "Order updated successfully",
      orderId,
      status,
    });
  } catch (error) {
    console.error("Update order error:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
