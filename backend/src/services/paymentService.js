import crypto from "crypto";
import axios from "axios";
import qs from "qs";
import { db } from "../config/firebase.js";

// ---- Gateway configs ----
const vnpConfig = {
  tmnCode: process.env.VNPAY_TMN_CODE,
  hashSecret: process.env.VNPAY_HASH_SECRET,
  gatewayUrl:
    process.env.VNPAY_URL ||
    "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html",
  returnUrl:
    process.env.VNPAY_RETURN_URL ||
    `${process.env.FRONTEND_URL}/payment/vnpay/callback`,
};

const momoConf = {
  partnerCode: process.env.MOMO_PARTNER_CODE,
  accessKey: process.env.MOMO_ACCESS_KEY,
  secretKey: process.env.MOMO_SECRET_KEY,
  endpoint:
    process.env.MOMO_ENDPOINT ||
    "https://test-payment.momo.vn/v2/gateway/api/create",
  redirectUrl:
    process.env.MOMO_REDIRECT_URL ||
    `${process.env.FRONTEND_URL}/payment/momo/callback`,
  ipnUrl:
    process.env.MOMO_IPN_URL || `${process.env.API_URL}/api/payment/momo/ipn`,
};

// ---- Shared helpers ----

/**
 * Normalize caller IP — VNPay rejects IPv6 loopback addresses.
 */
const normalizeIp = (raw) => {
  if (!raw || raw === "::1" || raw.startsWith("::ffff:")) return "127.0.0.1";
  return raw;
};

/**
 * Build Vietnam-timezone timestamp string (yyyyMMddHHmmss).
 * VNPay gateway only accepts UTC+7 local time in this exact format.
 */
const buildVnTimestamp = () => {
  const vn = new Date(Date.now() + 7 * 3600 * 1000);
  const p2 = (n) => String(n).padStart(2, "0");
  return (
    vn.getUTCFullYear() +
    p2(vn.getUTCMonth() + 1) +
    p2(vn.getUTCDate()) +
    p2(vn.getUTCHours()) +
    p2(vn.getUTCMinutes()) +
    p2(vn.getUTCSeconds())
  );
};

/**
 * Sort params alphabetically then compute HMAC-SHA512 checksum.
 * VNPay requires params to be sorted before signing, and the query string
 * must NOT be URL-encoded when generating the signature.
 */
const signVnpParams = (params, secret) => {
  const sorted = Object.fromEntries(
    Object.entries(params).sort(([a], [b]) => a.localeCompare(b))
  );
  const rawQuery = qs.stringify(sorted, { encode: false });
  const checksum = crypto
    .createHmac("sha512", secret)
    .update(rawQuery, "utf8")
    .digest("hex");
  return { sorted, checksum };
};

/**
 * Sign MoMo request: build key=value string from ordered fields then HMAC-SHA256.
 */
const signMomoRequest = (fields) => {
  const raw = Object.entries(fields)
    .map(([k, v]) => `${k}=${v}`)
    .join("&");
  return crypto
    .createHmac("sha256", momoConf.secretKey)
    .update(raw)
    .digest("hex");
};

/**
 * Save a payment attempt to Firestore for later reconciliation.
 */
const persistTransaction = (payload) =>
  db.collection("transactions").add({ ...payload, createdAt: new Date() });

// ---- VNPay ----

export const createVNPayPayment = async (orderData) => {
  try {
    const { orderId, amount, orderInfo, ipAddr } = orderData;
    const txnRef = String(Date.now());

    const safeDesc = (orderInfo || `Thanh toan don hang ${orderId}`)
      .replace(/[^\w\s-]/g, "")
      .slice(0, 255);

    const rawParams = {
      vnp_Amount: Math.round(amount) * 100,
      vnp_Command: "pay",
      vnp_CreateDate: buildVnTimestamp(),
      vnp_CurrCode: "VND",
      vnp_IpAddr: normalizeIp(ipAddr),
      vnp_Locale: "vn",
      vnp_OrderInfo: safeDesc,
      vnp_OrderType: "other",
      vnp_ReturnUrl: vnpConfig.returnUrl,
      vnp_TmnCode: vnpConfig.tmnCode,
      vnp_TxnRef: txnRef,
      vnp_Version: "2.1.0",
    };

    const { sorted, checksum } = signVnpParams(rawParams, vnpConfig.hashSecret);
    const finalParams = { ...sorted, vnp_SecureHash: checksum };
    const paymentUrl = `${vnpConfig.gatewayUrl}?${qs.stringify(finalParams, { encode: false })}`;

    await persistTransaction({
      orderId,
      txnRef,
      amount: Math.round(amount),
      paymentMethod: "vnpay",
      status: "pending",
    });

    return { success: true, paymentUrl, txnRef };
  } catch (err) {
    console.error("VNPay payment creation error:", err);
    throw new Error("Failed to create VNPay payment");
  }
};

