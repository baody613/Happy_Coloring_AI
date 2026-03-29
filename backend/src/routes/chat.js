import express from "express";
import { handleChatMessage } from "../services/chatService.js";
import { sendSuccess, sendError } from "../utils/helpers.js";

const router = express.Router();

// Handle incoming chat messages
router.post("/", async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message || typeof message !== "string" || message.trim() === "") {
      return sendError(res, "Message is required", 400);
    }

    // Giới hạn history 20 tin nhắn gần nhất để không quá dài
    const recentHistory = Array.isArray(history) ? history.slice(-20) : [];

    const result = await handleChatMessage(message.trim(), recentHistory);

    if (!result.success) {
      return sendError(res, "Failed to process message", 500);
    }
    sendSuccess(res, result.response);
  } catch (error) {
    console.error("Chat error:", error);
    sendError(res, error.message);
  }
});
export default router;
