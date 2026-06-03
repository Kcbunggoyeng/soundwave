"use client";

import { MusicCard } from "./MusicCard";

interface TrackData {
  id: string;
  title: string;
  thumbnailUrl?: string | null;
  duration?: number | null;
  playCount?: number;
  genre?: string | null;
  uploadedBy: { id: string; name: string | null };
}

interface MusicGridProps {
  tracks: TrackData[];
  title?: string;
}

export function MusicGrid({ tracks, title }: MusicGridProps) {
  if (tracks.length === 0) {
    return (
      <div className="text-center py-16 text-mist/50">
        <p>Belum ada musik tersedia.</p>
      </div>
    );
  }

  return (
    <div>
      {title && (
        <h2 className="text-chalk text-xl font-bold mb-4">{title}</h2>
      )}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {tracks.map((track) => (
          <MusicCard key={track.id} track={track} />
        ))}
      </div>
    </div>
  );
}