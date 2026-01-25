import { api } from "@/lib/api";
import { 
  BlogPostFeed, 
  BlogPostDetail, 
  PostType, 
  PostStatus,
  BlogPostFeedList 
} from "@/types/api";

/**
 * Blog Posts API Service
 * Centralized API calls for blog post operations
 */
export const blogService = {
  /**
   * Get main feed with optional filters
   * GET /api/posts
   */
  getFeed: async (
    status: PostStatus = PostStatus.PUBLISHED,
    cursor?: string,
    size: number = 20
  ): Promise<BlogPostFeed[]> => {
    const params = new URLSearchParams();
    params.append("status", status);
    params.append("size", size.toString());
    if (cursor) {
      params.append("cursor", cursor);
    }
    
    const { data } = await api.get<BlogPostFeed[]>(`/posts?${params.toString()}`);
    return data;
  },

  /**
   * Get posts by specific type
   * GET /api/posts/type/{type}
   */
  getByType: async (
    type: PostType, 
    size: number = 20
  ): Promise<BlogPostFeed[]> => {
    const { data } = await api.get<BlogPostFeedList>(`/posts/type/${type}?size=${size}`);
    // Handle both array and { posts: [] } response formats
    return Array.isArray(data) ? data : data.posts;
  },

  /**
   * Get single post with full content blocks
   * GET /api/posts/{id}
   */
  getPostById: async (id: number): Promise<BlogPostDetail> => {
    const { data } = await api.get<BlogPostDetail>(`/posts/${id}`);
    return data;
  },

  /**
   * Like a post
   * POST /api/posts/{id}/like
   */
  likePost: async (id: number): Promise<void> => {
    await api.post(`/posts/${id}/like`);
  },

  /**
   * Get reviews feed
   */
  getReviews: async (size: number = 20): Promise<BlogPostFeed[]> => {
    return blogService.getByType(PostType.REVIEWS, size);
  },

  /**
   * Get documentaries feed
   */
  getDocumentaries: async (size: number = 20): Promise<BlogPostFeed[]> => {
    return blogService.getByType(PostType.DOCUMENTARIES, size);
  },

  /**
   * Get podcasts feed
   */
  getPodcasts: async (size: number = 20): Promise<BlogPostFeed[]> => {
    return blogService.getByType(PostType.PODCASTS, size);
  },
};

export default blogService;
