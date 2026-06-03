"use client";

import { useState } from "react";
import { usePlayerStore } from "@/store/playerStore";

interface TrackData {
  id: string;
  title: string;
  thumbnailUrl?: string | null;
  duration?: number | null;
  playCount?: number;
  genre?: string | null;
  uploadedBy: { id: string; name: string | null };
}

export function MusicCard({ track }: { track: TrackData }) {
  const { currentTrack, isPlaying, play, pause, resume } = usePlayerStore();
  const [isHovered, setIsHovered] = useState(false);
  const isCurrentTrack = currentTrack?.id === track.id;

  const handlePlay = () => {
    if (isCurrentTrack) {
      isPlaying ? pause() : resume();
    } else {
      play({
        id: track.id,
        title: track.title,
        artist: track.uploadedBy.name ?? "Unknown Artist",
        thumbnailUrl: track.thumbnailUrl ?? "",
        mediaUrl: "",
        duration: track.duration ?? 0,
      });
    }
  };

  const formatPlays = (n: number) => {
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
    if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
    return n.toString();
  };

  return (
    <div
      className="group relative bg-zinc-900 rounded-xl p-4 cursor-pointer hover:bg-zinc-800 transition-all duration-200"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handlePlay}
    >
      <div className="relative mb-4 aspect-square rounded-lg overflow-hidden bg-zinc-800">
        {track.thumbnailUrl ? (
          <img
            src={track.thumbnailUrl}
            alt={track.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-zinc-700 to-zinc-900">
            <svg width="40" height="40" fill="#52525b" viewBox="0 0 24 24">
              <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
            </svg>
          </div>
        )}
        <button
          className={`absolute bottom-2 right-2 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center shadow-xl transition-all duration-200 hover:scale-105 ${
            isHovered || isCurrentTrack
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-2"
          }`}
          onClick={(e) => {
            e.stopPropagation();
            handlePlay();
          }}
        >
          {isCurrentTrack && isPlaying ? (
            <svg width="16" height="16" fill="black" viewBox="0 0 24 24">
              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
            </svg>
          ) : (
            <svg width="16" height="16" fill="black" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>
        {isCurrentTrack && (
          <div className="absolute top-2 left-2 bg-green-500 text-black text-[10px] font-bold px-2 py-0.5 rounded-full">
            ♫ LIVE
          </div>
        )}
      </div>
      <div>
        <p
          className={`text-sm font-semibold truncate mb-1 transition-colors ${
            isCurrentTrack ? "text-green-400" : "text-white"
          }`}
        >
          {track.title}
        </p>
        <p className="text-zinc-400 text-xs truncate">
          {track.uploadedBy.name ?? "Unknown Artist"}
        </p>
        <div className="flex items-center gap-2 mt-2">
          {track.genre && (
            <span className="text-zinc-500 text-[10px] bg-zinc-800 px-2 py-0.5 rounded-full">
              {track.genre}
            </span>
          )}
          {typeof track.playCount === "number" && (
            <span className="text-zinc-600 text-[10px]">
              {formatPlays(track.playCount)} plays
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
