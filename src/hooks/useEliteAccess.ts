import { useState, useCallback, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { subscriptionService, EliteAccessStatus } from "@/services/subscriptionService";

export type AccessTier = "guest" | "authenticated" | "elite";
export type SubscriptionPlan = "viewer" | "creator";

interface UseEliteAccessOptions {
  /** Enable demo mode (localStorage-based) - default: false for real backend usage */
  demoMode?: boolean;
}

interface UseEliteAccessReturn {
  /** Current user's access tier */
  accessTier: AccessTier;
  /** Whether user is logged in */
  isAuthenticated: boolean;
  /** Whether user has Elite access (paid viewer or premium profile owner) */
  isElite: boolean;
  /** Whether user has a premium profile (paid to list) */
  isPremiumCreator: boolean;
  /** Check if user can view full profile details */
  canViewFullProfile: (profileOwnerId?: number) => boolean;
  /** Upgrade to Elite access - opens payment flow if not in demo mode */
  upgradeToElite: (plan: SubscriptionPlan) => Promise<void>;
  /** Check if specific content is accessible */
  canAccess: (content: "skills" | "bio" | "stats" | "contact" | "resume") => boolean;
  /** Loading state for upgrade process */
  isUpgrading: boolean;
  /** Loading state for initial fetch */
  isLoading: boolean;
  /** Elite status details from backend */
  eliteStatus: EliteAccessStatus | null;
  /** Days remaining in subscription */
  daysRemaining: number;
  /** Whether subscription is expiring soon */
  isExpiringSoon: boolean;
  /** Refresh elite status from backend */
  refreshStatus: () => Promise<void>;
  /** Error state */
  error: string | null;
}

// Demo mode storage key
const DEMO_ELITE_KEY = "elite_access_demo";

/**
 * Hook for managing Elite access control
 * 
 * Supports both Demo Mode (localStorage) and Real Mode (backend APIs)
 * 
 * Access Tiers:
 * - guest: Not logged in - can see basic card info only
 * - authenticated: Logged in but no Elite access - sees limited profile info
 * - elite: Has Elite access (paid viewer OR premium creator) - sees everything
 * 
 * Premium Creators automatically get Elite Viewer access
 * 
 * @param options.demoMode - If true, uses localStorage. If false, only uses backend API.
 */
export function useEliteAccess(options: UseEliteAccessOptions = {}): UseEliteAccessReturn {
  const { demoMode = false } = options;
  const { user, dbUser, isAuthenticated } = useAuth();
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Backend elite status
  const [eliteStatus, setEliteStatus] = useState<EliteAccessStatus | null>(null);
  
  // Demo mode fallback (localStorage based)
  const [localEliteStatus, setLocalEliteStatus] = useState<{
    isViewer: boolean;
    isCreator: boolean;
  }>(() => {
    if (typeof window === "undefined") return { isViewer: false, isCreator: false };
    const stored = localStorage.getItem(DEMO_ELITE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return { isViewer: false, isCreator: false };
      }
    }
    return { isViewer: false, isCreator: false };
  });

  // Fetch elite status from backend when user is authenticated
  const fetchEliteStatus = useCallback(async () => {
    if (!isAuthenticated) {
      setEliteStatus(null);
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const status = await subscriptionService.getEliteStatus();
      setEliteStatus(status);
      console.log("[Elite Access] Status fetched from backend:", status);
    } catch (err) {
      // If backend fails, fall back to demo mode silently
      console.warn("[Elite Access] Backend unavailable, using demo mode:", err);
      setEliteStatus(null);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Fetch status on mount and when user changes
  useEffect(() => {
    if (isAuthenticated) {
      fetchEliteStatus();
    } else {
      setEliteStatus(null);
    }
  }, [isAuthenticated, fetchEliteStatus]);

  // Check if user is Premium from backend (dbUser.role === "PREMIUM" or "ADMIN")
  const isPremiumFromBackend = dbUser?.role === "PREMIUM" || dbUser?.role === "ADMIN";

  // Determine elite status from backend or fallback to demo mode
  const hasBackendElite = eliteStatus?.hasEliteAccess ?? false;
  // Only use localStorage (demo mode) if demoMode is explicitly enabled
  const hasDemoElite = demoMode && (localEliteStatus.isViewer || localEliteStatus.isCreator);
  
  // User has Elite access if backend says so OR (demo mode enabled AND demo says so)
  const isElite = isPremiumFromBackend || hasBackendElite || hasDemoElite;

  // Check if user is a premium creator
  const isPremiumCreator = 
    eliteStatus?.subscriptionType === "CREATOR" || 
    (demoMode && localEliteStatus.isCreator) || 
    dbUser?.role === "PREMIUM";

  // Days remaining and expiring soon
  const daysRemaining = eliteStatus?.daysRemaining ?? 0;
  const isExpiringSoon = eliteStatus?.isExpiringSoon ?? false;

  // Determine access tier
  const accessTier: AccessTier = !isAuthenticated 
    ? "guest" 
    : isElite 
      ? "elite" 
      : "authenticated";

  /**
   * Check if user can view full profile details for a specific profile
   * @param profileOwnerId - The ID of the profile owner (optional)
   * @returns true if user can view full details
   */
  const canViewFullProfile = useCallback((profileOwnerId?: number): boolean => {
    // Elite users can view everything
    if (isElite) return true;

    // Users can always view their own profile
    if (profileOwnerId && dbUser?.id === profileOwnerId) return true;

    // Everyone else has restricted access
    return false;
  }, [isElite, dbUser?.id]);

  /**
   * Check if user can access specific content type
   * @param content - The type of content to check
   * @returns true if content is accessible
   */
  const canAccess = useCallback((content: "skills" | "bio" | "stats" | "contact" | "resume"): boolean => {
    // Guests can only see avatar, name, role, location, linkedin
    if (!isAuthenticated) return false;

    // Elite users can access everything
    if (isElite) return true;

    // Authenticated users have limited access
    // They can see basic skills but not detailed stats/contact
    if (content === "skills") return false; // Show blurred
    if (content === "bio") return false; // Show blurred
    if (content === "stats") return false; // Show blurred
    if (content === "contact") return false; // Show blurred
    if (content === "resume") return false; // Hide completely

    return false;
  }, [isAuthenticated, isElite]);

  /**
   * Upgrade to Elite access
   * This is a demo-only function - real payment flow is handled by PricingModal
   * After successful payment, call refreshStatus() to update the hook state
   */
  const upgradeToElite = useCallback(async (plan: SubscriptionPlan): Promise<void> => {
    setIsUpgrading(true);
    setError(null);

    try {
      // Demo mode: Update localStorage immediately
      // Real mode: This would be called after Razorpay payment success
      const newStatus = {
        isViewer: plan === "viewer" || plan === "creator",
        isCreator: plan === "creator",
      };

      setLocalEliteStatus(newStatus);
      localStorage.setItem(DEMO_ELITE_KEY, JSON.stringify(newStatus));
      
      console.log(`[Elite Access] Demo upgrade to ${plan} plan`);
      
      // Also refresh from backend in case payment was processed there
      await fetchEliteStatus();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Upgrade failed";
      setError(message);
      console.error("[Elite Access] Upgrade failed:", err);
      throw err;
    } finally {
      setIsUpgrading(false);
    }
  }, [fetchEliteStatus]);

  return {
    accessTier,
    isAuthenticated,
    isElite,
    isPremiumCreator,
    canViewFullProfile,
    canAccess,
    upgradeToElite,
    isUpgrading,
    isLoading,
    eliteStatus,
    daysRemaining,
    isExpiringSoon,
    refreshStatus: fetchEliteStatus,
    error,
  };
}

export default useEliteAccess;
