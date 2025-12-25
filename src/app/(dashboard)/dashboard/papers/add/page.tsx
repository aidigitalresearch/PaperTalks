/**
 * Add Paper Page
 */

import { Container } from '@/components/ui/container';
import { AddPaperForm } from '@/features/papers/components/AddPaperForm';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Add Paper',
  description: 'Add a research paper to your PaperTalks profile.',
};

export default function AddPaperPage() {
  return (
    <div className="py-8">
      <Container>
        <div className="max-w-2xl">
          {/* Header */}
          <div className="mb-8">
            <Link
              href="/dashboard/papers"
              className="inline-flex items-center text-sm text-stone-600 hover:text-stone-900 mb-4"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-1" />
              Back to Papers
            </Link>
            <h1 className="font-serif text-3xl font-semibold text-stone-900">
              Add Paper
            </h1>
            <p className="mt-2 text-stone-600">
              Import your publication using its DOI for automatic metadata lookup.
            </p>
          </div>

          {/* Add paper form */}
          <AddPaperForm />
        </div>
      </Container>
    </div>
  );
}

function ArrowLeftIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <path d="M19 12H5" />
      <path d="M12 19l-7-7 7-7" />
    </svg>
  );
}

