'use client';

/**
 * Record Video Form Component
 */

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { createVideoDraft } from '../actions';
import type { Paper } from '@/types/database';

interface RecordVideoFormProps {
  papers: Pick<Paper, 'id' | 'title' | 'doi'>[];
  selectedPaperId?: string;
}

export function RecordVideoForm({ papers, selectedPaperId }: RecordVideoFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paperId, setPaperId] = useState(selectedPaperId || papers[0]?.id || '');

  async function handleSubmit(formData: FormData) {
    setIsLoading(true);
    setError(null);

    const result = await createVideoDraft(formData);

    if (result.error) {
      setError(result.error);
      setIsLoading(false);
    } else if (result.success && result.video) {
      // Redirect to upload page
      router.push(`/dashboard/videos/${result.video.id}/upload`);
    }
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      {/* Error message */}
      {error && (
        <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-800">
          {error}
        </div>
      )}

      {/* Paper selection */}
      <div>
        <label htmlFor="paper_id" className="block text-sm font-medium text-stone-700 mb-1">
          Select Paper <span className="text-red-500">*</span>
        </label>
        <select
          id="paper_id"
          name="paper_id"
          required
          value={paperId}
          onChange={(e) => setPaperId(e.target.value)}
          className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
        >
          {papers.map((paper) => (
            <option key={paper.id} value={paper.id}>
              {paper.title}
            </option>
          ))}
        </select>
        <p className="mt-1 text-xs text-stone-500">
          Choose which paper this video will explain.
        </p>
      </div>

      {/* Video title */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-stone-700 mb-1">
          Video Title <span className="text-red-500">*</span>
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
          placeholder="e.g., 5-Minute Summary of My Climate Research"
        />
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-stone-700 mb-1">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 resize-none"
          placeholder="Brief description of what viewers will learn..."
        />
      </div>

      {/* Submit */}
      <div className="flex items-center gap-4 pt-4">
        <Button
          type="submit"
          className="bg-teal-600 hover:bg-teal-700 text-white"
          disabled={isLoading}
        >
          {isLoading ? 'Creating...' : 'Create Draft & Continue'}
        </Button>
      </div>

      {/* Note about recording */}
      <div className="pt-4 border-t border-stone-200">
        <p className="text-sm text-stone-500">
          <strong>Note:</strong> After creating a draft, you&apos;ll be able to upload or record 
          your video. We support MP4, WebM, and MOV formats up to 500MB.
        </p>
      </div>
    </form>
  );
}

