import { useQuery, useMutation, useQueryClient, UseQueryOptions } from "@tanstack/react-query";
import { blogService } from "@/services/blogService";
import { BlogPostFeed, BlogPostDetail, PostType, PostStatus } from "@/types/api";

/**
 * Query key factory for blog posts
 */
export const blogQueryKeys = {
  all: ["blogPosts"] as const,
  feeds: () => [...blogQueryKeys.all, "feed"] as const,
  feed: (type?: PostType, size?: number) => [...blogQueryKeys.feeds(), { type, size }] as const,
  details: () => [...blogQueryKeys.all, "detail"] as const,
  detail: (id: number) => [...blogQueryKeys.details(), id] as const,
};

/**
 * Hook to fetch blog feed with optional type filter
 */
export const useBlogFeed = (
  postType?: PostType,
  size: number = 20,
  options?: Omit<UseQueryOptions<BlogPostFeed[], Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: blogQueryKeys.feed(postType, size),
    queryFn: () => 
      postType 
        ? blogService.getByType(postType, size)
        : blogService.getFeed(PostStatus.PUBLISHED, undefined, size),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    ...options,
  });
};

/**
 * Hook to fetch reviews
 */
export const useReviews = (size: number = 20) => {
  return useBlogFeed(PostType.REVIEWS, size);
};

/**
 * Hook to fetch documentaries
 */
export const useDocumentaries = (size: number = 20) => {
  return useBlogFeed(PostType.DOCUMENTARIES, size);
};

/**
 * Hook to fetch podcasts
 */
export const usePodcasts = (size: number = 20) => {
  return useBlogFeed(PostType.PODCASTS, size);
};

/**
 * Hook to fetch single post with full content blocks
 */
export const useBlogPost = (
  id: number,
  options?: Omit<UseQueryOptions<BlogPostDetail, Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: blogQueryKeys.detail(id),
    queryFn: () => blogService.getPostById(id),
    staleTime: 10 * 60 * 1000, // 10 minutes
    enabled: !!id && id > 0,
    ...options,
  });
};

/**
 * Hook to like a post with optimistic update
 */
export const useLikePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: blogService.likePost,
    onMutate: async (postId: number) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: blogQueryKeys.detail(postId) });
      
      // Snapshot previous value
      const previousPost = queryClient.getQueryData<BlogPostDetail>(
        blogQueryKeys.detail(postId)
      );

      // Optimistically update
      if (previousPost) {
        queryClient.setQueryData<BlogPostDetail>(
          blogQueryKeys.detail(postId),
          { ...previousPost, likes: previousPost.likes + 1 }
        );
      }

      return { previousPost };
    },
    onError: (_err, postId, context) => {
      // Rollback on error
      if (context?.previousPost) {
        queryClient.setQueryData(
          blogQueryKeys.detail(postId),
          context.previousPost
        );
      }
    },
    onSettled: (_data, _error, postId) => {
      // Refetch to ensure consistency
      queryClient.invalidateQueries({ queryKey: blogQueryKeys.detail(postId) });
      queryClient.invalidateQueries({ queryKey: blogQueryKeys.feeds() });
    },
  });
};

/**
 * Hook to prefetch a post (useful for hover prefetching)
 */
export const usePrefetchPost = () => {
  const queryClient = useQueryClient();

  return (id: number) => {
    queryClient.prefetchQuery({
      queryKey: blogQueryKeys.detail(id),
      queryFn: () => blogService.getPostById(id),
      staleTime: 10 * 60 * 1000,
    });
  };
};
