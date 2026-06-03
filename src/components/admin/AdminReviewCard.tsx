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
const [loading, setLoading] = useState(null as "approve" | "reject" | null);
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
    <div className="bg-surface border border-surface-hi/50 rounded-xl overflow-hidden">
      <div className="p-5 md:p-6">
        <div className="flex gap-5">
          <div className="w-24 h-24 rounded-lg bg-surface-hi flex-shrink-0 overflow-hidden flex items-center justify-center">
            {media.thumbnailUrl ? (
              <img src={media.thumbnailUrl} alt={media.title} className="w-full h-full object-cover"/>
            ) : (
              <svg width="32" height="32" viewBox="0 0 24 24" fill="#8b8b9e">
                <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
              </svg>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4 mb-2">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-chalk text-lg font-bold">{media.title}</h3>
                  <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold uppercase tracking-wide ${
                    media.type === "MUSIC"
                      ? "bg-coral/10 text-coral"
                      : "bg-purple-500/10 text-purple-400"
                  }`}>
                    {media.type === "MUSIC" ? "Musik" : "Video"}
                  </span>
                </div>
                {media.description && (
                  <p className="text-mist text-sm">{media.description}</p>
                )}
              </div>
              <span className="bg-amber-500/10 text-amber-400 text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wide flex-shrink-0">
                Pending
              </span>
            </div>

            <div className="flex flex-wrap gap-4 text-xs text-mist/60 mb-3">
              {media.genre && <span className="bg-surface-hi px-2 py-0.5 rounded">{media.genre}</span>}
              <span>{formatDuration(media.duration)}</span>
            </div>

            <div className="flex items-center gap-2 p-2.5 bg-surface-hi/50 rounded-lg">
              {media.uploadedBy.image ? (
                <img src={media.uploadedBy.image} alt="" className="w-7 h-7 rounded-md"/>
              ) : (
                <div className="w-7 h-7 rounded-md bg-coral/20 flex items-center justify-center text-coral font-bold text-xs">
                  {media.uploadedBy.name?.[0]?.toUpperCase() ?? "?"}
                </div>
              )}
              <div>
                <p className="text-chalk text-sm font-medium">{media.uploadedBy.name ?? "Unknown"}</p>
                <p className="text-mist/50 text-xs">{media.uploadedBy.email}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 p-3 bg-surface-hi/30 rounded-lg">
          <p className="text-mist/40 text-[10px] uppercase tracking-wider mb-1">File URL</p>
          <a
            href={media.mediaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-coral/80 text-xs hover:text-coral hover:underline break-all"
          >
            {media.mediaUrl}
          </a>
        </div>

        {showRejectForm && (
          <div className="mt-4 p-4 bg-red-950/20 border border-red-900/30 rounded-xl">
            <label className="block text-red-300 text-sm font-medium mb-2">
              Alasan Penolakan (wajib)
            </label>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Jelaskan mengapa konten ini ditolak..."
              rows={3}
              className="w-full bg-surface border border-red-900/30 text-chalk placeholder-mist/30 rounded-lg px-4 py-3 focus:outline-none focus:border-red-500/50 transition-colors text-sm resize-none"
            />
          </div>
        )}

        <div className="flex gap-3 mt-5">
          <button
            onClick={() => handleAction("approve")}
            disabled={loading !== null}
            className="flex-1 bg-coral hover:bg-coral-hover disabled:opacity-50 text-ink font-bold py-2.5 rounded-lg transition-all flex items-center justify-center gap-2 text-sm"
          >
            {loading === "approve" ? "Memproses..." : "Setujui & Tayangkan"}
          </button>

          {!showRejectForm ? (
            <button
              onClick={() => setShowRejectForm(true)}
              disabled={loading !== null}
              className="flex-1 bg-surface-hi hover:bg-red-900/20 disabled:opacity-50 text-red-300 font-bold py-2.5 rounded-lg transition-all border border-red-900/20 text-sm"
            >
              Tolak
            </button>
          ) : (
            <div className="flex gap-2 flex-1">
              <button
                onClick={() => { setShowRejectForm(false); setRejectReason(""); }}
                className="flex-1 bg-surface-hi hover:bg-surface-hi/80 text-mist font-bold py-2.5 rounded-lg transition-all text-sm"
              >
                Batal
              </button>
              <button
                onClick={() => handleAction("reject")}
                disabled={loading !== null || !rejectReason.trim()}
                className="flex-1 bg-red-700 hover:bg-red-600 disabled:opacity-50 text-white font-bold py-2.5 rounded-lg transition-all text-sm"
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