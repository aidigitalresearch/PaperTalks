/**
 * PaperTalks Type Definitions
 * 
 * Central type definitions for the platform.
 * These types will be used across the application and
 * should align with the future Supabase database schema.
 */

// ============================================
// USER & AUTHENTICATION
// ============================================

/**
 * Researcher profile - the core user entity
 * TODO: Sync with Supabase auth.users and profiles table
 */
export interface Researcher {
  id: string;
  email: string;
  name: string;
  orcidId?: string; // TODO: ORCID OAuth integration
  institution?: string;
  department?: string;
  bio?: string;
  avatarUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Authentication session
 * TODO: Implement with Supabase Auth
 */
export interface AuthSession {
  user: Researcher | null;
  accessToken: string | null;
  isLoading: boolean;
  error: Error | null;
}

// ============================================
// PAPERS & PUBLICATIONS
// ============================================

/**
 * Research paper/publication
 * TODO: Integrate with DOI resolver (CrossRef/DataCite)
 */
export interface Paper {
  id: string;
  doi?: string;
  title: string;
  abstract?: string;
  authors: Author[];
  publishedDate?: Date;
  journal?: string;
  url?: string;
  researcherId: string; // Owner who added this paper
  createdAt: Date;
  updatedAt: Date;
}

export interface Author {
  name: string;
  orcidId?: string;
  affiliation?: string;
  isCorresponding?: boolean;
}

// ============================================
// VIDEOS & EXPLAINERS
// ============================================

/**
 * Video explainer for a paper
 * TODO: Integrate with Mux or Cloudflare Stream
 */
export interface VideoExplainer {
  id: string;
  vri: string; // Video Research Identifier (DOI-like)
  paperId: string;
  researcherId: string;
  title: string;
  description?: string;
  
  // Video hosting
  videoUrl: string; // TODO: Mux/Cloudflare Stream URL
  thumbnailUrl?: string;
  duration: number; // in seconds
  
  // Status
  status: VideoStatus;
  publishedAt?: Date;
  
  // Engagement (populated from analytics)
  viewCount: number;
  completionRate: number;
  
  createdAt: Date;
  updatedAt: Date;
}

export type VideoStatus = 
  | 'draft'
  | 'processing'
  | 'published'
  | 'unlisted'
  | 'archived';

// ============================================
// TEACHING CREDIT SCORE
// ============================================

/**
 * Teaching Credit Score for a researcher
 * TODO: Implement scoring algorithm
 */
export interface TeachingCreditScore {
  researcherId: string;
  overallScore: number; // 0-100
  
  // Score breakdown
  clarityScore: number;
  engagementScore: number;
  peerRatingScore: number;
  accessibilityScore: number;
  
  // Metadata
  videoCount: number;
  totalViews: number;
  lastUpdated: Date;
  
  // Achievements
  badges: Badge[];
}

export interface Badge {
  id: string;
  type: BadgeType;
  label: string;
  earnedAt: Date;
}

export type BadgeType = 
  | 'top_10_percent'
  | 'video_milestone'
  | 'peer_verified'
  | 'trending'
  | 'accessibility_champion';

// ============================================
// ANALYTICS
// ============================================

/**
 * Video analytics event
 * TODO: Integrate with analytics service
 */
export interface VideoAnalyticsEvent {
  id: string;
  videoId: string;
  eventType: AnalyticsEventType;
  viewerId?: string; // Anonymous if not logged in
  timestamp: Date;
  metadata?: Record<string, unknown>;
}

export type AnalyticsEventType = 
  | 'view_start'
  | 'view_complete'
  | 'view_25_percent'
  | 'view_50_percent'
  | 'view_75_percent'
  | 'share'
  | 'cite';

/**
 * Aggregated video analytics
 */
export interface VideoAnalytics {
  videoId: string;
  totalViews: number;
  uniqueViewers: number;
  averageWatchTime: number;
  completionRate: number;
  shareCount: number;
  citationCount: number;
  viewsByDay: { date: string; count: number }[];
}

// ============================================
// API RESPONSES
// ============================================

/**
 * Standard API response wrapper
 */
export interface ApiResponse<T> {
  data: T | null;
  error: ApiError | null;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
  };
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

// ============================================
// FORM STATES
// ============================================

/**
 * Early access signup form
 */
export interface EarlyAccessFormData {
  email: string;
  role?: 'researcher' | 'institution' | 'other';
  institution?: string;
}

/**
 * Paper submission form
 */
export interface PaperFormData {
  doi?: string;
  title: string;
  abstract?: string;
  authors: Author[];
  journal?: string;
  publishedDate?: string;
}

/**
 * Video upload form
 */
export interface VideoUploadFormData {
  paperId: string;
  title: string;
  description?: string;
  videoFile: File;
}

