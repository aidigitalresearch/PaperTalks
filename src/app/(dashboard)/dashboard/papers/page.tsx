/**
 * Papers List Page
 */

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { Container } from '@/components/ui/container';
import { PapersList } from '@/features/papers/components/PapersList';
import { OrcidImport } from '@/features/papers/components/OrcidImport';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Papers',
  description: 'Manage your research papers on PaperTalks.',
};

export default async function PapersPage() {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect('/login');
  }

  // Get user's profile for ORCID iD
  const { data: profile } = await supabase
    .from('profiles')
    .select('orcid_id')
    .eq('id', user.id)
    .single();

  // Get papers
  const { data: papers } = await supabase
    .from('papers')
    .select(`
      *,
      videos:videos(count)
    `)
    .eq('researcher_id', user.id)
    .order('created_at', { ascending: false });

  // Check if any papers need enrichment (no authors)
  const papersNeedEnrichment = papers?.some(p => {
    const authors = p.authors as string[] | null;
    return (!authors || authors.length === 0) && !p.doi?.startsWith('orcid-');
  }) || false;

  return (
    <div className="py-8">
      <Container>
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-serif text-3xl font-semibold text-stone-900">
              My Papers
            </h1>
            <p className="mt-2 text-stone-600">
              Manage your research publications and create video explainers.
            </p>
          </div>
          <Link
            href="/dashboard/papers/add"
            className="inline-flex items-center justify-center rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700 transition-colors"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Paper
          </Link>
        </div>

        {/* ORCID Import */}
        <div className="mb-6">
          <OrcidImport 
            orcidId={profile?.orcid_id} 
            hasPapers={(papers?.length || 0) > 0}
            papersNeedEnrichment={papersNeedEnrichment}
          />
        </div>

        {/* Papers list */}
        <PapersList papers={papers || []} />
      </Container>
    </div>
  );
}

function PlusIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}
