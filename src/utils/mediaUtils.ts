import { BlogPostFeed, BlogPostDetail } from "@/types/api";

/**
 * Media URL Priority Utilities
 * 
 * Priority Rule: YouTube embed URL takes precedence over thumbnail.
 * Only if the YouTube embed URL is absent should the thumbnail be displayed.
 */

/**
 * Get the display media URL for a post.
 * Priority: videoEmbedUrl > thumbnailUrl
 */
export const getPostMediaUrl = (post: BlogPostFeed | BlogPostDetail): string => {
  // For display thumbnail, prefer videoEmbedUrl converted to thumbnail, else use thumbnailUrl
  if (post.videoEmbedUrl) {
    const ytId = extractYouTubeId(post.videoEmbedUrl);
    if (ytId) {
      return getYouTubeThumbnail(ytId);
    }
    return post.videoEmbedUrl;
  }
  return post.thumbnailUrl || "";
};

/**
 * Get the thumbnail URL for list views
 * Uses YouTube thumbnail if video embed exists, otherwise uses thumbnailUrl
 */
export const getPostThumbnail = (post: BlogPostFeed | BlogPostDetail): string => {
  if (post.videoEmbedUrl) {
    const ytId = extractYouTubeId(post.videoEmbedUrl);
    if (ytId) {
      return getYouTubeThumbnail(ytId);
    }
  }
  return post.thumbnailUrl || "";
};

/**
 * Get the video embed URL if available
 */
export const getVideoEmbedUrl = (post: BlogPostFeed | BlogPostDetail): string | null => {
  return post.videoEmbedUrl || null;
};

/**
 * Check if post has a video embed
 */
export const hasVideoEmbed = (post: BlogPostFeed | BlogPostDetail): boolean => {
  return !!post.videoEmbedUrl;
};

/**
 * Extract YouTube video ID from various URL formats
 * Supports: youtube.com/watch, youtu.be, youtube.com/embed
 */
export const extractYouTubeId = (url: string): string | null => {
  if (!url) return null;
  
  const patterns = [
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/,
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }
  
  return null;
};

/**
 * Convert YouTube video ID to high-quality thumbnail URL
 */
export const getYouTubeThumbnail = (videoId: string, quality: 'default' | 'hq' | 'mq' | 'sd' | 'maxres' = 'maxres'): string => {
  const qualityMap = {
    default: 'default',
    hq: 'hqdefault',
    mq: 'mqdefault', 
    sd: 'sddefault',
    maxres: 'maxresdefault',
  };
  return `https://img.youtube.com/vi/${videoId}/${qualityMap[quality]}.jpg`;
};

/**
 * Convert YouTube URL to embed URL for iframe
 */
export const getYouTubeEmbedUrl = (url: string, options?: {
  autoplay?: boolean;
  mute?: boolean;
  loop?: boolean;
  controls?: boolean;
}): string | null => {
  const videoId = extractYouTubeId(url);
  if (!videoId) return null;
  
  const params = new URLSearchParams();
  if (options?.autoplay) params.append('autoplay', '1');
  if (options?.mute) params.append('mute', '1');
  if (options?.loop) {
    params.append('loop', '1');
    params.append('playlist', videoId);
  }
  if (options?.controls === false) params.append('controls', '0');
  params.append('modestbranding', '1');
  params.append('rel', '0');
  
  const queryString = params.toString();
  return `https://www.youtube.com/embed/${videoId}${queryString ? `?${queryString}` : ''}`;
};

/**
 * Format date string for display
 */
export const formatPublishedDate = (isoDate: string): string => {
  const date = new Date(isoDate);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Format likes count for display (e.g., 1234 -> 1.2K)
 */
export const formatLikes = (likes: number): string => {
  if (likes >= 1000000) {
    return `${(likes / 1000000).toFixed(1)}M`;
  }
  if (likes >= 1000) {
    return `${(likes / 1000).toFixed(1)}K`;
  }
  return likes.toString();
};
