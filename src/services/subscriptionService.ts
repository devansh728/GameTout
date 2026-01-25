import { api } from "@/lib/api";

// ============================================
// TYPES
// ============================================

export interface SubscriptionDTO {
  id: number;
  userId: number;
  type: "VIEWER" | "CREATOR";
  status: "ACTIVE" | "EXPIRED" | "CANCELLED";
  startDate: string;
  endDate: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EliteAccessStatus {
  hasEliteAccess: boolean;
  subscriptionType: "VIEWER" | "CREATOR" | null;
  expiresAt: string | null;
  daysRemaining: number;
  isExpiringSoon: boolean;
}

// ============================================
// SUBSCRIPTION SERVICE
// ============================================

/**
 * Subscription Service for Elite Access management
 * Handles subscription status and elite access checks
 */
export const subscriptionService = {
  /**
   * Get current user's subscription details
   * GET /api/subscription/my
   */
  getMySubscription: async (): Promise<SubscriptionDTO | null> => {
    try {
      const { data } = await api.get<SubscriptionDTO>("/subscription/my");
      return data;
    } catch (error: any) {
      // 404 means no subscription exists
      if (error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  },

  /**
   * Get current user's elite access status
   * GET /api/subscription/elite-status
   */
  getEliteStatus: async (): Promise<EliteAccessStatus> => {
    const { data } = await api.get<EliteAccessStatus>("/subscription/elite-status");
    return data;
  },

  /**
   * Check if user has elite access (quick check)
   * Returns cached status from the hook if available
   */
  hasEliteAccess: async (): Promise<boolean> => {
    try {
      const status = await subscriptionService.getEliteStatus();
      return status.hasEliteAccess;
    } catch {
      return false;
    }
  },
};

export default subscriptionService;
