import { api } from "@/lib/api";
import { MediaUploadResult } from "@/lib/adminApi";

interface PresignResponse {
  uploadUrl: string;
  objectKey: string;
  publicUrl: string;
}

/**
 * Media Upload Service
 * Handles file uploads via presigned URLs to MinIO/S3
 */
export const mediaUploadService = {
  /**
   * Get a presigned URL for uploading a file
   * @param filename - Original filename
   * @param contentType - MIME type of the file
   */
  getPresignedUrl: async (
    filename: string,
    contentType: string
  ): Promise<PresignResponse> => {
    const { data } = await api.post<PresignResponse>(
      `/media/presign/presign?filename=${encodeURIComponent(filename)}&contentType=${encodeURIComponent(contentType)}`
    );
    return data;
  },

  /**
   * Get a presigned URL specifically for resume uploads (requires email verification)
   * @param filename - Original filename
   */
  getResumePresignedUrl: async (filename: string): Promise<PresignResponse> => {
    const { data } = await api.post<PresignResponse>(
      `/media/presign/resume?filename=${encodeURIComponent(filename)}`
    );
    return data;
  },

  /**
   * Upload a file using a presigned URL
   * @param uploadUrl - The presigned URL to upload to
   * @param file - The file to upload
   * @param onProgress - Optional progress callback
   */
  uploadToPresignedUrl: async (
    uploadUrl: string,
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<void> => {
    await new Promise<void>((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener("progress", (event) => {
        if (event.lengthComputable && onProgress) {
          const progress = Math.round((event.loaded / event.total) * 100);
          onProgress(progress);
        }
      });

      xhr.addEventListener("load", () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve();
        } else {
          reject(new Error(`Upload failed with status ${xhr.status}`));
        }
      });

      xhr.addEventListener("error", () => {
        reject(new Error("Upload failed"));
      });

      xhr.open("PUT", uploadUrl);
      xhr.setRequestHeader("Content-Type", file.type);
      xhr.send(file);
    });
  },

  /**
   * Complete upload flow: get presigned URL and upload file
   * @param file - The file to upload
   * @param isResume - Whether this is a resume upload (uses different endpoint)
   * @param onProgress - Optional progress callback
   */
  uploadFile: async (
    file: File,
    isResume: boolean = false,
    onProgress?: (progress: number) => void
  ): Promise<MediaUploadResult> => {
    // Get presigned URL
    const presignResponse = isResume
      ? await mediaUploadService.getResumePresignedUrl(file.name)
      : await mediaUploadService.getPresignedUrl(file.name, file.type);

    // Upload the file
    await mediaUploadService.uploadToPresignedUrl(
      presignResponse.uploadUrl,
      file,
      onProgress
    );

    // Return the result
    return {
      objectKey: presignResponse.objectKey,
      publicUrl: presignResponse.publicUrl,
      metadata: {
        originalFilename: file.name,
        contentType: file.type,
        size: file.size,
        uploadDate: new Date(),
      },
    };
  },
};

export default mediaUploadService;
