/**
 * Supabase Client Exports
 * 
 * Usage:
 * - Browser: import { createClient } from '@/lib/supabase/client'
 * - Server: import { createClient } from '@/lib/supabase/server'
 */

// Re-export for convenience
export { createClient as createBrowserClient } from './client';
export { createClient as createServerClient } from './server';

