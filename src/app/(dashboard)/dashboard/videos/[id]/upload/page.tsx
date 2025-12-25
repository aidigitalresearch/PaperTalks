/**
 * Video Upload Page
 */

import { redirect, notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { Container } from '@/components/ui/container';
import { VideoUploadForm } from '@/features/videos/components/VideoUploadForm';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Upload Video',
  description: 'Upload your research explainer video.',
};

interface UploadVideoPageProps {
  params: Promise<{ id: string }>;
}

export default async function UploadVideoPage({ params }: UploadVideoPageProps) {
  const supabase = await createClient();
  const { id } = await params;
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect('/login');
  }

  // Get video details
  const { data: video } = await supabase
    .from('videos')
    .select(`
      *,
      paper:papers(title, doi)
    `)
    .eq('id', id)
    .eq('researcher_id', user.id)
    .single();

  if (!video) {
    notFound();
  }

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
              Upload Video
            </h1>
            <p className="mt-2 text-stone-600">
              Upload your video for &ldquo;{video.title}&rdquo;
            </p>
          </div>

          {/* Video info */}
          <div className="mb-8 p-4 rounded-lg bg-stone-50 border border-stone-200">
            <div className="flex items-start gap-3">
              <VideoIcon className="h-5 w-5 text-stone-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-stone-900">{video.title}</p>
                <p className="text-sm text-stone-500 mt-1">
                  VRI: {video.vri}
                </p>
                {video.paper && (
                  <p className="text-sm text-stone-500">
                    Paper: {video.paper.title}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Upload form */}
          <VideoUploadForm videoId={video.id} />
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

function VideoIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <polygon points="10 9 15 12 10 15 10 9" fill="currentColor" stroke="none" />
    </svg>
  );
}

