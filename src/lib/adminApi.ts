import { api } from "./api";

export interface ContentBlock {
  order: number;
  blockType: "TEXT" | "IMAGE" | "VIDEO" | "QUOTE" | "HEADING" | "CODE" | "DIVIDER" | "EMBED";
  textContent?: string;
  mediaUrl?: string;
  caption?: string;
}

export interface PostCreateRequest {
  title: string;
  description: string;
  thumbnailUrl: string;
  videoEmbedUrl?: string;
  postType: "DOCUMENTARIES" | "REVIEWS" | "PODCASTS" | "PORTFOLIOS"; 
  category: string;
  postStatus: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  timeline: string; // ISO 8601 Duration
  publishedAt: string; // ISO String
  socialLinks: Record<string, string>;
}

export interface PresignResponse {
  data: {
    uploadUrl: string;
    objectKey: string;
    publicUrl?: string;
  };
}

export interface MediaUploadResult {
  objectKey: string;
  publicUrl?: string;
  metadata: UploadMetadata;
}

export interface UploadMetadata {
  originalFilename: string;
  contentType: string;
  size: number;
  uploadDate: Date;
}


// 1. Create the Blog Post Metadata
export const createPost = async (data: PostCreateRequest) => {
  return await api.post("/admin/posts", data);
};

// 2. Save/Replace Content Blocks for a Post
export const savePostBlocks = async (postId: number, blocks: ContentBlock[]) => {
  return await api.put(`/admin/posts/${postId}/blocks`, blocks);
};

// 3. User Management
export const upgradeUser = async (userId: number) => {
  return await api.post(`/admin/users/${userId}/upgrade`);
};

export const deactivateUser = async (userId: number) => {
  return await api.post(`/admin/users/${userId}/deactivate`);
};

export const getPresignedUploadUrl = async (fileName: string, fileType: string): Promise<PresignResponse> => {
  return await api.post(`/media/presign/presign?filename=${encodeURIComponent(fileName)}&contentType=${encodeURIComponent(fileType)}`);
}