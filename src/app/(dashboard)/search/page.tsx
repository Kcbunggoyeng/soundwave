"use client";

import { useState, useEffect } from "react";
import { MusicCard } from "@/components/music/MusicCard";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query || query.length < 2) {
      setResults([]);
      return;
    }
    const timeout = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/music?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults(data.music ?? []);
      } catch {}
      setLoading(false);
    }, 400);
    return () => clearTimeout(timeout);
  }, [query]);

  return (
    <div className="p-6">
      <h1 className="text-white text-3xl font-bold mb-6">Cari Musik</h1>

      <div className="relative mb-8">
        <svg
          className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
          width="20" height="20" viewBox="0 0 24 24" fill="currentColor"
        >
          <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
        </svg>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cari lagu, artist..."
          autoFocus
          className="w-full bg-zinc-900 border border-zinc-700 text-white placeholder-zinc-500 rounded-xl pl-12 pr-4 py-4 focus:outline-none focus:border-green-500 transition-colors text-lg"
        />
      </div>

      {loading && (
        <div className="text-center py-12 text-zinc-400">Mencari...</div>
      )}

      {!loading && query.length >= 2 && results.length === 0 && (
        <div className="text-center py-12">
          <div className="text-5xl mb-4">🔍</div>
          <p className="text-zinc-400">Tidak ada hasil untuk &quot;{query}&quot;</p>
        </div>
      )}

      {!loading && results.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {results.map((track) => (
            <MusicCard key={track.id} track={track} />
          ))}
        </div>
      )}

      {!query && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🎵</div>
          <p className="text-zinc-400 text-lg">
            Ketik nama lagu atau artist untuk mencari
          </p>
        </div>
      )}
    </div>
  );
}