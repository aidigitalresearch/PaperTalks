/**
 * Bunny.net Stream Client
 * 
 * Used for video upload, transcoding, and streaming.
 * Much cheaper than Mux for bootstrapping phase.
 * 
 * Pricing: ~$0.005/GB storage, ~$0.01/GB delivery
 * 
 * Setup:
 * 1. Create Bunny.net account
 * 2. Create a Stream Library
 * 3. Get API key and Library ID
 * 4. Add environment variables
 */

const BUNNY_API_KEY = process.env.BUNNY_STREAM_API_KEY || '';
const BUNNY_LIBRARY_ID = process.env.BUNNY_STREAM_LIBRARY_ID || '';
const BUNNY_API_URL = `https://video.bunnycdn.com/library/${BUNNY_LIBRARY_ID}`;

interface BunnyVideo {
  guid: string;
  title: string;
  status: number; // 0: created, 1: uploading, 2: processing, 3: transcoding, 4: finished, 5: error
  length: number;
  views: number;
  thumbnailFileName: string;
  dateUploaded: string;
  storageSize: number;
  encodeProgress: number;
}

interface CreateVideoResponse {
  guid: string;
  title: string;
}

/**
 * Create a new video placeholder (required before upload)
 */
export async function createVideo(title: string): Promise<CreateVideoResponse> {
  const response = await fetch(`${BUNNY_API_URL}/videos`, {
    method: 'POST',
    headers: {
      'AccessKey': BUNNY_API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ title }),
  });

  if (!response.ok) {
    throw new Error(`Failed to create video: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Get upload URL for direct browser upload (TUS protocol)
 */
export function getUploadUrl(videoId: string): {
  uploadUrl: string;
  headers: Record<string, string>;
} {
  return {
    uploadUrl: `https://video.bunnycdn.com/tusupload`,
    headers: {
      'AuthorizationSignature': generateUploadSignature(videoId),
      'AuthorizationExpire': String(Math.floor(Date.now() / 1000) + 3600),
      'VideoId': videoId,
      'LibraryId': BUNNY_LIBRARY_ID,
    },
  };
}

/**
 * Generate upload signature for TUS upload
 */
function generateUploadSignature(videoId: string): string {
  const crypto = require('crypto');
  const expireTime = Math.floor(Date.now() / 1000) + 3600;
  const signatureString = `${BUNNY_LIBRARY_ID}${BUNNY_API_KEY}${expireTime}${videoId}`;
  return crypto.createHash('sha256').update(signatureString).digest('hex');
}

/**
 * Upload video directly from server (for small files)
 */
export async function uploadVideo(videoId: string, videoBuffer: Buffer): Promise<void> {
  const response = await fetch(`${BUNNY_API_URL}/videos/${videoId}`, {
    method: 'PUT',
    headers: {
      'AccessKey': BUNNY_API_KEY,
      'Content-Type': 'application/octet-stream',
    },
    body: videoBuffer as unknown as BodyInit,
  });

  if (!response.ok) {
    throw new Error(`Failed to upload video: ${response.statusText}`);
  }
}

/**
 * Get video details
 */
export async function getVideo(videoId: string): Promise<BunnyVideo> {
  const response = await fetch(`${BUNNY_API_URL}/videos/${videoId}`, {
    headers: {
      'AccessKey': BUNNY_API_KEY,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to get video: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Delete a video
 */
export async function deleteVideo(videoId: string): Promise<void> {
  const response = await fetch(`${BUNNY_API_URL}/videos/${videoId}`, {
    method: 'DELETE',
    headers: {
      'AccessKey': BUNNY_API_KEY,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to delete video: ${response.statusText}`);
  }
}

/**
 * List all videos in the library
 */
export async function listVideos(page: number = 1, itemsPerPage: number = 100): Promise<{
  items: BunnyVideo[];
  totalItems: number;
}> {
  const response = await fetch(
    `${BUNNY_API_URL}/videos?page=${page}&itemsPerPage=${itemsPerPage}`,
    {
      headers: {
        'AccessKey': BUNNY_API_KEY,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to list videos: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Get the embed/playback URL for a video
 */
export function getPlaybackUrl(videoId: string): string {
  const pullZone = process.env.BUNNY_STREAM_PULL_ZONE || 'vz-abc123';
  return `https://${pullZone}.b-cdn.net/${videoId}/play.mp4`;
}

/**
 * Get the HLS streaming URL for adaptive playback
 */
export function getHlsUrl(videoId: string): string {
  const pullZone = process.env.BUNNY_STREAM_PULL_ZONE || 'vz-abc123';
  return `https://${pullZone}.b-cdn.net/${videoId}/playlist.m3u8`;
}

/**
 * Get thumbnail URL
 */
export function getThumbnailUrl(videoId: string, thumbnailFileName?: string): string {
  const pullZone = process.env.BUNNY_STREAM_PULL_ZONE || 'vz-abc123';
  const filename = thumbnailFileName || 'thumbnail.jpg';
  return `https://${pullZone}.b-cdn.net/${videoId}/${filename}`;
}

/**
 * Get video embed iframe HTML
 */
export function getEmbedHtml(videoId: string, width: number = 640, height: number = 360): string {
  const pullZone = process.env.BUNNY_STREAM_PULL_ZONE || 'vz-abc123';
  return `<iframe src="https://iframe.mediadelivery.net/embed/${BUNNY_LIBRARY_ID}/${videoId}" 
    width="${width}" height="${height}" 
    frameborder="0" 
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
    allowfullscreen>
  </iframe>`;
}

/**
 * Check if video is ready for playback
 */
export function isVideoReady(status: number): boolean {
  return status === 4; // 4 = finished transcoding
}

/**
 * Get human-readable status
 */
export function getVideoStatus(status: number): string {
  const statusMap: Record<number, string> = {
    0: 'created',
    1: 'uploading',
    2: 'processing',
    3: 'transcoding',
    4: 'ready',
    5: 'error',
  };
  return statusMap[status] || 'unknown';
}

