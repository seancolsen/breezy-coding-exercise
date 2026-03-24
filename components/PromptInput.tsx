"use client";

interface PromptInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

const EXAMPLES = [
  "Late-night coding playlist: moody, energetic, no obvious pop",
  "Dinner party playlist that feels upbeat but not cheesy",
  "Workout playlist that ramps up fast, but no EDM",
  "Rainy Sunday morning, acoustic and mellow",
];

export default function PromptInput({
  value,
  onChange,
  onSubmit,
  isLoading,
}: PromptInputProps) {
  return (
    <div className="w-full space-y-4">
      <div className="relative">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey && !isLoading) {
              e.preventDefault();
              onSubmit();
            }
          }}
          placeholder="Describe the playlist you want..."
          rows={3}
          className="w-full resize-none rounded-xl border border-zinc-200 bg-white px-4 py-3 text-base text-zinc-900 placeholder:text-zinc-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-indigo-400 dark:focus:ring-indigo-400/20"
          disabled={isLoading}
        />
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {EXAMPLES.map((example) => (
            <button
              key={example}
              onClick={() => onChange(example)}
              disabled={isLoading}
              className="rounded-full border border-zinc-200 px-3 py-1 text-xs text-zinc-500 transition-colors hover:border-indigo-300 hover:text-indigo-600 disabled:opacity-50 dark:border-zinc-700 dark:text-zinc-400 dark:hover:border-indigo-500 dark:hover:text-indigo-400"
            >
              {example.length > 40 ? example.slice(0, 40) + "…" : example}
            </button>
          ))}
        </div>

        <button
          onClick={onSubmit}
          disabled={isLoading || !value.trim()}
          className="shrink-0 rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-indigo-500 dark:hover:bg-indigo-600"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <svg
                className="h-4 w-4 animate-spin"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              Generating…
            </span>
          ) : (
            "Generate Playlist"
          )}
        </button>
      </div>
    </div>
  );
}
