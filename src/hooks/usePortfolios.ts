import { useState, useEffect, useCallback, useRef } from "react";
import { portfolioService } from "@/services/portfolioService";
import {
  PortfolioDetail,
  Developer,
  detailToDeveloper,
  JobCategory,
  CATEGORY_TO_BACKEND,
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

  // Cache for category-based results
  const cacheRef = useRef<Map<string, PortfolioDetail[]>>(new Map());

  const fetchPortfolios = useCallback(
    async (cat: string = category, page: number = 0) => {
      setLoading(true);
      setError(null);

      try {
        let response;
        
        if (cat === "All") {
          response = await portfolioService.listAll(page, pageSize);
        } else {
          response = await portfolioService.list(cat, page, pageSize);
        }

        const newPortfolios = response.content;

        if (page === 0) {
          setPortfolios(newPortfolios);
          cacheRef.current.set(cat, newPortfolios);
        } else {
          setPortfolios((prev) => {
            const merged = [...prev, ...newPortfolios];
            // Deduplicate by ID
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
        console.error("usePortfolios error:", err);
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
      // Check cache first
      const cached = cacheRef.current.get(category);
      if (cached && cached.length > 0) {
        setPortfolios(cached);
      } else {
        fetchPortfolios(category, 0);
      }
    }
  }, [category, autoFetch, fetchPortfolios]);

  // Transform portfolios to developers for UI
  const developers: Developer[] = portfolios.map((p) => {
    const dev = detailToDeveloper(p);
    // Ensure category is set correctly
    dev.category = BACKEND_TO_CATEGORY[p.jobCategory] || "Other";
    return dev;
  });

  // Get developers filtered by frontend category name
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
 */
export function usePortfolioRails() {
  const [rails, setRails] = useState<Record<string, Developer[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRails = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch featured/elite and each main category in parallel
      const [featured, developers, designers, producers] = await Promise.all([
        portfolioService.getFeatured(6),
        portfolioService.getByCategory(JobCategory.DEVELOPMENT, 0, 10),
        portfolioService.getByCategory(JobCategory.DESIGN, 0, 10),
        portfolioService.getByCategory(JobCategory.PRODUCT_MANAGEMENT, 0, 10),
      ]);

      setRails({
        "Elite Operatives": featured.map(detailToDeveloper),
        "Engineering Division": developers.content.map(detailToDeveloper),
        "Visual Arts Corps": designers.content.map(detailToDeveloper),
        "System Architects": producers.content.map(detailToDeveloper),
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to fetch portfolio rails";
      setError(message);
      console.error("usePortfolioRails error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRails();
  }, [fetchRails]);

  return { rails, loading, error, refresh: fetchRails };
}

export default usePortfolios;
