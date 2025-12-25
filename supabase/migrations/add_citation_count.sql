-- ================================================
-- Add Citation Count to Papers Table
-- ================================================
-- Run this in your Supabase SQL Editor

-- Add citation_count column
ALTER TABLE public.papers 
ADD COLUMN IF NOT EXISTS citation_count INTEGER DEFAULT 0;

-- Add last updated timestamp for citations
ALTER TABLE public.papers 
ADD COLUMN IF NOT EXISTS citations_updated_at TIMESTAMPTZ;

-- Add index for sorting by citations
CREATE INDEX IF NOT EXISTS papers_citation_count_idx ON public.papers(citation_count DESC);

