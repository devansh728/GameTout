import { api } from "@/lib/api";

// ============================================
// TYPES
// ============================================

export interface PaymentOrderRequest {
  subscriptionType: "VIEWER" | "CREATOR";
}

export interface PaymentOrderResponse {
  orderId: string;
  amount: number;
  currency: string;
  keyId: string;
  subscriptionType: "VIEWER" | "CREATOR";
  userEmail: string;
  userName: string;
}

export interface PaymentVerifyRequest {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}

export interface PaymentVerifyResponse {
  success: boolean;
  subscriptionId?: number;
  message?: string;
  expiresAt?: string;
}

// ============================================
// PAYMENT SERVICE
// ============================================

/**
 * Payment Service for Razorpay integration
 * Handles order creation and payment verification
 */
export const paymentService = {
  /**
   * Create a new Razorpay order for subscription purchase
   * POST /api/payment/create-order
   */
  createOrder: async (request: PaymentOrderRequest): Promise<PaymentOrderResponse> => {
    const { data } = await api.post<PaymentOrderResponse>("/payment/create-order", request);
    return data;
  },

  /**
   * Verify payment after Razorpay checkout completion
   * POST /api/payment/verify
   */
  verifyPayment: async (request: PaymentVerifyRequest): Promise<PaymentVerifyResponse> => {
    const { data } = await api.post<PaymentVerifyResponse>("/payment/verify", request);
    return data;
  },
};

export default paymentService;
