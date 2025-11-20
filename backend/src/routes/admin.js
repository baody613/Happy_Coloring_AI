import express from "express";
import admin from "firebase-admin";
import { db } from "../config/firebase.js";
import { requireAdmin } from "../middleware/auth.js";

const router = express.Router();

// ================== PRODUCT MANAGEMENT ==================

// Get all products (including inactive)
router.get("/products", requireAdmin, async (req, res) => {
  try {
    const { status, limit = 50, page = 1 } = req.query;

    let query = db.collection("products");

    if (status) {
      query = query.where("status", "==", status);
    }

    const snapshot = await query
      .orderBy("createdAt", "desc")
      .limit(parseInt(limit))
      .get();

    const products = [];
    snapshot.forEach((doc) => {
      products.push({ id: doc.id, ...doc.data() });
    });

    res.json({
      products,
      total: products.length,
      page: parseInt(page),
    });
  } catch (error) {
    console.error("Admin get products error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Create product
router.post("/products", requireAdmin, async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      price,
      imageUrl,
      thumbnailUrl,
      difficulty,
      dimensions,
      colors,
    } = req.body;

    if (!title || !price || !imageUrl) {
      return res
        .status(400)
        .json({ error: "Title, price, and imageUrl are required" });
    }

    const productRef = db.collection("products").doc();

    const productData = {
      id: productRef.id,
      title,
      description: description || "",
      category: category || "paint-by-numbers",
      price: parseFloat(price),
      imageUrl,
      thumbnailUrl: thumbnailUrl || imageUrl,
      difficulty: difficulty || "medium",
      dimensions: dimensions || { width: 40, height: 50, unit: "cm" },
      colors: colors || 24,
      status: "active",
      sales: 0,
      reviews: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await productRef.set(productData);

    res.status(201).json({
      message: "Product created successfully",
      product: productData,
    });
  } catch (error) {
    console.error("Admin create product error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Update product
router.put("/products/:id", requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    delete updateData.id;
    delete updateData.createdAt;
    updateData.updatedAt = new Date().toISOString();

    if (updateData.price) {
      updateData.price = parseFloat(updateData.price);
    }

    await db.collection("products").doc(id).update(updateData);

    res.json({
      message: "Product updated successfully",
      productId: id,
    });
  } catch (error) {
    console.error("Admin update product error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Delete product
router.delete("/products/:id", requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    await db.collection("products").doc(id).delete();

    res.json({
      message: "Product deleted successfully",
      productId: id,
    });
  } catch (error) {
    console.error("Admin delete product error:", error);
    res.status(500).json({ error: error.message });
  }
});

// ================== ORDER MANAGEMENT ==================

// Get all orders
router.get("/orders", requireAdmin, async (req, res) => {
  try {
    const { status, limit = 50, page = 1 } = req.query;

    let query = db.collection("orders");

    if (status) {
      query = query.where("status", "==", status);
    }

    const snapshot = await query
      .orderBy("createdAt", "desc")
      .limit(parseInt(limit))
      .get();

    const orders = [];
    snapshot.forEach((doc) => {
      orders.push({ id: doc.id, ...doc.data() });
    });

    res.json({
      orders,
      total: orders.length,
      page: parseInt(page),
    });
  } catch (error) {
    console.error("Admin get orders error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Update order status
router.put("/orders/:id", requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: "Status is required" });
    }

    const validStatuses = [
      "pending",
      "processing",
      "shipping",
      "delivered",
      "cancelled",
    ];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    await db.collection("orders").doc(id).update({
      status,
      updatedAt: new Date().toISOString(),
    });

    res.json({
      message: "Order status updated successfully",
      orderId: id,
      status,
    });
  } catch (error) {
    console.error("Admin update order error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Delete order
router.delete("/orders/:id", requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    await db.collection("orders").doc(id).delete();

    res.json({
      message: "Order deleted successfully",
      orderId: id,
    });
  } catch (error) {
    console.error("Admin delete order error:", error);
    res.status(500).json({ error: error.message });
  }
});

// ================== USER MANAGEMENT ==================

// Get all users
router.get("/users", requireAdmin, async (req, res) => {
  try {
    const { limit = 50, page = 1 } = req.query;

    const snapshot = await db
      .collection("users")
      .orderBy("createdAt", "desc")
      .limit(parseInt(limit))
      .get();

    const users = [];
    snapshot.forEach((doc) => {
      const userData = doc.data();
      delete userData.password; // Don't send password hashes
      users.push({ id: doc.id, ...userData });
    });

    res.json({
      users,
      total: users.length,
      page: parseInt(page),
    });
  } catch (error) {
    console.error("Admin get users error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Update user (e.g., disable/enable account)
router.put("/users/:id", requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { disabled, displayName, role } = req.body;

    const updateData = {
      updatedAt: new Date().toISOString(),
    };

    if (typeof disabled !== "undefined") {
      // Update Firebase Auth
      await admin.auth().updateUser(id, { disabled });
      updateData.disabled = disabled;
    }

    if (displayName) {
      updateData.displayName = displayName;
    }

    if (role) {
      updateData.role = role;
    }

    await db.collection("users").doc(id).update(updateData);

    res.json({
      message: "User updated successfully",
      userId: id,
    });
  } catch (error) {
    console.error("Admin update user error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Delete user
router.delete("/users/:id", requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    // Delete from Firebase Auth
    await admin.auth().deleteUser(id);

    // Delete from Firestore
    await db.collection("users").doc(id).delete();

    res.json({
      message: "User deleted successfully",
      userId: id,
    });
  } catch (error) {
    console.error("Admin delete user error:", error);
    res.status(500).json({ error: error.message });
  }
});

// ================== STATISTICS ==================

// Get dashboard statistics
router.get("/stats", requireAdmin, async (req, res) => {
  try {
    // Get counts
    const [productsSnapshot, ordersSnapshot, usersSnapshot] = await Promise.all(
      [
        db.collection("products").get(),
        db.collection("orders").get(),
        db.collection("users").get(),
      ]
    );

    const products = [];
    productsSnapshot.forEach((doc) => products.push(doc.data()));

    const orders = [];
    let totalRevenue = 0;
    ordersSnapshot.forEach((doc) => {
      const order = doc.data();
      orders.push(order);
      if (order.status !== "cancelled") {
        totalRevenue += order.totalAmount || 0;
      }
    });

    const stats = {
      totalProducts: products.length,
      activeProducts: products.filter((p) => p.status === "active").length,
      totalOrders: orders.length,
      pendingOrders: orders.filter((o) => o.status === "pending").length,
      processingOrders: orders.filter((o) => o.status === "processing").length,
      shippingOrders: orders.filter((o) => o.status === "shipping").length,
      deliveredOrders: orders.filter((o) => o.status === "delivered").length,
      cancelledOrders: orders.filter((o) => o.status === "cancelled").length,
      totalUsers: usersSnapshot.size,
      totalRevenue,
    };

    res.json(stats);
  } catch (error) {
    console.error("Admin get stats error:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
