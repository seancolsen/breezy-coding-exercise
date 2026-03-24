"use client";

import { useState, useCallback } from "react";
import PromptInput from "@/components/PromptInput";
import PlaylistView from "@/components/PlaylistView";
import LoadingState from "@/components/LoadingState";
import { Playlist, Track, GenerateResponse } from "@/lib/types";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const [pinnedIds, setPinnedIds] = useState<Set<number>>(new Set());
  const [removedIds, setRemovedIds] = useState<Set<number>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = useCallback(
    async (regenerate = false) => {
      const currentPrompt = prompt.trim();
      if (!currentPrompt) return;

      setIsLoading(true);
      setError(null);

      try {
        const pinnedTracks: Track[] = regenerate && playlist
          ? playlist.tracks.filter((t) => pinnedIds.has(t.id))
          : [];

        const res = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prompt: currentPrompt,
            pinnedTracks: pinnedTracks.length > 0 ? pinnedTracks : undefined,
            excludedTrackIds:
              removedIds.size > 0 ? Array.from(removedIds) : undefined,
          }),
        });

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || `Request failed (${res.status})`);
        }

        const data: GenerateResponse = await res.json();
        setPlaylist(data.playlist);

        if (!regenerate) {
          setPinnedIds(new Set());
          setRemovedIds(new Set());
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Something went wrong"
        );
      } finally {
        setIsLoading(false);
      }
    },
    [prompt, playlist, pinnedIds, removedIds]
  );

  function handleRemoveTrack(trackId: number) {
    if (!playlist) return;
    setRemovedIds((prev) => new Set(prev).add(trackId));
    setPinnedIds((prev) => {
      const next = new Set(prev);
      next.delete(trackId);
      return next;
    });
    setPlaylist({
      ...playlist,
      tracks: playlist.tracks.filter((t) => t.id !== trackId),
    });
  }

  function handleTogglePin(trackId: number) {
    setPinnedIds((prev) => {
      const next = new Set(prev);
      if (next.has(trackId)) {
        next.delete(trackId);
      } else {
        next.add(trackId);
      }
      return next;
    });
  }

  return (
    <div className="flex min-h-screen flex-col items-center bg-zinc-50 font-sans dark:bg-zinc-950">
      <div className="w-full max-w-2xl px-4 py-12 sm:px-6">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Playlist Copilot
          </h1>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            Describe the vibe. Get a playlist. Refine it.
          </p>
        </header>

        <PromptInput
          value={prompt}
          onChange={setPrompt}
          onSubmit={() => generate(false)}
          isLoading={isLoading}
        />

        {error && (
          <div className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/50 dark:text-red-400">
            {error}
          </div>
        )}

        <div className="mt-8">
          {isLoading && !playlist && <LoadingState />}

          {playlist && (
            <PlaylistView
              playlist={playlist}
              pinnedIds={pinnedIds}
              onRemoveTrack={handleRemoveTrack}
              onTogglePin={handleTogglePin}
              onRegenerate={() => generate(true)}
              isLoading={isLoading}
            />
          )}
        </div>
      </div>
    </div>
  );
}
