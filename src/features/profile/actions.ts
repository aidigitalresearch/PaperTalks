'use server';

/**
 * Profile Server Actions
 */

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export interface ProfileFormData {
  name: string;
  institution?: string;
  department?: string;
  bio?: string;
  orcid_id?: string;
}

export interface ProfileActionResult {
  error?: string;
  success?: boolean;
}

/**
 * Update user profile
 */
export async function updateProfile(formData: FormData): Promise<ProfileActionResult> {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return { error: 'Not authenticated' };
  }

  const name = formData.get('name') as string;
  const institution = formData.get('institution') as string;
  const department = formData.get('department') as string;
  const bio = formData.get('bio') as string;
  const orcid_id = formData.get('orcid_id') as string;

  if (!name || name.trim().length === 0) {
    return { error: 'Name is required' };
  }

  // Validate ORCID format if provided
  if (orcid_id && orcid_id.trim().length > 0) {
    const orcidRegex = /^\d{4}-\d{4}-\d{4}-\d{3}[\dX]$/;
    if (!orcidRegex.test(orcid_id.trim())) {
      return { error: 'Invalid ORCID format. Expected: 0000-0000-0000-0000' };
    }
  }

  const { error } = await supabase
    .from('profiles')
    .update({
      name: name.trim(),
      institution: institution?.trim() || null,
      department: department?.trim() || null,
      bio: bio?.trim() || null,
      orcid_id: orcid_id?.trim() || null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', user.id);

  if (error) {
    console.error('Profile update error:', error);
    if (error.code === '23505') {
      return { error: 'This ORCID is already linked to another account' };
    }
    return { error: 'Failed to update profile' };
  }

  revalidatePath('/dashboard/profile');
  revalidatePath('/dashboard');
  
  return { success: true };
}

/**
 * Get current user profile
 */
export async function getProfile() {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return null;
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  return profile;
}

