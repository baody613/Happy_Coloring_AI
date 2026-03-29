import { auth } from "../config/firebase.js";

// Admin emails — loaded from env; fallback for local dev only
const ADMIN_EMAILS = process.env.ADMIN_EMAILS
  ? process.env.ADMIN_EMAILS.split(",").map((e) => e.trim().toLowerCase())
  : ["admin@yulingstore.com", "baody613@gmail.com"];

export const authenticateUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "No token provided" });
    }

    const token = authHeader.split("Bearer ")[1];

    const decodedToken = await auth.verifyIdToken(token);
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      isAdmin: ADMIN_EMAILS.includes(decodedToken.email?.toLowerCase()),
    };

    next();
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(401).json({ error: "Invalid or expired token" });
  }
};

export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split("Bearer ")[1];
      const decodedToken = await auth.verifyIdToken(token);
      req.user = {
        uid: decodedToken.uid,
        email: decodedToken.email,
        isAdmin: ADMIN_EMAILS.includes(decodedToken.email?.toLowerCase()),
      };
    }

    next();
  } catch (error) {
    next();
  }
};

export const requireAdmin = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "No token provided" });
    }

    const token = authHeader.split("Bearer ")[1];

    const decodedToken = await auth.verifyIdToken(token);
    const email = decodedToken.email?.toLowerCase();

    if (!ADMIN_EMAILS.includes(email)) {
      return res.status(403).json({ error: "Admin access required" });
    }

    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      isAdmin: true,
    };

    next();
  } catch (error) {
    console.error("Admin authentication error:", error);
    res.status(401).json({ error: "Invalid or expired token" });
  }
};
