import express from "express";
import { db } from "../config/firebase.js";
import { authenticateUser } from "../middleware/auth.js";

const router = express.Router();

// Get user profile
router.get("/:userId", authenticateUser, async (req, res) => {
  try {
    const { userId } = req.params;

    const userDoc = await db.collection("users").doc(userId).get();

    if (!userDoc.exists) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ id: userDoc.id, ...userDoc.data() });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Update user profile
router.put("/:userId", authenticateUser, async (req, res) => {
  try {
    const { userId } = req.params;

    if (userId !== req.user.uid) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const { displayName, phoneNumber, address } = req.body;

    const updateData = {
      updatedAt: new Date().toISOString(),
    };

    if (displayName) updateData.displayName = displayName;
    if (phoneNumber) updateData.phoneNumber = phoneNumber;
    if (address) updateData.address = address;

    await db.collection("users").doc(userId).update(updateData);

    res.json({
      message: "Profile updated successfully",
      userId,
    });
  } catch (error) {
    console.error("Update user error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Add to favorites
router.post(
  "/:userId/favorites/:productId",
  authenticateUser,
  async (req, res) => {
    try {
      const { userId, productId } = req.params;

      if (userId !== req.user.uid) {
        return res.status(403).json({ error: "Unauthorized" });
      }

      await db
        .collection("users")
        .doc(userId)
        .update({
          favorites: admin.firestore.FieldValue.arrayUnion(productId),
        });

      res.json({
        message: "Added to favorites",
        productId,
      });
    } catch (error) {
      console.error("Add favorite error:", error);
      res.status(500).json({ error: error.message });
    }
  }
);

// Remove from favorites
router.delete(
  "/:userId/favorites/:productId",
  authenticateUser,
  async (req, res) => {
    try {
      const { userId, productId } = req.params;

      if (userId !== req.user.uid) {
        return res.status(403).json({ error: "Unauthorized" });
      }

      await db
        .collection("users")
        .doc(userId)
        .update({
          favorites: admin.firestore.FieldValue.arrayRemove(productId),
        });

      res.json({
        message: "Removed from favorites",
        productId,
      });
    } catch (error) {
      console.error("Remove favorite error:", error);
      res.status(500).json({ error: error.message });
    }
  }
);

export default router;
