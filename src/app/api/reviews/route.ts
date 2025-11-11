// src/app/api/reviews/route.ts
import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseServer';

export async function GET() {
  const { data, error } = await supabaseServer
    .from('reviews')
    .select('id, rating, author, text, created_at')
    .order('created_at', { ascending: false })
    .limit(25);

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true, reviews: data });
}
