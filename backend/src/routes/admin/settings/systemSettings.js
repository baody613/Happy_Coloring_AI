import { db } from "../../config/firebase.js";

// Default system settings
export const DEFAULT_SYSTEM_SETTINGS = {
  siteName: "Happy Coloring AI",
  siteDescription: "Nền tảng tô màu theo số với AI",
  maintenanceMode: false,
  allowRegistration: true,
  maxImageSize: 10,
  defaultCurrency: "VND",
  taxRate: 10,
  shippingFee: 30000,
};

// Get system settings
export const getSystemSettings = async () => {
  const settingsDoc = await db.collection("settings").doc("system").get();
  return settingsDoc.exists ? settingsDoc.data() : DEFAULT_SYSTEM_SETTINGS;
};

// Update system settings
export const updateSystemSettings = async (settings, uid) => {
  const settingsData = {
    ...settings,
    updatedAt: new Date().toISOString(),
    updatedBy: uid,
  };

  await db
    .collection("settings")
    .doc("system")
    .set(settingsData, { merge: true });
  return settingsData;
};
