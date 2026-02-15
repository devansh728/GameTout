import { useState, useCallback, useRef, useEffect } from "react";
import { portfolioService } from "@/services/portfolioService";
import {
  PortfolioDetail,
  Developer,
  detailToDeveloper,
} from "@/types/portfolio";

interface UsePortfolioDetailReturn {
  portfolio: PortfolioDetail | null;
  developer: Developer | null;
  loading: boolean;
  error: string | null;
  fetchPortfolio: (id: number) => Promise<void>;
  like: () => Promise<void>;
  liking: boolean;
  liked: boolean;
  clear: () => void;
}

/**
 * Hook for fetching and managing a single portfolio detail
 * Includes like functionality with optimistic updates
 */
export function usePortfolioDetail(
  initialId?: number
): UsePortfolioDetailReturn {
  const [portfolio, setPortfolio] = useState<PortfolioDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [liking, setLiking] = useState(false);
  const [liked, setLiked] = useState(false);

  // Cache for portfolio details
  const cacheRef = useRef<Map<number, PortfolioDetail>>(new Map());

  const fetchPortfolio = useCallback(async (id: number) => {
    // Check cache first
    const cached = cacheRef.current.get(id);
    if (cached) {
      setPortfolio(cached);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await portfolioService.getById(id);
      setPortfolio(data);
      cacheRef.current.set(id, data);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to fetch portfolio";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Auto-fetch if initial ID provided
  useEffect(() => {
    if (initialId && initialId > 0) {
      fetchPortfolio(initialId);
    }
  }, [initialId, fetchPortfolio]);

  const like = useCallback(async () => {
    if (!portfolio || liking) return;

    setLiking(true);

    // Optimistic update
    const previousLikes = portfolio.likesCount;
    const wasLiked = liked;
    
    setLiked(!liked);
    setPortfolio((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        likesCount: wasLiked ? prev.likesCount - 1 : prev.likesCount + 1,
      };
    });

    try {
      await portfolioService.like(portfolio.id);
      
      // Update cache
      if (portfolio) {
        const updated = {
          ...portfolio,
          likesCount: wasLiked ? previousLikes - 1 : previousLikes + 1,
        };
        cacheRef.current.set(portfolio.id, updated);
      }
    } catch (err) {
      // Revert optimistic update on error
      setLiked(wasLiked);
      setPortfolio((prev) => {
        if (!prev) return prev;
        return { ...prev, likesCount: previousLikes };
      });
    } finally {
      setLiking(false);
    }
  }, [portfolio, liking, liked]);

  const clear = useCallback(() => {
    setPortfolio(null);
    setError(null);
    setLiked(false);
  }, []);

  // Transform to Developer for UI compatibility
  const developer: Developer | null = portfolio
    ? detailToDeveloper(portfolio)
    : null;

  return {
    portfolio,
    developer,
    loading,
    error,
    fetchPortfolio,
    like,
    liking,
    liked,
    clear,
  };
}

/**
 * Hook for managing portfolio creation/update
 */
export function usePortfolioMutation() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const createOrUpdate = useCallback(
    async (data: Parameters<typeof portfolioService.createOrUpdate>[0]) => {
      setLoading(true);
      setError(null);
      setSuccess(false);

      try {
        const result = await portfolioService.createOrUpdate(data);
        setSuccess(true);
        return result;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to save portfolio";
        setError(message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const reset = useCallback(() => {
    setError(null);
    setSuccess(false);
  }, []);

  return {
    createOrUpdate,
    loading,
    error,
    success,
    reset,
  };
}

export default usePortfolioDetail;
