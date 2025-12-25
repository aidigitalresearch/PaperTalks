/**
 * Videos List Page
 */

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { Container } from '@/components/ui/container';
import { VideosList } from '@/features/videos/components/VideosList';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Videos',
  description: 'Manage your research explainer videos on PaperTalks.',
};

export default async function VideosPage() {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect('/login');
  }

  const { data: videos } = await supabase
    .from('videos')
    .select(`
      *,
      paper:papers(title, doi)
    `)
    .eq('researcher_id', user.id)
    .order('created_at', { ascending: false });

  // Check if user has any papers for the record button
  const { count: papersCount } = await supabase
    .from('papers')
    .select('*', { count: 'exact', head: true })
    .eq('researcher_id', user.id);

  return (
    <div className="py-8">
      <Container>
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-serif text-3xl font-semibold text-stone-900">
              My Videos
            </h1>
            <p className="mt-2 text-stone-600">
              Manage your research explainer videos.
            </p>
          </div>
          {(papersCount && papersCount > 0) ? (
            <Link
              href="/dashboard/videos/record"
              className="inline-flex items-center justify-center rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700 transition-colors"
            >
              <RecordIcon className="h-4 w-4 mr-2" />
              Record Video
            </Link>
          ) : (
            <Link
              href="/dashboard/papers/add"
              className="inline-flex items-center justify-center rounded-lg bg-stone-600 px-4 py-2 text-sm font-medium text-white hover:bg-stone-700 transition-colors"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Add Paper First
            </Link>
          )}
        </div>

        {/* Videos list */}
        <VideosList videos={videos || []} />
      </Container>
    </div>
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

function PlusIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

