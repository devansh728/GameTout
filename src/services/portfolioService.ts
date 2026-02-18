import { api } from "@/lib/api";
import {
  JobCategory,
  PortfolioCard,
  PortfolioDetail,
  PortfolioRequest,
  PortfolioListResponse,
  PortfolioSearchResponse,
  CATEGORY_TO_BACKEND,
  BACKEND_TO_CATEGORY
} from "@/types/portfolio";

/**
 * Portfolio API Service
 * Centralized API calls for portfolio operations
 */
export const portfolioService = {
  /**
   * List portfolios by category with pagination
   * GET /api/portfolio/list
   *
   * @param category - Job category filter (or "All" for default)
   * @param page - Page number (0-indexed)
   * @param size - Items per page
   */

  _cache: {
    all: new Map<number, PortfolioDetail[]>(),
    byCategory: new Map<string, Map<number, PortfolioDetail[]>>(),
    totalElements: null as number | null,
  },

  list: async (
    category: string = "ALL",
    page: number = 0,
    size: number = 20,
  ): Promise<PortfolioListResponse> => {
    const params = new URLSearchParams();

    // If "ALL" or "All", fetch from multiple categories in parallel
    if (category === "ALL" || category === "All") {
      return portfolioService.listAll(page, size);
    }

    // Single category fetch
    const backendCategory = CATEGORY_TO_BACKEND[category] || JobCategory.OTHER;
    params.append("category", backendCategory);
    params.append("page", page.toString());
    params.append("size", size.toString());

    const { data } = await api.get<PortfolioListResponse>(
      `/portfolio/list?${params.toString()}`,
    );
    return data;
  },

  /**
   * Optimized "All" categories fetch
   * Fetches from main categories in parallel with smaller page sizes
   */
  listAll: async (page: number = 0, size: number = 20): Promise<PortfolioListResponse> => {
    const { data } = await api.get<PortfolioListResponse>(`/portfolio/list/all?page=${page}&size=${size}`);
    return data;
  },


  /**
   * Clear cache (useful after mutations)
   */
  clearCache: () => {
    portfolioService._cache.all.clear();
    portfolioService._cache.byCategory.clear();
    portfolioService._cache.totalElements = null;
  },

  /**
   * List all portfolios (for "All" category - multiple requests)
   * Fetches from multiple categories and merges results
   */
  // listAll: async (
  //   page: number = 0,
  //   size: number = 20,
  // ): Promise<PortfolioListResponse> => {
  //   // Fetch from main categories in parallel
  //   const categories = [
  //     JobCategory.DEVELOPMENT,
  //     JobCategory.DESIGN,
  //     JobCategory.PRODUCT_MANAGEMENT,
  //   ];

  //   const requests = categories.map((cat) =>
  //     api.get<PortfolioListResponse>(
  //       `/portfolio/list?category=${cat}&page=${page}&size=${Math.ceil(size / categories.length)}`,
  //     ),
  //   );

  //   try {
  //     const responses = await Promise.all(requests);

  //     // Merge and deduplicate results
  //     const allContent = responses.flatMap((r) => r.data.content);
  //     const uniqueContent = Array.from(
  //       new Map(allContent.map((item) => [item.id, item])).values(),
  //     );

  //     // Sort: premium first, then by likes
  //     uniqueContent.sort((a, b) => {
  //       if (a.isPremium !== b.isPremium) return a.isPremium ? -1 : 1;
  //       return (b.likesCount || 0) - (a.likesCount || 0);
  //     });

  //     return {
  //       content: uniqueContent.slice(0, size),
  //       totalElements: uniqueContent.length,
  //       totalPages: 1,
  //       size: size,
  //       number: page,
  //       first: page === 0,
  //       last: true,
  //       empty: uniqueContent.length === 0,
  //     };
  //   } catch (error) {
  //     throw error;
  //   }
  // },

  /**
   * Search portfolios by query
   * GET /api/search/portfolio
   *
   * @param query - Search query (min 2 chars)
   * @param page - Page number
   * @param size - Items per page
   */
  search: async (
    query: string,
    page: number = 0,
    size: number = 20,
  ): Promise<PortfolioSearchResponse> => {
    if (!query || query.length < 2) {
      return {
        content: [],
        totalElements: 0,
        totalPages: 0,
        size,
        number: page,
        first: true,
        last: true,
        empty: true,
      };
    }

    const params = new URLSearchParams();
    params.append("q", query.trim());
    params.append("page", page.toString());
    params.append("size", size.toString());

    const { data } = await api.get<PortfolioSearchResponse>(
      `/search/portfolio?${params.toString()}`,
    );
    return data;
  },

  /**
   * Get portfolio details by ID
   * GET /api/search/portfolio/{id}
   */
  getById: async (id: number): Promise<PortfolioDetail> => {
    const { data } = await api.get<PortfolioDetail>(`/search/portfolio/${id}`);
    return data;
  },

  /**
   * Create or update portfolio (requires authentication)
   * POST /api/portfolio
   */
  createOrUpdate: async (
    request: PortfolioRequest,
  ): Promise<PortfolioDetail> => {
    const { data } = await api.post<PortfolioDetail>("/portfolio", request);
    return data;
  },

  /**
   * Like or unlike a portfolio (toggle)
   * POST /api/portfolio/{id}/like
   */
  like: async (id: number): Promise<void> => {
    await api.post(`/portfolio/${id}/like`);
  },

  /**
   * Get total count of portfolios
   * GET /api/portfolio/count
   */
  getCount: async (): Promise<{ count: number }> => {
    const { data } = await api.get<{ count: number }>("/portfolio/count");
    return data;
  },

  /**
   * Get portfolios by specific category (convenience method)
   */
  getByCategory: async (
    category: JobCategory,
    page: number = 0,
    size: number = 10,
  ): Promise<PortfolioListResponse> => {
    const params = new URLSearchParams();
    params.append("category", category);
    params.append("page", page.toString());
    params.append("size", size.toString());

    const { data } = await api.get<PortfolioListResponse>(
      `/portfolio/list?${params.toString()}`,
    );
    return data;
  },

  getMyPortfolio: async (): Promise<PortfolioDetail | null> => {
    try {
      const { data } = await api.get<PortfolioDetail>("/portfolio/my");
      return data;
    } catch (error: any) {
      if (error.response && error.response.status === 404) {
        return null;
      }
      throw error;
    }
  },

  /**
   * Get featured/elite portfolios (premium users first)
   * Fetches directly from a single endpoint instead of cascading through listAll
   */
  getFeatured: async (size: number = 6): Promise<PortfolioDetail[]> => {
    try {
      const response = await portfolioService.getByCategory(
        JobCategory.DEVELOPMENT,
        0,
        size * 2,
      );
      // Filter to premium first, then fill with non-premium
      const premium = response.content.filter((p) => p.isPremium);
      const nonPremium = response.content.filter((p) => !p.isPremium);
      return [...premium, ...nonPremium].slice(0, size);
    } catch (error) {
      return [];
    }
  },
};

export default portfolioService;
