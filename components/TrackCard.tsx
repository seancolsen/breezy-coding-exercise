"use client";

import { Track } from "@/lib/types";
import Image from "next/image";
import { useRef, useState } from "react";

interface TrackCardProps {
  track: Track;
  index: number;
  isPinned: boolean;
  onRemove: () => void;
  onTogglePin: () => void;
}

export default function TrackCard({
  track,
  index,
  isPinned,
  onRemove,
  onTogglePin,
}: TrackCardProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  function togglePlay() {
    if (!track.previewUrl) return;
    if (!audioRef.current) {
      audioRef.current = new Audio(track.previewUrl);
      audioRef.current.addEventListener("ended", () => setIsPlaying(false));
    }
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  }

  return (
    <div
      className={`group flex items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/50 ${
        isPinned
          ? "border border-indigo-200 bg-indigo-50/50 dark:border-indigo-800 dark:bg-indigo-950/30"
          : ""
      }`}
    >
      <span className="w-5 shrink-0 text-right text-xs text-zinc-400">
        {index + 1}
      </span>

      <button
        onClick={togglePlay}
        disabled={!track.previewUrl}
        className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md"
        title={track.previewUrl ? "Play preview" : "No preview available"}
      >
        <Image
          src={track.artworkUrl}
          alt={`${track.album} cover`}
          width={40}
          height={40}
          className="h-full w-full object-cover"
          unoptimized
        />
        {track.previewUrl && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/40">
            <svg
              className="h-4 w-4 text-white opacity-0 transition-opacity group-hover:opacity-100"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              {isPlaying ? (
                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
              ) : (
                <path d="M8 5v14l11-7z" />
              )}
            </svg>
          </div>
        )}
      </button>

      <div className="min-w-0 flex-1">
        <a
          href={track.trackUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block truncate text-sm font-medium text-zinc-900 hover:text-indigo-600 dark:text-zinc-100 dark:hover:text-indigo-400"
        >
          {track.title}
        </a>
        <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">
          {track.artist} &middot; {track.album}
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
        <button
          onClick={onTogglePin}
          className={`rounded-md p-1.5 transition-colors ${
            isPinned
              ? "text-indigo-600 dark:text-indigo-400"
              : "text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400"
          }`}
          title={isPinned ? "Unpin song" : "Pin song"}
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {isPinned ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5V6.75a4.5 4.5 0 119 0v3.75M3.75 21.75h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H3.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            )}
          </svg>
        </button>

        <button
          onClick={onRemove}
          className="rounded-md p-1.5 text-zinc-400 transition-colors hover:text-red-500 dark:hover:text-red-400"
          title="Remove song"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
