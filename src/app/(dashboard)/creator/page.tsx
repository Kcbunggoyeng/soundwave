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
        <div className="w-16 h-16 rounded-2xl bg-green-500/20 flex items-center justify-center">
          <span className="text-3xl">🎵</span>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-white text-3xl font-bold">Creator Dashboard</h1>
            <span className="bg-green-500 text-black text-xs font-bold px-2.5 py-1 rounded-full">
              ✓ VERIFIED
            </span>
          </div>
          <p className="text-zinc-400">Selamat datang, {user.name}!</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {[
          { label: "Total Konten", value: mediaCount.toString(), icon: "🎵" },
          { label: "Total Stream", value: totalStreams.toLocaleString(), icon: "▶️" },
          { label: "Pendapatan", value: `$${totalEarned.toFixed(2)}`, icon: "💰" },
          { label: "Rate/Stream", value: "$0.004", icon: "📈" },
        ].map((s) => (
          <div key={s.label} className="bg-zinc-900 rounded-xl p-5 border border-zinc-800">
            <div className="text-2xl mb-2">{s.icon}</div>
            <p className="text-2xl font-bold text-white">{s.value}</p>
            <p className="text-zinc-500 text-xs mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upload Form */}
        <div>
          <h2 className="text-white text-xl font-bold mb-4">Upload Konten Baru</h2>
          <CreatorUploadForm />
        </div>

        {/* My Content */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white text-xl font-bold">Konten Saya</h2>
            <Link
              href="/creator/royalties"
              className="text-green-400 text-sm hover:underline"
            >
              Lihat Royalti →
            </Link>
          </div>

          {myMedia.length === 0 ? (
            <div className="bg-zinc-900 rounded-xl p-8 text-center border border-zinc-800">
              <div className="text-4xl mb-3">📭</div>
              <p className="text-zinc-400">Belum ada konten. Upload sekarang!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {myMedia.map((m) => (
                <div
                  key={m.id}
                  className="bg-zinc-900 rounded-xl p-4 flex items-center gap-4 border border-zinc-800"
                >
                  <div className="w-12 h-12 rounded-lg bg-zinc-800 flex items-center justify-center flex-shrink-0">
                    <span>{m.type === "MUSIC" ? "🎵" : "🎬"}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">{m.title}</p>
                    <p className="text-zinc-500 text-xs">{m.playCount} plays</p>
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium flex-shrink-0 ${
                    m.status === "APPROVED"
                      ? "bg-green-900/50 text-green-400"
                      : m.status === "REJECTED"
                      ? "bg-red-900/50 text-red-400"
                      : "bg-yellow-900/50 text-yellow-400"
                  }`}>
                    {m.status === "APPROVED"
                      ? "Aktif"
                      : m.status === "REJECTED"
                      ? "Ditolak"
                      : "Review"}
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