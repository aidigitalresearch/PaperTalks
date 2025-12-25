'use server';

/**
 * Videos Server Actions
 */

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { nanoid } from 'nanoid';

export interface VideoFormData {
  paper_id: string;
  title: string;
  description?: string;
}

export interface VideoActionResult {
  error?: string;
  success?: boolean;
  video?: { id: string; vri: string };
}

/**
 * Generate a unique Video Research Identifier (VRI)
 */
function generateVRI(): string {
  // Format: VRI-XXXXXXXX (8 character alphanumeric)
  return `VRI-${nanoid(8).toUpperCase()}`;
}

/**
 * Create a new video draft
 */
export async function createVideoDraft(formData: FormData): Promise<VideoActionResult> {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return { error: 'Not authenticated' };
  }

  const paper_id = formData.get('paper_id') as string;
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;

  if (!paper_id) {
    return { error: 'Paper is required' };
  }

  if (!title || title.trim().length === 0) {
    return { error: 'Title is required' };
  }

  // Verify the paper belongs to this user
  const { data: paper } = await supabase
    .from('papers')
    .select('id')
    .eq('id', paper_id)
    .eq('researcher_id', user.id)
    .single();

  if (!paper) {
    return { error: 'Paper not found' };
  }

  const vri = generateVRI();

  const { data, error } = await supabase
    .from('videos')
    .insert({
      vri,
      paper_id,
      researcher_id: user.id,
      title: title.trim(),
      description: description?.trim() || null,
      status: 'draft',
    })
    .select('id, vri')
    .single();

  if (error) {
    console.error('Create video error:', error);
    return { error: 'Failed to create video draft' };
  }

  revalidatePath('/dashboard/videos');
  
  return { success: true, video: data };
}

/**
 * Update video metadata
 */
export async function updateVideo(videoId: string, formData: FormData): Promise<VideoActionResult> {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return { error: 'Not authenticated' };
  }

  const title = formData.get('title') as string;
  const description = formData.get('description') as string;

  if (!title || title.trim().length === 0) {
    return { error: 'Title is required' };
  }

  const { error } = await supabase
    .from('videos')
    .update({
      title: title.trim(),
      description: description?.trim() || null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', videoId)
    .eq('researcher_id', user.id);

  if (error) {
    console.error('Update video error:', error);
    return { error: 'Failed to update video' };
  }

  revalidatePath('/dashboard/videos');
  revalidatePath(`/dashboard/videos/${videoId}`);
  
  return { success: true };
}

/**
 * Delete a video
 */
export async function deleteVideo(videoId: string): Promise<VideoActionResult> {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return { error: 'Not authenticated' };
  }

  const { error } = await supabase
    .from('videos')
    .delete()
    .eq('id', videoId)
    .eq('researcher_id', user.id);

  if (error) {
    console.error('Delete video error:', error);
    return { error: 'Failed to delete video' };
  }

  revalidatePath('/dashboard/videos');
  
  return { success: true };
}

/**
 * Publish a video (change status to published)
 */
export async function publishVideo(videoId: string): Promise<VideoActionResult> {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return { error: 'Not authenticated' };
  }

  // Check if video has a video_url (uploaded)
  const { data: video } = await supabase
    .from('videos')
    .select('video_url')
    .eq('id', videoId)
    .eq('researcher_id', user.id)
    .single();

  if (!video) {
    return { error: 'Video not found' };
  }

  if (!video.video_url) {
    return { error: 'Video must be uploaded before publishing' };
  }

  const { error } = await supabase
    .from('videos')
    .update({
      status: 'published',
      published_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', videoId)
    .eq('researcher_id', user.id);

  if (error) {
    console.error('Publish video error:', error);
    return { error: 'Failed to publish video' };
  }

  revalidatePath('/dashboard/videos');
  
  return { success: true };
}

/**
 * Get all videos for current user
 */
export async function getVideos() {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return [];
  }

  const { data: videos } = await supabase
    .from('videos')
    .select(`
      *,
      paper:papers(title, doi)
    `)
    .eq('researcher_id', user.id)
    .order('created_at', { ascending: false });

  return videos || [];
}

