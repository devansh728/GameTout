/**
 * TypeScript Types matching Backend DTOs
 * Auto-synced with Java DTOs in gametout backend
 */

// ===========================================
// ENUMS (matching Java enums)
// ===========================================

export enum PostType {
  REVIEWS = "REVIEWS",
  DOCUMENTARIES = "DOCUMENTARIES",
  PODCASTS = "PODCASTS",
  PORTFOLIOS = "PORTFOLIOS",
  STEAM = "STEAM",
  STUDIOS = "STUDIOS",
}

export enum PostStatus {
  DRAFT = "DRAFT",
  PUBLISHED = "PUBLISHED",
  ARCHIVED = "ARCHIVED",
}

export enum BlockType {
  TEXT = "TEXT",
  IMAGE = "IMAGE",
  VIDEO = "VIDEO",
  QUOTE = "QUOTE",
  HEADING = "HEADING",
  CODE = "CODE",
  DIVIDER = "DIVIDER",
  EMBED = "EMBED",
}

// ===========================================
// DTOs (matching Java DTOs)
// ===========================================

/**
 * Lightweight post data for feed/list views
 * Matches: BlogPostFeedDTO.java
 */
export interface BlogPostFeed {
  id: number;
  title: string;
  description: string;
  thumbnailUrl: string | null;
  videoEmbedUrl: string | null;
  publishedAt: string; // ISO date string
  postType: PostType;
  postStatus: PostStatus;
  likes: number;
  rates: number;
}

/**
 * Content block for structured post content
 * Matches: ContentBlockDTO.java
 */
export interface ContentBlock {
  id: number;
  blockOrder: number;
  blockType: BlockType;
  textContent: string | null;
  mediaUrl: string | null;
  caption: string | null;
}

/**
 * Full post data with content blocks
 * Matches: BlogPostResponseDTO.java
 */
export interface BlogPostDetail {
  id: number;
  title: string;
  description: string;
  thumbnailUrl: string | null;
  videoEmbedUrl: string | null;
  publishedAt: string;
  postType: PostType;
  postStatus: PostStatus;
  likes: number;
  rates: number;
  category: string | null;
  contentBlocks: ContentBlock[];
}

// ===========================================
// API Response Types
// ===========================================

export interface BlogPostFeedList {
  posts: BlogPostFeed[];
}

export interface PaginatedFeed {
  posts: BlogPostFeed[];
  hasMore: boolean;
  nextCursor: string | null;
}
