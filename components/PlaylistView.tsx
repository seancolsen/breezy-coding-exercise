"use client";

import { useState } from "react";
import { Playlist } from "@/lib/types";
import TrackCard from "./TrackCard";

interface PlaylistViewProps {
  playlist: Playlist;
  pinnedIds: Set<number>;
  onRemoveTrack: (trackId: number) => void;
  onTogglePin: (trackId: number) => void;
  onRegenerate: () => void;
  isLoading: boolean;
}

export default function PlaylistView({
  playlist,
  pinnedIds,
  onRemoveTrack,
  onTogglePin,
  onRegenerate,
  isLoading,
}: PlaylistViewProps) {
  const [activeTrackId, setActiveTrackId] = useState<number | null>(null);

  function handleTrackEnded(endedTrackId: number) {
    setActiveTrackId((currentActiveId) => {
      if (currentActiveId !== endedTrackId) return currentActiveId;

      const currentIndex = playlist.tracks.findIndex(
        (t) => t.id === endedTrackId,
      );
      if (currentIndex === -1) return null;

      for (let i = currentIndex + 1; i < playlist.tracks.length; i++) {
        if (playlist.tracks[i].previewUrl) {
          return playlist.tracks[i].id;
        }
      }
      return null;
    });
  }

  return (
    <div className="w-full space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
            {playlist.title}
          </h2>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            {playlist.explanation}
          </p>
        </div>
        <button
          onClick={onRegenerate}
          disabled={isLoading}
          className="shrink-0 rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:border-indigo-300 hover:text-indigo-600 disabled:opacity-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-indigo-500 dark:hover:text-indigo-400"
        >
          {isLoading ? "Regenerating…" : "Regenerate"}
        </button>
      </div>

      <div className="text-xs text-zinc-400 dark:text-zinc-500">
        {playlist.tracks.length} songs &middot;{" "}
        {pinnedIds.size > 0 && `${pinnedIds.size} pinned`}
      </div>

      <div className="space-y-1">
        {playlist.tracks.map((track, i) => (
          <TrackCard
            key={track.id}
            track={track}
            index={i}
            isPinned={pinnedIds.has(track.id)}
            isActive={activeTrackId === track.id}
            onRemove={() => onRemoveTrack(track.id)}
            onTogglePin={() => onTogglePin(track.id)}
            onPlay={() => setActiveTrackId(track.id)}
            onEnded={() => handleTrackEnded(track.id)}
          />
        ))}
      </div>
    </div>
  );
}
