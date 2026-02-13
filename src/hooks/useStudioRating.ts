import { useState, useCallback, useEffect } from "react";
import { studioService, StudioRatingDTO, RatingStatsDTO } from "@/services/studioService";
import { useAuth } from "@/context/AuthContext";

interface UseStudioRatingOptions {
  studioId: number;
  /** Auto-fetch rating on mount */
  autoFetch?: boolean;
}

interface UseStudioRatingReturn {
  /** User's current rating for this studio (null if not rated) */
  myRating: number | null;
  /** Full rating DTO from backend */
  myRatingData: StudioRatingDTO | null;
  /** Rating statistics for the studio */
  stats: RatingStatsDTO | null;
  /** Loading state for fetching */
  isLoading: boolean;
  /** Loading state for submitting */
  isSubmitting: boolean;
  /** Error message */
  error: string | null;
  /** Submit or update a rating */
  submitRating: (rating: number) => Promise<void>;
  /** Refresh rating data */
  refresh: () => Promise<void>;
  /** Whether user has already rated */
  hasRated: boolean;
}

/**
 * Hook for managing studio ratings
 * 
 * Features:
 * - Fetches user's rating and studio stats
 * - Allows submitting new or updating existing ratings
 * - Auto-updates stats after rating submission
 * 
 * @example
 * const { myRating, stats, submitRating, isSubmitting } = useStudioRating({ studioId: 123 });
 * 
 * // Submit a rating
 * await submitRating(4);
 */
export function useStudioRating(options: UseStudioRatingOptions): UseStudioRatingReturn {
  const { studioId, autoFetch = true } = options;
  const { isAuthenticated } = useAuth();

  const [myRatingData, setMyRatingData] = useState<StudioRatingDTO | null>(null);
  const [stats, setStats] = useState<RatingStatsDTO | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch user's rating and studio stats
   */
  const fetchRatingData = useCallback(async () => {
    if (!studioId) return;

    setIsLoading(true);
    setError(null);

    try {
      // Fetch both in parallel
      const [ratingData, statsData] = await Promise.all([
        isAuthenticated ? studioService.getMyRating(studioId) : Promise.resolve(null),
        studioService.getRatingStats(studioId),
      ]);

      setMyRatingData(ratingData);
      setStats(statsData);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to fetch rating data";
      setError(message);
      console.error("[useStudioRating] Fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  }, [studioId, isAuthenticated]);

  /**
   * Submit or update a rating
   */
  const submitRating = useCallback(async (rating: number): Promise<void> => {
    if (!isAuthenticated) {
      setError("Please sign in to rate studios");
      throw new Error("Not authenticated");
    }

    if (rating < 1 || rating > 5) {
      setError("Rating must be between 1 and 5");
      throw new Error("Invalid rating");
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await studioService.rateStudio(studioId, rating);
      
      // Update local state with new rating
      setMyRatingData(response.rating);
      
      // Update stats with new values from response
      setStats((prevStats) => ({
        ...prevStats!,
        studioId,
        averageRating: response.newAverageRating,
        ratingCount: response.newRatingCount,
      }));

      console.log("[useStudioRating] Rating submitted:", rating, "New avg:", response.newAverageRating);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to submit rating";
      setError(message);
      console.error("[useStudioRating] Submit error:", err);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  }, [studioId, isAuthenticated]);

  // Auto-fetch on mount
  useEffect(() => {
    if (autoFetch && studioId) {
      fetchRatingData();
    }
  }, [autoFetch, studioId, fetchRatingData]);

  return {
    myRating: myRatingData?.rating ?? null,
    myRatingData,
    stats,
    isLoading,
    isSubmitting,
    error,
    submitRating,
    refresh: fetchRatingData,
    hasRated: myRatingData !== null,
  };
}

export default useStudioRating;
