'use client';

/**
 * Papers List Component
 * 
 * Displays researcher's papers with publication details, filtering, sorting, and actions.
 */

import { useState, useMemo } from 'react';
import Link from 'next/link';
import type { Paper } from '@/types/database';
import { deletePaper, updateAllCitations } from '../actions';

interface PapersListProps {
  papers: (Paper & { videos?: { count: number }[] })[];
}

type SortOrder = 'newest' | 'oldest' | 'most-cited';

export function PapersList({ papers }: PapersListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [sortOrder, setSortOrder] = useState<SortOrder>('newest');
  const [yearRange, setYearRange] = useState<{ from: number | null; to: number | null }>({
    from: null,
    to: null,
  });
  const [isUpdatingCitations, setIsUpdatingCitations] = useState(false);
  const [citationUpdateResult, setCitationUpdateResult] = useState<{ updated?: number; failed?: number } | null>(null);

  // Get all available years for the filter
  const availableYears = useMemo(() => {
    const years = papers
      .map(p => p.published_date ? new Date(p.published_date).getFullYear() : null)
      .filter((y): y is number => y !== null);
    
    const uniqueYears = [...new Set(years)].sort((a, b) => b - a);
    return uniqueYears;
  }, [papers]);

  const minYear = availableYears.length > 0 ? Math.min(...availableYears) : new Date().getFullYear();
  const maxYear = availableYears.length > 0 ? Math.max(...availableYears) : new Date().getFullYear();

  // Filter and sort papers
  const filteredAndSortedPapers = useMemo(() => {
    let result = [...papers];

    // Apply year range filter
    if (yearRange.from !== null || yearRange.to !== null) {
      result = result.filter(paper => {
        if (!paper.published_date) return false;
        const year = new Date(paper.published_date).getFullYear();
        
        if (yearRange.from !== null && year < yearRange.from) return false;
        if (yearRange.to !== null && year > yearRange.to) return false;
        
        return true;
      });
    }

    // Sort
    result.sort((a, b) => {
      if (sortOrder === 'most-cited') {
        return (b.citation_count || 0) - (a.citation_count || 0);
      }
      const yearA = a.published_date ? new Date(a.published_date).getFullYear() : 0;
      const yearB = b.published_date ? new Date(b.published_date).getFullYear() : 0;
      
      return sortOrder === 'newest' ? yearB - yearA : yearA - yearB;
    });

    return result;
  }, [papers, yearRange, sortOrder]);

  // Calculate total citations
  const totalCitations = useMemo(() => {
    return filteredAndSortedPapers.reduce((sum, p) => sum + (p.citation_count || 0), 0);
  }, [filteredAndSortedPapers]);

  const hasCitationData = papers.some(p => p.citations_updated_at);

  async function handleUpdateCitations() {
    setIsUpdatingCitations(true);
    setCitationUpdateResult(null);
    
    try {
      const result = await updateAllCitations();
      if (result.success) {
        setCitationUpdateResult({ updated: result.updated, failed: result.failed });
      }
    } catch {
      // Error handling
    } finally {
      setIsUpdatingCitations(false);
    }
  }

  async function handleDelete(paperId: string) {
    if (!confirm('Are you sure you want to delete this paper? This action cannot be undone.')) {
      return;
    }

    setDeletingId(paperId);
    await deletePaper(paperId);
    setDeletingId(null);
  }

  function handleYearRangeChange(type: 'from' | 'to', value: string) {
    const numValue = value === '' ? null : parseInt(value, 10);
    setYearRange(prev => ({ ...prev, [type]: numValue }));
  }

  function clearFilters() {
    setYearRange({ from: null, to: null });
    setSortOrder('newest');
  }

  // Calculate stats for filtered results
  const totalPapers = filteredAndSortedPapers.length;
  const papersWithVideos = filteredAndSortedPapers.filter(p => (p.videos?.[0]?.count || 0) > 0).length;
  const displayYearRange = getYearRange(filteredAndSortedPapers);
  const isFiltered = yearRange.from !== null || yearRange.to !== null;

  if (papers.length === 0) {
    return (
      <div className="rounded-xl border border-stone-200 bg-white p-12 text-center">
        <DocumentIcon className="h-12 w-12 text-stone-300 mx-auto mb-4" />
        <h3 className="font-medium text-stone-900 mb-2">No papers yet</h3>
        <p className="text-stone-500 mb-6">
          Add your first paper to start creating video explainers.
        </p>
        <Link
          href="/dashboard/papers/add"
          className="inline-flex items-center justify-center rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700 transition-colors"
        >
          Add Your First Paper
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters & Controls Bar */}
      <div className="rounded-xl border border-stone-200 bg-white p-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Year Range Filter */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm font-medium text-stone-700">
              <FilterIcon className="inline h-4 w-4 mr-1" />
              Filter by Year:
            </span>
            
            <div className="flex items-center gap-2">
              <select
                value={yearRange.from ?? ''}
                onChange={(e) => handleYearRangeChange('from', e.target.value)}
                className="rounded-lg border border-stone-300 bg-white px-3 py-1.5 text-sm text-stone-700 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
              >
                <option value="">From</option>
                {availableYears.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
              
              <span className="text-stone-400">–</span>
              
              <select
                value={yearRange.to ?? ''}
                onChange={(e) => handleYearRangeChange('to', e.target.value)}
                className="rounded-lg border border-stone-300 bg-white px-3 py-1.5 text-sm text-stone-700 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
              >
                <option value="">To</option>
                {availableYears.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>

            {/* Quick Year Presets */}
            <div className="hidden sm:flex items-center gap-1 ml-2">
              <button
                onClick={() => setYearRange({ from: new Date().getFullYear() - 4, to: new Date().getFullYear() })}
                className={`px-2 py-1 text-xs rounded-md transition-colors ${
                  yearRange.from === new Date().getFullYear() - 4 && yearRange.to === new Date().getFullYear()
                    ? 'bg-teal-100 text-teal-700'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                Last 5 years
              </button>
              <button
                onClick={() => setYearRange({ from: new Date().getFullYear() - 9, to: new Date().getFullYear() })}
                className={`px-2 py-1 text-xs rounded-md transition-colors ${
                  yearRange.from === new Date().getFullYear() - 9 && yearRange.to === new Date().getFullYear()
                    ? 'bg-teal-100 text-teal-700'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                Last 10 years
              </button>
              {isFiltered && (
                <button
                  onClick={clearFilters}
                  className="px-2 py-1 text-xs rounded-md bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Sort & View Controls */}
          <div className="flex items-center gap-3">
            {/* Sort Toggle */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-stone-500">Sort:</span>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as SortOrder)}
                className="rounded-lg border border-stone-300 bg-white px-3 py-1.5 text-sm text-stone-700 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="most-cited">Most Cited</option>
              </select>
            </div>

            {/* View Toggle */}
            <div className="flex items-center gap-1 p-1 rounded-lg bg-stone-100 border border-stone-200">
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'list' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500 hover:text-stone-700'
                }`}
                title="List view"
              >
                <ListIcon className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'grid' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500 hover:text-stone-700'
                }`}
                title="Grid view"
              >
                <GridIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="flex flex-wrap items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-stone-50 to-stone-100 border border-stone-200">
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-teal-100">
              <DocumentIcon className="h-5 w-5 text-teal-700" />
            </div>
            <div>
              <p className="text-2xl font-bold text-stone-900">
                {totalPapers}
                {isFiltered && (
                  <span className="text-sm font-normal text-stone-500 ml-1">
                    / {papers.length}
                  </span>
                )}
              </p>
              <p className="text-xs text-stone-500">
                {isFiltered ? 'Filtered' : 'Total'} Publications
              </p>
            </div>
          </div>
          
          <div className="h-8 w-px bg-stone-300" />
          
          {/* Citations */}
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-blue-100">
              <CitationIcon className="h-5 w-5 text-blue-700" />
            </div>
            <div>
              <p className="text-2xl font-bold text-stone-900">
                {totalCitations.toLocaleString()}
              </p>
              <p className="text-xs text-stone-500">Total Citations</p>
            </div>
          </div>
          
          <div className="h-8 w-px bg-stone-300" />
          
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-purple-100">
              <VideoIcon className="h-5 w-5 text-purple-700" />
            </div>
            <div>
              <p className="text-2xl font-bold text-stone-900">{papersWithVideos}</p>
              <p className="text-xs text-stone-500">With Videos</p>
            </div>
          </div>
          
          <div className="h-8 w-px bg-stone-300" />
          
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-amber-100">
              <CalendarIcon className="h-5 w-5 text-amber-700" />
            </div>
            <div>
              <p className="text-2xl font-bold text-stone-900">{displayYearRange}</p>
              <p className="text-xs text-stone-500">Year Range</p>
            </div>
          </div>
        </div>

        {/* Refresh Citations Button */}
        <div className="ml-auto flex items-center gap-2">
          {citationUpdateResult && (
            <span className="text-xs text-green-600">
              ✓ Updated {citationUpdateResult.updated} papers
            </span>
          )}
          <button
            onClick={handleUpdateCitations}
            disabled={isUpdatingCitations}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white border border-stone-300 text-stone-700 hover:bg-stone-50 transition-colors disabled:opacity-50"
            title={hasCitationData ? 'Refresh citation counts' : 'Fetch citation counts from Semantic Scholar'}
          >
            {isUpdatingCitations ? (
              <>
                <LoadingSpinner className="h-3.5 w-3.5" />
                Updating...
              </>
            ) : (
              <>
                <RefreshIcon className="h-3.5 w-3.5" />
                {hasCitationData ? 'Refresh Citations' : 'Fetch Citations'}
              </>
            )}
          </button>
        </div>
      </div>

      {/* Year Distribution Mini Chart */}
      {availableYears.length > 1 && (
        <div className="p-4 rounded-xl bg-white border border-stone-200">
          <YearDistributionChart 
            papers={filteredAndSortedPapers} 
            minYear={minYear} 
            maxYear={maxYear}
            yearRange={yearRange}
          />
        </div>
      )}

      {/* No Results Message */}
      {filteredAndSortedPapers.length === 0 && (
        <div className="rounded-xl border border-stone-200 bg-white p-8 text-center">
          <FilterIcon className="h-10 w-10 text-stone-300 mx-auto mb-3" />
          <h3 className="font-medium text-stone-900 mb-1">No papers found</h3>
          <p className="text-stone-500 text-sm mb-4">
            No papers match your current filter criteria.
          </p>
          <button
            onClick={clearFilters}
            className="text-sm text-teal-600 hover:text-teal-700 font-medium"
          >
            Clear all filters
          </button>
        </div>
      )}

      {/* Papers List */}
      {filteredAndSortedPapers.length > 0 && (
        <div className={viewMode === 'grid' ? 'grid gap-4 sm:grid-cols-2' : 'space-y-3'}>
          {filteredAndSortedPapers.map((paper) => {
            const videoCount = paper.videos?.[0]?.count || 0;
            const year = paper.published_date ? new Date(paper.published_date).getFullYear() : null;
            const authors = (paper.authors as string[]) || [];
            const displayAuthors = formatAuthors(authors);
            const isOrcidImport = paper.doi?.startsWith('orcid-');

            return (
              <div
                key={paper.id}
                className={`group rounded-xl border bg-white transition-all hover:shadow-md ${
                  deletingId === paper.id ? 'opacity-50' : ''
                } ${viewMode === 'grid' ? 'p-5' : 'p-5'}`}
              >
                <div className={viewMode === 'grid' ? 'space-y-3' : 'flex items-start justify-between gap-6'}>
                  {/* Main Content */}
                  <div className="flex-1 min-w-0">
                    {/* Year & Type Badges */}
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      {year && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-100 text-teal-800">
                          {year}
                        </span>
                      )}
                      {(paper.citation_count || 0) > 0 && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                          <CitationIcon className="h-3 w-3" />
                          {paper.citation_count?.toLocaleString()} citation{paper.citation_count !== 1 ? 's' : ''}
                        </span>
                      )}
                      {paper.journal && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-stone-100 text-stone-600 max-w-[200px] truncate">
                          {paper.journal}
                        </span>
                      )}
                      {videoCount > 0 && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                          <VideoIcon className="h-3 w-3" />
                          {videoCount} video{videoCount !== 1 ? 's' : ''}
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    {paper.doi && !paper.doi.startsWith('orcid-') ? (
                      <a
                        href={`https://doi.org/${paper.doi}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block font-semibold text-stone-900 mb-2 leading-snug line-clamp-2 hover:text-teal-700 transition-colors"
                      >
                        {cleanTitle(paper.title)}
                      </a>
                    ) : (
                      <h3 className="font-semibold text-stone-900 mb-2 leading-snug line-clamp-2">
                        {cleanTitle(paper.title)}
                      </h3>
                    )}

                    {/* Authors */}
                    {displayAuthors && (
                      <p className="text-sm text-stone-600 mb-2 line-clamp-1">
                        <UsersIcon className="inline h-3.5 w-3.5 mr-1 text-stone-400" />
                        {displayAuthors}
                      </p>
                    )}

                    {/* Abstract Preview */}
                    {paper.abstract && (
                      <p className="text-sm text-stone-500 line-clamp-2 mb-3">
                        {paper.abstract}
                      </p>
                    )}

                    {/* DOI & Metadata */}
                    <div className="flex flex-wrap items-center gap-3 text-xs text-stone-400">
                      {!isOrcidImport && paper.doi && (
                        <a
                          href={`https://doi.org/${paper.doi}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 hover:text-teal-600 transition-colors"
                        >
                          <LinkIcon className="h-3 w-3" />
                          <span className="font-mono">{paper.doi}</span>
                          <ExternalLinkIcon className="h-3 w-3" />
                        </a>
                      )}
                      {isOrcidImport && (
                        <span className="inline-flex items-center gap-1 text-stone-400">
                          <OrcidIcon className="h-3 w-3" />
                          Imported from ORCID
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions Column */}
                  <div className={`flex ${viewMode === 'grid' ? 'justify-between items-center pt-3 border-t border-stone-100' : 'flex-col items-end gap-2'}`}>
                    {/* Quick Actions */}
                    <div className={`flex items-center gap-1 ${viewMode === 'list' ? 'opacity-0 group-hover:opacity-100' : ''} transition-opacity`}>
                      {videoCount === 0 ? (
                        <Link
                          href={`/dashboard/videos/record?paper=${paper.id}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-teal-600 text-white hover:bg-teal-700 transition-colors"
                          title="Record video explainer"
                        >
                          <RecordIcon className="h-3.5 w-3.5" />
                          Record Video
                        </Link>
                      ) : (
                        <Link
                          href={`/dashboard/videos?paper=${paper.id}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-purple-100 text-purple-700 hover:bg-purple-200 transition-colors"
                          title="View videos"
                        >
                          <VideoIcon className="h-3.5 w-3.5" />
                          View Videos
                        </Link>
                      )}
                      
                      <Link
                        href={`/dashboard/papers/${paper.id}`}
                        className="p-2 rounded-lg text-stone-500 hover:bg-stone-100 hover:text-stone-700 transition-colors"
                        title="Edit paper"
                      >
                        <EditIcon className="h-4 w-4" />
                      </Link>
                      
                      <button
                        onClick={() => handleDelete(paper.id)}
                        disabled={deletingId === paper.id}
                        className="p-2 rounded-lg text-stone-400 hover:bg-red-50 hover:text-red-600 transition-colors disabled:opacity-50"
                        title="Delete paper"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// Year Distribution Mini Chart Component
function YearDistributionChart({ 
  papers, 
  minYear, 
  maxYear,
  yearRange 
}: { 
  papers: Paper[];
  minYear: number;
  maxYear: number;
  yearRange: { from: number | null; to: number | null };
}) {
  const chartHeight = 40; // pixels

  const yearCounts = useMemo(() => {
    const counts: Record<number, number> = {};
    
    for (let y = minYear; y <= maxYear; y++) {
      counts[y] = 0;
    }
    
    papers.forEach(p => {
      if (p.published_date) {
        const year = new Date(p.published_date).getFullYear();
        if (counts[year] !== undefined) {
          counts[year]++;
        }
      }
    });
    
    return counts;
  }, [papers, minYear, maxYear]);

  const maxCount = Math.max(...Object.values(yearCounts), 1);
  const years = Object.keys(yearCounts).map(Number).sort((a, b) => a - b);

  // Only show last 12 years max for readability
  const displayYears = years.slice(-12);

  return (
    <div className="min-w-[200px]">
      <p className="text-xs text-stone-500 mb-2">Publications per year</p>
      <div className="flex items-end gap-1" style={{ height: `${chartHeight}px` }}>
        {displayYears.map(year => {
          const count = yearCounts[year];
          const heightPx = count > 0 ? Math.max((count / maxCount) * chartHeight, 4) : 2;
          const isInRange = 
            (yearRange.from === null || year >= yearRange.from) &&
            (yearRange.to === null || year <= yearRange.to);
          
          return (
            <div
              key={year}
              className="group relative flex-1 flex flex-col justify-end"
              style={{ height: `${chartHeight}px` }}
            >
              <div
                className={`w-full rounded-t-sm transition-all cursor-pointer hover:opacity-80 ${
                  isInRange 
                    ? count > 0 ? 'bg-teal-500' : 'bg-stone-300'
                    : 'bg-stone-200'
                }`}
                style={{ height: `${heightPx}px` }}
              />
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 bg-stone-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                {year}: {count}
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex justify-between text-xs text-stone-400 mt-1">
        <span>{displayYears[0]}</span>
        <span>{displayYears[displayYears.length - 1]}</span>
      </div>
    </div>
  );
}

// Helper functions
function getYearRange(papers: Paper[]): string {
  const years = papers
    .map(p => p.published_date ? new Date(p.published_date).getFullYear() : null)
    .filter((y): y is number => y !== null);
  
  if (years.length === 0) return 'N/A';
  
  const min = Math.min(...years);
  const max = Math.max(...years);
  
  return min === max ? String(min) : `${min}–${max}`;
}

function formatAuthors(authors: string[]): string {
  if (authors.length === 0) return '';
  if (authors.length === 1) return authors[0];
  if (authors.length === 2) return `${authors[0]} & ${authors[1]}`;
  if (authors.length <= 4) return `${authors.slice(0, -1).join(', ')} & ${authors[authors.length - 1]}`;
  return `${authors[0]} et al. (${authors.length} authors)`;
}

function cleanTitle(title: string): string {
  return title.replace(/<[^>]*>/g, '');
}

// Icons
function DocumentIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  );
}

function VideoIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <polygon points="10 9 15 12 10 15 10 9" fill="currentColor" stroke="none" />
    </svg>
  );
}

function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

function CitationIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <path d="M6 17c.85-1 1.75-2 2-3.5.25-1.5-.15-3-1.5-4.5-1.35-1.5-2-2.5-1.5-4.5.5-2 2-3.5 4-3.5" />
      <path d="M14 17c.85-1 1.75-2 2-3.5.25-1.5-.15-3-1.5-4.5-1.35-1.5-2-2.5-1.5-4.5.5-2 2-3.5 4-3.5" />
      <path d="M6 22h4" />
      <path d="M14 22h4" />
    </svg>
  );
}

function RefreshIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <path d="M21 2v6h-6" />
      <path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
      <path d="M3 22v-6h6" />
      <path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
    </svg>
  );
}

function LoadingSpinner({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={`animate-spin ${className}`}>
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
      <path
        fill="currentColor"
        className="opacity-75"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}

function FilterIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>
  );
}

function SortDescIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <line x1="12" y1="5" x2="12" y2="19" />
      <polyline points="19 12 12 19 5 12" />
    </svg>
  );
}

function SortAscIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <line x1="12" y1="19" x2="12" y2="5" />
      <polyline points="5 12 12 5 19 12" />
    </svg>
  );
}

function ListIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <line x1="8" y1="6" x2="21" y2="6" />
      <line x1="8" y1="12" x2="21" y2="12" />
      <line x1="8" y1="18" x2="21" y2="18" />
      <line x1="3" y1="6" x2="3.01" y2="6" />
      <line x1="3" y1="12" x2="3.01" y2="12" />
      <line x1="3" y1="18" x2="3.01" y2="18" />
    </svg>
  );
}

function GridIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
    </svg>
  );
}

function UsersIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function LinkIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  );
}

function ExternalLinkIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}

function OrcidIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 0C5.372 0 0 5.372 0 12s5.372 12 12 12 12-5.372 12-12S18.628 0 12 0zM7.369 4.378c.525 0 .947.431.947.947s-.422.947-.947.947a.95.95 0 0 1-.947-.947c0-.525.422-.947.947-.947zm-.684 3.71h1.369v9.853H6.685V8.088zm3.947 0h3.7c3.088 0 4.616 2.128 4.616 4.922 0 2.925-1.853 4.931-4.684 4.931h-3.632V8.088zm1.369 1.203v7.447h2.203c2.397 0 3.384-1.516 3.384-3.728s-.947-3.719-3.306-3.719h-2.281z"/>
    </svg>
  );
}

function RecordIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="3" fill="currentColor" />
    </svg>
  );
}

function EditIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}

function TrashIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <line x1="10" y1="11" x2="10" y2="17" />
      <line x1="14" y1="11" x2="14" y2="17" />
    </svg>
  );
}
