import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface CreatePaymentRequest {
  orderId: string;
  paymentMethod: "vnpay" | "momo" | "cod";
  ipAddr?: string;
}

export interface CreatePaymentResponse {
  success: boolean;
  data?: {
    paymentUrl?: string;
    txnRef?: string;
    paymentMethod: string;
    message?: string;
  };
  message?: string;
}

export interface TransactionResponse {
  success: boolean;
  data?: {
    id: string;
    orderId: string;
    amount: number;
    paymentMethod: string;
    status: string;
    txnRef?: string;
    requestId?: string;
    createdAt: any;
    updatedAt?: any;
  };
  message?: string;
}

export interface PaymentVerifyResponse {
  success: boolean;
  data?: {
    orderId: string;
    orderStatus: string;
    paymentStatus: string;
    paymentMethod?: string;
    transactionId?: string;
    paidAt?: any;
    transaction?: any;
  };
  message?: string;
}

/**
 * Create payment URL for VNPay or MoMo
 */
export const createPayment = async (
  data: CreatePaymentRequest,
  token: string
): Promise<CreatePaymentResponse> => {
  try {
    const response = await axios.post(`${API_URL}/payment/create`, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    console.error("Create payment error:", error);
    throw error.response?.data || error;
  }
};

/**
 * Get transaction details by order ID
 */
export const getTransaction = async (
  orderId: string,
  token: string
): Promise<TransactionResponse> => {
  try {
    const response = await axios.get(
      `${API_URL}/payment/transaction/${orderId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    console.error("Get transaction error:", error);
    throw error.response?.data || error;
  }
};

/**
 * Verify payment status of an order
 */
export const verifyPayment = async (
  orderId: string,
  token: string
): Promise<PaymentVerifyResponse> => {
  try {
    const response = await axios.get(`${API_URL}/payment/verify/${orderId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    console.error("Verify payment error:", error);
    throw error.response?.data || error;
  }
};
