import express from "express";
import sgMail from "@sendgrid/mail";
import admin from "firebase-admin";
import { db } from "../config/firebase.js";

const router = express.Router();

// Configure SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Function to send email via SendGrid
const sendEmailViaSendGrid = async (to, subject, htmlContent) => {
  const msg = {
    to: to,
    from: process.env.EMAIL_USER || "baody613@gmail.com",
    subject: subject,
    html: htmlContent,
  };

  try {
    const result = await sgMail.send(msg);
    console.log("✅ Email sent successfully via SendGrid to:", to);
    return result;
  } catch (error) {
    console.error("❌ SendGrid error:", error.response?.body || error.message);
    throw error;
  }
};

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

router.post("/send-code", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    try {
      await admin.auth().getUserByEmail(email);
    } catch (error) {
      if (error.code === "auth/user-not-found") {
        return res.status(404).json({ error: "Email not found" });
      }
      throw error;
    }

    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await db.collection("password_reset_codes").doc(email).set({
      code: otp,
      email: email,
      expiresAt: expiresAt,
      used: false,
      createdAt: new Date(),
    });

    // Send email via SendGrid
    console.log("📧 Sending password reset code to:", email);
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #333;">Password Reset - Yu Ling Store</h2>
        <p style="color: #666;">You requested to reset your password. Use the verification code below:</p>
        <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
          <div style="font-size: 36px; font-weight: bold; color: #667eea; letter-spacing: 8px;">${otp}</div>
        </div>
        <p style="color: #666;">This code will expire in 10 minutes.</p>
        <p style="color: #999; font-size: 12px;">If you didn't request this, please ignore this email.</p>
      </div>
    `;

    try {
      await sendEmailViaSendGrid(
        email,
        "Password Reset Code - Yu Ling Store",
        htmlContent
      );

      res.json({
        success: true,
        message: "Verification code has been sent to your email",
        expiresAt: expiresAt,
      });
    } catch (emailError) {
      console.error("❌ Failed to send email:", emailError);
      return res.status(500).json({
        error: "Failed to send verification code",
        details: "Email service error. Please try again later.",
      });
    }
  } catch (error) {
    console.error("Error sending code:", error);
    console.error("Error details:", error.message, error.code);
    res.status(500).json({
      error: "Failed to send verification code",
      details: error.message,
    });
  }
});

router.post("/verify-code", async (req, res) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({ error: "Email and code are required" });
    }

    const otpDoc = await db.collection("password_reset_codes").doc(email).get();

    if (!otpDoc.exists) {
      return res.status(404).json({ error: "Code not found" });
    }

    const otpData = otpDoc.data();

    if (otpData.used) {
      return res.status(400).json({ error: "Code already used" });
    }

    if (new Date() > otpData.expiresAt.toDate()) {
      await db.collection("password_reset_codes").doc(email).delete();
      return res.status(400).json({ error: "Code expired" });
    }

    if (otpData.code !== code) {
      return res.status(400).json({ error: "Invalid code" });
    }

    res.json({ success: true, message: "Code verified" });
  } catch (error) {
    console.error("Error verifying code:", error);
    res.status(500).json({ error: "Failed to verify code" });
  }
});

router.post("/reset-password", async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;

    if (!email || !code || !newPassword) {
      return res.status(400).json({ error: "All fields are required" });
    }

    if (newPassword.length < 6) {
      return res
        .status(400)
        .json({ error: "Password must be at least 6 characters" });
    }

    const otpDoc = await db.collection("password_reset_codes").doc(email).get();

    if (!otpDoc.exists) {
      return res.status(404).json({ error: "Code not found" });
    }

    const otpData = otpDoc.data();

    if (otpData.used) {
      return res.status(400).json({ error: "Code already used" });
    }

    if (new Date() > otpData.expiresAt.toDate()) {
      await db.collection("password_reset_codes").doc(email).delete();
      return res.status(400).json({ error: "Code expired" });
    }

    if (otpData.code !== code) {
      return res.status(400).json({ error: "Invalid code" });
    }

    const user = await admin.auth().getUserByEmail(email);
    await admin.auth().updateUser(user.uid, {
      password: newPassword,
    });

    await db.collection("password_reset_codes").doc(email).update({
      used: true,
    });

    res.json({ success: true, message: "Password reset successful" });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({ error: "Failed to reset password" });
  }
});

export default router;
