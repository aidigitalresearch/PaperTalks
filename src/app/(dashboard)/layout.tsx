/**
 * Dashboard Layout
 * 
 * Protected layout with sidebar navigation.
 */

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { DashboardNav } from '@/features/dashboard/components/DashboardNav';
import { DashboardHeader } from '@/features/dashboard/components/DashboardHeader';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Get profile for header
  const { data: profile } = await supabase
    .from('profiles')
    .select('name, avatar_url, email')
    .eq('id', user.id)
    .single();

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Top header */}
      <DashboardHeader 
        user={{
          name: profile?.name || user.email?.split('@')[0] || 'Researcher',
          email: user.email || '',
          avatarUrl: profile?.avatar_url,
        }}
      />
      
      <div className="flex">
        {/* Sidebar navigation */}
        <DashboardNav />
        
        {/* Main content */}
        <main className="flex-1 lg:ml-64">
          {children}
        </main>
      </div>
    </div>
  );
}
