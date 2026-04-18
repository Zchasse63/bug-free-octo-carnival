export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-md text-center space-y-3">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
          Cadence
        </p>
        <h1 className="text-3xl font-semibold text-foreground">
          Building your coach.
        </h1>
        <p className="text-sm text-muted-foreground">
          Phase 1 scaffold. Strava sync ships next week.
        </p>
      </div>
    </main>
  );
}
