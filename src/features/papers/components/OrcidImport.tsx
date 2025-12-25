'use client';

/**
 * ORCID Import Component
 * 
 * Allows researchers to import their publications from ORCID.
 * Collapsible after papers have been imported.
 */

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { importFromOrcid, OrcidImportResult, enrichPapersWithCrossRef } from '../actions';

interface OrcidImportProps {
  orcidId?: string | null;
  hasPapers?: boolean;
  papersNeedEnrichment?: boolean;
}

export function OrcidImport({ orcidId, hasPapers = false, papersNeedEnrichment = false }: OrcidImportProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isEnriching, setIsEnriching] = useState(false);
  const [result, setResult] = useState<OrcidImportResult | null>(null);
  const [enrichResult, setEnrichResult] = useState<{ enriched?: number; failed?: number } | null>(null);
  const [isExpanded, setIsExpanded] = useState(!hasPapers);

  const handleImport = async () => {
    if (!orcidId) return;
    
    setIsLoading(true);
    setResult(null);
    
    try {
      const res = await importFromOrcid(orcidId);
      setResult(res);
    } catch {
      setResult({ error: 'An unexpected error occurred.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEnrich = async () => {
    setIsEnriching(true);
    setEnrichResult(null);
    
    try {
      const res = await enrichPapersWithCrossRef();
      if (res.success) {
        setEnrichResult({ enriched: res.enriched, failed: res.failed });
      }
    } catch {
      // Error handling
    } finally {
      setIsEnriching(false);
    }
  };

  if (!orcidId) {
    return (
      <div className="rounded-lg border border-stone-200 bg-white p-4">
        <div className="flex items-start gap-3">
          <OrcidIcon className="h-6 w-6 text-[#A6CE39] flex-shrink-0" />
          <div className="flex-1">
            <h3 className="font-medium text-stone-900 text-sm">Import from ORCID</h3>
            <p className="text-sm text-stone-600 mt-1">
              Add your ORCID iD in your profile to import publications automatically.
            </p>
            <a
              href="/dashboard/profile"
              className="inline-flex items-center text-sm font-medium text-teal-600 hover:text-teal-700 mt-2"
            >
              Go to Profile →
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Collapsed state - compact banner
  if (!isExpanded) {
    return (
      <button
        onClick={() => setIsExpanded(true)}
        className="w-full rounded-lg border border-stone-200 bg-white px-4 py-3 flex items-center justify-between hover:bg-stone-50 transition-colors text-left"
      >
        <div className="flex items-center gap-3">
          <OrcidIcon className="h-5 w-5 text-[#A6CE39] flex-shrink-0" />
          <span className="text-sm text-stone-600">
            Sync more publications from ORCID
          </span>
        </div>
        <ChevronDownIcon className="h-4 w-4 text-stone-400" />
      </button>
    );
  }

  return (
    <div className="rounded-lg border border-stone-200 bg-white p-4">
      <div className="flex items-start gap-3">
        <OrcidIcon className="h-6 w-6 text-[#A6CE39] flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-medium text-stone-900 text-sm">Import from ORCID</h3>
              <p className="text-sm text-stone-500 mt-0.5">
                ORCID iD: <code className="text-xs bg-stone-100 px-1 py-0.5 rounded">{orcidId}</code>
              </p>
            </div>
            {hasPapers && (
              <button
                onClick={() => setIsExpanded(false)}
                className="p-1 rounded hover:bg-stone-100 transition-colors"
                title="Collapse"
              >
                <ChevronUpIcon className="h-4 w-4 text-stone-400" />
              </button>
            )}
          </div>
          
          {/* Result message */}
          {result && (
            <div className={`mt-3 p-3 rounded-lg text-sm ${
              result.error 
                ? 'bg-red-50 text-red-700 border border-red-200' 
                : 'bg-green-50 text-green-700 border border-green-200'
            }`}>
              {result.error ? (
                result.error
              ) : (
                <>
                  ✓ Imported <strong>{result.imported}</strong> new paper{result.imported !== 1 ? 's' : ''}
                  {result.enriched && result.enriched > 0 && (
                    <> ({result.enriched} enriched with full metadata)</>
                  )}
                  {result.skipped && result.skipped > 0 && (
                    <>, skipped {result.skipped} duplicate{result.skipped !== 1 ? 's' : ''}</>
                  )}
                </>
              )}
            </div>
          )}

          {/* Enrich result message */}
          {enrichResult && (
            <div className="mt-3 p-3 rounded-lg text-sm bg-blue-50 text-blue-700 border border-blue-200">
              ✓ Enriched <strong>{enrichResult.enriched}</strong> paper{enrichResult.enriched !== 1 ? 's' : ''} with author info
              {enrichResult.failed && enrichResult.failed > 0 && (
                <> ({enrichResult.failed} could not be enriched)</>
              )}
            </div>
          )}
          
          <div className="flex flex-wrap gap-2 mt-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleImport}
              disabled={isLoading || isEnriching}
            >
              {isLoading ? (
                <>
                  <LoadingSpinner className="h-4 w-4 mr-2" />
                  Importing...
                </>
              ) : (
                <>
                  <RefreshIcon className="h-4 w-4 mr-2" />
                  {hasPapers ? 'Sync New Publications' : 'Import Publications'}
                </>
              )}
            </Button>

            {/* Enrich existing papers button */}
            {hasPapers && papersNeedEnrichment && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleEnrich}
                disabled={isLoading || isEnriching}
                className="text-blue-600 border-blue-300 hover:bg-blue-50"
              >
                {isEnriching ? (
                  <>
                    <LoadingSpinner className="h-4 w-4 mr-2" />
                    Enriching...
                  </>
                ) : (
                  <>
                    <EnrichIcon className="h-4 w-4 mr-2" />
                    Add Missing Authors
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function OrcidIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 256 256" className={className} fill="currentColor">
      <path d="M128 0C57.3 0 0 57.3 0 128s57.3 128 128 128 128-57.3 128-128S198.7 0 128 0zM74.4 52.9c5.8 0 10.5 4.7 10.5 10.5s-4.7 10.5-10.5 10.5-10.5-4.7-10.5-10.5 4.7-10.5 10.5-10.5zM84.4 196h-20V88h20v108zm29.6 0V88h54.8c28.4 0 52.6 18.9 52.6 53.9 0 35.9-25.1 54.1-53.4 54.1h-54zm20-87.7v67.4h32.5c21.3 0 34.8-13.8 34.8-33.7s-13.5-33.7-34.8-33.7h-32.5z"/>
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

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function ChevronUpIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <polyline points="18 15 12 9 6 15" />
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

function EnrichIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}
