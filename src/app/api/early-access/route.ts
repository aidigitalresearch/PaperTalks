/**
 * Early Access Signup API
 * 
 * POST /api/early-access
 * Saves email signups to the early_access_signups table.
 */

import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, role, institution } = body;

    // Validate email
    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: { code: 'INVALID_EMAIL', message: 'Email is required' } },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: { code: 'INVALID_EMAIL', message: 'Invalid email format' } },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Check if email already exists
    const { data: existing } = await supabase
      .from('early_access_signups')
      .select('id')
      .eq('email', email.toLowerCase())
      .single();

    if (existing) {
      return NextResponse.json(
        { error: { code: 'ALREADY_EXISTS', message: 'Email already registered for early access' } },
        { status: 409 }
      );
    }

    // Insert new signup
    const { data, error } = await supabase
      .from('early_access_signups')
      .insert({
        email: email.toLowerCase(),
        role: role || null,
        institution: institution || null,
      })
      .select()
      .single();

    if (error) {
      console.error('Early access signup error:', error);
      return NextResponse.json(
        { error: { code: 'DATABASE_ERROR', message: 'Failed to save signup' } },
        { status: 500 }
      );
    }

    return NextResponse.json({
      data: { id: data.id, email: data.email },
      message: 'Successfully registered for early access',
    });
  } catch (error) {
    console.error('Early access API error:', error);
    return NextResponse.json(
      { error: { code: 'SERVER_ERROR', message: 'Internal server error' } },
      { status: 500 }
    );
  }
}

// Get count of signups (for display purposes)
export async function GET() {
  try {
    const supabase = await createClient();
    
    const { count, error } = await supabase
      .from('early_access_signups')
      .select('*', { count: 'exact', head: true });

    if (error) {
      return NextResponse.json(
        { error: { code: 'DATABASE_ERROR', message: 'Failed to get count' } },
        { status: 500 }
      );
    }

    return NextResponse.json({
      data: { count: count || 0 },
    });
  } catch (error) {
    console.error('Early access count error:', error);
    return NextResponse.json(
      { error: { code: 'SERVER_ERROR', message: 'Internal server error' } },
      { status: 500 }
    );
  }
}

