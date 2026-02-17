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

  // Cache for category-based results
  const cacheRef = useRef<Map<string, PortfolioDetail[]>>(new Map());
  // Track if we've loaded all data for "All" category
  const allDataLoaded = useRef(false);
  const allPortfolios = useRef<PortfolioDetail[]>([]);

  const fetchPortfolios = useCallback(
    async (cat: string = category, page: number = 0) => {
      setLoading(true);
      setError(null);

      try {
        // For "All" category with cached data
        if (cat === "All" && allDataLoaded.current) {
          const start = page * pageSize;
          const end = start + pageSize;
          const paginated = allPortfolios.current.slice(start, end);
          
          setPortfolios(paginated);
          setCurrentPage(page);
          setTotalElements(allPortfolios.current.length);
          setTotalPages(Math.ceil(allPortfolios.current.length / pageSize));
          setHasMore(end < allPortfolios.current.length);
          setLoading(false);
          return;
        }

        const response = await portfolioService.list(cat, page, pageSize);
        const newPortfolios = response.content;

        // If this is "All" category and first page, store for potential full load
        if (cat === "All" && page === 0) {
          allPortfolios.current = newPortfolios;
          
          // If total elements is less than what we might need for full cache,
          // we can consider all data loaded
          if (response.totalElements <= pageSize * 2) {
            allDataLoaded.current = true;
          }
        }

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
            
            // Update allPortfolios if this is "All" category
            if (cat === "All") {
              allPortfolios.current = unique;
            }
            
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

  // Load all pages for "All" category to build complete cache (optional)
  const loadAllPages = useCallback(async () => {
    if (allDataLoaded.current || category !== "All") return;
    
    let currentPageNum = 1;
    let hasMorePages = true;
    const tempPortfolios = [...allPortfolios.current];
    
    while (hasMorePages && currentPageNum < 5) { // Limit to 5 pages max to avoid too many requests
      try {
        const response = await portfolioService.list("All", currentPageNum, pageSize);
        tempPortfolios.push(...response.content);
        hasMorePages = !response.last;
        currentPageNum++;
      } catch (err) {
        break;
      }
    }
    
    // Remove duplicates
    const uniqueMap = new Map();
    tempPortfolios.forEach(p => uniqueMap.set(p.id, p));
    allPortfolios.current = Array.from(uniqueMap.values());
    allDataLoaded.current = true;
    
    // Update cache
    cacheRef.current.set("All", allPortfolios.current);
  }, [category, pageSize]);

  const loadMore = useCallback(async () => {
    if (!hasMore || loading) return;
    
    // For "All" category with full cache, serve from cache
    if (category === "All" && allDataLoaded.current) {
      const nextPage = currentPage + 1;
      const start = nextPage * pageSize;
      const end = start + pageSize;
      const nextPageContent = allPortfolios.current.slice(start, end);
      
      if (nextPageContent.length > 0) {
        setPortfolios(nextPageContent);
        setCurrentPage(nextPage);
        setHasMore(end < allPortfolios.current.length);
      }
      return;
    }
    
    // Otherwise fetch from API
    await fetchPortfolios(category, currentPage + 1);
  }, [fetchPortfolios, category, currentPage, hasMore, loading, pageSize]);

  const refresh = useCallback(async () => {
    // Clear all caches
    portfolioService.clearCache();
    cacheRef.current.clear();
    allDataLoaded.current = false;
    allPortfolios.current = [];
    await fetchPortfolios(category, 0);
  }, [fetchPortfolios, category]);

  // Auto-fetch on mount and category change
  useEffect(() => {
    if (autoFetch) {
      // Check cache first
      const cached = cacheRef.current.get(category);
      if (cached && cached.length > 0) {
        setPortfolios(cached);
        // Estimate pagination from cached data
        setTotalElements(cached.length);
        setTotalPages(Math.ceil(cached.length / pageSize));
        setHasMore(pageSize < cached.length);
      } else {
        fetchPortfolios(category, 0);
      }
    }
  }, [category, autoFetch, fetchPortfolios, pageSize]);

  // Preload next pages for "All" category in background (optional optimization)
  useEffect(() => {
    if (category === "All" && portfolios.length > 0 && !allDataLoaded.current && !loading) {
      const timer = setTimeout(() => {
        loadAllPages();
      }, 3000); // Wait 3 seconds after initial load
      return () => clearTimeout(timer);
    }
  }, [category, portfolios, loading, loadAllPages]);

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

export default usePortfolios;