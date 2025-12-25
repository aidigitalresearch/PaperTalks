'use client';

/**
 * Profile Edit Form
 */

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { updateProfile } from '../actions';
import type { Profile } from '@/types/database';

interface ProfileFormProps {
  profile: Profile | null;
  userEmail: string;
}

export function ProfileForm({ profile, userEmail }: ProfileFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  async function handleSubmit(formData: FormData) {
    setIsLoading(true);
    setMessage(null);

    const result = await updateProfile(formData);

    if (result.error) {
      setMessage({ type: 'error', text: result.error });
    } else if (result.success) {
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    }

    setIsLoading(false);
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      {/* Message */}
      {message && (
        <div
          className={`p-4 rounded-lg ${
            message.type === 'success'
              ? 'bg-teal-50 border border-teal-200 text-teal-800'
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Email (read-only) */}
      <div>
        <label className="block text-sm font-medium text-stone-700 mb-1">
          Email
        </label>
        <input
          type="email"
          value={userEmail}
          disabled
          className="w-full rounded-lg border border-stone-200 bg-stone-50 px-3 py-2 text-sm text-stone-500"
        />
        <p className="mt-1 text-xs text-stone-500">
          Email cannot be changed. Contact support if needed.
        </p>
      </div>

      {/* Name */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-stone-700 mb-1">
          Full Name <span className="text-red-500">*</span>
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          defaultValue={profile?.name || ''}
          className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
          placeholder="Dr. Jane Smith"
        />
      </div>

      {/* ORCID */}
      <div>
        <label htmlFor="orcid_id" className="block text-sm font-medium text-stone-700 mb-1">
          ORCID iD
        </label>
        <div className="flex items-center gap-2">
          <span className="text-sm text-stone-500">https://orcid.org/</span>
          <input
            id="orcid_id"
            name="orcid_id"
            type="text"
            defaultValue={profile?.orcid_id || ''}
            className="flex-1 rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
            placeholder="0000-0000-0000-0000"
            pattern="\d{4}-\d{4}-\d{4}-\d{3}[\dX]"
          />
        </div>
        <p className="mt-1 text-xs text-stone-500">
          Link your ORCID for verification. <a href="https://orcid.org" target="_blank" rel="noopener noreferrer" className="text-teal-600 hover:underline">Get an ORCID</a>
        </p>
      </div>

      {/* Institution */}
      <div>
        <label htmlFor="institution" className="block text-sm font-medium text-stone-700 mb-1">
          Institution
        </label>
        <input
          id="institution"
          name="institution"
          type="text"
          defaultValue={profile?.institution || ''}
          className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
          placeholder="Massachusetts Institute of Technology"
        />
      </div>

      {/* Department */}
      <div>
        <label htmlFor="department" className="block text-sm font-medium text-stone-700 mb-1">
          Department
        </label>
        <input
          id="department"
          name="department"
          type="text"
          defaultValue={profile?.department || ''}
          className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
          placeholder="Computer Science"
        />
      </div>

      {/* Bio */}
      <div>
        <label htmlFor="bio" className="block text-sm font-medium text-stone-700 mb-1">
          Bio
        </label>
        <textarea
          id="bio"
          name="bio"
          rows={4}
          defaultValue={profile?.bio || ''}
          className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 resize-none"
          placeholder="Tell us about your research interests and expertise..."
        />
        <p className="mt-1 text-xs text-stone-500">
          Brief description of your research focus (max 500 characters).
        </p>
      </div>

      {/* Submit */}
      <div className="flex items-center gap-4 pt-4">
        <Button
          type="submit"
          className="bg-teal-600 hover:bg-teal-700 text-white"
          disabled={isLoading}
        >
          {isLoading ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </form>
  );
}

