"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface MediaItem {
  id: string;
  title: string;
  description: string | null;
  type: string;
  mediaUrl: string;
  thumbnailUrl: string | null;
  duration: number | null;
  genre: string | null;
  status: string;
  createdAt: Date;
  uploadedBy: {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
  };
}

export function AdminReviewCard({ media }: { media: MediaItem }) {
  const router = useRouter();
  const [loading, setLoading] = useState<"approve" | "reject" | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectForm, setShowRejectForm] = useState(false);

  const handleAction = async (action: "approve" | "reject") => {
    if (action === "reject" && !rejectReason.trim()) {
      alert("Berikan alasan penolakan!");
      return;
    }
    setLoading(action);
    try {
      const res = await fetch(`/api/admin/review/${media.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          reason: action === "reject" ? rejectReason : undefined,
        }),
      });
      if (res.ok) {
        router.refresh();
      } else {
        const data = await res.json();
        alert(data.error ?? "Gagal melakukan aksi");
      }
    } catch {
      alert("Terjadi kesalahan");
    } finally {
      setLoading(null);
    }
  };

  const formatDuration = (sec: number | null) => {
    if (!sec) return "-";
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden">
      <div className="p-6">
        <div className="flex gap-5">
          <div className="w-24 h-24 rounded-xl bg-zinc-800 flex-shrink-0 overflow-hidden flex items-center justify-center">
            {media.thumbnailUrl ? (
              <img src={media.thumbnailUrl} alt={media.title} className="w-full h-full object-cover"/>
            ) : (
              <span className="text-4xl">{media.type === "MUSIC" ? "🎵" : "🎬"}</span>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4 mb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-white text-lg font-bold">{media.title}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    media.type === "MUSIC"
                      ? "bg-green-900/50 text-green-400"
                      : "bg-purple-900/50 text-purple-400"
                  }`}>
                    {media.type === "MUSIC" ? "🎵 Musik" : "🎬 Video"}
                  </span>
                </div>
                {media.description && (
                  <p className="text-zinc-400 text-sm">{media.description}</p>
                )}
              </div>
              <span className="bg-yellow-500/20 text-yellow-400 text-xs font-bold px-3 py-1 rounded-full flex-shrink-0">
                PENDING
              </span>
            </div>

            <div className="flex flex-wrap gap-4 text-xs text-zinc-500 mb-4">
              {media.genre && <span>🎼 {media.genre}</span>}
              <span>⏱️ {formatDuration(media.duration)}</span>
            </div>

            <div className="flex items-center gap-2 p-3 bg-zinc-800 rounded-lg">
              {media.uploadedBy.image ? (
                <img src={media.uploadedBy.image} alt="" className="w-8 h-8 rounded-full"/>
              ) : (
                <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-black font-bold text-sm">
                  {media.uploadedBy.name?.[0]?.toUpperCase() ?? "?"}
                </div>
              )}
              <div>
                <p className="text-white text-sm font-medium">{media.uploadedBy.name ?? "Unknown"}</p>
                <p className="text-zinc-500 text-xs">{media.uploadedBy.email}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 p-3 bg-zinc-800/50 rounded-lg">
          <p className="text-zinc-500 text-xs mb-1">URL File:</p>
          <a
            href={media.mediaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-400 text-xs hover:underline break-all"
          >
            {media.mediaUrl}
          </a>
        </div>

        {showRejectForm && (
          <div className="mt-4 p-4 bg-red-950/30 border border-red-800/50 rounded-xl">
            <label className="block text-red-300 text-sm font-medium mb-2">
              Alasan Penolakan (wajib diisi)
            </label>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Jelaskan mengapa konten ini ditolak..."
              rows={3}
              className="w-full bg-zinc-800 border border-red-800/50 text-white placeholder-zinc-500 rounded-lg px-4 py-3 focus:outline-none focus:border-red-500 transition-colors text-sm resize-none"
            />
          </div>
        )}

        <div className="flex gap-3 mt-5">
          <button
            onClick={() => handleAction("approve")}
            disabled={loading !== null}
            className="flex-1 bg-green-500 hover:bg-green-400 disabled:opacity-50 text-black font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
          >
            {loading === "approve" ? "Memproses..." : "✓ Setujui & Tayangkan"}
          </button>

          {!showRejectForm ? (
            <button
              onClick={() => setShowRejectForm(true)}
              disabled={loading !== null}
              className="flex-1 bg-red-900/50 hover:bg-red-900 disabled:opacity-50 text-red-300 font-bold py-3 rounded-xl transition-all border border-red-800/50"
            >
              ✕ Tolak
            </button>
          ) : (
            <div className="flex gap-2 flex-1">
              <button
                onClick={() => { setShowRejectForm(false); setRejectReason(""); }}
                className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold py-3 rounded-xl transition-all text-sm"
              >
                Batal
              </button>
              <button
                onClick={() => handleAction("reject")}
                disabled={loading !== null || !rejectReason.trim()}
                className="flex-1 bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-all text-sm"
              >
                {loading === "reject" ? "Memproses..." : "Konfirmasi Tolak"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}