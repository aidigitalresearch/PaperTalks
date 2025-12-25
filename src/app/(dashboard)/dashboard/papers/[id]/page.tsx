/**
 * Edit Paper Page
 */

import { redirect, notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { Container } from '@/components/ui/container';
import { EditPaperForm } from '@/features/papers/components/EditPaperForm';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Edit Paper',
  description: 'Edit your research paper details.',
};

interface EditPaperPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPaperPage({ params }: EditPaperPageProps) {
  const { id } = await params;
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect('/login');
  }

  // Get the paper
  const { data: paper, error } = await supabase
    .from('papers')
    .select('*')
    .eq('id', id)
    .eq('researcher_id', user.id)
    .single();

  if (error || !paper) {
    notFound();
  }

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
              Edit Paper
            </h1>
            <p className="mt-2 text-stone-600">
              Update your publication details.
            </p>
          </div>

          {/* Edit paper form */}
          <EditPaperForm paper={paper} />
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

