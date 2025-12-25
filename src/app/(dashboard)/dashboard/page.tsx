/**
 * Dashboard Home
 * 
 * Main dashboard showing researcher overview - styled to match Analytics page.
 */

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { Container } from '@/components/ui/container';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Your PaperTalks research dashboard.',
};

export default async function DashboardPage() {
  const supabase = await createClient();
  
  // Get current user
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect('/login');
  }

  // Get profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  // Get papers with citations
  const { data: papers } = await supabase
    .from('papers')
    .select('id, citation_count')
    .eq('researcher_id', user.id);

  const papersCount = papers?.length || 0;
  const totalCitations = papers?.reduce((sum, p) => sum + (p.citation_count || 0), 0) || 0;

  // Get videos count
  const { count: videosCount } = await supabase
    .from('videos')
    .select('*', { count: 'exact', head: true })
    .eq('researcher_id', user.id);

  // Get teaching score
  const { data: teachingScore } = await supabase
    .from('teaching_scores')
    .select('*')
    .eq('researcher_id', user.id)
    .single();

  return (
    <div className="py-8">
      <Container>
        <div className="space-y-6">
          
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="font-serif text-3xl font-semibold text-stone-900">
                Welcome back{profile?.name ? `, ${getFirstName(profile.name)}` : ''}
              </h1>
              <p className="text-stone-500 mt-1">
                Here&apos;s an overview of your research profile
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="px-4 py-2 rounded-lg bg-teal-50 border border-teal-100">
                <span className="font-semibold text-teal-700">{papersCount}</span>
                <span className="text-teal-600 ml-1">papers</span>
              </div>
              <div className="px-4 py-2 rounded-lg bg-blue-50 border border-blue-100">
                <span className="font-semibold text-blue-700">{totalCitations.toLocaleString()}</span>
                <span className="text-blue-600 ml-1">citations</span>
              </div>
            </div>
          </div>

          {/* Profile completion alert */}
          {(!profile?.institution || !profile?.bio) && (
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
              <div className="flex items-start gap-3">
                <div className="p-1.5 rounded-lg bg-amber-100">
                  <AlertIcon className="h-4 w-4 text-amber-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-amber-800">Complete your profile</p>
                  <p className="text-sm text-amber-700 mt-1">
                    Add your institution and bio to help others discover your research.
                  </p>
                  <Link
                    href="/dashboard/profile"
                    className="inline-flex items-center text-sm font-medium text-amber-800 hover:text-amber-900 mt-2"
                  >
                    Complete profile →
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Stats grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard 
              href="/dashboard/papers"
              label="Papers"
              value={papersCount}
              icon={<DocumentIcon className="h-4 w-4" />}
              accentColor="teal"
            />
            <StatCard 
              href="/dashboard/videos"
              label="Videos"
              value={videosCount || 0}
              icon={<VideoIcon className="h-4 w-4" />}
              accentColor="purple"
            />
            <StatCard 
              href="/dashboard/analytics"
              label="Teaching Score"
              value={teachingScore?.overall_score || 0}
              suffix="/100"
              icon={<ChartIcon className="h-4 w-4" />}
              accentColor="blue"
            />
            <StatCard 
              href="/dashboard/analytics"
              label="Total Views"
              value={teachingScore?.total_views || 0}
              icon={<EyeIcon className="h-4 w-4" />}
              accentColor="amber"
            />
          </div>

          {/* Quick actions */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Add paper card */}
            <div className="rounded-xl border border-stone-200 bg-white p-6">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-1.5 rounded-lg bg-teal-100">
                  <DocumentIcon className="h-4 w-4 text-teal-600" />
                </div>
                <h2 className="font-semibold text-stone-900">Add a Paper</h2>
              </div>
              <p className="text-sm text-stone-500 mb-4">
                Import your publication using its DOI or add manually.
              </p>
              <Link
                href="/dashboard/papers/add"
                className="inline-flex items-center justify-center rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700 transition-colors"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Add Paper
              </Link>
            </div>

            {/* Record video card */}
            <div className="rounded-xl border border-stone-200 bg-white p-6">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-1.5 rounded-lg bg-purple-100">
                  <VideoRecordIcon className="h-4 w-4 text-purple-600" />
                </div>
                <h2 className="font-semibold text-stone-900">Record an Explainer</h2>
              </div>
              <p className="text-sm text-stone-500 mb-4">
                Create a short video explaining one of your papers.
              </p>
              <Link
                href="/dashboard/videos/record"
                className="inline-flex items-center justify-center rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 transition-colors"
              >
                <VideoRecordIcon className="h-4 w-4 mr-2" />
                Record Video
              </Link>
            </div>
          </div>

          {/* Recent activity */}
          <div className="rounded-xl border border-stone-200 bg-white p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-1.5 rounded-lg bg-stone-100">
                <ClockIcon className="h-4 w-4 text-stone-600" />
              </div>
              <h2 className="font-semibold text-stone-900">Recent Activity</h2>
            </div>
            <div className="text-center py-8 border border-dashed border-stone-200 rounded-lg">
              <p className="text-stone-400 text-sm">
                No recent activity yet. Start by adding a paper!
              </p>
            </div>
          </div>

        </div>
      </Container>
    </div>
  );
}

// Components
function StatCard({ 
  href, 
  label, 
  value, 
  suffix,
  icon,
  accentColor = 'teal' 
}: { 
  href: string;
  label: string; 
  value: string | number; 
  suffix?: string;
  icon: React.ReactNode;
  accentColor?: 'teal' | 'blue' | 'purple' | 'amber';
}) {
  const colorClasses = {
    teal: 'border-t-teal-500 hover:shadow-teal-100',
    blue: 'border-t-blue-500 hover:shadow-blue-100',
    purple: 'border-t-purple-500 hover:shadow-purple-100',
    amber: 'border-t-amber-500 hover:shadow-amber-100',
  };
  
  const textColors = {
    teal: 'text-teal-600',
    blue: 'text-blue-600',
    purple: 'text-purple-600',
    amber: 'text-amber-600',
  };

  const bgColors = {
    teal: 'bg-teal-100 text-teal-600',
    blue: 'bg-blue-100 text-blue-600',
    purple: 'bg-purple-100 text-purple-600',
    amber: 'bg-amber-100 text-amber-600',
  };
  
  return (
    <Link
      href={href}
      className={`group rounded-xl border border-stone-200 bg-white p-5 border-t-4 ${colorClasses[accentColor]} transition-shadow hover:shadow-md`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className={`p-1.5 rounded-lg ${bgColors[accentColor]}`}>
          {icon}
        </div>
        <span className="text-xs text-stone-400 group-hover:text-stone-500 transition-colors">
          View →
        </span>
      </div>
      <p className={`text-3xl font-bold ${textColors[accentColor]}`}>
        {value}
        {suffix && <span className="text-sm font-normal text-stone-400">{suffix}</span>}
      </p>
      <p className="text-sm text-stone-500 mt-1">{label}</p>
    </Link>
  );
}

// Helper function to get first name, handling titles like "Dr."
function getFirstName(fullName: string): string {
  const parts = fullName.trim().split(' ').filter(Boolean);
  const titles = ['dr.', 'dr', 'prof.', 'prof', 'mr.', 'mr', 'mrs.', 'mrs', 'ms.', 'ms'];
  
  for (const part of parts) {
    if (!titles.includes(part.toLowerCase())) {
      return part;
    }
  }
  return fullName;
}

// Icons
function DocumentIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  );
}

function VideoIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <polygon points="10 9 15 12 10 15 10 9" fill="currentColor" stroke="none" />
    </svg>
  );
}

function ChartIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <path d="M3 3v18h18" />
      <path d="M18 9l-5 5-4-4-3 3" />
    </svg>
  );
}

function EyeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function AlertIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
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

function VideoRecordIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="3" fill="currentColor" />
    </svg>
  );
}

function ClockIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}
