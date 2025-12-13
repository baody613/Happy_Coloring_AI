import express from "express";
import nodemailer from "nodemailer";
import admin from "firebase-admin";
import { db } from "../config/firebase.js";

const router = express.Router();

const createTransporter = () => {
  console.log('Creating email transporter with user:', process.env.EMAIL_USER);
  return nodemailer.createTransporter({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false
    },
    connectionTimeout: 30000,
    greetingTimeout: 30000,
    socketTimeout: 30000
  });
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

    let emailSent = false;
    let emailError = null;

    try {
      const transporter = createTransporter();
      console.log('Attempting to send email to:', email);
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Password Reset Code - Yu Ling Store",
        html: `<div style="padding:20px;max-width:600px"><h2>Password Reset</h2><p>Your verification code:</p><div style="font-size:32px;font-weight:bold;color:#667eea;padding:20px;background:#f0f0f0;text-align:center;border-radius:8px;letter-spacing:8px">${otp}</div><p>Code expires in 10 minutes</p></div>`,
      };

      const info = await transporter.sendMail(mailOptions);
      console.log('Email sent successfully:', info.messageId);
      emailSent = true;
    } catch (emailErr) {
      console.error('Email sending failed:', emailErr.message);
      emailError = emailErr.message;
    }

    res.json({
      success: true,
      message: emailSent ? "Verification code sent to email" : "Code saved but email failed to send",
      expiresAt: expiresAt,
      otp: process.env.NODE_ENV === 'production' ? (emailSent ? undefined : otp) : otp,
      emailSent,
      emailError: emailSent ? undefined : emailError
    });
  } catch (error) {
    console.error("Error sending code:", error);
    console.error("Error details:", error.message, error.code);
    res.status(500).json({ 
      error: "Failed to send verification code",
      details: error.message 
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
