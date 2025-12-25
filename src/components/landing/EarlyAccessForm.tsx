'use client';

/**
 * Early Access Form Component
 * 
 * Email capture form for the waitlist.
 * Uses the useEarlyAccess hook to submit to the API.
 */

import { useState, FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { useEarlyAccess } from '@/hooks/useEarlyAccess';
import { Container } from '@/components/ui/container';

export function EarlyAccessForm() {
  const [email, setEmail] = useState('');
  const { submit, isLoading, isSuccess, error, reset } = useEarlyAccess();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    await submit({ email });
    if (!error) {
      setEmail('');
    }
  }

  if (isSuccess) {
    return (
      <section id="early-access" className="py-24 bg-stone-50 border-t border-stone-200">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-teal-100 flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="font-serif text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl">
              You&apos;re on the list!
            </h2>
            <p className="mt-4 text-lg text-stone-600">
              Thanks for signing up. We&apos;ll notify you when PaperTalks is ready for you.
            </p>
            <Button
              variant="outline"
              className="mt-6"
              onClick={reset}
            >
              Sign up another email
            </Button>
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section id="early-access" className="py-24 bg-stone-50 border-t border-stone-200">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-serif text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl">
            Get Early Access
          </h2>
          <p className="mt-4 text-lg text-stone-600">
            Be among the first researchers to join PaperTalks and shape the
            future of academic communication.
          </p>

          {error && (
            <div className="mt-6 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700 max-w-sm mx-auto">
              {error}
            </div>
          )}

          <form 
            onSubmit={handleSubmit}
            className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
          >
            <label htmlFor="early-access-email" className="sr-only">
              Email address
            </label>
            <input
              id="early-access-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              disabled={isLoading}
              className="w-full max-w-sm rounded-md border border-stone-300 bg-white px-4 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 disabled:opacity-50"
            />
            <Button 
              type="submit"
              className="w-full bg-teal-600 text-white hover:bg-teal-700 sm:w-auto"
              disabled={isLoading}
            >
              {isLoading ? 'Submitting...' : 'Request Access'}
            </Button>
          </form>

          <p className="mt-4 text-xs text-stone-500">
            We respect your privacy. No spam, ever.
          </p>
        </div>
      </Container>
    </section>
  );
}

