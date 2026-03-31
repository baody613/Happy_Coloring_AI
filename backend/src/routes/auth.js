import express from "express";
import { auth, db } from "../config/firebase.js";
import { authenticateUser } from "../middleware/auth.js";

const router = express.Router();

// Register — supports two modes:
// 1. Standalone: creates Firebase Auth user then Firestore doc
// 2. Post-Firebase-SDK: Bearer token present → user already exists in Auth, just create Firestore doc
router.post("/register", async (req, res) => {
  try {
    const { email, password, displayName } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    // Check if request comes with a Bearer token (user already created via Firebase SDK)
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split("Bearer ")[1];
      try {
        const decoded = await auth.verifyIdToken(token);
        // User already exists in Firebase Auth — just ensure Firestore doc exists
        const existingDoc = await db.collection("users").doc(decoded.uid).get();
        if (!existingDoc.exists) {
          await db
            .collection("users")
            .doc(decoded.uid)
            .set({
              uid: decoded.uid,
              email: decoded.email || email,
              displayName: displayName || decoded.name || "",
              role: "user",
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            });
        }
        return res.status(201).json({
          message: "User profile created successfully",
          user: {
            uid: decoded.uid,
            email: decoded.email || email,
            displayName,
          },
        });
      } catch {
        // Token invalid — fall through to create new user
      }
    }

    if (!password) {
      return res.status(400).json({ error: "Password is required" });
    }

    // Create user in Firebase Auth (standalone flow)
    const userRecord = await auth.createUser({ email, password, displayName });

    // Create user profile in Firestore
    await db
      .collection("users")
      .doc(userRecord.uid)
      .set({
        uid: userRecord.uid,
        email,
        displayName: displayName || "",
        role: "user",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
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

// Login is handled entirely client-side via Firebase Auth SDK.
// This endpoint is intentionally removed to prevent unauthenticated token issuance.

// Get user profile — requires authentication and ownership
router.get("/profile/:uid", authenticateUser, async (req, res) => {
  try {
    const { uid } = req.params;

    if (uid !== req.user.uid && !req.user.isAdmin) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const userDoc = await db.collection("users").doc(uid).get();

    if (!userDoc.exists) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(userDoc.data());
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
