import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import { CreatorUploadForm } from "@/components/creator/CreatorUploadForm";

async function getCreatorStats(userId: string) {
  const [mediaCount, royalties, myMedia] = await Promise.all([
    db.media.count({ where: { uploadedById: userId } }),
    db.royalty.findMany({
      where: { artistId: userId },
      select: { streams: true, amountUsd: true },
    }),
    db.media.findMany({
      where: { uploadedById: userId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        type: true,
        status: true,
        playCount: true,
        thumbnailUrl: true,
      },
    }),
  ]);

  const totalStreams = royalties.reduce((s, r) => s + r.streams, 0);
  const totalEarned = royalties.reduce((s, r) => s + r.amountUsd, 0);

  return { mediaCount, totalStreams, totalEarned, myMedia };
}

export default async function CreatorPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { role: true, name: true },
  });

  if (!user || !["CREATOR", "ADMIN"].includes(user.role)) {
    redirect("/subscription");
  }

  const { mediaCount, totalStreams, totalEarned, myMedia } =
    await getCreatorStats(session.user.id);

  return (
    <div className="p-6 max-w-6xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-14 h-14 rounded-2xl bg-coral/10 flex items-center justify-center">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ff4d6d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <path d="M8 12l2 2 4-4"/>
          </svg>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-chalk text-3xl font-bold">Creator Dashboard</h1>
            <span className="bg-coral/10 text-coral text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wide border border-coral/20">
              Verified
            </span>
          </div>
          <p className="text-mist">Selamat datang, {user.name}!</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {[
          { label: "Konten", value: mediaCount.toString(), sub: "uploaded" },
          { label: "Streams", value: totalStreams.toLocaleString(), sub: "total putar" },
          { label: "Pendapatan", value: `$${totalEarned.toFixed(2)}`, sub: "USD terkumpul" },
          { label: "Rate", value: "$0.004", sub: "per stream" },
        ].map((s) => (
          <div key={s.label} className="bg-surface rounded-xl p-5 border border-surface-hi/40">
            <p className="text-mist/50 text-[10px] uppercase tracking-wider mb-1">{s.label}</p>
            <p className="text-2xl font-bold text-chalk">{s.value}</p>
            <p className="text-mist/50 text-xs mt-1">{s.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upload Form */}
        <div>
          <h2 className="text-chalk text-xl font-bold mb-4">Upload Konten Baru</h2>
          <CreatorUploadForm />
        </div>

        {/* My Content */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-chalk text-xl font-bold">Konten Saya</h2>
            <Link
              href="/creator/royalties"
              className="text-coral text-sm hover:underline transition-all"
            >
              Lihat Royalti →
            </Link>
          </div>

          {myMedia.length === 0 ? (
            <div className="bg-surface rounded-xl p-8 text-center border border-surface-hi/40">
              <svg className="w-10 h-10 mx-auto mb-3 text-mist/30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                <polyline points="17 8 12 3 7 8"/>
                <line x1="12" y1="3" x2="12" y2="15"/>
              </svg>
              <p className="text-mist">Belum ada konten. Upload sekarang!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {myMedia.map((m) => (
                <div
                  key={m.id}
                  className="bg-surface rounded-xl p-4 flex items-center gap-4 border border-surface-hi/40 hover:border-surface-hi transition-all"
                >
                  <div className="w-12 h-12 rounded-lg bg-surface-hi flex items-center justify-center flex-shrink-0">
                    {m.thumbnailUrl ? (
                      <img src={m.thumbnailUrl} alt={m.title} className="w-full h-full object-cover rounded-lg" />
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="#8b8b9e">
                        <path d={m.type === "MUSIC" ? "M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" : "M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"} />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-chalk text-sm font-medium truncate">{m.title}</p>
                    <p className="text-mist/60 text-xs">{m.playCount} plays</p>
                  </div>
                  <span className={`text-[10px] px-2.5 py-1 rounded-md font-bold uppercase tracking-wide flex-shrink-0 ${
                    m.status === "APPROVED"
                      ? "bg-coral/10 text-coral border border-coral/20"
                      : m.status === "REJECTED"
                      ? "bg-red-500/10 text-red-400 border border-red-500/20"
                      : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                  }`}>
                    {m.status === "APPROVED" ? "Aktif" : m.status === "REJECTED" ? "Ditolak" : "Review"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}