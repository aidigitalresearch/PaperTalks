/**
 * Paper Detail Page
 * 
 * URL: /paper/[id]
 * 
 * TODO: Implement paper details with video explainer
 * - Paper metadata (title, abstract, authors, DOI)
 * - Video explainer (if available)
 * - Researcher info
 * - Citation options (BibTeX, APA, etc.)
 * - Related papers
 */

import { Container } from "@/components/ui/container";

interface PaperPageProps {
  params: Promise<{ id: string }>;
}

export default async function PaperPage({ params }: PaperPageProps) {
  const { id } = await params;
  
  // TODO: Fetch paper from Supabase
  // const supabase = createServerSupabaseClient();
  // const { data: paper } = await supabase
  //   .from('papers')
  //   .select('*, researcher:profiles(*), video:videos(*)')
  //   .eq('id', id)
  //   .single();

  return (
    <Container>
      <div className="py-12">
        <h1 className="font-serif text-3xl font-semibold text-stone-900">
          Paper Details
        </h1>
        <p className="mt-4 text-stone-600">
          Paper ID: {id}
        </p>
        <p className="mt-2 text-sm text-stone-500">
          Paper pages coming soon.
        </p>
        {/* TODO: Implement full paper layout */}
      </div>
    </Container>
  );
}

export async function generateMetadata({ params }: PaperPageProps) {
  const { id } = await params;
  // TODO: Fetch paper title for dynamic metadata
  return {
    title: `Paper ${id}`,
    description: `View paper details and video explainer.`,
  };
}

