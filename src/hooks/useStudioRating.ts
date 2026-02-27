import { useState, useCallback, useEffect } from "react";
import { studioService } from "@/services/studioService";
import { StudioRatingDTO, RatingStatsDTO } from "@/types/studio";
import { useAuth } from "@/context/AuthContext";

interface UseStudioRatingOptions {
  studioId: number;
  autoFetch?: boolean;
}

interface UseStudioRatingReturn {
  myRating: number | null;
  myRatingData: StudioRatingDTO | null;
  stats: RatingStatsDTO | null;
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;
  submitRating: (rating: number) => Promise<void>;
  refresh: () => Promise<void>;
  hasRated: boolean;
}

export function useStudioRating(options: UseStudioRatingOptions): UseStudioRatingReturn {
  const { studioId, autoFetch = true } = options;
  const { isAuthenticated } = useAuth();

  const [myRatingData, setMyRatingData] = useState<StudioRatingDTO | null>(null);
  const [stats, setStats] = useState<RatingStatsDTO | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRatingData = useCallback(async () => {
    if (!studioId) return;

    setIsLoading(true);
    setError(null);

    try {
      const [userRatingData, statsData] = await Promise.all([
        isAuthenticated ? studioService.getMyRating(studioId) : Promise.resolve(null),
        studioService.getRatingStats(studioId),
      ]);

      setMyRatingData(userRatingData);
      setStats(statsData);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to fetch rating data";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [studioId, isAuthenticated]);

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
      setMyRatingData(response);
      setStats({
        studioId: response.studioId,
        averageRating: response.averageRating,
        ratingCount: response.ratingCount,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to submit rating";
      setError(message);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  }, [studioId, isAuthenticated]);

  useEffect(() => {
    if (autoFetch && studioId) {
      fetchRatingData();
    }
  }, [autoFetch, studioId, fetchRatingData]);

  return {
    myRating: myRatingData?.userRating ?? null,  
    myRatingData,
    stats,
    isLoading,
    isSubmitting,
    error,
    submitRating,
    refresh: fetchRatingData,
    hasRated: myRatingData?.userRating != null,  
  };
}

export default useStudioRating;