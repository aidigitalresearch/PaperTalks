/**
 * Application Constants
 * 
 * Centralized configuration values for the application.
 */

// ============================================
// APP METADATA
// ============================================

export const APP_NAME = 'PaperTalks';
export const APP_TAGLINE = 'Turn research into impact';
export const APP_DESCRIPTION = 
  'The platform where researchers explain their papers through video, building verifiable teaching profiles and bridging the gap between publication and public understanding.';

// ============================================
// ROUTES
// ============================================

export const ROUTES = {
  // Public routes
  HOME: '/',
  ABOUT: '/about',
  FEATURES: '/#features',
  HOW_IT_WORKS: '/#how-it-works',
  TEACHING_SCORE: '/#teaching-score',
  INSTITUTIONS: '/#institutions',
  
  // Auth routes (TODO: Implement)
  LOGIN: '/login',
  SIGNUP: '/signup',
  LOGOUT: '/logout',
  
  // Researcher routes (TODO: Implement)
  RESEARCHER: (id: string) => `/researcher/${id}`,
  
  // Paper routes (TODO: Implement)
  PAPER: (id: string) => `/paper/${id}`,
  
  // Video routes (TODO: Implement)
  VIDEO: (vri: string) => `/video/${vri}`,
  
  // Dashboard routes (TODO: Implement)
  DASHBOARD: '/dashboard',
  DASHBOARD_PROFILE: '/dashboard/profile',
  DASHBOARD_PAPERS: '/dashboard/papers',
  DASHBOARD_VIDEOS: '/dashboard/videos',
  DASHBOARD_ANALYTICS: '/dashboard/analytics',
  
  // Legal routes
  PRIVACY: '/privacy',
  TERMS: '/terms',
  COOKIES: '/cookies',
} as const;

// ============================================
// EXTERNAL LINKS
// ============================================

export const EXTERNAL_LINKS = {
  ORCID: 'https://orcid.org',
  CROSSREF: 'https://www.crossref.org',
  // TODO: Add social media links
  TWITTER: '#',
  LINKEDIN: '#',
  GITHUB: '#',
} as const;

// ============================================
// FEATURE FLAGS
// ============================================

/**
 * Feature flags for progressive rollout
 * TODO: Replace with proper feature flag service (LaunchDarkly, etc.)
 */
export const FEATURE_FLAGS = {
  ENABLE_VIDEO_RECORDING: false,
  ENABLE_ORCID_AUTH: false,
  ENABLE_TEACHING_SCORE: false,
  ENABLE_ANALYTICS_DASHBOARD: false,
  ENABLE_EARLY_ACCESS_SIGNUP: true,
} as const;

// ============================================
// VALIDATION RULES
// ============================================

export const VALIDATION = {
  EMAIL: {
    MIN_LENGTH: 5,
    MAX_LENGTH: 255,
    PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  PASSWORD: {
    MIN_LENGTH: 8,
    MAX_LENGTH: 128,
    REQUIRE_UPPERCASE: true,
    REQUIRE_NUMBER: true,
  },
  VIDEO: {
    MAX_DURATION_SECONDS: 600, // 10 minutes
    MAX_FILE_SIZE_MB: 500,
    ALLOWED_FORMATS: ['mp4', 'webm', 'mov'],
  },
  PAPER: {
    TITLE_MAX_LENGTH: 500,
    ABSTRACT_MAX_LENGTH: 5000,
  },
} as const;

// ============================================
// API ENDPOINTS
// ============================================

/**
 * API endpoint configuration
 * TODO: Add actual API endpoints when backend is implemented
 */
export const API_ENDPOINTS = {
  // Auth
  AUTH_LOGIN: '/api/auth/login',
  AUTH_SIGNUP: '/api/auth/signup',
  AUTH_LOGOUT: '/api/auth/logout',
  AUTH_ORCID_CALLBACK: '/api/auth/orcid/callback',
  
  // Papers
  PAPERS: '/api/papers',
  PAPER_BY_ID: (id: string) => `/api/papers/${id}`,
  DOI_LOOKUP: '/api/papers/doi-lookup',
  
  // Videos
  VIDEOS: '/api/videos',
  VIDEO_BY_ID: (id: string) => `/api/videos/${id}`,
  VIDEO_UPLOAD: '/api/videos/upload',
  
  // Analytics
  ANALYTICS_TRACK: '/api/analytics/track',
  ANALYTICS_SUMMARY: '/api/analytics/summary',
  
  // Teaching Score
  TEACHING_SCORE: (researcherId: string) => `/api/teaching-score/${researcherId}`,
  
  // Early Access
  EARLY_ACCESS: '/api/early-access',
} as const;

