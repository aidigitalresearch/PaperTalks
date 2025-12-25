'use server';

/**
 * Papers Server Actions
 */

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export interface PaperFormData {
  doi: string;
  title: string;
  abstract?: string;
  journal?: string;
  publication_date?: string;
  authors?: string[];
}

export interface PaperActionResult {
  error?: string;
  success?: boolean;
  paper?: PaperFormData;
}

/**
 * Lookup paper metadata by DOI using CrossRef API
 */
export async function lookupDOI(doi: string): Promise<PaperActionResult> {
  if (!doi || doi.trim().length === 0) {
    return { error: 'DOI is required' };
  }

  // Clean DOI
  const cleanDoi = doi.trim().replace(/^https?:\/\/doi\.org\//, '');

  try {
    const response = await fetch(`https://api.crossref.org/works/${encodeURIComponent(cleanDoi)}`, {
      headers: {
        'User-Agent': 'PaperTalks/1.0 (mailto:hello@papertalks.io)',
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return { error: 'DOI not found. Please check and try again.' };
      }
      return { error: 'Failed to lookup DOI. Please try again.' };
    }

    const data = await response.json();
    const work = data.message;

    // Extract authors
    const authors = work.author?.map((a: { given?: string; family?: string }) => {
      if (a.given && a.family) {
        return `${a.given} ${a.family}`;
      }
      return a.family || a.given || 'Unknown';
    }) || [];

    // Extract publication date
    let publicationDate: string | undefined;
    if (work.published?.['date-parts']?.[0]) {
      const parts = work.published['date-parts'][0];
      if (parts[0]) {
        publicationDate = parts.length >= 3
          ? `${parts[0]}-${String(parts[1]).padStart(2, '0')}-${String(parts[2]).padStart(2, '0')}`
          : parts.length >= 2
          ? `${parts[0]}-${String(parts[1]).padStart(2, '0')}-01`
          : `${parts[0]}-01-01`;
      }
    }

    const paper: PaperFormData = {
      doi: cleanDoi,
      title: work.title?.[0] || 'Untitled',
      abstract: work.abstract?.replace(/<[^>]*>/g, '') || undefined, // Strip HTML
      journal: work['container-title']?.[0] || undefined,
      publication_date: publicationDate,
      authors,
    };

    return { success: true, paper };
  } catch (error) {
    console.error('DOI lookup error:', error);
    return { error: 'Failed to lookup DOI. Please try again.' };
  }
}

/**
 * Add a new paper to the database
 */
export async function addPaper(formData: FormData): Promise<PaperActionResult> {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return { error: 'Not authenticated' };
  }

  const doi = formData.get('doi') as string;
  const title = formData.get('title') as string;
  const abstract = formData.get('abstract') as string;
  const journal = formData.get('journal') as string;
  const publication_date = formData.get('publication_date') as string;
  const authorsJson = formData.get('authors') as string;

  if (!title || title.trim().length === 0) {
    return { error: 'Title is required' };
  }

  let authors: string[] = [];
  try {
    if (authorsJson) {
      authors = JSON.parse(authorsJson);
    }
  } catch {
    // Ignore parse errors
  }

  const { error } = await supabase.from('papers').insert({
    researcher_id: user.id,
    doi: doi?.trim() || `manual-${Date.now()}`,
    title: title.trim(),
    abstract: abstract?.trim() || null,
    journal: journal?.trim() || null,
    published_date: publication_date || null,
    authors,
  });

  if (error) {
    console.error('Add paper error:', error);
    if (error.code === '23505') {
      return { error: 'This paper (DOI) is already in your library' };
    }
    return { error: 'Failed to add paper' };
  }

  revalidatePath('/dashboard/papers');
  
  return { success: true };
}

/**
 * Delete a paper
 */
export async function deletePaper(paperId: string): Promise<PaperActionResult> {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return { error: 'Not authenticated' };
  }

  const { error } = await supabase
    .from('papers')
    .delete()
    .eq('id', paperId)
    .eq('researcher_id', user.id);

  if (error) {
    console.error('Delete paper error:', error);
    return { error: 'Failed to delete paper' };
  }

  revalidatePath('/dashboard/papers');
  
  return { success: true };
}

/**
 * Update a paper
 */
