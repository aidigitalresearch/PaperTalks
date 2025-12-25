# Environment Setup Guide

This document describes the environment variables needed for PaperTalks.

## Quick Start

1. Copy the template below to a new file called `.env.local`
2. Fill in your values
3. Never commit `.env.local` to version control

---

## Environment Variables Template

```env
# ================================================
# PaperTalks Environment Variables
# ================================================

# ------------------------------------------------
# SUPABASE (Required for backend functionality)
# ------------------------------------------------
# Get these from your Supabase project settings
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# ------------------------------------------------
# ORCID OAUTH (Required for researcher verification)
# ------------------------------------------------
# Register at https://orcid.org/developer-tools
ORCID_CLIENT_ID=your-orcid-client-id
ORCID_CLIENT_SECRET=your-orcid-client-secret
ORCID_REDIRECT_URI=http://localhost:3000/api/auth/orcid/callback

# ------------------------------------------------
# VIDEO HOSTING (Choose one)
# ------------------------------------------------

# Option A: Mux (Recommended)
# Sign up at https://mux.com
MUX_TOKEN_ID=your-mux-token-id
MUX_TOKEN_SECRET=your-mux-token-secret

# Option B: Cloudflare Stream
# CLOUDFLARE_ACCOUNT_ID=your-account-id
# CLOUDFLARE_API_TOKEN=your-api-token

# ------------------------------------------------
# DOI RESOLUTION
# ------------------------------------------------
# CrossRef Polite Pool (optional but recommended)
# Register at https://www.crossref.org/services/metadata-delivery/
CROSSREF_MAILTO=your-email@example.com

# ------------------------------------------------
# ANALYTICS (Optional)
# ------------------------------------------------
# NEXT_PUBLIC_ANALYTICS_ID=your-analytics-id

# ------------------------------------------------
# EMAIL SERVICE (Optional, for waitlist)
# ------------------------------------------------
# RESEND_API_KEY=your-resend-api-key
# or
# MAILCHIMP_API_KEY=your-mailchimp-api-key

# ------------------------------------------------
# APP CONFIGURATION
# ------------------------------------------------
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_ENABLE_BETA_FEATURES=false
```

---

## Service Setup Instructions

### 1. Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Project Settings → API
3. Copy the URL and anon key to your `.env.local`
4. For server-side operations, also copy the service role key

### 2. ORCID OAuth

1. Register at [ORCID Developer Tools](https://orcid.org/developer-tools)
2. Create a new API client
3. Set redirect URI to your callback URL
4. Copy client ID and secret

### 3. Mux Video

1. Sign up at [mux.com](https://mux.com)
2. Create a new environment
3. Generate API access tokens
4. Copy token ID and secret

### 4. CrossRef (for DOI resolution)

1. Register at [CrossRef](https://www.crossref.org/services/metadata-delivery/)
2. Use polite pool by providing your email
3. This is free and speeds up API requests

---

## Database Schema

When setting up Supabase, create these tables:

```sql
-- Profiles (extends auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT NOT NULL,
  name TEXT,
  orcid_id TEXT UNIQUE,
  institution TEXT,
  department TEXT,
  bio TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Papers
CREATE TABLE papers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  doi TEXT UNIQUE,
  title TEXT NOT NULL,
  abstract TEXT,
  authors JSONB,
  published_date DATE,
  journal TEXT,
  url TEXT,
  researcher_id UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Videos
CREATE TABLE videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vri TEXT UNIQUE NOT NULL,
  paper_id UUID REFERENCES papers(id),
  researcher_id UUID REFERENCES profiles(id),
  title TEXT NOT NULL,
  description TEXT,
  video_url TEXT,
  thumbnail_url TEXT,
  duration INTEGER,
  status TEXT DEFAULT 'draft',
  published_at TIMESTAMPTZ,
  view_count INTEGER DEFAULT 0,
  completion_rate REAL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Early Access Signups
CREATE TABLE early_access_signups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  role TEXT,
  institution TEXT,
  signed_up_at TIMESTAMPTZ DEFAULT NOW()
);

-- Teaching Scores
CREATE TABLE teaching_scores (
  researcher_id UUID PRIMARY KEY REFERENCES profiles(id),
  overall_score REAL DEFAULT 0,
  clarity_score REAL DEFAULT 0,
  engagement_score REAL DEFAULT 0,
  peer_rating_score REAL DEFAULT 0,
  accessibility_score REAL DEFAULT 0,
  video_count INTEGER DEFAULT 0,
  total_views INTEGER DEFAULT 0,
  last_updated TIMESTAMPTZ DEFAULT NOW()
);
```

---

## RLS Policies

Enable Row Level Security and create appropriate policies:

```sql
-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE papers ENABLE ROW LEVEL SECURITY;
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;

-- Public read access for published content
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT USING (true);

CREATE POLICY "Published videos are viewable by everyone"
  ON videos FOR SELECT USING (status = 'published');

-- Users can edit their own content
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can manage own papers"
  ON papers FOR ALL USING (auth.uid() = researcher_id);

CREATE POLICY "Users can manage own videos"
  ON videos FOR ALL USING (auth.uid() = researcher_id);
```

