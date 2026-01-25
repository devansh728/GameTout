import { 
  useQuery, 
  useMutation, 
  useQueryClient, 
  UseQueryOptions 
} from "@tanstack/react-query";
import { featuredService } from "@/services/featuredService";
import { FeaturedPost, FeaturedPostType } from "@/types/featured";
import { BlogPostFeed, PostType } from "@/types/api";
import { PortfolioCard } from "@/types/portfolio";
import { StudioPageResponse } from "@/types/studio";
import { toast } from "sonner";

/**
 * Query key factory for featured posts
 */
export const featuredQueryKeys = {
  all: ["featured"] as const,
  list: () => [...featuredQueryKeys.all, "list"] as const,
  byType: (type: FeaturedPostType) => [...featuredQueryKeys.all, "type", type] as const,
  
  // For admin selection
  posts: () => ["admin", "posts"] as const,
  postsByType: (type: string) => ["admin", "posts", type] as const,
  studios: () => ["admin", "studios"] as const,
  portfolios: () => ["admin", "portfolios"] as const,
  premiumPortfolios: () => ["admin", "portfolios", "premium"] as const,
  portfolioSearch: (query: string) => ["admin", "portfolios", "search", query] as const,
};

// ============================================
// FEATURED POSTS QUERIES
// ============================================

/**
 * Hook to fetch all featured posts
 */
export const useFeaturedPosts = (
  options?: Omit<UseQueryOptions<FeaturedPost[], Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: featuredQueryKeys.list(),
    queryFn: () => featuredService.getAll(),
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchOnWindowFocus: false,
    ...options,
  });
};

/**
 * Hook to fetch featured posts by type
 */
export const useFeaturedByType = (
  type: FeaturedPostType,
  options?: Omit<UseQueryOptions<FeaturedPost[], Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: featuredQueryKeys.byType(type),
    queryFn: () => featuredService.getByType(type),
    staleTime: 2 * 60 * 1000,
    refetchOnWindowFocus: false,
    ...options,
  });
};

// ============================================
// FEATURED POSTS MUTATIONS
// ============================================

/**
 * Hook to add a post to featured
 */
export const useAddToFeatured = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ type, id }: { type: FeaturedPostType; id: number }) =>
      featuredService.addToFeatured(type, id),
    onSuccess: (_data, variables) => {
      // Invalidate featured queries
      queryClient.invalidateQueries({ queryKey: featuredQueryKeys.all });
      toast.success(`Added to featured ${variables.type.toLowerCase()}`);
    },
    onError: (error: Error) => {
      toast.error(`Failed to add to featured: ${error.message}`);
    },
  });
};

/**
 * Hook to remove a post from featured
 */
export const useRemoveFromFeatured = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ type, id }: { type: FeaturedPostType; id: number }) =>
      featuredService.removeFromFeatured(type, id),
    onSuccess: (_data, variables) => {
      // Invalidate featured queries
      queryClient.invalidateQueries({ queryKey: featuredQueryKeys.all });
      toast.success(`Removed from featured ${variables.type.toLowerCase()}`);
    },
    onError: (error: Error) => {
      toast.error(`Failed to remove from featured: ${error.message}`);
    },
  });
};

// ============================================
// ADMIN SELECTION QUERIES
// ============================================

/**
 * Hook to fetch all posts for admin selection
 */
export const useAdminAllPosts = (
  size: number = 50,
  options?: Omit<UseQueryOptions<BlogPostFeed[], Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: featuredQueryKeys.posts(),
    queryFn: () => featuredService.getAllPosts(size),
    staleTime: 5 * 60 * 1000,
    ...options,
  });
};

/**
 * Hook to fetch posts by type for admin selection
 */
export const useAdminPostsByType = (
  type: PostType,
  size: number = 50,
  options?: Omit<UseQueryOptions<BlogPostFeed[], Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: featuredQueryKeys.postsByType(type),
    queryFn: () => featuredService.getPostsByType(type, size),
    staleTime: 5 * 60 * 1000,
    enabled: !!type,
    ...options,
  });
};

/**
 * Hook to fetch all studios for admin selection
 */
export const useAdminStudios = (
  page: number = 0,
  size: number = 50,
  options?: Omit<UseQueryOptions<StudioPageResponse, Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: [...featuredQueryKeys.studios(), page, size],
    queryFn: () => featuredService.getAllStudios(page, size),
    staleTime: 5 * 60 * 1000,
    ...options,
  });
};

/**
 * Hook to fetch premium portfolios for admin selection
 */
export const useAdminPremiumPortfolios = (
  page: number = 0,
  size: number = 50,
  options?: Omit<UseQueryOptions<PortfolioCard[], Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: [...featuredQueryKeys.premiumPortfolios(), page, size],
    queryFn: () => featuredService.getPremiumPortfolios(page, size),
    staleTime: 5 * 60 * 1000,
    ...options,
  });
};

/**
 * Hook to search portfolios for admin
 */
export const useAdminPortfolioSearch = (
  query: string,
  page: number = 0,
  size: number = 20,
  options?: Omit<UseQueryOptions<{ content: PortfolioCard[]; totalElements: number; totalPages: number }, Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: [...featuredQueryKeys.portfolioSearch(query), page, size],
    queryFn: () => featuredService.searchPortfolios(query, page, size),
    staleTime: 2 * 60 * 1000,
    enabled: query.length >= 2, // Only search with 2+ characters
    ...options,
  });
};

/**
 * Hook to fetch all portfolios for admin
 */
export const useAdminAllPortfolios = (
  page: number = 0,
  size: number = 50,
  options?: Omit<UseQueryOptions<{ content: PortfolioCard[]; totalElements: number; totalPages: number }, Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: [...featuredQueryKeys.portfolios(), page, size],
    queryFn: () => featuredService.getAllPortfolios(page, size),
    staleTime: 5 * 60 * 1000,
    ...options,
  });
};

// ============================================
// UTILITY HOOKS
// ============================================

/**
 * Hook to check if an item is already featured
 * Returns a Set of featured entity IDs for quick lookup
 */
export const useFeaturedIds = (type: FeaturedPostType) => {
  const { data: featured } = useFeaturedByType(type);
  
  const featuredIds = new Set<number>();
  
  if (featured) {
    featured.forEach((f) => {
      if (f.postDetails) featuredIds.add(f.postDetails.id);
      if (f.portfolioDetails) featuredIds.add(f.portfolioDetails.id);
      if (f.studioDetails) featuredIds.add(f.studioDetails.id);
    });
  }
  
  return featuredIds;
};
