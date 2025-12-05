import admin from "firebase-admin";
import dotenv from "dotenv";

dotenv.config();

// Initialize Firebase Admin
// Support both plain PEM with escaped \n and base64-encoded private keys
const privateKey = (() => {
  const raw = process.env.FIREBASE_PRIVATE_KEY;
  const base64 = process.env.FIREBASE_PRIVATE_KEY_BASE64;

  if (base64) {
    // Decode base64 then normalize newlines
    return Buffer.from(base64, "base64").toString("utf8");
  }

  if (raw) {
    // Replace literal \n with real newlines
    return raw.replace(/\\n/g, "\n");
  }

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
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  });
}

export const db = admin.firestore();
export const auth = admin.auth();
export const storage = admin.storage();

export default admin;
