import { api } from "@/lib/api";

export interface StatsResponse {
  count: number;
}

export const statsService = {
  // Post Counts
  getReviewsCount: () => api.get<StatsResponse>("/posts/count/REVIEW"),
  getDocumentariesCount: () => api.get<StatsResponse>("/posts/count/DOCUMENTARY"),
  getPodcastsCount: () => api.get<StatsResponse>("/posts/count/PODCAST"),
  getTotalContentCount: () => api.get<StatsResponse>("/posts/count"),
  
  // Studio Count
  getStudiosCount: () => api.get<StatsResponse>("/user/studio/count"),
  
  // Portfolio Count
  getPortfoliosCount: () => api.get<StatsResponse>("/portfolio/count"),
  
  // Helper to fetch all simultaneously (for dashboards)
  getAllCounts: async () => {
    try {
      const [
        reviewsRes, 
        docsRes, 
        podcastsRes, 
        studiosRes, 
        portfoliosRes, 
        contentRes
      ] = await Promise.allSettled([
        statsService.getReviewsCount(),
        statsService.getDocumentariesCount(),
        statsService.getPodcastsCount(),
        statsService.getStudiosCount(),
        statsService.getPortfoliosCount(),
        statsService.getTotalContentCount()
      ]);

      return {
        reviews: reviewsRes.status === 'fulfilled' ? reviewsRes.value.data.count : 0,
        documentaries: docsRes.status === 'fulfilled' ? docsRes.value.data.count : 0,
        podcasts: podcastsRes.status === 'fulfilled' ? podcastsRes.value.data.count : 0,
        studios: studiosRes.status === 'fulfilled' ? studiosRes.value.data.count : 0,
        portfolios: portfoliosRes.status === 'fulfilled' ? portfoliosRes.value.data.count : 0,
        totalContent: contentRes.status === 'fulfilled' ? contentRes.value.data.count : 0,
      };
    } catch (error) {
      console.error("Failed to fetch all stats", error);
      return {
        reviews: 0,
        documentaries: 0,
        podcasts: 0,
        studios: 0,
        portfolios: 0,
        totalContent: 0,
      };
    }
  }
};
