/**
 * Profile Edit Page
 */

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { Container } from '@/components/ui/container';
import { ProfileForm } from '@/features/profile/components/ProfileForm';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Edit Profile',
  description: 'Update your PaperTalks research profile.',
};

export default async function ProfilePage() {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect('/login');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  return (
    <div className="py-8">
      <Container>
        <div className="max-w-2xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-serif text-3xl font-semibold text-stone-900">
              Edit Profile
            </h1>
            <p className="mt-2 text-stone-600">
              Update your research profile information.
            </p>
          </div>

          {/* Profile form */}
          <ProfileForm profile={profile} userEmail={user.email || ''} />
        </div>
      </Container>
    </div>
  );
}

