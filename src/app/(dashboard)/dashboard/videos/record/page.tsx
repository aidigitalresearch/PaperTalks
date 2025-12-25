/**
 * Record Video Page
 */

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { Container } from '@/components/ui/container';
import { RecordVideoForm } from '@/features/videos/components/RecordVideoForm';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Record Video',
  description: 'Record a new research explainer video.',
};

interface RecordVideoPageProps {
  searchParams: Promise<{ paper?: string }>;
}

export default async function RecordVideoPage({ searchParams }: RecordVideoPageProps) {
  const supabase = await createClient();
  const params = await searchParams;
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect('/login');
  }

  // Get user's papers
  const { data: papers } = await supabase
    .from('papers')
    .select('id, title, doi')
    .eq('researcher_id', user.id)
    .order('created_at', { ascending: false });

  if (!papers || papers.length === 0) {
    redirect('/dashboard/papers/add');
  }

  const selectedPaperId = params.paper || papers[0]?.id;

  return (
    <div className="py-8">
      <Container>
        <div className="max-w-2xl">
          {/* Header */}
          <div className="mb-8">
            <Link
              href="/dashboard/videos"
              className="inline-flex items-center text-sm text-stone-600 hover:text-stone-900 mb-4"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-1" />
              Back to Videos
            </Link>
            <h1 className="font-serif text-3xl font-semibold text-stone-900">
              Record Explainer Video
            </h1>
            <p className="mt-2 text-stone-600">
              Create a short video explaining your research paper.
            </p>
          </div>

          {/* Tips */}
          <div className="mb-8 p-4 rounded-lg bg-teal-50 border border-teal-200">
            <h3 className="font-medium text-teal-800 mb-2">Tips for a great explainer:</h3>
            <ul className="text-sm text-teal-700 space-y-1">
              <li>• Keep it under 5 minutes</li>
              <li>• Explain your key findings in simple terms</li>
              <li>• Use visual aids or slides when helpful</li>
              <li>• Speak clearly and at a moderate pace</li>
            </ul>
          </div>

          {/* Record form */}
          <RecordVideoForm papers={papers} selectedPaperId={selectedPaperId} />
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

