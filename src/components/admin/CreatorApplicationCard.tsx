"use client";

import { useState } from "react";

type App = {
  id: string;
  artistName: string;
  realName: string;
  email: string;
  phone: string;
  genre: string;
  sampleWork: string;
  status: string;
  rejectionReason: string | null;
  createdAt: string;
};

export function CreatorApplicationCard({ app }: { app: App }) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(app.status);
  const [reason, setReason] = useState("");
  const [showReason, setShowReason] = useState(false);
  const [error, setError] = useState("");

  const handleAction = async (action: "approve" | "reject") => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/creator-applications/${app.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, reason: action === "reject" ? reason : undefined }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Gagal memproses");
        return;
      }
      setStatus(action === "approve" ? "APPROVED" : "REJECTED");
      setShowReason(false);
    } catch {
      setError("Gagal memproses");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-zinc-900 rounded-xl p-5 border border-zinc-800">
      <div className="flex flex-col md:flex-row md:items-start gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-white font-bold">{app.artistName}</h3>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
              status === "PENDING"
                ? "bg-yellow-900/50 text-yellow-400"
                : status === "APPROVED"
                ? "bg-green-900/50 text-green-400"
                : "bg-red-900/50 text-red-400"
            }`}>
              {status}
            </span>
          </div>
          <p className="text-zinc-400 text-sm">{app.realName} · {app.email} · {app.phone}</p>
          <p className="text-zinc-500 text-xs mt-1">Genre: {app.genre}</p>
          <a href={app.sampleWork} target="_blank" rel="noreferrer" className="text-green-400 text-xs hover:underline mt-1 inline-block">
            Lihat karya sample →
          </a>
          {app.rejectionReason && (
            <p className="text-red-400 text-xs mt-2">Alasan ditolak: {app.rejectionReason}</p>
          )}
          {error && <p className="text-red-400 text-xs mt-2">{error}</p>}
        </div>

        {status === "PENDING" && (
          <div className="flex flex-col gap-2 min-w-[140px]">
            {showReason ? (
              <>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Alasan penolakan..."
                  rows={2}
                  className="bg-zinc-800 border border-zinc-700 text-white text-xs rounded-lg px-3 py-2 resize-none"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => handleAction("reject")}
                    disabled={loading || !reason}
                    className="flex-1 bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white text-xs font-bold py-2 rounded-lg transition-all"
                  >
                    {loading ? "..." : "Tolak"}
                  </button>
                  <button
                    onClick={() => setShowReason(false)}
                    className="flex-1 border border-zinc-700 text-zinc-300 text-xs py-2 rounded-lg hover:border-zinc-500"
                  >
                    Batal
                  </button>
                </div>
              </>
            ) : (
              <>
                <button
                  onClick={() => handleAction("approve")}
                  disabled={loading}
                  className="bg-green-600 hover:bg-green-500 disabled:opacity-50 text-white text-xs font-bold py-2 rounded-lg transition-all"
                >
                  {loading ? "..." : "Setujui"}
                </button>
                <button
                  onClick={() => setShowReason(true)}
                  disabled={loading}
                  className="border border-red-800 text-red-400 hover:bg-red-900/30 disabled:opacity-50 text-xs font-bold py-2 rounded-lg transition-all"
                >
                  Tolak
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}