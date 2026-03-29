import { getUserById } from "../services/index.js";
import { sendError } from "../utils/helpers.js";

/**
 * Middleware to check if user is admin
 * Must be used after authenticateUser middleware
 */
export const requireAdmin = async (req, res, next) => {
  try {
    if (!req.user || !req.user.uid) {
      return sendError(res, "Authentication required", 401);
    }

    // Short-circuit: isAdmin already confirmed by authenticateUser
    if (req.user.isAdmin === true) {
      req.user.role = "admin";
      return next();
    }

    const user = await getUserById(req.user.uid);

    // Primary source: role in users collection.
    // Fallback: authenticated admin email flag from auth middleware.
    const hasAdminRole = user?.role === "admin" || req.user.isAdmin === true;

    if (!hasAdminRole) {
      return sendError(res, "Admin access required", 403);
    }

    req.user.role = "admin";
    next();
  } catch (error) {
    console.error("Admin check error:", error);
    sendError(res, "Authorization failed");
  }
};

/**
 * Middleware to check if user is admin or accessing their own resource
 */
export const requireAdminOrOwner = (getUserIdFromRequest) => {
  return async (req, res, next) => {
    try {
      if (!req.user || !req.user.uid) {
        return sendError(res, "Authentication required", 401);
      }

      const resourceUserId = getUserIdFromRequest(req);

      // Allow if user is accessing their own resource
      if (req.user.uid === resourceUserId) {
        return next();
      }

      // Otherwise check if user is admin
      const user = await getUserById(req.user.uid);

      if ((!user || user.role !== "admin") && req.user.isAdmin !== true) {
        return sendError(res, "Access denied", 403);
      }

      req.user.role = "admin";
      next();
    } catch (error) {
      console.error("Authorization check error:", error);
      sendError(res, "Authorization failed");
    }
  };
};
