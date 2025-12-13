import express from "express";
import { Resend } from "resend";
import admin from "firebase-admin";
import { db } from "../config/firebase.js";

const router = express.Router();

// Khởi tạo Resend (chỉ khi có API key)
let resend = null;
if (process.env.RESEND_API_KEY) {
  resend = new Resend(process.env.RESEND_API_KEY);
}

// Tạo mã OTP 6 số
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// POST /api/password-reset/send-code - Gửi mã OTP
router.post("/send-code", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    // Kiểm tra email có tồn tại trong Firebase Auth không
    let userExists = false;
    try {
      await admin.auth().getUserByEmail(email);
      userExists = true;
    } catch (error) {
      if (error.code === "auth/user-not-found") {
        return res
          .status(404)
          .json({ error: "Không tìm thấy tài khoản với email này" });
      }
      throw error;
    }

    // Tạo mã OTP
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // Hết hạn sau 10 phút

    // Lưu OTP vào Firestore
    await db.collection("password_reset_codes").doc(email).set({
      code: otp,
      email: email,
      expiresAt: expiresAt,
      used: false,
      createdAt: new Date(),
    });

    console.log(`🔐 OTP for ${email}: ${otp} (expires at ${expiresAt})`);

    // Gửi email qua Resend
    try {
      if (!resend) {
        console.warn("⚠️ RESEND_API_KEY not configured, skipping email");
        throw new Error("Email service chưa được cấu hình");
      }

      const { data, error } = await resend.emails.send({
        from: "Yu Ling Store <onboarding@resend.dev>",
        to: email,
        subject: "Mã Xác Nhận Đặt Lại Mật Khẩu - Yu Ling Store",
        html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .container {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              padding: 30px;
              border-radius: 10px;
              color: white;
            }
            .code-box {
              background: white;
              color: #667eea;
              font-size: 32px;
              font-weight: bold;
              padding: 20px;
              text-align: center;
              border-radius: 8px;
              margin: 20px 0;
              letter-spacing: 8px;
            }
            .info {
              background: rgba(255, 255, 255, 0.1);
              padding: 15px;
              border-radius: 8px;
              margin: 20px 0;
            }
            .footer {
              text-align: center;
              font-size: 12px;
              color: rgba(255, 255, 255, 0.8);
              margin-top: 20px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1 style="text-align: center; margin-bottom: 10px;">🔐 Đặt Lại Mật Khẩu</h1>
            <p style="text-align: center; font-size: 16px;">Yu Ling Store - Happy Coloring with AI</p>
            
            <p>Xin chào,</p>
            <p>Bạn đã yêu cầu đặt lại mật khẩu cho tài khoản của mình. Vui lòng sử dụng mã xác nhận bên dưới:</p>
            
            <div class="code-box">${otp}</div>
            
            <div class="info">
              <p style="margin: 5px 0;"><strong>⏰ Mã có hiệu lực trong: 10 phút</strong></p>
              <p style="margin: 5px 0;">📧 Email: ${email}</p>
            </div>
            
            <p><strong>Lưu ý:</strong></p>
            <ul>
              <li>Không chia sẻ mã này với bất kỳ ai</li>
              <li>Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này</li>
              <li>Mã chỉ được sử dụng một lần</li>
            </ul>
            
            <div class="footer">
              <p>Email này được gửi tự động từ Yu Ling Store</p>
              <p>© 2025 Yu Ling Store. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      });

      if (error) {
        throw error;
      }

      console.log(`✅ Email sent successfully to ${email} (ID: ${data?.id})`);
    } catch (emailError) {
      console.error(
        "⚠️ Failed to send email (non-critical):",
        emailError.message
      );
      // Không throw error, vẫn cho phép user dùng OTP
    }

    res.json({
      success: true,
      message:
        "Mã xác nhận đã được tạo. Kiểm tra email hoặc console log để lấy mã.",
      expiresAt: expiresAt,
      // Trả OTP trong response cho development (XÓA trong production!)
      otp: process.env.NODE_ENV === "development" ? otp : undefined,
    });
  } catch (error) {
    console.error("Error sending OTP:", error);

    // Xóa OTP nếu có lỗi
    try {
      await db.collection("password_reset_codes").doc(email).delete();
    } catch (deleteError) {
      console.error("Failed to cleanup OTP:", deleteError);
    }

    res.status(500).json({
      error: "Không thể xử lý yêu cầu. Vui lòng thử lại.",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

// POST /api/password-reset/verify-code - Xác thực mã OTP
router.post("/verify-code", async (req, res) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res
        .status(400)
        .json({ error: "Email và mã xác nhận là bắt buộc" });
    }

    // Lấy mã OTP từ Firestore
    const docRef = db.collection("password_reset_codes").doc(email);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res
        .status(404)
        .json({ error: "Mã xác nhận không tồn tại hoặc đã hết hạn" });
    }

    const data = doc.data();

    // Kiểm tra mã đã được sử dụng chưa
    if (data.used) {
      return res.status(400).json({ error: "Mã xác nhận đã được sử dụng" });
    }

    // Kiểm tra mã có hết hạn chưa
    if (new Date() > data.expiresAt.toDate()) {
      await docRef.delete();
      return res
        .status(400)
        .json({ error: "Mã xác nhận đã hết hạn. Vui lòng yêu cầu mã mới." });
    }

    // Kiểm tra mã có đúng không
    if (data.code !== code) {
      return res.status(400).json({ error: "Mã xác nhận không chính xác" });
    }

    res.json({
      success: true,
      message: "Mã xác nhận hợp lệ",
    });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({ error: "Không thể xác thực mã. Vui lòng thử lại." });
  }
});

// POST /api/password-reset/reset-password - Đặt lại mật khẩu
router.post("/reset-password", async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;

    if (!email || !code || !newPassword) {
      return res
        .status(400)
        .json({ error: "Email, mã xác nhận và mật khẩu mới là bắt buộc" });
    }

    if (newPassword.length < 6) {
      return res
        .status(400)
        .json({ error: "Mật khẩu phải có ít nhất 6 ký tự" });
    }

    // Lấy mã OTP từ Firestore
    const docRef = db.collection("password_reset_codes").doc(email);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res
        .status(404)
        .json({ error: "Mã xác nhận không tồn tại hoặc đã hết hạn" });
    }

    const data = doc.data();

    // Kiểm tra mã đã được sử dụng chưa
    if (data.used) {
      return res.status(400).json({ error: "Mã xác nhận đã được sử dụng" });
    }

    // Kiểm tra mã có hết hạn chưa
    if (new Date() > data.expiresAt.toDate()) {
      await docRef.delete();
      return res
        .status(400)
        .json({ error: "Mã xác nhận đã hết hạn. Vui lòng yêu cầu mã mới." });
    }

    // Kiểm tra mã có đúng không
    if (data.code !== code) {
      return res.status(400).json({ error: "Mã xác nhận không chính xác" });
    }

    // Đặt lại mật khẩu trong Firebase Auth
    const user = await admin.auth().getUserByEmail(email);
    await admin.auth().updateUser(user.uid, {
      password: newPassword,
    });

    // Đánh dấu mã đã được sử dụng
    await docRef.update({ used: true });

    res.json({
      success: true,
      message: "Đặt lại mật khẩu thành công",
    });
  } catch (error) {
    console.error("Error resetting password:", error);
    res
      .status(500)
      .json({ error: "Không thể đặt lại mật khẩu. Vui lòng thử lại." });
  }
});

export default router;
