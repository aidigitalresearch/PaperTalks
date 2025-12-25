/**
 * Video Explainer Page
 * 
 * URL: /video/[vri]
 * VRI = Video Research Identifier (e.g., VRI:10.papertalks/2024.chen.0042)
 * 
 * TODO: Implement video player and metadata
 * - Video player (Mux or Cloudflare Stream)
 * - Paper information
 * - Researcher info
 * - Share and cite buttons
 * - Related videos
 * - Engagement analytics tracking
 */

import { Container } from "@/components/ui/container";

interface VideoPageProps {
  params: Promise<{ vri: string }>;
}

export default async function VideoPage({ params }: VideoPageProps) {
  const { vri } = await params;
  
  // TODO: Fetch video from Supabase
  // const supabase = createServerSupabaseClient();
  // const { data: video } = await supabase
  //   .from('videos')
  //   .select('*, researcher:profiles(*), paper:papers(*)')
  //   .eq('vri', decodeURIComponent(vri))
  //   .single();

  return (
    <Container>
      <div className="py-12">
        <h1 className="font-serif text-3xl font-semibold text-stone-900">
          Video Explainer
        </h1>
        <p className="mt-4 text-stone-600">
          VRI: {decodeURIComponent(vri)}
        </p>
        <p className="mt-2 text-sm text-stone-500">
          Video player coming soon.
        </p>
        {/* TODO: Implement video player and metadata */}
      </div>
    </Container>
  );
}

export async function generateMetadata({ params }: VideoPageProps) {
  const { vri } = await params;
  // TODO: Fetch video title for dynamic metadata
  return {
    title: `Video Explainer`,
    description: `Watch research explainer video ${decodeURIComponent(vri)}`,
  };
}

