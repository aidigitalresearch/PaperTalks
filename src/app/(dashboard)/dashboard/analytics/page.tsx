/**
 * Analytics Page
 * 
 * Clean, professional analytics dashboard matching the overall design system.
 */

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { Container } from '@/components/ui/container';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Analytics',
  description: 'View your research analytics, citations, and teaching score.',
};

export default async function AnalyticsPage() {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect('/login');
  }

  // Get profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('name, created_at')
    .eq('id', user.id)
    .single();

  // Get papers with full data
  const { data: papers } = await supabase
    .from('papers')
    .select('*')
    .eq('researcher_id', user.id);

  // Get videos
  const { data: videos } = await supabase
    .from('videos')
    .select('id, title, view_count, completion_rate, status, created_at')
    .eq('researcher_id', user.id)
    .order('view_count', { ascending: false });

  // Get teaching score
  const { data: teachingScore } = await supabase
    .from('teaching_scores')
    .select('*')
    .eq('researcher_id', user.id)
    .single();

  // Calculate paper stats
  const totalPapers = papers?.length || 0;
  const totalCitations = papers?.reduce((sum, p) => sum + (p.citation_count || 0), 0) || 0;
  const papersWithCitations = papers?.filter(p => (p.citation_count || 0) > 0).length || 0;
  const avgCitations = totalPapers > 0 ? Math.round(totalCitations / totalPapers) : 0;
  
  // Calculate h-index
  const citationCounts = papers?.map(p => p.citation_count || 0).sort((a, b) => b - a) || [];
  let hIndex = 0;
  for (let i = 0; i < citationCounts.length; i++) {
    if (citationCounts[i] >= i + 1) {
      hIndex = i + 1;
    } else {
      break;
    }
  }

  // Calculate i10-index
  const i10Index = citationCounts.filter(c => c >= 10).length;

  // Get year range
  const years = papers
    ?.map(p => p.published_date ? new Date(p.published_date).getFullYear() : null)
    .filter((y): y is number => y !== null) || [];
  const minYear = years.length > 0 ? Math.min(...years) : null;
  const maxYear = years.length > 0 ? Math.max(...years) : null;

  // Calculate researcher rankings
  const rankings = calculateResearcherRankings({ hIndex, totalCitations, totalPapers, i10Index });

  // Publications by year
  const publicationsByYear: Record<number, number> = {};
  papers?.forEach(p => {
    if (p.published_date) {
      const year = new Date(p.published_date).getFullYear();
      publicationsByYear[year] = (publicationsByYear[year] || 0) + 1;
    }
  });

  // Top cited papers
  const topCitedPapers = [...(papers || [])]
    .sort((a, b) => (b.citation_count || 0) - (a.citation_count || 0))
    .slice(0, 5);

  // Video stats
  const publishedVideos = videos?.filter(v => v.status === 'published') || [];
  const totalViews = publishedVideos.reduce((sum, v) => sum + (v.view_count || 0), 0);
  const avgCompletion = publishedVideos.length 
    ? publishedVideos.reduce((sum, v) => sum + (v.completion_rate || 0), 0) / publishedVideos.length 
    : 0;

  // Chart data
  const currentYear = new Date().getFullYear();
  const chartYears = Array.from({ length: 12 }, (_, i) => currentYear - 11 + i);
  const maxPubsInYear = Math.max(...chartYears.map(y => publicationsByYear[y] || 0), 1);

  return (
    <div className="py-8">
      <Container>
        <div className="space-y-6">
          
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="font-serif text-3xl font-semibold text-stone-900">
                Research Analytics
              </h1>
              <p className="text-stone-500 mt-1">
                {profile?.name || 'Researcher'} · {minYear && maxYear ? `Active since ${minYear}` : 'Building your profile'}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="px-4 py-2 rounded-lg bg-teal-50 border border-teal-100">
                <span className="font-semibold text-teal-700">{totalPapers}</span>
                <span className="text-teal-600 ml-1">papers</span>
              </div>
              <div className="px-4 py-2 rounded-lg bg-blue-50 border border-blue-100">
                <span className="font-semibold text-blue-700">{totalCitations.toLocaleString()}</span>
                <span className="text-blue-600 ml-1">citations</span>
              </div>
            </div>
          </div>

          {/* Research Impact Banner */}
          {rankings.overallPercentile && (
            <div className="rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 p-6 text-white shadow-lg shadow-teal-200">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex flex-col items-center justify-center border-2 border-white/30">
                    <span className="text-xs font-medium text-teal-100">Top</span>
                    <span className="text-2xl font-bold text-white leading-none">{rankings.overallPercentile}%</span>
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-white">Global Ranking</h2>
                    <p className="text-teal-100 text-sm">Based on h-index, citations, and publications</p>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-3">
                  <RankBadge label="h-index" value={hIndex} rank={`Top ${rankings.hIndexPercentile}%`} />
                  <RankBadge label="Citations" value={totalCitations.toLocaleString()} rank={`Top ${rankings.citationPercentile}%`} />
                  <RankBadge label="Papers" value={totalPapers} rank={`Top ${rankings.publicationPercentile}%`} />
                  <RankBadge label="i10-index" value={i10Index} rank={`Top ${rankings.i10Percentile}%`} />
                </div>
              </div>
            </div>
          )}

          {/* Key Metrics */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard 
              label="Total Publications"
              value={totalPapers}
              subtext={minYear && maxYear ? `${maxYear - minYear + 1} year career` : undefined}
              accentColor="teal"
            />
            <StatCard 
              label="Total Citations"
              value={totalCitations.toLocaleString()}
              subtext={`${papersWithCitations} papers cited`}
              accentColor="blue"
            />
            <StatCard 
              label="h-index"
              value={hIndex}
              subtext="Impact metric"
              accentColor="purple"
            />
            <StatCard 
              label="Avg. Citations"
              value={avgCitations}
              subtext="Per paper"
              accentColor="amber"
            />
          </div>

          {/* Charts Row */}
          <div className="grid gap-6 lg:grid-cols-3">
            
            {/* Publications Timeline */}
            <div className="lg:col-span-2 rounded-xl border border-stone-200 bg-white p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-semibold text-stone-900">Publication Timeline</h3>
                  <p className="text-sm text-stone-500">Papers published per year</p>
                </div>
              </div>
              
              <div className="relative">
                <div className="flex items-end gap-2" style={{ height: '180px' }}>
                  {chartYears.map((year) => {
                    const count = publicationsByYear[year] || 0;
                    const barHeight = count > 0 ? Math.max((count / maxPubsInYear) * 150, 8) : 4;
                    const isCurrentYear = year === currentYear;
                    
                    return (
                      <div key={year} className="flex-1 flex flex-col items-center group cursor-pointer">
                        <div className="mb-1 h-5 flex items-end">
                          <span className={`text-xs font-medium transition-opacity ${
                            count > 0 ? 'text-stone-600' : 'text-transparent'
                          }`}>
                            {count > 0 ? count : ''}
                          </span>
                        </div>
                        
                        <div 
                          className={`w-full max-w-[24px] rounded-t transition-all duration-200 group-hover:scale-105 ${
                            count > 0 
                              ? isCurrentYear 
                                ? 'bg-gradient-to-t from-teal-600 to-teal-400' 
                                : 'bg-gradient-to-t from-blue-400 to-blue-300'
                              : 'bg-stone-100'
                          }`}
                          style={{ height: `${barHeight}px` }}
                        />
                        
                        <span className="text-xs mt-2 text-stone-400">
                          {year.toString().slice(-2)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Top Cited Papers */}
            <div className="rounded-xl border border-stone-200 bg-white p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-1.5 rounded-lg bg-amber-100">
                  <TrophyIcon className="h-4 w-4 text-amber-600" />
                </div>
                <h3 className="font-semibold text-stone-900">Most Cited Papers</h3>
              </div>
              
              {topCitedPapers.length > 0 ? (
                <div className="space-y-3">
                  {topCitedPapers.map((paper, index) => (
                    <div key={paper.id} className="flex items-start gap-3">
                      <span className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        index === 0 ? 'bg-amber-100 text-amber-700' :
                        index === 1 ? 'bg-stone-100 text-stone-600' :
                        index === 2 ? 'bg-orange-100 text-orange-700' :
                        'bg-stone-50 text-stone-500'
                      }`}>
                        {index + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-stone-800 line-clamp-1">
                          {paper.title.replace(/<[^>]*>/g, '')}
                        </p>
                        <p className="text-xs text-stone-500 mt-0.5">
                          <span className="font-medium text-teal-600">{paper.citation_count || 0}</span> citations
                          {paper.published_date && ` · ${new Date(paper.published_date).getFullYear()}`}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-stone-400 text-center py-8">
                  No citation data yet
                </p>
              )}
            </div>
          </div>

          {/* Teaching Score & Videos Row */}
          <div className="grid gap-6 lg:grid-cols-2">
            
            {/* Teaching Score */}
            <div className="rounded-xl border border-stone-200 bg-white p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-1.5 rounded-lg bg-teal-100">
                  <StarIcon className="h-4 w-4 text-teal-600" />
                </div>
                <h3 className="font-semibold text-stone-900">Teaching Credit Score</h3>
              </div>
              
              {teachingScore ? (
                <div className="flex items-center gap-8">
                  <div className="relative w-24 h-24">
                    <svg className="w-24 h-24 -rotate-90">
                      <circle cx="48" cy="48" r="40" fill="none" stroke="#e7e5e4" strokeWidth="8" />
                      <circle 
                        cx="48" cy="48" r="40" 
                        fill="none" 
                        stroke="#14b8a6" 
                        strokeWidth="8"
                        strokeDasharray={2 * Math.PI * 40}
                        strokeDashoffset={2 * Math.PI * 40 * (1 - (teachingScore.overall_score || 0) / 100)}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-2xl font-bold text-stone-900">{teachingScore.overall_score || 0}</span>
                    </div>
                  </div>
                  
                  <div className="flex-1 grid grid-cols-2 gap-3">
                    <ScoreItem label="Clarity" value={teachingScore.clarity_score || 0} />
                    <ScoreItem label="Engagement" value={teachingScore.engagement_score || 0} />
                    <ScoreItem label="Peer Rating" value={teachingScore.peer_rating_score || 0} />
                    <ScoreItem label="Accessibility" value={teachingScore.accessibility_score || 0} />
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 border border-dashed border-stone-200 rounded-lg">
                  <p className="text-stone-500 text-sm">Publish video explainers to build your score</p>
                </div>
              )}
            </div>

            {/* Video Performance */}
            <div className="rounded-xl border border-stone-200 bg-white p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-1.5 rounded-lg bg-purple-100">
                  <VideoIcon className="h-4 w-4 text-purple-600" />
                </div>
                <h3 className="font-semibold text-stone-900">Video Performance</h3>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 rounded-lg bg-purple-50 border border-purple-100">
                  <p className="text-2xl font-bold text-purple-700">{publishedVideos.length}</p>
                  <p className="text-xs text-purple-600">Videos</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-blue-50 border border-blue-100">
                  <p className="text-2xl font-bold text-blue-700">{totalViews.toLocaleString()}</p>
                  <p className="text-xs text-blue-600">Views</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-green-50 border border-green-100">
                  <p className="text-2xl font-bold text-green-700">{Math.round(avgCompletion)}%</p>
                  <p className="text-xs text-green-600">Avg. Completion</p>
                </div>
              </div>
              
              {publishedVideos.length === 0 && (
                <p className="text-sm text-stone-400 text-center mt-4">
                  Create video explainers to see analytics
                </p>
              )}
            </div>
          </div>

          {/* Methodology Note */}
          <div className="rounded-lg bg-stone-50 border border-stone-200 p-4 text-sm text-stone-600">
            <p className="flex items-start gap-2">
              <InfoIcon className="h-4 w-4 text-stone-400 flex-shrink-0 mt-0.5" />
              <span>
                <strong>Ranking methodology:</strong> Percentiles are estimated using academic benchmarks from Hirsch (2005), 
                Bornmann et al. (2008), and Ioannidis et al. (2020). Metrics are weighted: h-index (40%), citations (30%), 
                papers (15%), i10-index (15%).
              </span>
            </p>
          </div>
          
        </div>
      </Container>
    </div>
  );
}

// Ranking calculation
interface RankingResult {
  overallPercentile: number | null;
  hIndexPercentile: number;
  citationPercentile: number;
  publicationPercentile: number;
  i10Percentile: number;
}

function calculateResearcherRankings({
  hIndex,
  totalCitations,
  totalPapers,
  i10Index,
}: {
  hIndex: number;
  totalCitations: number;
  totalPapers: number;
  i10Index: number;
}): RankingResult {
  let hIndexPercentile = 100;
  if (hIndex >= 50) hIndexPercentile = 1;
  else if (hIndex >= 30) hIndexPercentile = 5;
  else if (hIndex >= 20) hIndexPercentile = 10;
  else if (hIndex >= 12) hIndexPercentile = 25;
  else if (hIndex >= 6) hIndexPercentile = 50;

  let citationPercentile = 100;
  if (totalCitations >= 10000) citationPercentile = 1;
  else if (totalCitations >= 3000) citationPercentile = 5;
  else if (totalCitations >= 1000) citationPercentile = 10;
  else if (totalCitations >= 300) citationPercentile = 25;
  else if (totalCitations >= 50) citationPercentile = 50;

  let publicationPercentile = 100;
  if (totalPapers >= 200) publicationPercentile = 1;
  else if (totalPapers >= 100) publicationPercentile = 5;
  else if (totalPapers >= 50) publicationPercentile = 10;
  else if (totalPapers >= 25) publicationPercentile = 25;
  else if (totalPapers >= 10) publicationPercentile = 50;

  let i10Percentile = 100;
  if (i10Index >= 100) i10Percentile = 1;
  else if (i10Index >= 50) i10Percentile = 5;
  else if (i10Index >= 25) i10Percentile = 10;
  else if (i10Index >= 10) i10Percentile = 25;
  else if (i10Index >= 5) i10Percentile = 50;

  const overallPercentile = totalPapers > 0 
    ? Math.round((hIndexPercentile * 0.4 + citationPercentile * 0.3 + publicationPercentile * 0.15 + i10Percentile * 0.15))
    : null;

  return { overallPercentile, hIndexPercentile, citationPercentile, publicationPercentile, i10Percentile };
}

// Components
function RankBadge({ label, value, rank }: { label: string; value: string | number; rank: string }) {
  return (
    <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-white/20 backdrop-blur-sm">
      <div>
        <p className="text-xl font-bold text-white">{value}</p>
        <p className="text-xs text-teal-100">{label}</p>
      </div>
      <div className="w-px h-8 bg-white/30" />
      <p className="text-xs font-semibold text-white">{rank}</p>
    </div>
  );
}

function StatCard({ label, value, subtext, accentColor = 'teal' }: { 
  label: string; 
  value: string | number; 
  subtext?: string;
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
  
  return (
    <div className={`rounded-xl border border-stone-200 bg-white p-5 border-t-4 ${colorClasses[accentColor]} transition-shadow hover:shadow-md`}>
      <p className="text-sm text-stone-500 mb-1">{label}</p>
      <p className={`text-3xl font-bold ${textColors[accentColor]}`}>{value}</p>
      {subtext && <p className="text-xs text-stone-400 mt-1">{subtext}</p>}
    </div>
  );
}

function ScoreItem({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="flex items-center justify-between text-sm mb-1">
        <span className="text-stone-600">{label}</span>
        <span className="font-medium text-stone-900">{value}</span>
      </div>
      <div className="h-1.5 bg-stone-100 rounded-full overflow-hidden">
        <div className="h-full bg-teal-500 rounded-full" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

// Icons
function TrophyIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
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

function StarIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

function InfoIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  );
}
