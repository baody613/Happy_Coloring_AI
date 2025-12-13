import express from 'express';
import nodemailer from 'nodemailer';
import admin from 'firebase-admin';
import { db } from '../config/firebase.js';

const router = express.Router();

const createTransporter = () => {
  return nodemailer.createTransporter({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
};

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

router.post('/send-code', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    try {
      await admin.auth().getUserByEmail(email);
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        return res.status(404).json({ error: 'Email not found' });
      }
      throw error;
    }

    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await db.collection('password_reset_codes').doc(email).set({
      code: otp,
      email: email,
      expiresAt: expiresAt,
      used: false,
      createdAt: new Date(),
    });

    const transporter = createTransporter();
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset Code - Yu Ling Store',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Password Reset Request</h2>
          <p style="font-size: 16px; color: #666;">You requested a password reset. Here is your verification code:</p>
          <div style="font-size: 32px; font-weight: bold; color: #667eea; padding: 20px; background-color: #f0f0f0; text-align: center; border-radius: 8px; letter-spacing: 8px; margin: 20px 0;">
            ${otp}
          </div>
          <p style="font-size: 14px; color: #999;">This code will expire in 10 minutes.</p>
          <p style="font-size: 14px; color: #999;">If you did not request this, please ignore this email.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.json({
      success: true,
      message: 'Verification code sent to email',
      expiresAt: expiresAt,
    });
  } catch (error) {
    console.error('Error sending code:', error);
    res.status(500).json({ error: 'Failed to send verification code' });
  }
});

router.post('/verify-code', async (req, res) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({ error: 'Email and code are required' });
    }

    const otpDoc = await db.collection('password_reset_codes').doc(email).get();

    if (!otpDoc.exists) {
      return res.status(404).json({ error: 'Code not found' });
    }

    const otpData = otpDoc.data();

    if (otpData.used) {
      return res.status(400).json({ error: 'Code already used' });
    }

    if (new Date() > otpData.expiresAt.toDate()) {
      await db.collection('password_reset_codes').doc(email).delete();
      return res.status(400).json({ error: 'Code expired' });
    }

    if (otpData.code !== code) {
      return res.status(400).json({ error: 'Invalid code' });
    }

    res.json({ success: true, message: 'Code verified' });
  } catch (error) {
    console.error('Error verifying code:', error);
    res.status(500).json({ error: 'Failed to verify code' });
  }
});

router.post('/reset-password', async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;

    if (!email || !code || !newPassword) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const otpDoc = await db.collection('password_reset_codes').doc(email).get();

    if (!otpDoc.exists) {
      return res.status(404).json({ error: 'Code not found' });
    }

    const otpData = otpDoc.data();

    if (otpData.used) {
      return res.status(400).json({ error: 'Code already used' });
    }

    if (new Date() > otpData.expiresAt.toDate()) {
      await db.collection('password_reset_codes').doc(email).delete();
      return res.status(400).json({ error: 'Code expired' });
    }

    if (otpData.code !== code) {
      return res.status(400).json({ error: 'Invalid code' });
    }

    const user = await admin.auth().getUserByEmail(email);
    await admin.auth().updateUser(user.uid, {
      password: newPassword,
    });

    await db.collection('password_reset_codes').doc(email).update({
      used: true,
    });

    res.json({ success: true, message: 'Password reset successful' });
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ error: 'Failed to reset password' });
  }
});

export default router;