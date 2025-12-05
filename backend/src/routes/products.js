import express from "express";
import { authenticateUser, optionalAuth } from "../middleware/auth.js";
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories,
} from "../services/index.js";
import { sendSuccess, sendError } from "../utils/helpers.js";
import {
  validate,
  createProductSchema,
  updateProductSchema,
} from "../validators/index.js";

const router = express.Router();

// Get all products (public)
router.get("/", optionalAuth, async (req, res) => {
  try {
    const {
      category,
      difficulty,
      minPrice,
      maxPrice,
      sortBy,
      sortOrder,
      limit = 20,
      page = 1,
    } = req.query;

    const filters = {};
    if (category) filters.category = category;
    if (difficulty) filters.difficulty = difficulty;
    if (minPrice) filters.minPrice = minPrice;
    if (maxPrice) filters.maxPrice = maxPrice;
    if (sortBy) filters.sortBy = sortBy;
    if (sortOrder) filters.sortOrder = sortOrder;

    const result = await getAllProducts(
      parseInt(page),
      parseInt(limit),
      filters
    );

    sendSuccess(res, result);
  } catch (error) {
    console.error("Get products error:", error);
    sendError(res, error.message);
  }
});

// Get all categories (public)
router.get("/categories", async (req, res) => {
  try {
    const categories = await getCategories();
    sendSuccess(res, categories);
  } catch (error) {
    console.error("Get categories error:", error);
    sendError(res, error.message);
  }
});

// Get single product (public)
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const product = await getProductById(id);

    if (!product) {
      return sendError(res, "Product not found", 404);
    }

    sendSuccess(res, product);
  } catch (error) {
    console.error("Get product error:", error);
    sendError(res, error.message);
  }
});

// Create product (admin only)
router.post(
  "/",
  authenticateUser,
  validate(createProductSchema),
  async (req, res) => {
    try {
      // TODO: Add admin check middleware
      // if (req.user.role !== 'admin') {
      //   return sendError(res, 'Unauthorized', 403);
      // }

      const product = await createProduct(req.body);

      sendSuccess(res, product, "Product created successfully", 201);
    } catch (error) {
      console.error("Create product error:", error);
      sendError(res, error.message);
    }
  }
);

// Update product (admin only)
router.put(
  "/:id",
  authenticateUser,
  validate(updateProductSchema),
  async (req, res) => {
    try {
      // TODO: Add admin check middleware
      const { id } = req.params;

      const product = await updateProduct(id, req.body);

      if (!product) {
        return sendError(res, "Product not found", 404);
      }

      sendSuccess(res, product, "Product updated successfully");
    } catch (error) {
      console.error("Update product error:", error);
      sendError(res, error.message);
    }
  }
);

// Delete product (admin only)
router.delete("/:id", authenticateUser, async (req, res) => {
  try {
    // TODO: Add admin check middleware
    const { id } = req.params;

    const product = await deleteProduct(id);

    if (!product) {
      return sendError(res, "Product not found", 404);
    }

    sendSuccess(res, { id }, "Product deleted successfully");
  } catch (error) {
    console.error("Delete product error:", error);
    sendError(res, error.message);
  }
});

export default router;
