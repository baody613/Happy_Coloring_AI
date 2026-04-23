import express from "express";
import { sendSuccess, sendError } from "../utils/helpers.js";

const router = express.Router();

/**
 * GET /api/payment/banking-info
 * Public banking transfer info (read from env vars)
 */
router.get("/banking-info", async (req, res) => {
  try {
    sendSuccess(res, {
      enabled: process.env.BANK_ENABLED !== "false",
      bankName: process.env.BANK_NAME || "",
      accountNumber: process.env.BANK_ACCOUNT_NUMBER || "",
      accountName: process.env.BANK_ACCOUNT_NAME || "",
      qrImageUrl: process.env.BANK_QR_URL || "",
    });
  } catch (error) {
    console.error("Get banking info error:", error);
    sendError(res, "Failed to load banking info");
  }
});

export default router;
