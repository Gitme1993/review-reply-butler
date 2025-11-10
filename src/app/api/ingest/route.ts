import { NextResponse } from 'next/server';
import { supabaseServer } from '../../../lib/supabaseServer'; // or '@/lib/supabaseServer' if your tsconfig alias works

type Payload = {
  locationName?: string;      // OR send location_id directly
  location_id?: string;
  source: 'google' | 'yelp' | 'email';
  rating?: number;
  text: string;
  author?: string;
  created_at?: string;        // optional ISO date
};

// Helpful GET so opening /api/ingest in a browser doesn't 404
export async function GET() {
  return NextResponse.json({ ok: false, hint: 'POST a review JSON payload to this URL.' });
}

export async function POST(req: Request) {
  const body = (await req.json()) as Partial<Payload>;

  if (!body.text || !body.source || (!body.location_id && !body.locationName)) {
    return NextResponse.json(
      { ok: false, error: 'Required: text, source, and location_id or locationName.' },
      { status: 400 }
    );
  }

  // Resolve location_id if only a name was provided
  let location_id = body.location_id ?? null;
  if (!location_id && body.locationName) {
    const { data: loc, error: locErr } = await supabaseServer
      .from('locations')
      .select('id')
      .eq('name', body.locationName)
      .maybeSingle();
    if (locErr || !loc) return NextResponse.json({ ok: false, error: 'Unknown locationName.' }, { status: 400 });
    location_id = loc.id;
  }

  const insert = {
    location_id,
    source: body.source!,
    rating: body.rating ?? null,
    author: body.author ?? null,
    text: body.text!,
    created_at: body.created_at ? new Date(body.created_at).toISOString() : undefined,
  };

  const { error } = await supabaseServer.from('reviews').insert(insert as any);
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 400 });

  return NextResponse.json({ ok: true });
}
