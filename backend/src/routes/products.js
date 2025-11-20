import express from "express";
import { db } from "../config/firebase.js";
import { authenticateUser, optionalAuth } from "../middleware/auth.js";

const router = express.Router();

// Get all products
router.get("/", optionalAuth, async (req, res) => {
  try {
    const { category, minPrice, maxPrice, limit = 20, page = 1 } = req.query;

    let query = db.collection("products").where("status", "==", "active");

    if (category) {
      query = query.where("category", "==", category);
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
    console.error("Get products error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Get single product
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const productDoc = await db.collection("products").doc(id).get();

    if (!productDoc.exists) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json({ id: productDoc.id, ...productDoc.data() });
  } catch (error) {
    console.error("Get product error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Create product (admin only - add admin middleware later)
router.post("/", authenticateUser, async (req, res) => {
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
      category: category || "general",
      price: parseFloat(price),
      imageUrl,
      thumbnailUrl: thumbnailUrl || imageUrl,
      difficulty: difficulty || "medium",
      dimensions: dimensions || "40x50cm",
      colors: colors || 24,
      status: "active",
      createdBy: req.user.uid,
      createdAt: new Date().toISOString(),
      sales: 0,
      rating: 0,
      reviews: [],
    };

    await productRef.set(productData);

    res.status(201).json({
      message: "Product created successfully",
      product: productData,
    });
  } catch (error) {
    console.error("Create product error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Update product
router.put("/:id", authenticateUser, async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    delete updateData.id;
    delete updateData.createdAt;
    delete updateData.createdBy;

    updateData.updatedAt = new Date().toISOString();

    await db.collection("products").doc(id).update(updateData);

    res.json({
      message: "Product updated successfully",
      id,
    });
  } catch (error) {
    console.error("Update product error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Delete product
router.delete("/:id", authenticateUser, async (req, res) => {
  try {
    const { id } = req.params;

    await db.collection("products").doc(id).update({
      status: "deleted",
      deletedAt: new Date().toISOString(),
    });

    res.json({
      message: "Product deleted successfully",
      id,
    });
  } catch (error) {
    console.error("Delete product error:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
