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
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px;">
          <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.1);">
            
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">
                🔐 Đặt Lại Mật Khẩu
              </h1>
              <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">
                Yu Ling Store - Happy Coloring with AI
              </p>
            </div>

            <!-- Content -->
            <div style="padding: 40px 30px;">
              <p style="color: #333; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                Xin chào,
              </p>
              
              <p style="color: #555; font-size: 15px; line-height: 1.6; margin: 0 0 30px 0;">
                Bạn đã yêu cầu đặt lại mật khẩu cho tài khoản của mình. Vui lòng sử dụng mã xác nhận bên dưới:
              </p>

              <!-- OTP Box -->
              <div style="background: #1a1a2e; border-radius: 12px; padding: 30px; text-align: center; margin: 30px 0;">
                <div style="color: #a8b3ff; font-size: 48px; font-weight: bold; letter-spacing: 12px; font-family: 'Courier New', monospace;">
                  ${otp}
                </div>
              </div>

              <!-- Info Box -->
              <div style="background: #f8f9ff; border-radius: 8px; padding: 20px; margin: 25px 0;">
                <p style="margin: 0 0 10px 0; color: #555; font-size: 14px;">
                  ⏰ <strong>Mã có hiệu lực trong:</strong> 10 phút
                </p>
                <p style="margin: 0; color: #555; font-size: 14px;">
                  📧 <strong>Email:</strong> <span style="color: #667eea;">${email}</span>
                </p>
              </div>

              <!-- Notes -->
              <div style="margin-top: 30px;">
                <p style="color: #333; font-size: 15px; font-weight: bold; margin: 0 0 15px 0;">
                  Lưu ý:
                </p>
                <ul style="color: #555; font-size: 14px; line-height: 1.8; margin: 0; padding-left: 20px;">
                  <li>Không chia sẻ mã này với bất kỳ ai</li>
                  <li>Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này</li>
                  <li>Mã chỉ được sử dụng một lần</li>
                </ul>
              </div>
            </div>

            <!-- Footer -->
            <div style="background: #f8f9ff; padding: 25px 30px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="color: #999; font-size: 13px; margin: 0; line-height: 1.6;">
                Email này được gửi tự động từ hệ thống. Vui lòng không trả lời email này.
              </p>
              <p style="color: #999; font-size: 13px; margin: 10px 0 0 0;">
                © 2025 Yu Ling Store. All rights reserved.
              </p>
            </div>

          </div>
        </div>
      </body>
      </html>
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
