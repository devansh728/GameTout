/**
 * Portfolio TypeScript Types
 * Matching Backend DTOs from gametout backend
 */

// ===========================================
// ENUMS (matching Java enums)
// ===========================================

export enum JobCategory {
  DEVELOPMENT = "DEVELOPMENT",
  DESIGN = "DESIGN",
  MARKETING = "MARKETING",
  SALES = "SALES",
  CUSTOMER_SUPPORT = "CUSTOMER_SUPPORT",
  HUMAN_RESOURCES = "HUMAN_RESOURCES",
  FINANCE = "FINANCE",
  OPERATIONS = "OPERATIONS",
  PRODUCT_MANAGEMENT = "PRODUCT_MANAGEMENT",
  PROGRAMMER = "PROGRAMMER",
  ARTIST = "ARTIST",
  DESIGNER = "DESIGNER",
  AUDIO = "AUDIO",
  PRODUCER = "PRODUCER",
  ANIMATOR = "ANIMATOR",
  COMMUNITY_MANAGER = "COMMUNITY_MANAGER",
  COMPOSER = "COMPOSER",
  LEVEL_DESIGNER = "LEVEL_DESIGNER",
  MARKETING_ENGINEER = "MARKETING_ENGINEER",
  MUSICIAN = "MUSICIAN",
  PRODUCT_MANAGER = "PRODUCT_MANAGER",
  QA_TESTER = "QA_TESTER",
  PROJECT_MANAGER = "PROJECT_MANAGER",
  WRITER = "WRITER",
  SOUND_ENGINEER = "SOUND_ENGINEER",
  TRANSLATOR = "TRANSLATOR",
  UI_UX_DESIGNER = "UI_UX_DESIGNER",
  USER_ACQUISITION_ENGINEER = "USER_ACQUISITION_ENGINEER",
  VIDEO_EDITOR = "VIDEO_EDITOR",
  VFX_ARTIST = "VFX_ARTIST",
  V0_ARTIST = "V0_ARTIST",
  MENTOR = "MENTOR",
  BIZDEV = "BIZDEV",
  OTHER = "OTHER"
}

export enum JobProfileStatus {
  OPEN = "OPEN",
  FREELANCE = "FREELANCE",
  DEPLOYED = "DEPLOYED",
}

// ===========================================
// CATEGORY MAPPING (Frontend Display ↔ Backend)
// ===========================================

/** Map frontend display names to backend enum values */
export const CATEGORY_TO_BACKEND: Record<string, JobCategory> = {
  "Programmer": JobCategory.PROGRAMMER,
  "Developer": JobCategory.PROGRAMMER,
  "Software Engineer": JobCategory.PROGRAMMER,
  "Artist": JobCategory.ARTIST,
  "2D Artist": JobCategory.ARTIST,
  "3D Artist": JobCategory.V0_ARTIST, 
  "VFX Artist": JobCategory.VFX_ARTIST,
  "Designer": JobCategory.DESIGNER,
  "Game Designer": JobCategory.DESIGNER,
  "Level Designer": JobCategory.LEVEL_DESIGNER,
  "UI/UX Designer": JobCategory.UI_UX_DESIGNER,
  "Audio": JobCategory.AUDIO,
  "Sound Engineer": JobCategory.SOUND_ENGINEER,
  "Composer": JobCategory.COMPOSER,
  "Musician": JobCategory.MUSICIAN,
  "Producer": JobCategory.PRODUCER,
  "Project Manager": JobCategory.PROJECT_MANAGER,
  "Product Manager": JobCategory.PRODUCT_MANAGER,
  "Community Manager": JobCategory.COMMUNITY_MANAGER,
  "Marketing": JobCategory.MARKETING_ENGINEER,
  "BizDev": JobCategory.BIZDEV,
  "QA Tester": JobCategory.QA_TESTER,
  "Writer": JobCategory.WRITER,
  "Translator": JobCategory.TRANSLATOR,
  "Video Editor": JobCategory.VIDEO_EDITOR,
  "Other": JobCategory.OTHER
};

