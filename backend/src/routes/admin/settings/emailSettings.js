import { db } from "../../config/firebase.js";

// Default email settings
export const DEFAULT_EMAIL_SETTINGS = {
  smtpHost: "smtp.gmail.com",
  smtpPort: 587,
  smtpUser: "",
  smtpPassword: "",
  fromEmail: "",
  fromName: "Happy Coloring AI",
  emailNotifications: {
    orderConfirmation: true,
    orderStatusUpdate: true,
    newUserRegistration: true,
    passwordReset: true,
  },
};

// Mask password
const maskPassword = (data) => {
  const masked = { ...data };
  if (masked.smtpPassword) {
    masked.smtpPassword = "****";
  }
  return masked;
};

// Get email settings
export const getEmailSettings = async () => {
  const settingsDoc = await db.collection("settings").doc("email").get();
  const data = settingsDoc.exists ? settingsDoc.data() : DEFAULT_EMAIL_SETTINGS;
  return maskPassword(data);
};

// Update email settings
export const updateEmailSettings = async (settings, existingData, uid) => {
  const settingsData = {
    ...settings,
    smtpPassword:
      settings.smtpPassword === "****"
        ? existingData?.smtpPassword || ""
        : settings.smtpPassword,
    updatedAt: new Date().toISOString(),
    updatedBy: uid,
  };

  await db
    .collection("settings")
    .doc("email")
    .set(settingsData, { merge: true });
  return maskPassword(settingsData);
};
