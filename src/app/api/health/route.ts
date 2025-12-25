/**
 * Health Check Endpoint
 * 
 * Used by Railway, Vercel, and load balancers to check app health.
 */

import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0',
    checks: {
      database: 'unknown',
    },
  };

  try {
    // Check database connection
    const supabase = await createClient();
    const { error } = await supabase.from('profiles').select('id').limit(1);
    
    health.checks.database = error ? 'unhealthy' : 'healthy';
  } catch {
    health.checks.database = 'unhealthy';
  }

  const isHealthy = health.checks.database === 'healthy';

  return NextResponse.json(health, { 
    status: isHealthy ? 200 : 503,
    headers: {
      'Cache-Control': 'no-store',
    },
  });
}

