import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseServer';

export async function POST(req: Request) {
  const { review_id } = await req.json();
  if (!review_id) {
    return NextResponse.json({ ok: false, error: 'review_id required' }, { status: 400 });
  }

  // Get the review
  const { data: review, error: rErr } = await supabaseServer
    .from('reviews')
    .select('id, rating, text, author, location_id, created_at')
    .eq('id', review_id)
    .single();

  if (rErr || !review) {
    return NextResponse.json({ ok: false, error: 'Review not found' }, { status: 404 });
  }

  // Very simple “classifier” + draft (replace with your actual AI later)
  const sentiment = review.rating && review.rating >= 4 ? 'positive' :
                    review.rating && review.rating <= 2 ? 'negative' : 'neutral';

  const reply_text =
    sentiment === 'positive'
      ? `Thanks so much for the kind words! We're thrilled you enjoyed your visit. Hope to see you again soon. — Team`
      : sentiment === 'negative'
      ? `I'm sorry we missed the mark. We'd love a chance to make it right—please email us so we can help. — Team`
      : `Thanks for the feedback! We appreciate you taking the time to share your experience. — Team`;

  const classification_json = {
    sentiment,
    topics: [],
    risk: sentiment === 'negative' ? 'medium' : 'low',
  };

  const { error: dErr } = await supabaseServer.from('drafts').insert({
    review_id: review.id,
    classification_json,
    reply_text,
    needs_approval: sentiment !== 'positive', // e.g., auto-post only positives later
  } as any);

  if (dErr) {
    return NextResponse.json({ ok: false, error: dErr.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
