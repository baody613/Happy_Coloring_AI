import api from "./api";

interface CreatePaymentParams {
  orderId: string;
  paymentMethod: string;
}

interface CreatePaymentResponse {
  success: boolean;
  data?: {
    paymentUrl: string;
  };
}

export async function createPayment(
  params: CreatePaymentParams,
): Promise<CreatePaymentResponse> {
  const response = await api.post<CreatePaymentResponse>(
    "/payment/create",
    params,
  );
  return response.data;
}
