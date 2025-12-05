import { db } from "../../config/firebase.js";

// Default payment settings
export const DEFAULT_PAYMENT_SETTINGS = {
  paymentMethods: {
    cod: true,
    vnpay: false,
    momo: false,
    banking: true,
  },
  vnpayConfig: {
    tmnCode: "",
    hashSecret: "",
    url: "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html",
  },
  momoConfig: {
    partnerCode: "",
    accessKey: "",
    secretKey: "",
  },
  bankingInfo: {
    bankName: "Vietcombank",
    accountNumber: "",
    accountName: "",
  },
};

// Mask sensitive data
const maskSensitiveData = (data) => {
  const masked = { ...data };
  if (masked.vnpayConfig?.hashSecret) {
    masked.vnpayConfig.hashSecret = "****";
  }
  if (masked.momoConfig?.secretKey) {
    masked.momoConfig.secretKey = "****";
  }
  if (masked.momoConfig?.accessKey) {
    masked.momoConfig.accessKey = "****";
  }
  return masked;
};

// Get payment settings
export const getPaymentSettings = async () => {
  const settingsDoc = await db.collection("settings").doc("payment").get();
  const data = settingsDoc.exists
    ? settingsDoc.data()
    : DEFAULT_PAYMENT_SETTINGS;
  return maskSensitiveData(data);
};

// Update payment settings
export const updatePaymentSettings = async (settings, existingData, uid) => {
  const settingsData = {
    ...settings,
    vnpayConfig: {
      ...settings.vnpayConfig,
      hashSecret:
        settings.vnpayConfig.hashSecret === "****"
          ? existingData?.vnpayConfig?.hashSecret || ""
          : settings.vnpayConfig.hashSecret,
    },
    momoConfig: {
      ...settings.momoConfig,
      secretKey:
        settings.momoConfig.secretKey === "****"
          ? existingData?.momoConfig?.secretKey || ""
          : settings.momoConfig.secretKey,
      accessKey:
        settings.momoConfig.accessKey === "****"
          ? existingData?.momoConfig?.accessKey || ""
          : settings.momoConfig.accessKey,
    },
    updatedAt: new Date().toISOString(),
    updatedBy: uid,
  };

  await db
    .collection("settings")
    .doc("payment")
    .set(settingsData, { merge: true });
  return maskSensitiveData(settingsData);
};
