import { api } from "@/lib/api";
import { Studio, StudioRequest, StudioPageResponse, StudioFilters } from "@/types/studio";

/**
 * Studio API Service
 * Centralized API calls for studio operations
 */
export const studioService = {
  // ============================================
  // PUBLIC ENDPOINTS (User)
  // ============================================

  /**
   * Get a studio by ID
   * GET /api/user/studio/{id}
   */
  getById: async (id: number): Promise<Studio> => {
    const { data } = await api.get<Studio>(`/user/studio/${id}`);
    return data;
  },

  /**
   * Get all studios with pagination
   * GET /api/user/studio
   */
  getAll: async (page: number = 0, size: number = 20): Promise<StudioPageResponse> => {
    const { data } = await api.get<StudioPageResponse>(`/user/studio`, {
      params: { page, size, sort: "ratings,desc" }
    });
    return data;
  },

  /**
   * Get studios with filters
   * GET /api/user/studio/filter
   */
  getFiltered: async (
    filters: StudioFilters,
    page: number = 0,
    size: number = 20
  ): Promise<StudioPageResponse> => {
    const params = new URLSearchParams();
    params.append("page", page.toString());
    params.append("size", size.toString());
    
    if (filters.country) params.append("country", filters.country);
    if (filters.city) params.append("city", filters.city);
    if (filters.ratings) params.append("ratings", filters.ratings.toString());

    const { data } = await api.get<StudioPageResponse>(`/user/studio/filter?${params.toString()}`);
    return data;
  },

  // ============================================
  // ADMIN ENDPOINTS
  // ============================================

  /**
   * Create a new studio
   * POST /api/admin/studios
   */
  create: async (studio: StudioRequest): Promise<Studio> => {
    const { data } = await api.post<Studio>("/admin/studios", studio);
    return data;
  },

  /**
   * Bulk create studios
   * POST /api/admin/studios/bulk
   */
  bulkCreate: async (studios: StudioRequest[]): Promise<Studio[]> => {
    const { data } = await api.post<Studio[]>("/admin/studios/bulk", studios);
    return data;
  },

  /**
   * Update a studio
   * PUT /api/admin/studios/{id}
   */
  update: async (id: number, studio: StudioRequest): Promise<Studio> => {
    const { data } = await api.put<Studio>(`/admin/studios/${id}`, studio);
    return data;
  },

  /**
   * Delete a studio
   * DELETE /api/admin/studios/{id}
   */
  delete: async (id: number): Promise<void> => {
    await api.delete(`/admin/studios/${id}`);
  },

  /**
   * Bulk delete studios
   * DELETE /api/admin/studios/bulk
   */
  bulkDelete: async (ids: number[]): Promise<void> => {
    await api.delete("/admin/studios/bulk", { data: ids });
  },

  /**
   * Get pending studios for admin approval
   * GET /api/admin/studios/pending-studios
   */
  getPendingStudios: async (page: number = 0, size: number = 20): Promise<StudioPageResponse> => {
    const { data } = await api.get<StudioPageResponse>(`/admin/studios/pending-studios`, {
      params: { page, size, sort: "createdAt,desc" }
    });
    return data;
  },

  /**
   * Approve or reject a studio
   * POST /api/admin/studios/{id}/approve
   */
  approveStudio: async (id: number, isApproved: boolean): Promise<boolean> => {
    const { data } = await api.post<boolean>(`/admin/studios/${id}/approve`, null, {
      params: { isApproved }
    });
    return data;
  },

  // ============================================
  // USER ENDPOINTS (Create Studio Request & Rating)
  // ============================================

  /**
   * Create a studio request (user-submitted, defaults to PENDING)
   * POST /api/user/studio/create-request
   */
  createRequest: async (studio: StudioRequest): Promise<Studio> => {
    const { data } = await api.post<Studio>("/user/studio/create-request", studio);
    return data;
  },

  /**
   * Rate a studio (authenticated users only)
   * Users can update their rating by calling this again
   * POST /api/user/studio/{id}/rate
   */
  rateStudio: async (id: number, rating: number): Promise<StudioRatingResponse> => {
    const { data } = await api.post<StudioRatingResponse>(`/user/studio/${id}/rate`, { rating });
    return data;
  },

  /**
   * Get user's rating for a studio
   * GET /api/user/studio/{id}/rating
   */
  getMyRating: async (id: number): Promise<StudioRatingDTO | null> => {
    try {
      const { data } = await api.get<StudioRatingDTO>(`/user/studio/${id}/rating`);
      return data;
    } catch (error: any) {
      // 404 means user hasn't rated yet
      if (error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  },

  /**
   * Get rating statistics for a studio
   * GET /api/user/studio/{id}/ratings
   */
  getRatingStats: async (id: number): Promise<RatingStatsDTO> => {
    const { data } = await api.get<RatingStatsDTO>(`/user/studio/${id}/ratings`);
    return data;
  },
};

// ============================================
// TYPES
// ============================================

export interface StudioRatingDTO {
  id: number;
  studioId: number;
  userId: number;
  rating: number;
  createdAt: string;
  updatedAt: string;
}

export interface StudioRatingResponse {
  rating: StudioRatingDTO;
  newAverageRating: number;
  newRatingCount: number;
}

export interface RatingStatsDTO {
  studioId: number;
  averageRating: number;
  ratingCount: number;
  ratingDistribution: Record<number, number>; // e.g., { 1: 5, 2: 10, 3: 20, 4: 30, 5: 35 }
}

export default studioService;