/** Map backend enum to frontend display names */
export const BACKEND_TO_CATEGORY: Record<JobCategory, string> = {
  [JobCategory.DEVELOPMENT]: "Developer",
  [JobCategory.DESIGN]: "Designer",
  [JobCategory.MARKETING]: "Marketing",
  [JobCategory.SALES]: "Sales",
  [JobCategory.CUSTOMER_SUPPORT]: "Customer Support",
  [JobCategory.HUMAN_RESOURCES]: "HR",
  [JobCategory.FINANCE]: "Finance",
  [JobCategory.OPERATIONS]: "Operations",
  [JobCategory.PRODUCT_MANAGEMENT]: "Product Manager",
  [JobCategory.PROGRAMMER]: "Programmer",
  [JobCategory.ARTIST]: "Artist",
  [JobCategory.DESIGNER]: "Designer",
  [JobCategory.AUDIO]: "Audio Engineer",
  [JobCategory.PRODUCER]: "Producer",
  [JobCategory.ANIMATOR]: "Animator",
  [JobCategory.COMMUNITY_MANAGER]: "Community Manager",
  [JobCategory.COMPOSER]: "Composer",
  [JobCategory.LEVEL_DESIGNER]: "Level Designer",
  [JobCategory.MARKETING_ENGINEER]: "Marketing Engineer",
  [JobCategory.MUSICIAN]: "Musician",
  [JobCategory.PRODUCT_MANAGER]: "Product Manager",
  [JobCategory.QA_TESTER]: "QA Tester",
  [JobCategory.PROJECT_MANAGER]: "Project Manager",
  [JobCategory.WRITER]: "Writer",
  [JobCategory.SOUND_ENGINEER]: "Sound Engineer",
  [JobCategory.TRANSLATOR]: "Translator",
  [JobCategory.UI_UX_DESIGNER]: "UI/UX Designer",
  [JobCategory.USER_ACQUISITION_ENGINEER]: "User Acquisition",
  [JobCategory.VIDEO_EDITOR]: "Video Editor",
  [JobCategory.VFX_ARTIST]: "VFX Artist",
  [JobCategory.V0_ARTIST]: "3D Artist",
  [JobCategory.MENTOR]: "Mentor",
  [JobCategory.BIZDEV]: "BizDev",
  [JobCategory.OTHER]: "Other"
};

/** Map backend status to frontend display */
export const STATUS_DISPLAY: Record<JobProfileStatus, string> = {
  [JobProfileStatus.OPEN]: "Open for Work",
  [JobProfileStatus.FREELANCE]: "Freelance",
  [JobProfileStatus.DEPLOYED]: "Deployed",
};

/** Map frontend display to backend status */
export const DISPLAY_TO_STATUS: Record<string, JobProfileStatus> = {
  "Open for Work": JobProfileStatus.OPEN,
  "Freelance": JobProfileStatus.FREELANCE,
  "Deployed": JobProfileStatus.DEPLOYED,
};

// ===========================================
// DTOs (matching Java DTOs)
// ===========================================

/**
 * Skill data for portfolio
 * Matches: SkillDTO.java
 */
export interface SkillDTO {
  name: string;
  score: number; // 0-100
}

/**
 * Social link data
 * Matches: SocialLinkDTO.java
 */
export interface SocialLinkDTO {
  platform: string;
  url: string;
}

/**
 * Lightweight portfolio data for card/list views
 * Matches: PortfolioCardDTO.java
 */
export interface PortfolioCard {
  id: number;
  name: string;
  profilePhotoUrl: string | null;
  shortDescription: string | null;
  location: string | null;
  experienceYears: number | null;
  isPremium: boolean;
  jobStatus: JobProfileStatus;
  skills: SkillDTO[];
}

/**
 * Full portfolio data for detail view
 * Matches: PortfolioResponseDTO.java
 */
