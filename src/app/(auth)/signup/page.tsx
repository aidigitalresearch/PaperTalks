/**
 * Signup Page
 */

import { SignupForm } from '@/features/auth/components';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create Account',
  description: 'Create your PaperTalks research profile.',
};

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <SignupForm />
    </div>
  );
}
