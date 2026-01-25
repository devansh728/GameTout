/**
 * Razorpay TypeScript Declarations
 * 
 * Type definitions for Razorpay Checkout SDK
 * @see https://razorpay.com/docs/payments/payment-gateway/web-integration/standard/
 */

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

export interface RazorpayOptions {
  /** Razorpay Key ID */
  key: string;
  /** Amount in paise (e.g., 49900 for ₹499) */
  amount: number;
  /** Currency code (e.g., "INR") */
  currency: string;
  /** Display name shown in checkout */
  name: string;
  /** Description of the purchase */
  description?: string;
  /** Logo URL to display */
  image?: string;
  /** Razorpay Order ID from create-order API */
  order_id: string;
  /** Callback on successful payment */
  handler: (response: RazorpayPaymentResponse) => void;
  /** Prefill customer details */
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  /** Notes to attach to payment */
  notes?: Record<string, string>;
  /** Theme customization */
  theme?: {
    color?: string;
    backdrop_color?: string;
    hide_topbar?: boolean;
  };
  /** Modal configuration */
  modal?: {
    ondismiss?: () => void;
    escape?: boolean;
    confirm_close?: boolean;
    animation?: boolean;
    backdropclose?: boolean;
  };
  /** Retry configuration */
  retry?: {
    enabled?: boolean;
    max_count?: number;
  };
  /** Allowed payment methods */
  config?: {
    display?: {
      blocks?: Record<string, {
        name: string;
        instruments: Array<{
          method: string;
          issuers?: string[];
          types?: string[];
        }>;
      }>;
      sequence?: string[];
      preferences?: {
        show_default_blocks?: boolean;
      };
    };
  };
}

export interface RazorpayPaymentResponse {
  /** Razorpay Payment ID */
  razorpay_payment_id: string;
  /** Razorpay Order ID */
  razorpay_order_id: string;
  /** Payment signature for verification */
  razorpay_signature: string;
}

export interface RazorpayInstance {
  /** Open the checkout modal */
  open(): void;
  /** Close the checkout modal */
  close(): void;
  /** Add event listener */
  on(event: string, callback: (response: any) => void): void;
}

export interface RazorpayError {
  code: string;
  description: string;
  source: string;
  step: string;
  reason: string;
  metadata: {
    order_id: string;
    payment_id: string;
  };
}

export {};
