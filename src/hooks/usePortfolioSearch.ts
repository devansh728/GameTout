import { useState, useEffect, useCallback, useRef } from "react";
import { portfolioService } from "@/services/portfolioService";
import {
  PortfolioCard,
  Developer,
  toDevelo,
  STATUS_DISPLAY,
} from "@/types/portfolio";

interface UsePortfolioSearchOptions {
  debounceMs?: number;
  minChars?: number;
  pageSize?: number;
}

interface UsePortfolioSearchReturn {
  results: Developer[];
  portfolioCards: PortfolioCard[];
  loading: boolean;
  error: string | null;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  hasMore: boolean;
  currentPage: number;
  totalResults: number;
  loadMore: () => Promise<void>;
  clear: () => void;
  isSearching: boolean;
}

/**
 * Hook for searching portfolios with debounce
 * Automatically triggers search when query changes
 */
export function usePortfolioSearch(
  options: UsePortfolioSearchOptions = {}
): UsePortfolioSearchReturn {
  const { debounceMs = 300, minChars = 2, pageSize = 20 } = options;

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [portfolioCards, setPortfolioCards] = useState<PortfolioCard[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalResults, setTotalResults] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // Ref for abort controller
  const abortControllerRef = useRef<AbortController | null>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Debounce the search query
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (searchQuery.length < minChars) {
      setDebouncedQuery("");
      setPortfolioCards([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    debounceTimerRef.current = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, debounceMs);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [searchQuery, debounceMs, minChars]);

  // Perform search when debounced query changes
  const performSearch = useCallback(
    async (query: string, page: number = 0) => {
      if (!query || query.length < minChars) {
        setPortfolioCards([]);
        setIsSearching(false);
        return;
      }

      // Cancel previous request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();

      setLoading(true);
      setError(null);

      try {
        const response = await portfolioService.search(query, page, pageSize);

        if (page === 0) {
          setPortfolioCards(response.content);
        } else {
          setPortfolioCards((prev) => [...prev, ...response.content]);
        }

        setCurrentPage(response.number);
        setTotalResults(response.totalElements);
        setHasMore(!response.last);
      } catch (err) {
        // Ignore abort errors
        if (err instanceof Error && err.name === "AbortError") {
          return;
        }

        // Handle rate limit (429)
        if (err && typeof err === "object" && "response" in err) {
          const response = (err as { response?: { status?: number } }).response;
          if (response?.status === 429) {
            setError("Search rate limited. Please wait a moment.");
            return;
          }
        }

        const message =
          err instanceof Error ? err.message : "Search failed";
        setError(message);
      } finally {
        setLoading(false);
        setIsSearching(false);
      }
    },
    [minChars, pageSize]
  );

  // Trigger search on debounced query change
  useEffect(() => {
    if (debouncedQuery) {
      performSearch(debouncedQuery, 0);
    }
  }, [debouncedQuery, performSearch]);

  const loadMore = useCallback(async () => {
    if (!hasMore || loading || !debouncedQuery) return;
    await performSearch(debouncedQuery, currentPage + 1);
  }, [performSearch, debouncedQuery, currentPage, hasMore, loading]);

  const clear = useCallback(() => {
    setSearchQuery("");
    setDebouncedQuery("");
    setPortfolioCards([]);
    setCurrentPage(0);
    setTotalResults(0);
    setHasMore(false);
    setError(null);
    setIsSearching(false);
  }, []);

  // Transform to Developer format for UI compatibility
  const results: Developer[] = portfolioCards.map((card) => toDevelo(card));

  return {
    results,
    portfolioCards,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    hasMore,
    currentPage,
    totalResults,
    loadMore,
    clear,
    isSearching,
  };
}

export default usePortfolioSearch;
