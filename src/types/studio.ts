/**
 * Studio Types
 * TypeScript interfaces matching backend DTOs
 */

export interface Studio {
  id: number;
  studioName: string;
  studioLogoUrl?: string;
  studioDescription?: string;
  studioWebsiteUrl?: string;
  ratings: number; // Average rating 1-5 (legacy field)
  ratingCount?: number; // Total number of ratings
  averageRating?: number; // Calculated average rating
  status: "PENDING" | "REJECTED" | "PUBLISHED";
  country: string;
  city: string;
  description?: string;
  employeesCount: number;
  latitude: number;
  longitude: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface StudioRequest {
  studioName: string;
  studioLogoUrl?: string;
  studioDescription?: string;
  studioWebsiteUrl?: string;
  ratings: number;
  country: string;
  city: string;
  description?: string;
  employeesCount: number;
  latitude: number;
  longitude: number;
  status: "PENDING" | "REJECTED" | "PUBLISHED";
}

export interface StudioPageResponse {
  content: Studio[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

export interface StudioFilters {
  country?: string;
  city?: string;
  ratings?: number;
}

// Helper for employee count display
export const formatEmployeeCount = (count: number): string => {
  if (count < 10) return "1-10";
  if (count < 50) return "10-50";
  if (count < 100) return "50-100";
  if (count < 200) return "100-200";
  if (count < 500) return "200-500";
  return "500+";
};

// Rating to percentage for health bar
export const ratingToPercentage = (rating: number): number => {
  return (rating / 5) * 100;
};
