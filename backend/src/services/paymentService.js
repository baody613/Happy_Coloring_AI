import crypto from "crypto";
import axios from "axios";
import querystring from "querystring";
import { db } from "../config/firebase.js";

/**
 * Payment Service - Handle VNPay and MoMo integrations
 */

// ===== VNPay Configuration =====
const vnpayConfig = {
  vnp_TmnCode: process.env.VNPAY_TMN_CODE,
  vnp_HashSecret: process.env.VNPAY_HASH_SECRET,
  vnp_Url:
    process.env.VNPAY_URL ||
    "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html",
  vnp_ReturnUrl:
    process.env.VNPAY_RETURN_URL ||
    `${process.env.FRONTEND_URL}/payment/vnpay/callback`,
};

// ===== MoMo Configuration =====
const momoConfig = {
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

/**
 * Sort object keys alphabetically
 */
const sortObject = (obj) => {
  const sorted = {};
  const keys = Object.keys(obj).sort();
  keys.forEach((key) => {
    sorted[key] = obj[key];
  });
  return sorted;
};

/**
 * Create VNPay payment URL
 */
export const createVNPayPayment = async (orderData) => {
  try {
    const { orderId, amount, orderInfo, ipAddr } = orderData;

    // Create date
    const date = new Date();
    const createDate = date
      .toISOString()
      .replace(/[-:TZ.]/g, "")
      .substring(0, 14);

    // Transaction ref
    const txnRef = `${orderId}_${Date.now()}`;

    // VNPay parameters
    let vnp_Params = {
      vnp_Version: "2.1.0",
      vnp_Command: "pay",
      vnp_TmnCode: vnpayConfig.vnp_TmnCode,
      vnp_Locale: "vn",
      vnp_CurrCode: "VND",
      vnp_TxnRef: txnRef,
      vnp_OrderInfo: orderInfo || `Thanh toan don hang ${orderId}`,
      vnp_OrderType: "other",
      vnp_Amount: amount * 100, // VNPay requires amount * 100
      vnp_ReturnUrl: vnpayConfig.vnp_ReturnUrl,
      vnp_IpAddr: ipAddr || "127.0.0.1",
      vnp_CreateDate: createDate,
    };

    // Sort parameters
    vnp_Params = sortObject(vnp_Params);

    // Create signature
    const signData = querystring.stringify(vnp_Params, { encode: false });
    const hmac = crypto.createHmac("sha512", vnpayConfig.vnp_HashSecret);
    const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");
    vnp_Params["vnp_SecureHash"] = signed;

    // Create payment URL
    const paymentUrl =
      vnpayConfig.vnp_Url +
      "?" +
      querystring.stringify(vnp_Params, { encode: false });

    // Save transaction to database
    await db.collection("transactions").add({
      orderId,
      txnRef,
      amount,
      paymentMethod: "vnpay",
      status: "pending",
      createdAt: new Date(),
      vnpayParams: vnp_Params,
    });

    return {
      success: true,
      paymentUrl,
      txnRef,
    };
  } catch (error) {
    console.error("VNPay payment creation error:", error);
    throw new Error("Failed to create VNPay payment");
  }
};

/**
 * Verify VNPay callback
 */
export const verifyVNPayCallback = async (vnp_Params) => {
  try {
    const secureHash = vnp_Params["vnp_SecureHash"];
    delete vnp_Params["vnp_SecureHash"];
    delete vnp_Params["vnp_SecureHashType"];

    // Sort parameters
    const sortedParams = sortObject(vnp_Params);

    // Create signature
    const signData = querystring.stringify(sortedParams, { encode: false });
    const hmac = crypto.createHmac("sha512", vnpayConfig.vnp_HashSecret);
    const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

    // Verify signature
    if (secureHash !== signed) {
      return {
        success: false,
        message: "Invalid signature",
      };
    }

    // Check response code
    const responseCode = vnp_Params["vnp_ResponseCode"];
    const txnRef = vnp_Params["vnp_TxnRef"];
    const amount = vnp_Params["vnp_Amount"] / 100;

    // Update transaction in database
    const transactionQuery = await db
      .collection("transactions")
      .where("txnRef", "==", txnRef)
      .limit(1)
      .get();

    if (transactionQuery.empty) {
      return {
        success: false,
        message: "Transaction not found",
      };
    }

    const transactionDoc = transactionQuery.docs[0];
    const transactionData = transactionDoc.data();

    // Update transaction status
    await transactionDoc.ref.update({
      status: responseCode === "00" ? "success" : "failed",
      responseCode,
      vnpayResponse: vnp_Params,
      updatedAt: new Date(),
    });

    return {
      success: responseCode === "00",
      message: responseCode === "00" ? "Payment successful" : "Payment failed",
      orderId: transactionData.orderId,
      txnRef,
      amount,
      responseCode,
    };
  } catch (error) {
    console.error("VNPay callback verification error:", error);
    throw new Error("Failed to verify VNPay callback");
  }
};

/**
 * Create MoMo payment
 */
export const createMoMoPayment = async (orderData) => {
  try {
    const { orderId, amount, orderInfo } = orderData;

    const requestId = `${orderId}_${Date.now()}`;
    const requestType = "captureWallet";
    const extraData = "";

    // Create raw signature
    const rawSignature = `accessKey=${momoConfig.accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${momoConfig.ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${momoConfig.partnerCode}&redirectUrl=${momoConfig.redirectUrl}&requestId=${requestId}&requestType=${requestType}`;

    // Create signature
    const signature = crypto
      .createHmac("sha256", momoConfig.secretKey)
      .update(rawSignature)
      .digest("hex");

    // Request body
    const requestBody = {
      partnerCode: momoConfig.partnerCode,
      accessKey: momoConfig.accessKey,
      requestId,
      amount: amount.toString(),
      orderId,
      orderInfo: orderInfo || `Thanh toan don hang ${orderId}`,
      redirectUrl: momoConfig.redirectUrl,
      ipnUrl: momoConfig.ipnUrl,
      extraData,
      requestType,
      signature,
      lang: "vi",
    };

    // Call MoMo API
    const response = await axios.post(momoConfig.endpoint, requestBody, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    const { resultCode, payUrl, message } = response.data;

    if (resultCode !== 0) {
      throw new Error(message || "MoMo payment creation failed");
    }

    // Save transaction to database
    await db.collection("transactions").add({
      orderId,
      requestId,
      amount,
      paymentMethod: "momo",
      status: "pending",
      createdAt: new Date(),
      momoParams: requestBody,
    });

    return {
      success: true,
      paymentUrl: payUrl,
      requestId,
    };
  } catch (error) {
    console.error("MoMo payment creation error:", error);
    throw new Error(error.message || "Failed to create MoMo payment");
  }
};

/**
 * Verify MoMo callback/IPN
 */
export const verifyMoMoCallback = async (callbackData) => {
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
    } = callbackData;

    // Create raw signature
    const rawSignature = `accessKey=${momoConfig.accessKey}&amount=${amount}&extraData=${extraData}&message=${message}&orderId=${orderId}&orderInfo=${orderInfo}&orderType=${orderType}&partnerCode=${partnerCode}&payType=${payType}&requestId=${requestId}&responseTime=${responseTime}&resultCode=${resultCode}&transId=${transId}`;

    // Verify signature
    const expectedSignature = crypto
      .createHmac("sha256", momoConfig.secretKey)
      .update(rawSignature)
      .digest("hex");

    if (signature !== expectedSignature) {
      return {
        success: false,
        message: "Invalid signature",
      };
    }

    // Update transaction in database
    const transactionQuery = await db
      .collection("transactions")
      .where("requestId", "==", requestId)
      .limit(1)
      .get();

    if (transactionQuery.empty) {
      return {
        success: false,
        message: "Transaction not found",
      };
    }

    const transactionDoc = transactionQuery.docs[0];
    const transactionData = transactionDoc.data();

    // Update transaction status
    await transactionDoc.ref.update({
      status: resultCode === 0 ? "success" : "failed",
      resultCode,
      transId,
      momoResponse: callbackData,
      updatedAt: new Date(),
    });

    return {
      success: resultCode === 0,
      message: resultCode === 0 ? "Payment successful" : message,
      orderId: transactionData.orderId,
      requestId,
      amount: parseInt(amount),
      transId,
    };
  } catch (error) {
    console.error("MoMo callback verification error:", error);
    throw new Error("Failed to verify MoMo callback");
  }
};

/**
 * Get transaction by order ID
 */
export const getTransactionByOrderId = async (orderId) => {
  try {
    const transactionQuery = await db
      .collection("transactions")
      .where("orderId", "==", orderId)
      .orderBy("createdAt", "desc")
      .limit(1)
      .get();

    if (transactionQuery.empty) {
      return null;
    }

    const doc = transactionQuery.docs[0];
    return { id: doc.id, ...doc.data() };
  } catch (error) {
    console.error("Get transaction error:", error);
    return null;
  }
};

/**
 * Get transaction by transaction reference
 */
export const getTransactionByRef = async (txnRef, paymentMethod) => {
  try {
    const field = paymentMethod === "vnpay" ? "txnRef" : "requestId";

    const transactionQuery = await db
      .collection("transactions")
      .where(field, "==", txnRef)
      .limit(1)
      .get();

    if (transactionQuery.empty) {
      return null;
    }

    const doc = transactionQuery.docs[0];
    return { id: doc.id, ...doc.data() };
  } catch (error) {
    console.error("Get transaction by ref error:", error);
    return null;
  }
};
