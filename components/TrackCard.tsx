"use client";

import { Track } from "@/lib/types";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

interface TrackCardProps {
  track: Track;
  index: number;
  isActive: boolean;
  onRemove: () => void;
  onPlay: () => void;
  onEnded: () => void;
}

export default function TrackCard({
  track,
  index,
  isActive,
  onRemove,
  onPlay,
  onEnded,
}: TrackCardProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showTimeline, setShowTimeline] = useState(false);
  const [isSeeking, setIsSeeking] = useState(false);
  const trackBarRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const prevActiveRef = useRef(false);
  const isPlayingRef = useRef(false);
  const onEndedRef = useRef(onEnded);

  onEndedRef.current = onEnded;
  isPlayingRef.current = isPlaying;

  const updateTime = useCallback(() => {
    if (audioRef.current && !isSeeking) {
      setCurrentTime(audioRef.current.currentTime);
    }
    if (isPlaying) {
      rafRef.current = requestAnimationFrame(updateTime);
    }
  }, [isPlaying, isSeeking]);

  useEffect(() => {
    if (isPlaying) {
      rafRef.current = requestAnimationFrame(updateTime);
    }
    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [isPlaying, updateTime]);

  function initAudio() {
    if (audioRef.current || !track.previewUrl) return;
    const audio = new Audio(track.previewUrl);
    audio.addEventListener("loadedmetadata", () => {
      setDuration(audio.duration);
    });
    audio.addEventListener("ended", () => {
      setIsPlaying(false);
      setCurrentTime(0);
      onEndedRef.current();
    });
    audioRef.current = audio;
  }

  useEffect(() => {
    const wasActive = prevActiveRef.current;
    prevActiveRef.current = isActive;

    if (!wasActive && isActive && !isPlayingRef.current) {
      if (!track.previewUrl) return;
      initAudio();
      const audio = audioRef.current!;
      if (audio.currentTime > 0) {
        audio.currentTime = 0;
        setCurrentTime(0);
      }
      audio.play();
      setIsPlaying(true);
      setShowTimeline(true);
    } else if (wasActive && !isActive && isPlayingRef.current) {
      audioRef.current?.pause();
      setIsPlaying(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive]);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  function togglePlay() {
    if (!track.previewUrl) return;
    initAudio();
    const audio = audioRef.current!;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      onPlay();
      audio.play();
      setIsPlaying(true);
      setShowTimeline(true);
    }
  }

  function seekTo(fraction: number) {
    if (!audioRef.current || !duration) return;
    const clamped = Math.max(0, Math.min(1, fraction));
    const newTime = clamped * duration;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  }

  function getFractionFromEvent(e: React.MouseEvent | MouseEvent) {
    if (!trackBarRef.current) return 0;
    const rect = trackBarRef.current.getBoundingClientRect();
    return (e.clientX - rect.left) / rect.width;
  }

  function handleTrackBarMouseDown(e: React.MouseEvent) {
    e.preventDefault();
    setIsSeeking(true);
    seekTo(getFractionFromEvent(e));

    function onMove(me: MouseEvent) {
      seekTo(getFractionFromEvent(me));
    }
    function onUp(me: MouseEvent) {
      seekTo(getFractionFromEvent(me));
      setIsSeeking(false);
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
    }
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
  }

  const progress = duration > 0 ? currentTime / duration : 0;

  return (
    <div>
      <div
        className="group flex items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
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

      {showTimeline && (
        <div className="flex items-center gap-2 px-3 pb-2 pt-0.5 ml-8">
          <span className="text-[10px] tabular-nums text-zinc-400 w-8 text-right select-none">
            {formatTime(currentTime)}
          </span>
          <div
            ref={trackBarRef}
            onMouseDown={handleTrackBarMouseDown}
            className="relative flex-1 h-3 flex items-center cursor-pointer group/seek"
          >
            <div className="absolute inset-x-0 h-1 rounded-full bg-zinc-200 dark:bg-zinc-700" />
            <div
              className="absolute left-0 h-1 rounded-full bg-indigo-500 dark:bg-indigo-400 transition-[width] duration-75"
              style={{ width: `${progress * 100}%` }}
            />
            <div
              className="absolute h-3 w-3 rounded-full bg-indigo-500 dark:bg-indigo-400 shadow-sm border-2 border-white dark:border-zinc-900 -translate-x-1/2 opacity-0 group-hover/seek:opacity-100 transition-opacity"
              style={{ left: `${progress * 100}%` }}
            />
          </div>
          <span className="text-[10px] tabular-nums text-zinc-400 w-8 select-none">
            {formatTime(duration)}
          </span>
        </div>
      )}
    </div>
  );
}
