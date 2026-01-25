import { api } from "@/lib/api";
import { FeaturedPost, FeaturedPostType } from "@/types/featured";
import { BlogPostFeed } from "@/types/api";
import { PortfolioCard } from "@/types/portfolio";
import { Studio, StudioPageResponse } from "@/types/studio";

/**
 * Featured Posts API Service
 * Centralized API calls for featured posts operations
 */
export const featuredService = {
  // ============================================
  // GET FEATURED
  // ============================================

  /**
   * Get all featured posts
   * GET /api/featured
   */
  getAll: async (): Promise<FeaturedPost[]> => {
    const { data } = await api.get<FeaturedPost[]>("/featured");
    return data;
  },

  /**
   * Get featured posts by type
   * GET /api/featured/{type}
   */
  getByType: async (type: FeaturedPostType): Promise<FeaturedPost[]> => {
    const { data } = await api.get<FeaturedPost[]>(`/featured/${type}`);
    return data;
  },

  // ============================================
  // ADMIN: MANAGE FEATURED
  // ============================================

  /**
   * Add a post to featured
   * POST /api/featured/{type}/{id}
   * 
   * @param type - The type of post (REVIEWS, PODCASTS, etc.)
   * @param id - The ID of the entity to feature (post ID, portfolio ID, studio ID)
   */
  addToFeatured: async (type: FeaturedPostType, id: number): Promise<void> => {
    await api.post(`/featured/${type}/${id}`);
  },

  /**
   * Remove a post from featured
   * DELETE /api/featured/{type}/{id}
   * 
   * @param type - The type of post
   * @param id - The ID of the entity to unfeature
   */
  removeFromFeatured: async (type: FeaturedPostType, id: number): Promise<void> => {
    await api.delete(`/featured/${type}/${id}`);
  },

  // ============================================
  // ADMIN: FETCH ALL ITEMS FOR SELECTION
  // ============================================

  /**
   * Get all blog posts for admin selection (all types)
   * GET /api/posts
   */
  getAllPosts: async (size: number = 50): Promise<BlogPostFeed[]> => {
    const { data } = await api.get<BlogPostFeed[]>(`/posts?size=${size}`);
    return data;
  },

  /**
   * Get posts by specific type for admin selection
   * GET /api/posts/type/{type}
   */
  getPostsByType: async (type: string, size: number = 50): Promise<BlogPostFeed[]> => {
    const { data } = await api.get(`/posts/type/${type}?size=${size}`);
    // Handle both array and { posts: [] } response formats
    return Array.isArray(data) ? data : (data as { posts: BlogPostFeed[] }).posts || [];
  },

  /**
   * Get all studios for admin selection
   * GET /api/user/studio
   */
  getAllStudios: async (page: number = 0, size: number = 50): Promise<StudioPageResponse> => {
    const { data } = await api.get<StudioPageResponse>(`/user/studio`, {
      params: { page, size }
    });
    return data;
  },

  /**
   * Search portfolios for admin selection
   * GET /api/search/portfolio
   */
  searchPortfolios: async (query: string, page: number = 0, size: number = 20): Promise<{
    content: PortfolioCard[];
    totalElements: number;
    totalPages: number;
  }> => {
    const { data } = await api.get(`/search/portfolio`, {
      params: { q: query, page, size }
    });
    return data;
  },

  /**
   * Get premium portfolios for admin selection
   * This fetches portfolios and filters by isPremium on client side
   * TODO: Add backend endpoint for premium filter if needed
   */
  getPremiumPortfolios: async (page: number = 0, size: number = 50): Promise<PortfolioCard[]> => {
    // Fetch from development category (most likely to have premium)
    const { data } = await api.get(`/portfolio/list`, {
      params: { category: "DEVELOPMENT", page, size }
    });
    
    // Filter premium only
    const allContent: PortfolioCard[] = data.content || [];
    return allContent.filter((p: PortfolioCard) => p.isPremium);
  },

  /**
   * Get all portfolios (not just premium) for admin
   */
  getAllPortfolios: async (page: number = 0, size: number = 50): Promise<{
    content: PortfolioCard[];
    totalElements: number;
    totalPages: number;
  }> => {
    const { data } = await api.get(`/portfolio/list`, {
      params: { category: "DEVELOPMENT", page, size }
    });
    return {
      content: data.content || [],
      totalElements: data.totalElements || 0,
      totalPages: data.totalPages || 0
    };
  },
};

export default featuredService;
