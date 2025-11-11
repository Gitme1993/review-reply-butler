export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <header className="border-b">
        <div className="mx-auto max-w-4xl px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold">Review Reply Butler</h1>
          <nav className="space-x-3">
            <a className="underline" href="/inbox">Inbox</a>
            <a className="underline" href="/settings">Settings</a>
            <a className="underline" href="/api/reviews" target="_blank" rel="noreferrer">API → reviews</a>
          </nav>
        </div>
      </header>

      <section className="mx-auto max-w-4xl px-6 py-12">
        <h2 className="text-3xl font-bold">Answer every review, on-brand—fast.</h2>
        <p className="mt-3 text-gray-600">
          New reviews flow in, drafts are generated automatically, and you can copy or approve in minutes.
        </p>

        <div className="mt-6 flex gap-3">
          <a href="/inbox" className="px-4 py-2 rounded-lg bg-black text-white">Open Inbox</a>
          <a href="/settings" className="px-4 py-2 rounded-lg border">Set up brand & signature</a>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          <Card title="Status">
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>DB connected via Supabase</li>
              <li>Draft generator endpoint ready</li>
              <li>Hourly cron (optional) for auto-drafts</li>
            </ul>
          </Card>

          <Card title="Next steps">
            <ol className="list-decimal pl-5 space-y-1 text-sm">
              <li>Hook up email/Zapier to <code>/api/ingest</code></li>
              <li>Turn on hourly cron to auto-draft</li>
              <li>Start a 14-day pilot with 1–2 locations</li>
            </ol>
          </Card>
        </div>
      </section>
    </main>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border p-4">
      <div className="font-medium">{title}</div>
      <div className="mt-2 text-gray-700">{children}</div>
    </div>
  );
}
