import express from "express";
import { authenticateUser } from "../../../middleware/auth.js";
import { requireAdmin } from "../../../middleware/adminAuth.js";
import {
  getAllSettings,
  updateSystemSettings,
  updatePaymentSettings,
  updateEmailSettings,
} from "../../../services/index.js";
import { sendSuccess, sendError } from "../../../utils/helpers.js";
import {
  validate,
  systemSettingsSchema,
  paymentSettingsSchema,
  emailSettingsSchema,
} from "../../../validators/index.js";

const router = express.Router();

// All routes require authentication and admin role
router.use(authenticateUser);
router.use(requireAdmin);

// Get all settings
router.get("/", async (req, res) => {
  try {
    const settings = await getAllSettings();
    sendSuccess(res, settings);
  } catch (error) {
    console.error("Get settings error:", error);
    sendError(res, error.message);
  }
});

// Get system settings
router.get("/system", async (req, res) => {
  try {
    const settings = await getAllSettings();
    sendSuccess(res, settings.system);
  } catch (error) {
    console.error("Get system settings error:", error);
    sendError(res, error.message);
  }
});

// Update system settings
router.put("/system", validate(systemSettingsSchema), async (req, res) => {
  try {
    const settings = await updateSystemSettings(req.body);
    sendSuccess(res, settings, "System settings updated successfully");
  } catch (error) {
    console.error("Update system settings error:", error);
    sendError(res, error.message);
  }
});

// Get payment settings
router.get("/payment", async (req, res) => {
  try {
    const settings = await getAllSettings();
    sendSuccess(res, settings.payment);
  } catch (error) {
    console.error("Get payment settings error:", error);
    sendError(res, error.message);
  }
});

// Update payment settings
router.put("/payment", validate(paymentSettingsSchema), async (req, res) => {
  try {
    const settings = await updatePaymentSettings(req.body);
    sendSuccess(res, settings, "Payment settings updated successfully");
  } catch (error) {
    console.error("Update payment settings error:", error);
    sendError(res, error.message);
  }
});

// Get email settings
router.get("/email", async (req, res) => {
  try {
    const settings = await getAllSettings();
    sendSuccess(res, settings.email);
  } catch (error) {
    console.error("Get email settings error:", error);
    sendError(res, error.message);
  }
});

// Update email settings
router.put("/email", validate(emailSettingsSchema), async (req, res) => {
  try {
    const settings = await updateEmailSettings(req.body);
    sendSuccess(res, settings, "Email settings updated successfully");
  } catch (error) {
    console.error("Update email settings error:", error);
    sendError(res, error.message);
  }
});

export default router;
