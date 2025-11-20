import express from "express";
import { auth, db } from "../config/firebase.js";

const router = express.Router();

// Register
router.post("/register", async (req, res) => {
  try {
    const { email, password, displayName } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Create user in Firebase Auth
    const userRecord = await auth.createUser({
      email,
      password,
      displayName,
    });

    // Create user profile in Firestore
    await db
      .collection("users")
      .doc(userRecord.uid)
      .set({
        uid: userRecord.uid,
        email,
        displayName: displayName || "",
        createdAt: new Date().toISOString(),
        orders: [],
        favorites: [],
      });

    res.status(201).json({
      message: "User created successfully",
      user: {
        uid: userRecord.uid,
        email: userRecord.email,
        displayName: userRecord.displayName,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(400).json({ error: error.message });
  }
});

// Get user profile
router.get("/profile/:uid", async (req, res) => {
  try {
    const { uid } = req.params;

    const userDoc = await db.collection("users").doc(uid).get();

    if (!userDoc.exists) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(userDoc.data());
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
