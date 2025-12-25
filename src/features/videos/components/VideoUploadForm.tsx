'use client';

/**
 * Video Upload Form Component
 * 
 * TODO: Integrate with Mux or Cloudflare Stream for video processing
 */

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

interface VideoUploadFormProps {
  videoId: string;
}

export function VideoUploadForm({ videoId: _videoId }: VideoUploadFormProps) {
  // videoId will be used when integrating with Mux/Cloudflare Stream
  void _videoId;
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['video/mp4', 'video/webm', 'video/quicktime'];
    if (!validTypes.includes(file.type)) {
      setError('Please select a valid video file (MP4, WebM, or MOV)');
      return;
    }

    // Validate file size (500MB max)
    const maxSize = 500 * 1024 * 1024;
    if (file.size > maxSize) {
      setError('File size must be less than 500MB');
      return;
    }

    setSelectedFile(file);
    setError(null);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setError(null);

    try {
      // TODO: Replace with actual Mux/Cloudflare Stream upload
      // This is a placeholder that simulates upload progress
      
      // Simulate upload progress
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 200));
        setUploadProgress(i);
      }

      // For now, just show a message about the placeholder
      // In production, this would:
      // 1. Get an upload URL from your API
      // 2. Upload the file to Mux/Cloudflare Stream
      // 3. Update the video record with the video_url
      
      alert('Upload simulation complete! In production, this would upload to Mux or Cloudflare Stream.');
      
      router.push('/dashboard/videos');
    } catch (err) {
      console.error('Upload error:', err);
      setError('Failed to upload video. Please try again.');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-6">
      {/* Error message */}
      {error && (
        <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-800">
          {error}
        </div>
      )}

      {/* Upload area */}
      <div
        className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
          selectedFile
            ? 'border-teal-300 bg-teal-50'
            : 'border-stone-300 hover:border-stone-400'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="video/mp4,video/webm,video/quicktime"
          onChange={handleFileSelect}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={isUploading}
        />

        {selectedFile ? (
          <div>
            <VideoIcon className="h-12 w-12 text-teal-600 mx-auto mb-4" />
            <p className="font-medium text-stone-900 mb-1">{selectedFile.name}</p>
            <p className="text-sm text-stone-500">{formatFileSize(selectedFile.size)}</p>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedFile(null);
                if (fileInputRef.current) {
                  fileInputRef.current.value = '';
                }
              }}
              className="mt-4 text-sm text-red-600 hover:text-red-700"
            >
              Remove file
            </button>
          </div>
        ) : (
          <div>
            <UploadIcon className="h-12 w-12 text-stone-400 mx-auto mb-4" />
            <p className="font-medium text-stone-900 mb-1">
              Drag & drop your video here
            </p>
            <p className="text-sm text-stone-500">
              or click to browse (MP4, WebM, MOV up to 500MB)
            </p>
          </div>
        )}
      </div>

      {/* Upload progress */}
      {isUploading && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-stone-600">Uploading...</span>
            <span className="font-medium text-stone-900">{uploadProgress}%</span>
          </div>
          <div className="h-2 bg-stone-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-teal-600 transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-4">
        <Button
          type="button"
          onClick={handleUpload}
          disabled={!selectedFile || isUploading}
          className="bg-teal-600 hover:bg-teal-700 text-white disabled:opacity-50"
        >
          {isUploading ? 'Uploading...' : 'Upload Video'}
        </Button>
        <button
          type="button"
          onClick={() => router.push('/dashboard/videos')}
          className="text-sm text-stone-600 hover:text-stone-900"
          disabled={isUploading}
        >
          Cancel
        </button>
      </div>

      {/* Info note */}
      <div className="pt-4 border-t border-stone-200">
        <p className="text-sm text-stone-500">
          <strong>Note:</strong> Video upload is currently in demo mode. Full integration 
          with Mux or Cloudflare Stream will be available soon. Videos will be 
          processed and optimized for streaming after upload.
        </p>
      </div>
    </div>
  );
}

function UploadIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
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

