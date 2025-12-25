/**
 * Public Researcher Profile Page
 * 
 * URL: /researcher/[id]
 * 
 * TODO: Fetch researcher data from Supabase
 * - Profile info (name, institution, bio, ORCID)
 * - Publications list
 * - Video explainers
 * - Teaching Credit Score
 * - Badges and achievements
 */

import { Container } from "@/components/ui/container";

interface ResearcherPageProps {
  params: Promise<{ id: string }>;
}

export default async function ResearcherPage({ params }: ResearcherPageProps) {
  const { id } = await params;
  
  // TODO: Fetch researcher from Supabase
  // const supabase = createServerSupabaseClient();
  // const { data: researcher } = await supabase
  //   .from('profiles')
  //   .select('*')
  //   .eq('id', id)
  //   .single();

  return (
    <Container>
      <div className="py-12">
        <h1 className="font-serif text-3xl font-semibold text-stone-900">
          Researcher Profile
        </h1>
        <p className="mt-4 text-stone-600">
          Profile for researcher ID: {id}
        </p>
        <p className="mt-2 text-sm text-stone-500">
          Profile pages coming soon.
        </p>
        {/* TODO: Implement full profile layout */}
      </div>
    </Container>
  );
}

export async function generateMetadata({ params }: ResearcherPageProps) {
  const { id } = await params;
  // TODO: Fetch researcher name for dynamic metadata
  return {
    title: `Researcher ${id}`,
    description: `View research profile and video explainers.`,
  };
}

