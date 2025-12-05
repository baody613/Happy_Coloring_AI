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

    const user = await getUserById(req.user.uid);

    if (!user) {
      return sendError(res, "User not found", 404);
    }

    if (user.role !== "admin") {
      return sendError(res, "Admin access required", 403);
    }

    req.user.role = user.role;
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

      if (!user || user.role !== "admin") {
        return sendError(res, "Access denied", 403);
      }

      req.user.role = user.role;
      next();
    } catch (error) {
      console.error("Authorization check error:", error);
      sendError(res, "Authorization failed");
    }
  };
};
