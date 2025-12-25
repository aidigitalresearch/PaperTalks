/**
 * Early Access Signup Hook
 * 
 * Handles early access waitlist signups via API.
 */

import { useState, useCallback } from 'react';
import type { EarlyAccessFormData } from '@/types';

interface UseEarlyAccessReturn {
  isLoading: boolean;
  isSuccess: boolean;
  error: string | null;
  submit: (data: EarlyAccessFormData) => Promise<void>;
  reset: () => void;
}

/**
 * Hook for early access signup form
 * 
 * Usage:
 * ```tsx
 * const { submit, isLoading, isSuccess, error } = useEarlyAccess();
 * 
 * const handleSubmit = async (e: FormEvent) => {
 *   e.preventDefault();
 *   await submit({ email });
 * };
 * ```
 */
export function useEarlyAccess(): UseEarlyAccessReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = useCallback(async (data: EarlyAccessFormData) => {
    setIsLoading(true);
    setError(null);
    setIsSuccess(false);

    try {
      const response = await fetch('/api/early-access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error?.message || 'Failed to submit');
      }

      setIsSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setIsLoading(false);
    setIsSuccess(false);
    setError(null);
  }, []);

  return {
    isLoading,
    isSuccess,
    error,
    submit,
    reset,
  };
}
