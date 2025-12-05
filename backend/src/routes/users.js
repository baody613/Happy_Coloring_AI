import express from "express";
import { authenticateUser } from "../middleware/auth.js";
import { getUserById, updateUser } from "../services/index.js";
import { sendSuccess, sendError } from "../utils/helpers.js";

const router = express.Router();

// Get user profile
router.get("/:userId", authenticateUser, async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await getUserById(userId);

    if (!user) {
      return sendError(res, "User not found", 404);
    }

    sendSuccess(res, user);
  } catch (error) {
    console.error("Get user error:", error);
    sendError(res, error.message);
  }
});

// Update user profile
router.put("/:userId", authenticateUser, async (req, res) => {
  try {
    const { userId } = req.params;

    if (userId !== req.user.uid) {
      return sendError(res, "Unauthorized", 403);
    }

    const { displayName, phoneNumber, address } = req.body;

    const updateData = {};
    if (displayName) updateData.displayName = displayName;
    if (phoneNumber) updateData.phoneNumber = phoneNumber;
    if (address) updateData.address = address;

    const updatedUser = await updateUser(userId, updateData);

    sendSuccess(res, updatedUser, "Profile updated successfully");
  } catch (error) {
    console.error("Update user error:", error);
    sendError(res, error.message);
  }
});

// Note: Favorites functionality removed - moved to separate favorites collection
// Add to favorites
// router.post("/:userId/favorites/:productId", authenticateUser, async (req, res) => {
//   // Implement using dedicated favorites service
// });

// Remove from favorites
// router.delete("/:userId/favorites/:productId", authenticateUser, async (req, res) => {
//   // Implement using dedicated favorites service
// });

export default router;
