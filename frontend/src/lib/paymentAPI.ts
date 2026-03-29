import api from "./api";

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
  data: CreatePaymentRequest
): Promise<CreatePaymentResponse> => {
  try {
    const response = await api.post("/payment/create", data);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
};

/**
 * Get transaction details by order ID
 */
export const getTransaction = async (
  orderId: string
): Promise<TransactionResponse> => {
  try {
    const response = await api.get(`/payment/transaction/${orderId}`);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
};

/**
 * Verify payment status of an order
 */
export const verifyPayment = async (
  orderId: string
): Promise<PaymentVerifyResponse> => {
  try {
    const response = await api.get(`/payment/verify/${orderId}`);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
};