export async function updatePaper(formData: FormData): Promise<PaperActionResult> {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return { error: 'Not authenticated' };
  }

  const id = formData.get('id') as string;
  const title = formData.get('title') as string;
  const abstract = formData.get('abstract') as string;
  const journal = formData.get('journal') as string;
  const published_date = formData.get('published_date') as string;
  const authorsJson = formData.get('authors') as string;

  if (!id) {
    return { error: 'Paper ID is required' };
  }

  if (!title || title.trim().length === 0) {
    return { error: 'Title is required' };
  }

  let authors: string[] = [];
  try {
    if (authorsJson) {
      authors = JSON.parse(authorsJson);
    }
  } catch {
    // Ignore parse errors
  }

  const { error } = await supabase
    .from('papers')
    .update({
      title: title.trim(),
      abstract: abstract?.trim() || null,
      journal: journal?.trim() || null,
      published_date: published_date || null,
      authors,
    })
    .eq('id', id)
    .eq('researcher_id', user.id);

  if (error) {
    console.error('Update paper error:', error);
    return { error: 'Failed to update paper' };
  }

  revalidatePath('/dashboard/papers');
  revalidatePath(`/dashboard/papers/${id}`);
  
  return { success: true };
}

/**
 * Get all papers for current user
 */
export async function getPapers() {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return [];
  }

  const { data: papers } = await supabase
    .from('papers')
    .select('*')
    .eq('researcher_id', user.id)
    .order('created_at', { ascending: false });

  return papers || [];
}

/**
 * ORCID Work types for parsing API response
 */
interface OrcidWorkSummary {
  'put-code': number;
  title?: {
    title?: { value: string };
  };
  'external-ids'?: {
    'external-id'?: Array<{
      'external-id-type': string;
      'external-id-value': string;
    }>;
  };
  'publication-date'?: {
    year?: { value: string };
    month?: { value: string };
    day?: { value: string };
  };
  'journal-title'?: { value: string };
  type?: string;
}

interface OrcidWorkGroup {
  'work-summary': OrcidWorkSummary[];
}

interface OrcidWorksResponse {
  group?: OrcidWorkGroup[];
}

export interface OrcidImportResult {
  error?: string;
  success?: boolean;
  imported?: number;
  skipped?: number;
  enriched?: number;
  total?: number;
}

/**
 * Fetch full paper metadata from CrossRef API
 */
