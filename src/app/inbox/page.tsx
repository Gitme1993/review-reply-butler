'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

type Review = {
  id: string;
  rating: number | null;
  author: string | null;
  text: string;
  created_at: string;
};
type Draft = {
  id: string;
  review_id: string;
  reply_text: string | null;
  created_at: string;
};

export default function Inbox() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [drafts, setDrafts] = useState<Record<string, Draft | undefined>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const { data: rData } = await supabase
        .from('reviews')
        .select('id,rating,author,text,created_at')
        .order('created_at', { ascending: false })
        .limit(50);
      setReviews(rData || []);

      const { data: dData } = await supabase
        .from('drafts')
        .select('id,review_id,reply_text,created_at');

      const map: Record<string, Draft> = {};
      (dData || []).forEach((d) => (map[d.review_id] = d));
      setDrafts(map);

      setLoading(false);
    };

    fetchData();
  }, []);

  const generateDraft = async (review_id: string) => {
    const res = await fetch('/api/draft', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ review_id }),
    });
    if (res.ok) {
      alert('Draft created. Refreshing list…');
      location.reload();
    } else {
      alert('Failed to create draft.');
    }
  };

  if (loading) return <main className="p-6">Loading…</main>;

  return (
    <main className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Inbox</h1>
      <div className="text-sm text-gray-600">Newest first • {reviews.length} reviews</div>
      <div className="grid gap-4">
        {reviews.map((r) => (
          <div key={r.id} className="border rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div className="font-medium">
                {r.author || 'Anonymous'} • {r.rating ? `${r.rating}★` : 'No rating'}
              </div>
              <button
                className="px-3 py-1 rounded-lg bg-black text-white"
                onClick={() => generateDraft(r.id)}
              >
                Generate Draft
              </button>
            </div>
            <p className="mt-2">{r.text}</p>
            {drafts[r.id] && (
              <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                <div className="text-xs text-gray-500 mb-1">Draft reply</div>
                <div>{drafts[r.id]?.reply_text}</div>
              </div>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}
