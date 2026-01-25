/**
 * Featured Posts Types
 * TypeScript interfaces matching backend DTOs for Featured functionality
 */

import { PostType, BlogPostFeed } from "./api";
import { PortfolioCard, PortfolioDetail } from "./portfolio";
import { Studio } from "./studio";

// ===========================================
// ENUMS (matching Java PostEnum for Featured)
// ===========================================

export enum FeaturedPostType {
  REVIEWS = "REVIEWS",
  DOCUMENTARIES = "DOCUMENTARIES",
  PODCASTS = "PODCASTS",
  PORTFOLIOS = "PORTFOLIOS",
  STUDIOS = "STUDIOS",
}

// ===========================================
// FEATURED DTOs
// ===========================================

/**
 * Lightweight blog post data for featured cards
 * Used when postDetails is present in FeaturedPostDTO
 */
export interface FeaturedBlogPost {
  id: number;
  title: string;
  description: string;
  thumbnailUrl: string | null;
  videoEmbedUrl: string | null;
  publishedAt: string;
  postType: PostType;
  likes: number;
  rates: number;
  category?: string | null;
}

/**
 * Portfolio data for featured cards
 * Used when portfolioDetails is present in FeaturedPostDTO
 */
export interface FeaturedPortfolio {
  id: number;
  name: string;
  shortDescription: string | null;
  location: string | null;
  experienceYears: number | null;
  jobCategory: string | null;
  jobStatus: string | null;
  isPremium: boolean;
  profilePhotoUrl: string | null;
  coverPhotoUrl: string | null;
  likesCount: number;
}

/**
 * Studio data for featured cards
 * Used when studioDetails is present in FeaturedPostDTO
 */
export interface FeaturedStudio {
  id: number;
  studioName: string;
  studioLogoUrl: string | null;
  studioDescription: string | null;
  studioWebsiteUrl: string | null;
  ratings: number;
  country: string | null;
  city: string | null;
  employeesCount: number | null;
}

/**
 * Main Featured Post DTO
 * Matches: FeaturedPostDTO.java
 * 
 * Note: Only ONE of postDetails, portfolioDetails, or studioDetails 
 * will be populated based on postType. Others will be null.
 * All nested entities may be null due to lazy loading.
 */
export interface FeaturedPost {
  id: number;
  postType: FeaturedPostType;
  featuredAt: string; // ISO date string
  postDetails: FeaturedBlogPost | null;
  portfolioDetails: FeaturedPortfolio | null;
  studioDetails: FeaturedStudio | null;
}

// ===========================================
// TYPE GUARDS
// ===========================================

export const isFeaturedBlogPost = (featured: FeaturedPost): boolean => {
  return featured.postType === FeaturedPostType.REVIEWS ||
         featured.postType === FeaturedPostType.DOCUMENTARIES ||
         featured.postType === FeaturedPostType.PODCASTS;
};

export const isFeaturedPortfolio = (featured: FeaturedPost): boolean => {
  return featured.postType === FeaturedPostType.PORTFOLIOS;
};

export const isFeaturedStudio = (featured: FeaturedPost): boolean => {
  return featured.postType === FeaturedPostType.STUDIOS;
};

// ===========================================
// HELPER FUNCTIONS
// ===========================================

/**
 * Get display name for featured post
 */
export const getFeaturedDisplayName = (featured: FeaturedPost): string => {
  if (featured.postDetails) {
    return featured.postDetails.title;
  }
  if (featured.portfolioDetails) {
    return featured.portfolioDetails.name;
  }
  if (featured.studioDetails) {
    return featured.studioDetails.studioName;
  }
  return `Featured #${featured.id}`;
};

/**
 * Get thumbnail/image for featured post
 */
export const getFeaturedThumbnail = (featured: FeaturedPost): string | null => {
  if (featured.postDetails) {
    return featured.postDetails.thumbnailUrl;
  }
  if (featured.portfolioDetails) {
    return featured.portfolioDetails.profilePhotoUrl || featured.portfolioDetails.coverPhotoUrl;
  }
  if (featured.studioDetails) {
    return featured.studioDetails.studioLogoUrl;
  }
  return null;
};

/**
 * Get ID of the underlying entity (not the featured entry ID)
 */
export const getFeaturedEntityId = (featured: FeaturedPost): number => {
  if (featured.postDetails) {
    return featured.postDetails.id;
  }
  if (featured.portfolioDetails) {
    return featured.portfolioDetails.id;
  }
  if (featured.studioDetails) {
    return featured.studioDetails.id;
  }
  return featured.id;
};

/**
 * Map FeaturedPostType to display label
 */
export const FEATURED_TYPE_LABELS: Record<FeaturedPostType, string> = {
  [FeaturedPostType.REVIEWS]: "Reviews",
  [FeaturedPostType.DOCUMENTARIES]: "Documentaries",
  [FeaturedPostType.PODCASTS]: "Podcasts",
  [FeaturedPostType.PORTFOLIOS]: "Portfolios",
  [FeaturedPostType.STUDIOS]: "Studios",
};

/**
 * Map FeaturedPostType to accent color
 */
export const FEATURED_TYPE_COLORS: Record<FeaturedPostType, string> = {
  [FeaturedPostType.REVIEWS]: "#FFAB00",
  [FeaturedPostType.DOCUMENTARIES]: "#FF6B6B",
  [FeaturedPostType.PODCASTS]: "#4ECDC4",
  [FeaturedPostType.PORTFOLIOS]: "#A855F7",
  [FeaturedPostType.STUDIOS]: "#3B82F6",
};
