import express from "express";
import { handleChatMessage } from "../services/chatService.js";
import { sendSuccess, sendError } from "../utils/helpers.js";

const router = express.Router();

// POST /api/chat - Handle chat messages
router.post("/", async (req, res) => {
  try {
    const { message } = req.body;

    if (
      !message ||
      typeof message !== "string" ||
      message.trim().length === 0
    ) {
      return sendError(res, "Message is required", 400);
    }

    const result = await handleChatMessage(message.trim());

    if (!result.success) {
      return sendError(res, "Failed to process message", 500);
    }

    sendSuccess(res, result.response);
  } catch (error) {
    console.error("Chat route error:", error);
    sendError(res, error.message);
  }
});

export default router;
