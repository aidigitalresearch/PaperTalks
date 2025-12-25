/**
 * ImageKit.io Client (Indian Company 🇮🇳)
 * 
 * Combined image optimization + video streaming.
 * Servers in India = faster for Indian users.
 * INR billing available.
 * 
 * Pricing:
 * - Free: 20GB delivery/mo
 * - Pro: $49/mo (₹4,070) - 225GB delivery
 * 
 * Setup:
 * 1. Sign up at imagekit.io
 * 2. Get credentials from dashboard
 * 3. Add environment variables
 */

import ImageKit from 'imagekit';

// Initialize ImageKit
const imagekit = new ImageKit({
  publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || '',
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY || '',
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || '',
});

export { imagekit };

// Types
interface UploadResponse {
  fileId: string;
  name: string;
  url: string;
  thumbnailUrl: string;
  filePath: string;
  fileType: string;
  size: number;
  width?: number;
  height?: number;
}

interface VideoMetadata {
  duration: number;
  width: number;
  height: number;
  bitRate: number;
}

/**
 * Upload a video file
 */
export async function uploadVideo(
  file: Buffer | string, // Buffer or base64
  fileName: string,
  folder: string = '/videos'
): Promise<UploadResponse> {
  const response = await imagekit.upload({
    file,
    fileName,
    folder,
    useUniqueFileName: true,
    tags: ['video', 'explainer'],
  });

  return response as UploadResponse;
}

/**
 * Upload an image (thumbnail, avatar, etc.)
 */
export async function uploadImage(
  file: Buffer | string,
  fileName: string,
  folder: string = '/images'
): Promise<UploadResponse> {
  const response = await imagekit.upload({
    file,
    fileName,
    folder,
    useUniqueFileName: true,
  });

  return response as UploadResponse;
}

/**
 * Get authentication parameters for client-side upload
 * Use this for direct browser uploads
 */
export function getAuthenticationParameters(): {
  token: string;
  expire: number;
  signature: string;
} {
  return imagekit.getAuthenticationParameters();
}

/**
 * Delete a file
 */
export async function deleteFile(fileId: string): Promise<void> {
  await imagekit.deleteFile(fileId);
}

/**
 * Get file details
 */
export async function getFileDetails(fileId: string): Promise<{
  fileId: string;
  name: string;
  url: string;
  filePath: string;
  size: number;
  fileType: string;
  customMetadata?: Record<string, unknown>;
}> {
  const details = await imagekit.getFileDetails(fileId);
  return details as {
    fileId: string;
    name: string;
    url: string;
    filePath: string;
    size: number;
    fileType: string;
    customMetadata?: Record<string, unknown>;
  };
}

/**
 * Generate optimized video URL with transformations
 */
export function getVideoUrl(
  filePath: string,
  options?: {
    quality?: number; // 1-100
    format?: 'mp4' | 'webm';
    width?: number;
    height?: number;
  }
): string {
  const transformations: Array<{ [key: string]: string | number }> = [];

  if (options?.quality) {
    transformations.push({ q: options.quality });
  }
  if (options?.format) {
    transformations.push({ f: options.format });
  }
  if (options?.width) {
    transformations.push({ w: options.width });
  }
  if (options?.height) {
    transformations.push({ h: options.height });
  }

  return imagekit.url({
    path: filePath,
    transformation: transformations.length > 0 ? transformations : undefined,
  });
}

/**
 * Generate adaptive streaming URL (HLS)
 */
export function getStreamingUrl(filePath: string): string {
  return imagekit.url({
    path: filePath,
    transformation: [{ ik: 'sr-360_480_720_1080' }], // Adaptive bitrate
  });
}

/**
 * Generate thumbnail from video
 */
export function getVideoThumbnail(
  filePath: string,
  options?: {
    width?: number;
    height?: number;
    time?: number; // seconds into video
  }
): string {
  const transformations: Array<{ [key: string]: string | number }> = [
    { 'so': options?.time || 1 }, // Screenshot at X seconds
  ];

  if (options?.width) {
    transformations.push({ w: options.width });
  }
  if (options?.height) {
    transformations.push({ h: options.height });
  }

  return imagekit.url({
    path: filePath,
    transformation: transformations,
  });
}

/**
 * Generate optimized image URL
 */
export function getImageUrl(
  filePath: string,
  options?: {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'auto' | 'webp' | 'jpg' | 'png';
    blur?: number;
  }
): string {
  const transformations: Array<{ [key: string]: string | number }> = [];

  if (options?.width) {
    transformations.push({ w: options.width });
  }
  if (options?.height) {
    transformations.push({ h: options.height });
  }
  if (options?.quality) {
    transformations.push({ q: options.quality });
  }
  if (options?.format) {
    transformations.push({ f: options.format });
  }
  if (options?.blur) {
    transformations.push({ bl: options.blur });
  }

  return imagekit.url({
    path: filePath,
    transformation: transformations.length > 0 ? transformations : undefined,
  });
}

/**
 * Generate avatar URL with face detection
 */
export function getAvatarUrl(filePath: string, size: number = 100): string {
  return imagekit.url({
    path: filePath,
    transformation: [
      { w: size, h: size },
      { fo: 'face' }, // Focus on face
      { r: 'max' }, // Circular crop
    ],
  });
}

/**
 * Bulk delete files
 */
export async function bulkDeleteFiles(fileIds: string[]): Promise<void> {
  await imagekit.bulkDeleteFiles(fileIds);
}

/**
 * List files in a folder
 */
export async function listFiles(
  folder: string,
  options?: {
    limit?: number;
    skip?: number;
    type?: 'file' | 'folder';
  }
): Promise<Array<{
  fileId: string;
  name: string;
  url: string;
  filePath: string;
  size: number;
  fileType: string;
}>> {
  const files = await imagekit.listFiles({
    path: folder,
    limit: options?.limit || 100,
    skip: options?.skip || 0,
    type: options?.type || 'file',
  });

  return files as Array<{
    fileId: string;
    name: string;
    url: string;
    filePath: string;
    size: number;
    fileType: string;
  }>;
}