async function fetchCrossRefMetadata(doi: string): Promise<{
  title?: string;
  abstract?: string;
  authors?: string[];
  journal?: string;
  publishedDate?: string;
} | null> {
  // Clean DOI - handle various formats
  let cleanDoi = doi.trim()
    .replace(/^https?:\/\/doi\.org\//, '')
    .replace(/^doi:/, '')
    .replace(/\s+/g, ''); // Remove whitespace

  // Skip pseudo-DOIs
  if (cleanDoi.startsWith('orcid-')) {
    return null;
  }

  try {
    const response = await fetch(
      `https://api.crossref.org/works/${encodeURIComponent(cleanDoi)}`,
      {
        headers: {
          'User-Agent': 'PaperTalks/1.0 (mailto:hello@papertalks.io)',
        },
      }
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    const work = data.message;

    // Extract authors - handle large collaborations
    let authors: string[] = [];
    if (work.author && Array.isArray(work.author)) {
      // For large collaborations (>50 authors), just take first few + collaboration name
      if (work.author.length > 50) {
        const collaboration = work.author.find((a: { name?: string }) => a.name);
        if (collaboration?.name) {
          authors = [collaboration.name];
        } else {
          // Take first 5 authors + "et al."
          authors = work.author.slice(0, 5).map((a: { given?: string; family?: string }) => {
            if (a.given && a.family) return `${a.given} ${a.family}`;
            return a.family || a.given || '';
          }).filter(Boolean);
          if (work.author.length > 5) {
            authors.push(`+ ${work.author.length - 5} more authors`);
          }
        }
      } else {
        authors = work.author.map((a: { given?: string; family?: string; name?: string }) => {
          if (a.name) return a.name; // Collaboration name
          if (a.given && a.family) return `${a.given} ${a.family}`;
          return a.family || a.given || '';
        }).filter(Boolean);
      }
    }

    // Extract publication date
    let publishedDate: string | undefined;
    const dateSource = work.published || work['published-print'] || work['published-online'];
    if (dateSource?.['date-parts']?.[0]) {
      const parts = dateSource['date-parts'][0];
      if (parts[0]) {
        publishedDate = parts.length >= 3
          ? `${parts[0]}-${String(parts[1]).padStart(2, '0')}-${String(parts[2]).padStart(2, '0')}`
          : parts.length >= 2
          ? `${parts[0]}-${String(parts[1]).padStart(2, '0')}-01`
          : `${parts[0]}-01-01`;
      }
    }

    // Clean title (remove HTML tags)
    const title = work.title?.[0]?.replace(/<[^>]*>/g, '') || undefined;

    // Clean abstract (remove HTML tags)
    const abstract = work.abstract?.replace(/<[^>]*>/g, '') || undefined;

    // Journal name
    const journal = work['container-title']?.[0] || undefined;

    return {
      title,
      abstract,
      authors: authors.length > 0 ? authors : undefined,
      journal,
      publishedDate,
    };
  } catch {
    return null;
  }
}

/**
 * Fetch paper metadata from Semantic Scholar API (fallback)
 */
async function fetchSemanticScholarMetadata(doi: string): Promise<{
  title?: string;
  abstract?: string;
  authors?: string[];
} | null> {
  const cleanDoi = doi.trim()
    .replace(/^https?:\/\/doi\.org\//, '')
    .replace(/^doi:/, '');

  if (cleanDoi.startsWith('orcid-')) {
    return null;
  }

  try {
    const response = await fetch(
      `https://api.semanticscholar.org/graph/v1/paper/DOI:${encodeURIComponent(cleanDoi)}?fields=title,abstract,authors`,
      {
        headers: {
          'User-Agent': 'PaperTalks/1.0 (mailto:hello@papertalks.io)',
        },
      }
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();

    const authors = data.authors?.map((a: { name: string }) => a.name).filter(Boolean) || [];
    
    // For large collaborations, summarize
    let finalAuthors = authors;
    if (authors.length > 10) {
      finalAuthors = [...authors.slice(0, 5), `+ ${authors.length - 5} more authors`];
    }

    return {
      title: data.title?.replace(/<[^>]*>/g, ''),
      abstract: data.abstract?.replace(/<[^>]*>/g, ''),
      authors: finalAuthors.length > 0 ? finalAuthors : undefined,
    };
  } catch {
    return null;
  }
}

/**
 * Fetch papers from ORCID and import them
 */
/**
 * Fetch citation count for a paper from external APIs
 */
async function fetchCitationCount(doi: string): Promise<number | null> {
  // Clean DOI
  const cleanDoi = doi.trim()
    .replace(/^https?:\/\/doi\.org\//, '')
    .replace(/^doi:/, '');

  // Skip ORCID-generated pseudo-DOIs
  if (cleanDoi.startsWith('orcid-')) {
    return null;
  }

  // Try Semantic Scholar first (better coverage)
  try {
    const response = await fetch(
      `https://api.semanticscholar.org/graph/v1/paper/DOI:${encodeURIComponent(cleanDoi)}?fields=citationCount`,
      {
        headers: {
          'User-Agent': 'PaperTalks/1.0 (mailto:hello@papertalks.io)',
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      if (typeof data.citationCount === 'number') {
        return data.citationCount;
      }
    }
  } catch {
    // Semantic Scholar failed, try OpenCitations
  }

  // Fallback to OpenCitations
  try {
    const response = await fetch(
      `https://opencitations.net/index/coci/api/v1/citation-count/${encodeURIComponent(cleanDoi)}`,
      {
        headers: {
          'User-Agent': 'PaperTalks/1.0 (mailto:hello@papertalks.io)',
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      if (Array.isArray(data) && data.length > 0 && typeof data[0].count === 'number') {
        return data[0].count;
      }
    }
  } catch {
    // OpenCitations also failed
  }

  return null;
}

export interface CitationUpdateResult {
  error?: string;
  success?: boolean;
  updated?: number;
  failed?: number;
}

/**
 * Process items in parallel batches
 */
async function processBatch<T, R>(
  items: T[],
  batchSize: number,
  processor: (item: T) => Promise<R>
): Promise<R[]> {
  const results: R[] = [];
  
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const batchResults = await Promise.all(batch.map(processor));
    results.push(...batchResults);
  }
  
  return results;
}

/**
 * Update citation counts for all papers (optimized with parallel batches)
 */
export async function updateAllCitations(): Promise<CitationUpdateResult> {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return { error: 'Not authenticated' };
  }

  // Get all papers with DOIs
  const { data: papers, error: fetchError } = await supabase
    .from('papers')
    .select('id, doi')
    .eq('researcher_id', user.id)
    .not('doi', 'like', 'orcid-%'); // Skip pseudo-DOIs

  if (fetchError || !papers) {
    return { error: 'Failed to fetch papers' };
  }

  const validPapers = papers.filter(p => p.doi);
  let updated = 0;
  let failed = 0;

  // Process in parallel batches of 10
  const BATCH_SIZE = 10;
  
  const results = await processBatch(validPapers, BATCH_SIZE, async (paper) => {
    const citationCount = await fetchCitationCount(paper.doi!);
    
    if (citationCount !== null) {
      const { error: updateError } = await supabase
        .from('papers')
        .update({
          citation_count: citationCount,
          citations_updated_at: new Date().toISOString(),
        })
        .eq('id', paper.id);

      return { success: !updateError, citationCount };
    }
    return { success: false, citationCount: null };
  });

  results.forEach(r => {
    if (r.success) updated++;
    else failed++;
  });

  revalidatePath('/dashboard/papers');

  return { success: true, updated, failed };
}

/**
 * Update citation count for a single paper
 */
export async function updatePaperCitations(paperId: string): Promise<{ error?: string; citationCount?: number }> {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return { error: 'Not authenticated' };
  }

  // Get the paper
  const { data: paper, error: fetchError } = await supabase
    .from('papers')
    .select('doi')
    .eq('id', paperId)
    .eq('researcher_id', user.id)
    .single();

  if (fetchError || !paper?.doi) {
    return { error: 'Paper not found' };
  }

  const citationCount = await fetchCitationCount(paper.doi);
  
  if (citationCount === null) {
    return { error: 'Could not fetch citation count for this paper' };
  }

  const { error: updateError } = await supabase
    .from('papers')
    .update({
      citation_count: citationCount,
      citations_updated_at: new Date().toISOString(),
    })
    .eq('id', paperId);

  if (updateError) {
    return { error: 'Failed to update citation count' };
  }

  revalidatePath('/dashboard/papers');

  return { citationCount };
}

/**
 * Enrich existing papers with CrossRef metadata (optimized with parallel batches)
 */
export async function enrichPapersWithCrossRef(): Promise<{
  error?: string;
  success?: boolean;
  enriched?: number;
  failed?: number;
}> {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return { error: 'Not authenticated' };
  }

  // Get papers that need enrichment (no authors or empty authors array)
  const { data: papers, error: fetchError } = await supabase
    .from('papers')
    .select('id, doi, authors')
    .eq('researcher_id', user.id)
    .not('doi', 'like', 'orcid-%'); // Skip pseudo-DOIs

  if (fetchError || !papers) {
    return { error: 'Failed to fetch papers' };
  }

  // Filter papers that need enrichment
  const papersToEnrich = papers.filter(p => {
    const authors = p.authors as string[] | null;
    return p.doi && (!authors || authors.length === 0);
  });

  if (papersToEnrich.length === 0) {
    return { success: true, enriched: 0, failed: 0 };
  }

  // Process in parallel batches of 5 (smaller batch to avoid rate limits)
  const BATCH_SIZE = 5;
  
  const results = await processBatch(papersToEnrich, BATCH_SIZE, async (paper) => {
    // Try CrossRef first
    let metadata = await fetchCrossRefMetadata(paper.doi!);
    
    // If CrossRef doesn't have authors, try Semantic Scholar
    if (!metadata?.authors || metadata.authors.length === 0) {
      const ssData = await fetchSemanticScholarMetadata(paper.doi!);
      if (ssData?.authors && ssData.authors.length > 0) {
        metadata = {
          ...metadata,
          ...ssData,
        };
      }
    }
    
    if (metadata && metadata.authors && metadata.authors.length > 0) {
      const updateData: Record<string, unknown> = {
        authors: metadata.authors,
      };

      if (metadata.title) {
        updateData.title = metadata.title;
      }

      if (metadata.abstract) {
        updateData.abstract = metadata.abstract;
      }

      const { error: updateError } = await supabase
        .from('papers')
        .update(updateData)
        .eq('id', paper.id);

      return { success: !updateError };
    }
    return { success: false };
  });

  const enriched = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;

  revalidatePath('/dashboard/papers');

  return { success: true, enriched, failed };
}

export async function importFromOrcid(orcidId: string): Promise<OrcidImportResult> {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return { error: 'Not authenticated' };
  }

  if (!orcidId || orcidId.trim().length === 0) {
    return { error: 'ORCID iD is required' };
  }

  // Clean ORCID iD (remove URL prefix if present)
  const cleanOrcid = orcidId.trim()
    .replace(/^https?:\/\/orcid\.org\//, '')
    .replace(/\s/g, '');

  // Validate ORCID format (0000-0000-0000-000X)
  const orcidRegex = /^\d{4}-\d{4}-\d{4}-\d{3}[\dX]$/;
  if (!orcidRegex.test(cleanOrcid)) {
    return { error: 'Invalid ORCID iD format. Expected: 0000-0000-0000-000X' };
  }

  try {
    // Fetch works from ORCID public API
    const response = await fetch(`https://pub.orcid.org/v3.0/${cleanOrcid}/works`, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'PaperTalks/1.0 (mailto:hello@papertalks.io)',
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return { error: 'ORCID iD not found. Please check and try again.' };
      }
      return { error: 'Failed to fetch from ORCID. Please try again.' };
    }

    const data: OrcidWorksResponse = await response.json();
    
    if (!data.group || data.group.length === 0) {
      return { error: 'No publications found for this ORCID iD.' };
    }

    // Get existing DOIs to avoid duplicates
    const { data: existingPapers } = await supabase
      .from('papers')
      .select('doi')
      .eq('researcher_id', user.id);
    
    const existingDois = new Set(existingPapers?.map(p => p.doi?.toLowerCase()) || []);

    let imported = 0;
    let skipped = 0;
    let enriched = 0;
    const papersToInsert: Array<{
      researcher_id: string;
      doi: string;
      title: string;
      abstract: string | null;
      journal: string | null;
      published_date: string | null;
      authors: string[];
    }> = [];

    // Process each work group
    for (const group of data.group) {
      const workSummary = group['work-summary']?.[0];
      if (!workSummary) continue;

      // Extract title from ORCID (fallback)
      let title = workSummary.title?.title?.value;
      if (!title) continue;

      // Clean title of HTML tags
      title = title.replace(/<[^>]*>/g, '');

      // Extract DOI
      let doi: string | undefined;
      const externalIds = workSummary['external-ids']?.['external-id'] || [];
      for (const extId of externalIds) {
        if (extId['external-id-type']?.toLowerCase() === 'doi') {
          doi = extId['external-id-value'];
          break;
        }
      }

      // Skip if no DOI (we need DOI for deduplication)
      if (!doi) {
        // Generate a pseudo-DOI for papers without one
        doi = `orcid-${cleanOrcid}-${workSummary['put-code']}`;
      }

      // Check for duplicates
      if (existingDois.has(doi.toLowerCase())) {
        skipped++;
        continue;
      }

      // Extract publication date from ORCID (fallback)
      let publishedDate: string | null = null;
      const pubDate = workSummary['publication-date'];
      if (pubDate?.year?.value) {
        const year = pubDate.year.value;
        const month = pubDate.month?.value?.padStart(2, '0') || '01';
        const day = pubDate.day?.value?.padStart(2, '0') || '01';
        publishedDate = `${year}-${month}-${day}`;
      }

      // Extract journal from ORCID (fallback)
      let journal = workSummary['journal-title']?.value || null;
      let authors: string[] = [];
      let abstract: string | null = null;

      // Try to enrich with CrossRef/Semantic Scholar data for papers with real DOIs
      if (!doi.startsWith('orcid-')) {
        let crossRefData = await fetchCrossRefMetadata(doi);
        
        // If CrossRef doesn't have authors, try Semantic Scholar
        if (!crossRefData?.authors || crossRefData.authors.length === 0) {
          const ssData = await fetchSemanticScholarMetadata(doi);
          if (ssData?.authors && ssData.authors.length > 0) {
            crossRefData = {
              ...crossRefData,
              ...ssData,
            };
          }
        }
        
        if (crossRefData) {
          // Use enriched data if available
          if (crossRefData.title) title = crossRefData.title;
          if (crossRefData.abstract) abstract = crossRefData.abstract;
          if (crossRefData.authors && crossRefData.authors.length > 0) {
            authors = crossRefData.authors;
            enriched++;
          }
          if (crossRefData.journal) journal = crossRefData.journal;
          if (crossRefData.publishedDate) publishedDate = crossRefData.publishedDate;
        }
      }

      papersToInsert.push({
        researcher_id: user.id,
        doi,
        title,
        abstract,
        journal,
        published_date: publishedDate,
        authors,
      });

      existingDois.add(doi.toLowerCase()); // Prevent duplicates within batch
    }

    // Batch insert papers
    if (papersToInsert.length > 0) {
      const { error } = await supabase.from('papers').insert(papersToInsert);
      
      if (error) {
        console.error('ORCID import error:', error);
        return { error: 'Failed to import some papers. Please try again.' };
      }
      
      imported = papersToInsert.length;
    }

    revalidatePath('/dashboard/papers');

    return {
      success: true,
      imported,
      skipped,
      enriched,
      total: data.group.length,
    };
  } catch (error) {
    console.error('ORCID fetch error:', error);
    return { error: 'Failed to connect to ORCID. Please try again.' };
  }
}

