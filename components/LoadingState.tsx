"use client";

export default function LoadingState() {
  return (
    <div className="w-full space-y-4">
      <div className="space-y-2">
        <div className="h-6 w-48 animate-pulse rounded-md bg-zinc-200 dark:bg-zinc-800" />
        <div className="h-4 w-80 animate-pulse rounded-md bg-zinc-100 dark:bg-zinc-800/60" />
      </div>
      <div className="space-y-2">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 rounded-lg px-3 py-2">
            <div className="h-4 w-5 animate-pulse rounded bg-zinc-100 dark:bg-zinc-800/60" />
            <div className="h-10 w-10 animate-pulse rounded-md bg-zinc-200 dark:bg-zinc-800" />
            <div className="flex-1 space-y-1.5">
              <div
                className="h-4 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800"
                style={{ width: `${50 + Math.random() * 30}%` }}
              />
              <div
                className="h-3 animate-pulse rounded bg-zinc-100 dark:bg-zinc-800/60"
                style={{ width: `${30 + Math.random() * 40}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
