export default function Loading() {
  return (
    <main className="mx-auto w-full max-w-5xl flex-1 animate-pulse px-4 py-8">
      <div className="h-8 w-48 rounded bg-slate-200" />
      <div className="mt-3 h-4 w-72 rounded bg-slate-200" />
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-24 rounded-2xl bg-slate-200" />
        ))}
      </div>
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-32 rounded-2xl bg-slate-200" />
        ))}
      </div>
    </main>
  );
}
