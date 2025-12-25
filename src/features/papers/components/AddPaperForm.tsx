'use client';

/**
 * Add Paper Form with DOI Lookup
 */

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { lookupDOI, addPaper, type PaperFormData } from '../actions';

export function AddPaperForm() {
  const router = useRouter();
  const [step, setStep] = useState<'doi' | 'confirm'>('doi');
  const [doi, setDoi] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paperData, setPaperData] = useState<PaperFormData | null>(null);

  async function handleLookup(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const result = await lookupDOI(doi);

    if (result.error) {
      setError(result.error);
    } else if (result.paper) {
      setPaperData(result.paper);
      setStep('confirm');
    }

    setIsLoading(false);
  }

  async function handleSubmit(formData: FormData) {
    setIsLoading(true);
    setError(null);

    const result = await addPaper(formData);

    if (result.error) {
      setError(result.error);
      setIsLoading(false);
    } else if (result.success) {
      router.push('/dashboard/papers');
    }
  }

  if (step === 'confirm' && paperData) {
    return (
      <form action={handleSubmit} className="space-y-6">
        {/* Error message */}
        {error && (
          <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-800">
            {error}
          </div>
        )}

        {/* Success message */}
        <div className="p-4 rounded-lg bg-teal-50 border border-teal-200">
          <p className="font-medium text-teal-800 mb-1">Paper found!</p>
          <p className="text-sm text-teal-700">
            Review the details below and confirm to add this paper to your library.
          </p>
        </div>

        {/* Hidden fields */}
        <input type="hidden" name="doi" value={paperData.doi} />
        <input type="hidden" name="authors" value={JSON.stringify(paperData.authors || [])} />

        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-stone-700 mb-1">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
            defaultValue={paperData.title}
            className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
          />
        </div>

        {/* DOI (read-only) */}
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">
            DOI
          </label>
          <input
            type="text"
            value={paperData.doi}
            disabled
            className="w-full rounded-lg border border-stone-200 bg-stone-50 px-3 py-2 text-sm text-stone-500"
          />
        </div>

        {/* Journal */}
        <div>
          <label htmlFor="journal" className="block text-sm font-medium text-stone-700 mb-1">
            Journal
          </label>
          <input
            id="journal"
            name="journal"
            type="text"
            defaultValue={paperData.journal || ''}
            className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
          />
        </div>

        {/* Publication Date */}
        <div>
          <label htmlFor="publication_date" className="block text-sm font-medium text-stone-700 mb-1">
            Publication Date
          </label>
          <input
            id="publication_date"
            name="publication_date"
            type="date"
            defaultValue={paperData.publication_date || ''}
            className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
          />
        </div>

        {/* Authors */}
        {paperData.authors && paperData.authors.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">
              Authors
            </label>
            <p className="text-sm text-stone-600">
              {paperData.authors.join(', ')}
            </p>
          </div>
        )}

        {/* Abstract */}
        <div>
          <label htmlFor="abstract" className="block text-sm font-medium text-stone-700 mb-1">
            Abstract
          </label>
          <textarea
            id="abstract"
            name="abstract"
            rows={4}
            defaultValue={paperData.abstract || ''}
            className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 resize-none"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4 pt-4">
          <Button
            type="submit"
            className="bg-teal-600 hover:bg-teal-700 text-white"
            disabled={isLoading}
          >
            {isLoading ? 'Adding...' : 'Add Paper'}
          </Button>
          <button
            type="button"
            onClick={() => {
              setStep('doi');
              setPaperData(null);
              setError(null);
            }}
            className="text-sm text-stone-600 hover:text-stone-900"
          >
            Use a different DOI
          </button>
        </div>
      </form>
    );
  }

  return (
    <form onSubmit={handleLookup} className="space-y-6">
      {/* Error message */}
      {error && (
        <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-800">
          {error}
        </div>
      )}

      {/* DOI input */}
      <div>
        <label htmlFor="doi" className="block text-sm font-medium text-stone-700 mb-1">
          DOI <span className="text-red-500">*</span>
        </label>
        <input
          id="doi"
          type="text"
          value={doi}
          onChange={(e) => setDoi(e.target.value)}
          required
          className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
          placeholder="10.1038/s41586-023-06600-9 or https://doi.org/..."
        />
        <p className="mt-1 text-xs text-stone-500">
          Enter the DOI of your publication. We&apos;ll automatically fetch the metadata.
        </p>
      </div>

      {/* Submit */}
      <Button
        type="submit"
        className="bg-teal-600 hover:bg-teal-700 text-white"
        disabled={isLoading || !doi.trim()}
      >
        {isLoading ? (
          <>
            <LoadingIcon className="h-4 w-4 mr-2 animate-spin" />
            Looking up...
          </>
        ) : (
          'Lookup DOI'
        )}
      </Button>

      {/* Manual entry option */}
      <div className="pt-4 border-t border-stone-200">
        <p className="text-sm text-stone-500">
          Don&apos;t have a DOI?{' '}
          <button
            type="button"
            onClick={() => {
              setPaperData({
                doi: '',
                title: '',
              });
              setStep('confirm');
            }}
            className="text-teal-600 hover:underline"
          >
            Enter manually
          </button>
        </p>
      </div>
    </form>
  );
}

function LoadingIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <path d="M21 12a9 9 0 11-6.219-8.56" />
    </svg>
  );
}

