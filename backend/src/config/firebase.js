import admin from "firebase-admin";

/**
 * Decode the Firebase private key from environment variables.
 * Supports two formats:
 *   1. Base64-encoded PEM (FIREBASE_PRIVATE_KEY_BASE64) — preferred for cloud
 *      hosts that mangle embedded newlines in env vars
 *   2. PEM string with escaped newlines (FIREBASE_PRIVATE_KEY)
 */
const resolvePrivateKey = () => {
  const b64 = process.env.FIREBASE_PRIVATE_KEY_BASE64;
  if (b64) return Buffer.from(b64, "base64").toString("utf8");

  const pem = process.env.FIREBASE_PRIVATE_KEY;
  if (pem) return pem.replace(/\\n/g, "\n");

  throw new Error(
    "Firebase private key not configured — set FIREBASE_PRIVATE_KEY or FIREBASE_PRIVATE_KEY_BASE64"
  );
};

const initFirebaseAdmin = () => {
  if (admin.apps.length) return admin.app();

  return admin.initializeApp({
    credential: admin.credential.cert({
      project_id: process.env.FIREBASE_PROJECT_ID,
      private_key: resolvePrivateKey(),
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
    }),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  });
};

initFirebaseAdmin();

export const db = admin.firestore();
export const auth = admin.auth();
export const storage = admin.storage();
export default admin;
