"use client";

import { useState } from "react";

type UploadType = "MUSIC" | "VIDEO";

export function CreatorUploadForm() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    type: "MUSIC" as UploadType,
    genre: "",
    mediaUrl: "",
    thumbnailUrl: "",
    duration: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/music", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          duration: form.duration ? parseInt(form.duration) : undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Gagal upload");
        return;
      }
      setSuccess("Konten berhasil diupload! Sedang dalam review admin.");
      setForm({
        title: "", description: "", type: "MUSIC",
        genre: "", mediaUrl: "", thumbnailUrl: "", duration: "",
      });
    } catch {
      setError("Terjadi kesalahan server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
      {success && (
        <div className="bg-green-950 border border-green-700 text-green-300 text-sm p-3 rounded-lg mb-4">
          ✅ {success}
        </div>
      )}
      {error && (
        <div className="bg-red-950 border border-red-800 text-red-300 text-sm p-3 rounded-lg mb-4">
          ❌ {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Type selector */}
        <div className="flex gap-2">
          {(["MUSIC", "VIDEO"] as UploadType[]).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setForm({ ...form, type: t })}
              className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
                form.type === t
                  ? "bg-green-500 text-black"
                  : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
              }`}
            >
              {t === "MUSIC" ? "🎵 Musik" : "🎬 Video"}
            </button>
          ))}
        </div>

        <div>
          <label className="block text-zinc-300 text-sm font-medium mb-2">
            Judul *
          </label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="Nama lagu atau video..."
            required
            className="w-full bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 rounded-lg px-4 py-3 focus:outline-none focus:border-green-500 transition-colors text-sm"
          />
        </div>

        <div>
          <label className="block text-zinc-300 text-sm font-medium mb-2">
            URL File Audio/Video *
          </label>
          <input
            type="url"
            value={form.mediaUrl}
            onChange={(e) => setForm({ ...form, mediaUrl: e.target.value })}
            placeholder="https://storage.example.com/audio.mp3"
            required
            className="w-full bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 rounded-lg px-4 py-3 focus:outline-none focus:border-green-500 transition-colors text-sm"
          />
          <p className="text-zinc-600 text-xs mt-1">
            Upload file ke S3/Cloudflare R2 dulu, lalu paste URL-nya di sini.
          </p>
        </div>

        <div>
          <label className="block text-zinc-300 text-sm font-medium mb-2">
            URL Thumbnail/Cover
          </label>
          <input
            type="url"
            value={form.thumbnailUrl}
            onChange={(e) => setForm({ ...form, thumbnailUrl: e.target.value })}
            placeholder="https://storage.example.com/cover.jpg"
            className="w-full bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 rounded-lg px-4 py-3 focus:outline-none focus:border-green-500 transition-colors text-sm"
          />
        </div>

        <div>
          <label className="block text-zinc-300 text-sm font-medium mb-2">
            Genre
          </label>
          <select
            value={form.genre}
            onChange={(e) => setForm({ ...form, genre: e.target.value })}
            className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-green-500 transition-colors text-sm"
          >
            <option value="">Pilih genre...</option>
            {["Pop", "Rock", "Jazz", "Electronic", "Hip-Hop", "R&B",
              "Classical", "Dangdut", "Indie", "Karaoke"].map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-zinc-300 text-sm font-medium mb-2">
            Durasi (detik)
          </label>
          <input
            type="number"
            value={form.duration}
            onChange={(e) => setForm({ ...form, duration: e.target.value })}
            placeholder="240"
            className="w-full bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 rounded-lg px-4 py-3 focus:outline-none focus:border-green-500 transition-colors text-sm"
          />
        </div>

        <div>
          <label className="block text-zinc-300 text-sm font-medium mb-2">
            Deskripsi
          </label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Ceritakan tentang karya ini..."
            rows={3}
            className="w-full bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 rounded-lg px-4 py-3 focus:outline-none focus:border-green-500 transition-colors text-sm resize-none"
          />
        </div>

        <div className="bg-zinc-800/50 rounded-lg p-3 flex gap-3">
          <span className="text-lg flex-shrink-0">ℹ️</span>
          <p className="text-zinc-400 text-xs leading-relaxed">
            Konten yang diupload akan melalui review admin sebelum ditayangkan.
            Proses review biasanya 1x24 jam.
          </p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-500 hover:bg-green-400 disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold py-3 rounded-full transition-all text-sm"
        >
          {loading ? "Mengupload..." : `Upload ${form.type === "MUSIC" ? "Musik" : "Video"}`}
        </button>
      </form>
    </div>
  );
}