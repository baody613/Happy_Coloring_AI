import express from "express";
import { authenticateUser } from "../../middleware/auth.js";
import { requireAdmin } from "../../middleware/adminAuth.js";
import {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductStats,
} from "../../services/index.js";
import { sendSuccess, sendError } from "../../utils/helpers.js";
import {
  validate,
  createProductSchema,
  updateProductSchema,
} from "../../validators/index.js";

const router = express.Router();

// All routes require authentication and admin role
router.use(authenticateUser);
router.use(requireAdmin);

// Get all products (including inactive)
router.get("/", async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      difficulty,
      status,
      sortBy,
      sortOrder,
    } = req.query;

    const filters = {};
    if (category) filters.category = category;
    if (difficulty) filters.difficulty = difficulty;
    if (status) filters.status = status;
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

// Get product statistics
router.get("/stats", async (req, res) => {
  try {
    const stats = await getProductStats();
    sendSuccess(res, stats);
  } catch (error) {
    console.error("Get product stats error:", error);
    sendError(res, error.message);
  }
});

// Create product
router.post("/", validate(createProductSchema), async (req, res) => {
  try {
    const product = await createProduct(req.body);

    sendSuccess(res, product, "Product created successfully", 201);
  } catch (error) {
    console.error("Create product error:", error);
    sendError(res, error.message);
  }
});

// Update product
router.put("/:productId", validate(updateProductSchema), async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await updateProduct(productId, req.body);

    if (!product) {
      return sendError(res, "Product not found", 404);
    }

    sendSuccess(res, product, "Product updated successfully");
  } catch (error) {
    console.error("Update product error:", error);
    sendError(res, error.message);
  }
});

// Delete product
router.delete("/:productId", async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await deleteProduct(productId);

    if (!product) {
      return sendError(res, "Product not found", 404);
    }

    sendSuccess(res, { productId }, "Product deleted successfully");
  } catch (error) {
    console.error("Delete product error:", error);
    sendError(res, error.message);
  }
});

export default router;
