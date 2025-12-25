/**
 * Settings Page
 */

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { Container } from '@/components/ui/container';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Settings',
  description: 'Manage your PaperTalks account settings.',
};

export default async function SettingsPage() {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect('/login');
  }

  return (
    <div className="py-8">
      <Container>
        <div className="max-w-2xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-serif text-3xl font-semibold text-stone-900">
              Settings
            </h1>
            <p className="mt-2 text-stone-600">
              Manage your account and preferences.
            </p>
          </div>

          {/* Account section */}
          <div className="space-y-8">
            {/* Email */}
            <section className="p-6 rounded-xl border border-stone-200 bg-white">
              <h2 className="font-medium text-stone-900 mb-4">Account</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">
                    Email Address
                  </label>
                  <p className="text-stone-600">{user.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">
                    Account Created
                  </label>
                  <p className="text-stone-600">
                    {new Date(user.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>
            </section>

            {/* Notifications */}
            <section className="p-6 rounded-xl border border-stone-200 bg-white">
              <h2 className="font-medium text-stone-900 mb-4">Notifications</h2>
              <p className="text-sm text-stone-500">
                Notification preferences will be available soon.
              </p>
            </section>

            {/* Privacy */}
            <section className="p-6 rounded-xl border border-stone-200 bg-white">
              <h2 className="font-medium text-stone-900 mb-4">Privacy</h2>
              <p className="text-sm text-stone-500">
                Privacy settings will be available soon.
              </p>
            </section>

            {/* Danger zone */}
            <section className="p-6 rounded-xl border border-red-200 bg-red-50">
              <h2 className="font-medium text-red-900 mb-4">Danger Zone</h2>
              <p className="text-sm text-red-700 mb-4">
                Once you delete your account, there is no going back. Please be certain.
              </p>
              <button
                type="button"
                disabled
                className="px-4 py-2 rounded-lg border border-red-300 text-red-700 text-sm font-medium hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Delete Account (Coming Soon)
              </button>
            </section>
          </div>
        </div>
      </Container>
    </div>
  );
}

