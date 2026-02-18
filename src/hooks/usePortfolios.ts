import { useState, useEffect, useCallback, useRef } from "react";
import { portfolioService } from "@/services/portfolioService";
import {
  PortfolioDetail,
  Developer,
  detailToDeveloper,
  JobCategory,
  BACKEND_TO_CATEGORY,
} from "@/types/portfolio";

interface UsePortfoliosOptions {
  category?: string;
  initialPage?: number;
  pageSize?: number;
  autoFetch?: boolean;
}

interface UsePortfoliosReturn {
  developers: Developer[];
  portfolios: PortfolioDetail[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  currentPage: number;
  totalPages: number;
  totalElements: number;
  fetchPortfolios: (category?: string, page?: number) => Promise<void>;
  loadMore: () => Promise<void>;
  refresh: () => Promise<void>;
  getByCategory: (category: string) => Developer[];
}

/**
 * Hook for fetching and managing portfolio listings
 * Handles pagination, caching, and category filtering
 */
export function usePortfolios(options: UsePortfoliosOptions = {}): UsePortfoliosReturn {
  const {
    category = "All",
    initialPage = 0,
    pageSize = 20,
    autoFetch = true,
  } = options;

  const [portfolios, setPortfolios] = useState<PortfolioDetail[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  // Simple cache - just store by category
  const cacheRef = useRef<Map<string, PortfolioDetail[]>>(new Map());

  const fetchPortfolios = useCallback(
    async (cat: string = category, page: number = 0) => {
      setLoading(true);
      setError(null);

      try {
        const response = await portfolioService.list(cat, page, pageSize);
        const newPortfolios = response.content;

        if (page === 0) {
          setPortfolios(newPortfolios);
          cacheRef.current.set(cat, newPortfolios);
        } else {
          setPortfolios((prev) => {
            const merged = [...prev, ...newPortfolios];
            const unique = Array.from(
              new Map(merged.map((p) => [p.id, p])).values()
            );
            cacheRef.current.set(cat, unique);
            return unique;
          });
        }

        setCurrentPage(response.number);
        setTotalPages(response.totalPages);
        setTotalElements(response.totalElements);
        setHasMore(!response.last);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to fetch portfolios";
        setError(message);
      } finally {
        setLoading(false);
      }
    },
    [category, pageSize]
  );

  const loadMore = useCallback(async () => {
    if (!hasMore || loading) return;
    await fetchPortfolios(category, currentPage + 1);
  }, [fetchPortfolios, category, currentPage, hasMore, loading]);

  const refresh = useCallback(async () => {
    cacheRef.current.clear();
    await fetchPortfolios(category, 0);
  }, [fetchPortfolios, category]);

  // Auto-fetch on mount and category change
  useEffect(() => {
    if (autoFetch) {
      const cached = cacheRef.current.get(category);
      if (cached && cached.length > 0) {
        setPortfolios(cached);
        // Estimate pagination from cached data (optional)
        setTotalElements(cached.length);
        setTotalPages(Math.ceil(cached.length / pageSize));
        setHasMore(pageSize < cached.length);
      } else {
        fetchPortfolios(category, 0);
      }
    }
  }, [category, autoFetch, fetchPortfolios, pageSize]);

  // Transform portfolios to developers for UI
  const developers: Developer[] = portfolios.map((p) => {
    const dev = detailToDeveloper(p);
    dev.category = BACKEND_TO_CATEGORY[p.jobCategory] || "Other";
    return dev;
  });

  const getByCategory = useCallback(
    (cat: string): Developer[] => {
      if (cat === "All") return developers;
      return developers.filter((d) => d.category === cat);
    },
    [developers]
  );

  return {
    developers,
    portfolios,
    loading,
    error,
    hasMore,
    currentPage,
    totalPages,
    totalElements,
    fetchPortfolios,
    loadMore,
    refresh,
    getByCategory,
  };
}

/**
 * Hook for fetching portfolios by multiple categories (for Netflix-style rails)
 * Updated to work with the new service
 */
export function usePortfolioRails() {
  const [rails, setRails] = useState<Record<string, Developer[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRails = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Use MAJOR_CATEGORIES from the service for consistency
      const MAJOR_CATEGORIES = [
        JobCategory.PROGRAMMER,
        JobCategory.ARTIST,
        JobCategory.DESIGNER,
        JobCategory.PRODUCT_MANAGER,
        JobCategory.PRODUCER,
      ];

      // Fetch main categories in parallel
      const requests = MAJOR_CATEGORIES.map(cat =>
        portfolioService.getByCategory(cat, 0, 8)
      );

      const responses = await Promise.all(requests);

      // Build rails dynamically from responses
      const newRails: Record<string, Developer[]> = {};

      // Featured rail (premium from all categories)
      const allContent = responses.flatMap(r => r.content);
      const premium = allContent.filter(p => p.isPremium);
      const nonPremium = allContent.filter(p => !p.isPremium);
      newRails["Elite Operatives"] = [...premium, ...nonPremium]
        .slice(0, 6)
        .map(detailToDeveloper);

      // Category rails
      const categoryNames = {
        [JobCategory.PROGRAMMER]: "Engineering Division",
        [JobCategory.ARTIST]: "Visual Arts Corps",
        [JobCategory.DESIGNER]: "Design Guild",
        [JobCategory.PRODUCT_MANAGER]: "Product Management",
        [JobCategory.PRODUCER]: "Production Unit",
      };

      responses.forEach((response, index) => {
        const category = MAJOR_CATEGORIES[index];
        const railName = categoryNames[category] || `${BACKEND_TO_CATEGORY[category]}s`;
        newRails[railName] = response.content.map(detailToDeveloper);
      });

      setRails(newRails);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to fetch portfolio rails";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRails();
  }, [fetchRails]);

  return { rails, loading, error, refresh: fetchRails };
}

// Default export for usePortfolios
export default usePortfolios;