export const verifyVNPayCallback = async (vnp_Params) => {
  try {
    const incomingHash = vnp_Params["vnp_SecureHash"];
    const paramsToVerify = Object.fromEntries(
      Object.entries(vnp_Params).filter(
        ([k]) => k !== "vnp_SecureHash" && k !== "vnp_SecureHashType"
      )
    );

    const { checksum } = signVnpParams(paramsToVerify, vnpConfig.hashSecret);
    if (incomingHash !== checksum) {
      return { success: false, message: "Invalid signature" };
    }

    const responseCode = vnp_Params["vnp_ResponseCode"];
    const txnRef = vnp_Params["vnp_TxnRef"];
    const paidAmount = Number(vnp_Params["vnp_Amount"]) / 100;

    const snap = await db
      .collection("transactions")
      .where("txnRef", "==", txnRef)
      .limit(1)
      .get();

    if (snap.empty) return { success: false, message: "Transaction not found" };

    const doc = snap.docs[0];
    await doc.ref.update({
      status: responseCode === "00" ? "success" : "failed",
      responseCode,
      vnpayResponse: vnp_Params,
      updatedAt: new Date(),
    });

    return {
      success: responseCode === "00",
      message: responseCode === "00" ? "Payment successful" : "Payment failed",
      orderId: doc.data().orderId,
      txnRef,
      amount: paidAmount,
      responseCode,
    };
  } catch (err) {
    console.error("VNPay callback verification error:", err);
    throw new Error("Failed to verify VNPay callback");
  }
};

// ---- MoMo ----

export const createMoMoPayment = async (orderData) => {
  try {
    const { orderId, amount, orderInfo } = orderData;
    const requestId = `${orderId}_${Date.now()}`;
    const requestType = "captureWallet";
    const extraData = "";
    const desc = orderInfo || `Thanh toan don hang ${orderId}`;

    const signature = signMomoRequest({
      accessKey: momoConf.accessKey,
      amount,
      extraData,
      ipnUrl: momoConf.ipnUrl,
      orderId,
      orderInfo: desc,
      partnerCode: momoConf.partnerCode,
      redirectUrl: momoConf.redirectUrl,
      requestId,
      requestType,
    });

    const body = {
      partnerCode: momoConf.partnerCode,
      accessKey: momoConf.accessKey,
      requestId,
      amount: amount.toString(),
      orderId,
      orderInfo: desc,
      redirectUrl: momoConf.redirectUrl,
      ipnUrl: momoConf.ipnUrl,
      extraData,
      requestType,
      signature,
      lang: "vi",
    };

    const { data } = await axios.post(momoConf.endpoint, body, {
      headers: { "Content-Type": "application/json" },
    });

    if (data.resultCode !== 0) {
      throw new Error(data.message || "MoMo payment creation failed");
    }

    await persistTransaction({
      orderId,
      requestId,
      amount,
      paymentMethod: "momo",
      status: "pending",
      momoParams: body,
    });

    return { success: true, paymentUrl: data.payUrl, requestId };
  } catch (err) {
    console.error("MoMo payment creation error:", err);
    throw new Error(err.message || "Failed to create MoMo payment");
  }
};

export const verifyMoMoCallback = async (cb) => {
  try {
    const {
      partnerCode,
      orderId,
      requestId,
      amount,
      orderInfo,
      orderType,
      transId,
      resultCode,
      message,
      payType,
      responseTime,
      extraData,
      signature,
    } = cb;

    const expectedSig = signMomoRequest({
      accessKey: momoConf.accessKey,
      amount,
      extraData,
      message,
      orderId,
      orderInfo,
      orderType,
      partnerCode,
      payType,
      requestId,
      responseTime,
      resultCode,
      transId,
    });

    if (signature !== expectedSig) {
      return { success: false, message: "Invalid signature" };
    }

    const snap = await db
      .collection("transactions")
      .where("requestId", "==", requestId)
      .limit(1)
      .get();

    if (snap.empty) return { success: false, message: "Transaction not found" };

    const doc = snap.docs[0];
    await doc.ref.update({
      status: resultCode === 0 ? "success" : "failed",
      resultCode,
      transId,
      momoResponse: cb,
      updatedAt: new Date(),
    });

    return {
      success: resultCode === 0,
      message: resultCode === 0 ? "Payment successful" : message,
      orderId: doc.data().orderId,
      requestId,
      amount: parseInt(amount),
      transId,
    };
  } catch (err) {
    console.error("MoMo callback verification error:", err);
    throw new Error("Failed to verify MoMo callback");
  }
};

// ---- Lookup helpers ----

export const getTransactionByOrderId = async (orderId) => {
  try {
    const snap = await db
      .collection("transactions")
      .where("orderId", "==", orderId)
      .orderBy("createdAt", "desc")
      .limit(1)
      .get();

    if (snap.empty) return null;
    const d = snap.docs[0];
    return { id: d.id, ...d.data() };
  } catch (err) {
    console.error("Get transaction error:", err);
    return null;
  }
};

export const getTransactionByRef = async (txnRef, paymentMethod) => {
  try {
    const field = paymentMethod === "vnpay" ? "txnRef" : "requestId";
    const snap = await db
      .collection("transactions")
      .where(field, "==", txnRef)
      .limit(1)
      .get();

    if (snap.empty) return null;
    const d = snap.docs[0];
    return { id: d.id, ...d.data() };
  } catch (err) {
    console.error("Get transaction by ref error:", err);
    return null;
  }
};
