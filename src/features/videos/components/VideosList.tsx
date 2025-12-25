'use client';

/**
 * Videos List Component
 */

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Video, Paper } from '@/types/database';
import { deleteVideo } from '../actions';

type VideoWithPaper = Video & {
  paper?: Pick<Paper, 'title' | 'doi'> | null;
};

interface VideosListProps {
  videos: VideoWithPaper[];
}

const STATUS_STYLES: Record<string, { label: string; class: string }> = {
  draft: { label: 'Draft', class: 'bg-stone-100 text-stone-600' },
  processing: { label: 'Processing', class: 'bg-amber-100 text-amber-700' },
  published: { label: 'Published', class: 'bg-teal-100 text-teal-700' },
  unlisted: { label: 'Unlisted', class: 'bg-purple-100 text-purple-700' },
  archived: { label: 'Archived', class: 'bg-stone-100 text-stone-500' },
};

export function VideosList({ videos }: VideosListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleDelete(videoId: string) {
    if (!confirm('Are you sure you want to delete this video? This action cannot be undone.')) {
      return;
    }

    setDeletingId(videoId);
    await deleteVideo(videoId);
    setDeletingId(null);
  }

  if (videos.length === 0) {
    return (
      <div className="rounded-xl border border-stone-200 bg-white p-12 text-center">
        <VideoIcon className="h-12 w-12 text-stone-300 mx-auto mb-4" />
        <h3 className="font-medium text-stone-900 mb-2">No videos yet</h3>
        <p className="text-stone-500 mb-6">
          Record your first explainer video to share your research.
        </p>
        <Link
          href="/dashboard/videos/record"
          className="inline-flex items-center justify-center rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700 transition-colors"
        >
          Record Your First Video
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {videos.map((video) => {
        const statusStyle = STATUS_STYLES[video.status] || STATUS_STYLES.draft;

        return (
          <div
            key={video.id}
            className="group rounded-xl border border-stone-200 bg-white overflow-hidden hover:border-stone-300 hover:shadow-sm transition-all"
          >
            {/* Thumbnail */}
            <div className="relative aspect-video bg-stone-100">
              {video.thumbnail_url ? (
                <Image
                  src={video.thumbnail_url}
                  alt={video.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <VideoPlaceholderIcon className="h-12 w-12 text-stone-300" />
                </div>
              )}

              {/* Duration badge */}
              {video.duration && (
                <span className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/70 text-white text-xs">
                  {formatDuration(video.duration)}
                </span>
              )}

              {/* Status badge */}
              <span className={`absolute top-2 left-2 px-2 py-0.5 rounded-full text-xs font-medium ${statusStyle.class}`}>
                {statusStyle.label}
              </span>
            </div>

            {/* Content */}
            <div className="p-4">
              <h3 className="font-medium text-stone-900 mb-1 line-clamp-2">
                {video.title}
              </h3>
              {video.paper && (
                <p className="text-sm text-stone-500 line-clamp-1">
                  {video.paper.title}
                </p>
              )}

              {/* Stats */}
              <div className="mt-3 flex items-center justify-between text-sm text-stone-500">
                <span className="flex items-center gap-1">
                  <EyeIcon className="h-4 w-4" />
                  {video.view_count} views
                </span>
                <span>VRI: {video.vri}</span>
              </div>

              {/* Actions */}
              <div className="mt-4 flex items-center gap-2">
                {video.status === 'draft' ? (
                  <Link
                    href={`/dashboard/videos/${video.id}/upload`}
                    className="flex-1 text-center px-3 py-2 rounded-lg bg-teal-600 text-white text-sm font-medium hover:bg-teal-700 transition-colors"
                  >
                    Upload Video
                  </Link>
                ) : (
                  <Link
                    href={`/video/${video.vri}`}
                    className="flex-1 text-center px-3 py-2 rounded-lg bg-stone-100 text-stone-700 text-sm font-medium hover:bg-stone-200 transition-colors"
                  >
                    View
                  </Link>
                )}
                <button
                  onClick={() => handleDelete(video.id)}
                  disabled={deletingId === video.id}
                  className="p-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                  title="Delete video"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Icons
function VideoIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <polygon points="10 9 15 12 10 15 10 9" fill="currentColor" stroke="none" />
    </svg>
  );
}

function VideoPlaceholderIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="M10 9l5 3-5 3V9z" fill="currentColor" stroke="none" />
    </svg>
  );
}

function EyeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function TrashIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  );
}

