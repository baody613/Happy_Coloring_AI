import { auth } from "../config/firebase.js";

const ADMIN_EMAILS = new Set(
  (process.env.ADMIN_EMAILS || "admin@yulingstore.com,baody613@gmail.com")
    .split(",")
    .map((e) => e.trim().toLowerCase())
);

/**
 * Extract the Bearer token from the Authorization header and verify it
 * against Firebase Auth. Throws an error with a `status` field on failure.
 */
const verifyBearerToken = (req) => {
  const header = req.headers.authorization ?? "";
  if (!header.startsWith("Bearer ")) {
    const err = new Error("No token provided");
    err.status = 401;
    throw err;
  }
  return auth.verifyIdToken(header.slice(7));
};

/** Build a standardised req.user object from a decoded Firebase token */
const buildUser = (decoded, forceAdmin = false) => ({
  uid: decoded.uid,
  email: decoded.email,
  isAdmin: forceAdmin || ADMIN_EMAILS.has(decoded.email?.toLowerCase()),
});

const respondAuthError = (res, err) => {
  const status = err.status || 401;
  const message = err.status ? err.message : "Invalid or expired token";
  res.status(status).json({ error: message });
};

export const authenticateUser = async (req, res, next) => {
  try {
    const decoded = await verifyBearerToken(req);
    req.user = buildUser(decoded);
    next();
  } catch (err) {
    respondAuthError(res, err);
  }
};

export const optionalAuth = async (req, res, next) => {
  try {
    const decoded = await verifyBearerToken(req);
    req.user = buildUser(decoded);
  } catch {
    // Unauthenticated requests are allowed to continue
  }
  next();
};

export const requireAdmin = async (req, res, next) => {
  try {
    const decoded = await verifyBearerToken(req);
    if (!ADMIN_EMAILS.has(decoded.email?.toLowerCase())) {
      return res.status(403).json({ error: "Admin access required" });
    }
    req.user = buildUser(decoded, true);
    next();
  } catch (err) {
    respondAuthError(res, err);
  }
};
