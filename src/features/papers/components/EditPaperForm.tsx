'use client';

/**
 * Edit Paper Form Component
 */

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { updatePaper } from '../actions';
import type { Paper } from '@/types/database';

interface EditPaperFormProps {
  paper: Paper;
}

export function EditPaperForm({ paper }: EditPaperFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    title: paper.title || '',
    abstract: paper.abstract || '',
    journal: paper.journal || '',
    published_date: paper.published_date || '',
    authors: Array.isArray(paper.authors) ? (paper.authors as string[]).join(', ') : '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    const form = new FormData();
    form.append('id', paper.id);
    form.append('title', formData.title);
    form.append('abstract', formData.abstract);
    form.append('journal', formData.journal);
    form.append('published_date', formData.published_date);
    
    // Convert comma-separated authors to JSON array
    const authorsArray = formData.authors
      .split(',')
      .map(a => a.trim())
      .filter(a => a.length > 0);
    form.append('authors', JSON.stringify(authorsArray));

    const result = await updatePaper(form);

    if (result.error) {
      setError(result.error);
    } else {
      setSuccess(true);
      setTimeout(() => {
        router.push('/dashboard/papers');
      }, 1000);
    }

    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Error message */}
      {error && (
        <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Success message */}
      {success && (
        <div className="p-4 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm">
          ✓ Paper updated successfully! Redirecting...
        </div>
      )}

      {/* DOI (read-only) */}
      <div>
        <label className="block text-sm font-medium text-stone-700 mb-1">
          DOI
        </label>
        <input
          type="text"
          value={paper.doi || ''}
          disabled
          className="w-full rounded-lg border border-stone-300 bg-stone-100 px-4 py-2 text-stone-500 cursor-not-allowed"
        />
        <p className="text-xs text-stone-500 mt-1">
          DOI cannot be changed after import.
        </p>
      </div>

      {/* Title */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-stone-700 mb-1">
          Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          className="w-full rounded-lg border border-stone-300 px-4 py-2 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
        />
      </div>

      {/* Authors */}
      <div>
        <label htmlFor="authors" className="block text-sm font-medium text-stone-700 mb-1">
          Authors
        </label>
        <input
          type="text"
          id="authors"
          name="authors"
          value={formData.authors}
          onChange={handleChange}
          placeholder="John Doe, Jane Smith, ..."
          className="w-full rounded-lg border border-stone-300 px-4 py-2 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
        />
        <p className="text-xs text-stone-500 mt-1">
          Comma-separated list of author names.
        </p>
      </div>

      {/* Journal */}
      <div>
        <label htmlFor="journal" className="block text-sm font-medium text-stone-700 mb-1">
          Journal / Publication
        </label>
        <input
          type="text"
          id="journal"
          name="journal"
          value={formData.journal}
          onChange={handleChange}
          className="w-full rounded-lg border border-stone-300 px-4 py-2 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
        />
      </div>

      {/* Publication Date */}
      <div>
        <label htmlFor="published_date" className="block text-sm font-medium text-stone-700 mb-1">
          Publication Date
        </label>
        <input
          type="date"
          id="published_date"
          name="published_date"
          value={formData.published_date}
          onChange={handleChange}
          className="w-full rounded-lg border border-stone-300 px-4 py-2 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
        />
      </div>

      {/* Abstract */}
      <div>
        <label htmlFor="abstract" className="block text-sm font-medium text-stone-700 mb-1">
          Abstract
        </label>
        <textarea
          id="abstract"
          name="abstract"
          value={formData.abstract}
          onChange={handleChange}
          rows={6}
          className="w-full rounded-lg border border-stone-300 px-4 py-2 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
        />
      </div>

      {/* Citation count (read-only info) */}
      {paper.citation_count > 0 && (
        <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
          <div className="flex items-center gap-2">
            <CitationIcon className="h-5 w-5 text-blue-600" />
            <span className="font-medium text-blue-900">
              {paper.citation_count} citation{paper.citation_count !== 1 ? 's' : ''}
            </span>
          </div>
          {paper.citations_updated_at && (
            <p className="text-xs text-blue-600 mt-1">
              Last updated: {new Date(paper.citations_updated_at).toLocaleDateString()}
            </p>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-4 pt-4">
        <Button
          type="submit"
          disabled={isLoading}
          className="bg-teal-600 hover:bg-teal-700"
        >
          {isLoading ? 'Saving...' : 'Save Changes'}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push('/dashboard/papers')}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}

function CitationIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <path d="M6 17c.85-1 1.75-2 2-3.5.25-1.5-.15-3-1.5-4.5-1.35-1.5-2-2.5-1.5-4.5.5-2 2-3.5 4-3.5" />
      <path d="M14 17c.85-1 1.75-2 2-3.5.25-1.5-.15-3-1.5-4.5-1.35-1.5-2-2.5-1.5-4.5.5-2 2-3.5 4-3.5" />
    </svg>
  );
}

