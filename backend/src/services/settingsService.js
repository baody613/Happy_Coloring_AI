import { db } from "../config/firebase.js";
import { formatDate, deepMerge } from "../utils/helpers.js";

/**
 * Settings Service - handles all settings-related database operations
 */

const SETTINGS_DOC_ID = "app-settings";

// Default settings structure
const defaultSettings = {
  system: {
    siteName: "Happy Coloring with AI",
    siteDescription: "Nền tảng tô màu theo số với AI",
    maintenanceMode: false,
    allowRegistration: true,
    maxImageSize: 5, // MB
    defaultCurrency: "VND",
    taxRate: 0,
    shippingFee: 30000,
  },
  payment: {
    paymentMethods: {
      cod: true,
      vnpay: false,
      momo: false,
      banking: true,
    },
    vnpayConfig: {
      tmnCode: "",
      hashSecret: "",
      url: "",
    },
    momoConfig: {
      partnerCode: "",
      accessKey: "",
      secretKey: "",
    },
    bankingInfo: {
      bankName: "",
      accountNumber: "",
      accountName: "",
    },
  },
  email: {
    smtpHost: "",
    smtpPort: 587,
    smtpUser: "",
    smtpPassword: "",
    fromEmail: "",
    fromName: "Happy Coloring",
    emailNotifications: {
      orderConfirmation: true,
      orderStatusUpdate: true,
      newUserRegistration: false,
      passwordReset: true,
    },
  },
  updatedAt: formatDate(),
};

// Get all settings
export const getAllSettings = async () => {
  const settingsDoc = await db
    .collection("settings")
    .doc(SETTINGS_DOC_ID)
    .get();

  if (!settingsDoc.exists) {
    // Initialize with default settings
    await db.collection("settings").doc(SETTINGS_DOC_ID).set(defaultSettings);
    return defaultSettings;
  }

  return settingsDoc.data();
};

// Get settings by category
export const getSettingsByCategory = async (category) => {
  const allSettings = await getAllSettings();
  return allSettings[category] || null;
};

// Update settings by category
export const updateSettingsByCategory = async (category, data) => {
  const allSettings = await getAllSettings();

  const updatedSettings = {
    ...allSettings,
    [category]: {
      ...allSettings[category],
      ...data,
    },
    updatedAt: formatDate(),
  };

  await db.collection("settings").doc(SETTINGS_DOC_ID).update(updatedSettings);
  return updatedSettings[category];
};

// Update system settings
export const updateSystemSettings = async (data) => {
  return updateSettingsByCategory("system", data);
};

// Update payment settings
export const updatePaymentSettings = async (data) => {
  return updateSettingsByCategory("payment", data);
};

// Update email settings
export const updateEmailSettings = async (data) => {
  // Don't save empty password
  if (data.smtpPassword === "") {
    delete data.smtpPassword;
  }
  return updateSettingsByCategory("email", data);
};

// Reset settings to default
export const resetSettings = async () => {
  await db.collection("settings").doc(SETTINGS_DOC_ID).set(defaultSettings);
  return defaultSettings;
};

// Get specific setting value
export const getSettingValue = async (category, key) => {
  const settings = await getSettingsByCategory(category);
  return settings?.[key];
};

// Update specific setting value
export const updateSettingValue = async (category, key, value) => {
  const settings = await getSettingsByCategory(category);
  return updateSettingsByCategory(category, {
    ...settings,
    [key]: value,
  });
};
