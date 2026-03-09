import express from "express";
import { requireAdmin } from "../../middleware/auth.js";
import {
  getAllUsers,
  updateUser,
  updateUserRole,
  deleteUser,
  getUserStats,
} from "../../services/index.js";
import { sendSuccess, sendError } from "../../utils/helpers.js";
import admin from "../../config/firebase.js";

const router = express.Router();

// All routes require authentication and admin role
router.use(requireAdmin);

// Get all users
router.get("/", async (req, res) => {
  try {
    const { page = 1, limit = 10, role, search } = req.query;

    const filters = {};
    if (role) filters.role = role;
    if (search) filters.search = search;

    const result = await getAllUsers(parseInt(page), parseInt(limit), filters);

    sendSuccess(res, result);
  } catch (error) {
    console.error("Get users error:", error);
    sendError(res, error.message);
  }
});

// Get user statistics
router.get("/stats", async (req, res) => {
  try {
    const stats = await getUserStats();
    sendSuccess(res, stats);
  } catch (error) {
    console.error("Get user stats error:", error);
    sendError(res, error.message);
  }
});

// Update user (disable/enable, displayName, etc.)
router.put("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const { disabled, displayName, role } = req.body;

    // Update Firebase Auth disabled status
    if (typeof disabled === "boolean") {
      await admin.auth().updateUser(userId, { disabled });
    }

    // Update Firestore fields
    const firestoreUpdates = {};
    if (displayName !== undefined) firestoreUpdates.displayName = displayName;
    if (role !== undefined) firestoreUpdates.role = role;
    if (typeof disabled === "boolean") firestoreUpdates.disabled = disabled;

    if (Object.keys(firestoreUpdates).length > 0) {
      await updateUser(userId, firestoreUpdates);
    }

    sendSuccess(res, { userId, ...req.body }, "User updated successfully");
  } catch (error) {
    console.error("Update user error:", error);
    sendError(res, error.message);
  }
});

// Update user role
router.put("/:userId/role", async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    if (!role || !["user", "admin"].includes(role)) {
      return sendError(res, "Invalid role", 400);
    }

    const user = await updateUserRole(userId, role);

    if (!user) {
      return sendError(res, "User not found", 404);
    }

    sendSuccess(res, user, "User role updated successfully");
  } catch (error) {
    console.error("Update user role error:", error);
    sendError(res, error.message);
  }
});

// Delete user
router.delete("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    // Prevent self-deletion
    if (userId === req.user.uid) {
      return sendError(res, "Cannot delete your own account", 400);
    }

    await deleteUser(userId);

    sendSuccess(res, { userId }, "User deleted successfully");
  } catch (error) {
    console.error("Delete user error:", error);
    sendError(res, error.message);
  }
});

export default router;
