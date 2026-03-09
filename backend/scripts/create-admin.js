import admin from "firebase-admin";
import dotenv from "dotenv";

dotenv.config();

// Initialize Firebase Admin (same logic as config/firebase.js)
const privateKey = (() => {
  const raw = process.env.FIREBASE_PRIVATE_KEY;
  const base64 = process.env.FIREBASE_PRIVATE_KEY_BASE64;
  if (base64) return Buffer.from(base64, "base64").toString("utf8");
  if (raw) return raw.replace(/\\n/g, "\n");
  return undefined;
})();

const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  privateKey,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
};

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

async function createAdminUser() {
  try {
    // Thông tin admin mới
    const email = "admin@yulingstore.com";
    const password = "Admin@123456"; // Mật khẩu mạnh
    const displayName = "Administrator";

    console.log("🔄 Đang tạo tài khoản admin...");

    // Kiểm tra xem user đã tồn tại chưa
    try {
      const existingUser = await admin.auth().getUserByEmail(email);
      console.log("⚠️  Tài khoản admin đã tồn tại. Đang cập nhật mật khẩu...");

      // Cập nhật mật khẩu
      await admin.auth().updateUser(existingUser.uid, {
        password: password,
        displayName: displayName,
      });

      // Set custom claims
      await admin.auth().setCustomUserClaims(existingUser.uid, {
        role: "admin",
        isAdmin: true,
      });

      console.log("✅ Đã cập nhật tài khoản admin thành công!");
      console.log("📧 Email:", email);
      console.log("🔑 Mật khẩu:", password);
      console.log("👤 UID:", existingUser.uid);
    } catch (error) {
      if (error.code === "auth/user-not-found") {
        // Tạo user mới
        const userRecord = await admin.auth().createUser({
          email: email,
          password: password,
          displayName: displayName,
          emailVerified: true,
        });

        // Set custom claims để đánh dấu là admin
        await admin.auth().setCustomUserClaims(userRecord.uid, {
          role: "admin",
          isAdmin: true,
        });

        console.log("✅ Tạo tài khoản admin mới thành công!");
        console.log("📧 Email:", email);
        console.log("🔑 Mật khẩu:", password);
        console.log("👤 UID:", userRecord.uid);
      } else {
        throw error;
      }
    }

    console.log("\n🎉 Hoàn tất! Bạn có thể đăng nhập với thông tin trên.");
    process.exit(0);
  } catch (error) {
    console.error("❌ Lỗi khi tạo admin:", error);
    process.exit(1);
  }
}

createAdminUser();