export interface PortfolioDetail {
  id: number;
  name: string;
  shortDescription: string | null;
  location: string | null;
  experienceYears: number | null;
  jobCategory: JobCategory;
  jobStatus: JobProfileStatus;
  isPremium: boolean;
  profileSummary: string | null;
  likesCount: number;
  coverPhotoUrl: string | null;
  profilePhotoUrl: string | null;
  contactEmail: string | null;
  resumeUrl: string | null;
  skills: SkillDTO[];
  socials: SocialLinkDTO[];
  user?: {
    id: number;
    displayName: string;
  };
}

/**
 * Request payload for creating/updating portfolio
 * Matches: PortfolioRequest.java
 */
export interface PortfolioRequest {
  name: string;
  shortDescription: string;
  location: string;
  experienceYears: number;
  jobCategory: JobCategory;
  jobStatus: JobProfileStatus;
  profileSummary: string;
  coverPhotoUrl?: string;
  profilePhotoUrl?: string;
  contactEmail: string;
  skills: SkillDTO[];
  socials: SocialLinkDTO[];
  resumeUrl?: string;
}

// ===========================================
// API Response Types (Spring Page wrapper)
// ===========================================

/**
 * Spring Boot Page response wrapper
 */
export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number; // current page (0-indexed)
  first: boolean;
  last: boolean;
  empty: boolean;
}

/**
 * Paginated portfolio list response
 */
export type PortfolioListResponse = PaginatedResponse<PortfolioDetail>;

/**
 * Paginated search results
 */
export type PortfolioSearchResponse = PaginatedResponse<PortfolioCard>;

// ===========================================
// Frontend UI Types (derived from backend data)
// ===========================================

/**
 * Normalized developer data for UI components
 * Maps backend DTO to frontend-friendly format
 */
export interface Developer {
  id: number;
  name: string;
  role: string; // shortDescription
  location: string;
  avatar: string;
  status: string; // Display string for JobProfileStatus
  exp: string; // Formatted experience
  badges: string[]; // Derived from skills
  skills: { name: string; level: number }[];
  category: string; // Frontend category name
  isPremium: boolean;
  rate?: string; // Optional - not from backend
  linkedinUrl?: string;
}

/**
 * Transform PortfolioCard to Developer for UI
 */
export function toDevelo(card: PortfolioCard): Developer {
  return {
    id: card.id,
    name: card.name || "Unknown",
    role: card.shortDescription || "Game Developer",
    location: card.location || "India",
    avatar: card.profilePhotoUrl || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200",
    status: STATUS_DISPLAY[card.jobStatus] || "Open for Work",
    exp: card.experienceYears ? `${card.experienceYears} Yrs` : "N/A",
    badges: card.skills?.slice(0, 2).map(s => s.name) || [],
    skills: card.skills?.map(s => ({ name: s.name, level: s.score })) || [],
    category: "Programmer", // Will be set based on context
    isPremium: card.isPremium,
    linkedinUrl: undefined,
  };
}

/**
 * Transform PortfolioDetail to Developer for UI
 */
export function detailToDeveloper(detail: PortfolioDetail): Developer {
  const linkedinUrl = detail.socials?.find(
    (s) => s.platform?.toLowerCase() === "linkedin"
  )?.url ?? undefined;
  return {
    id: detail.id,
    name: detail.name || "Unknown",
    role: detail.shortDescription || "Game Developer",
    location: detail.location || "India",
    avatar: detail.profilePhotoUrl || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200",
    status: STATUS_DISPLAY[detail.jobStatus] || "Open for Work",
    exp: detail.experienceYears ? `${detail.experienceYears} Yrs` : "N/A",
    badges: detail.skills?.slice(0, 3).map(s => s.name) || [],
    skills: detail.skills?.map(s => ({ name: s.name, level: s.score })) || [],
    category: BACKEND_TO_CATEGORY[detail.jobCategory] || "Other",
    isPremium: detail.isPremium,
    linkedinUrl,
  };
}
