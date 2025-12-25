/**
 * Cloudflare R2 Storage Client
 * 
 * Used for storing paper PDFs, thumbnails, and static assets.
 * R2 is S3-compatible with zero egress fees.
 * 
 * Setup:
 * 1. Create R2 bucket in Cloudflare dashboard
 * 2. Generate API tokens with R2 permissions
 * 3. Add environment variables
 */

import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// R2 is S3-compatible
const R2 = new S3Client({
  region: 'auto',
  endpoint: process.env.CLOUDFLARE_R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY || '',
  },
});

const BUCKET_NAME = process.env.CLOUDFLARE_R2_BUCKET_NAME || 'papertalks';

export type FileType = 'pdf' | 'thumbnail' | 'avatar';

/**
 * Get the storage path for a file
 */
function getStoragePath(type: FileType, userId: string, filename: string): string {
  const timestamp = Date.now();
  switch (type) {
    case 'pdf':
      return `papers/${userId}/${timestamp}-${filename}`;
    case 'thumbnail':
      return `thumbnails/${userId}/${timestamp}-${filename}`;
    case 'avatar':
      return `avatars/${userId}/${filename}`;
    default:
      return `misc/${userId}/${timestamp}-${filename}`;
  }
}

/**
 * Upload a file to R2
 */
export async function uploadFile(
  file: Buffer | Uint8Array,
  type: FileType,
  userId: string,
  filename: string,
  contentType: string
): Promise<{ key: string; url: string }> {
  const key = getStoragePath(type, userId, filename);

  await R2.send(
    new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: file,
      ContentType: contentType,
    })
  );

  // Return the public URL (requires public bucket or Cloudflare CDN)
  const publicUrl = `${process.env.CLOUDFLARE_R2_PUBLIC_URL}/${key}`;

  return { key, url: publicUrl };
}

/**
 * Generate a presigned URL for direct upload (client-side uploads)
 */
export async function getPresignedUploadUrl(
  type: FileType,
  userId: string,
  filename: string,
  contentType: string,
  expiresIn: number = 3600 // 1 hour
): Promise<{ uploadUrl: string; key: string; publicUrl: string }> {
  const key = getStoragePath(type, userId, filename);

  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    ContentType: contentType,
  });

  const uploadUrl = await getSignedUrl(R2, command, { expiresIn });
  const publicUrl = `${process.env.CLOUDFLARE_R2_PUBLIC_URL}/${key}`;

  return { uploadUrl, key, publicUrl };
}

/**
 * Generate a presigned URL for reading a private file
 */
export async function getPresignedDownloadUrl(
  key: string,
  expiresIn: number = 3600
): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  });

  return getSignedUrl(R2, command, { expiresIn });
}

/**
 * Delete a file from R2
 */
export async function deleteFile(key: string): Promise<void> {
  await R2.send(
    new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    })
  );
}

/**
 * Get public URL for a stored file
 */
export function getPublicUrl(key: string): string {
  return `${process.env.CLOUDFLARE_R2_PUBLIC_URL}/${key}`;
}

