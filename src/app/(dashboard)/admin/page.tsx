import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { AdminReviewCard } from "@/components/admin/AdminReviewCard";

async function getPendingMedia() {
  return db.media.findMany({
    where: { status: "PENDING" },
    orderBy: { createdAt: "asc" },
    include: {
      uploadedBy: {
        select: { id: true, name: true, email: true, image: true },
      },
    },
  });
}

async function getAdminStats() {
  const [total, pending, approved, rejected, users, creators] = await Promise.all([
    db.media.count(),
    db.media.count({ where: { status: "PENDING" } }),
    db.media.count({ where: { status: "APPROVED" } }),
    db.media.count({ where: { status: "REJECTED" } }),
    db.user.count(),
    db.user.count({ where: { role: "CREATOR" } }),
  ]);
  return { total, pending, approved, rejected, users, creators };
}

export default async function AdminPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });

  if (user?.role !== "ADMIN") redirect("/home");

  const [pendingMedia, stats] = await Promise.all([
    getPendingMedia(),
    getAdminStats(),
  ]);

  return (
    <div className="p-6 max-w-6xl">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-14 h-14 rounded-2xl bg-red-500/20 flex items-center justify-center">
          <span className="text-2xl">⚡</span>
        </div>
        <div>
          <h1 className="text-white text-3xl font-bold">Admin Panel</h1>
          <p className="text-zinc-400">Kelola konten dan pengguna platform</p>
        </div>
      </div>

      <div className="grid grid-cols-3 md:grid-cols-6 gap-4 mb-10">
        {[
          { label: "Total Konten", value: stats.total, color: "text-white" },
          { label: "Menunggu Review", value: stats.pending, color: "text-yellow-400" },
          { label: "Disetujui", value: stats.approved, color: "text-green-400" },
          { label: "Ditolak", value: stats.rejected, color: "text-red-400" },
          { label: "Total User", value: stats.users, color: "text-blue-400" },
          { label: "Creator", value: stats.creators, color: "text-purple-400" },
        ].map((s) => (
          <div key={s.label} className="bg-zinc-900 rounded-xl p-4 border border-zinc-800 text-center">
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-zinc-500 text-xs mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div>
        <div className="flex items-center gap-3 mb-6">
          <h2 className="text-white text-xl font-bold">Konten Menunggu Review</h2>
          {stats.pending > 0 && (
            <span className="bg-yellow-500 text-black text-xs font-bold px-2.5 py-1 rounded-full">
              {stats.pending} baru
            </span>
          )}
        </div>

        {pendingMedia.length === 0 ? (
          <div className="bg-zinc-900 rounded-2xl p-12 text-center border border-zinc-800">
            <div className="text-5xl mb-4">✅</div>
            <h3 className="text-white text-xl font-bold mb-2">Semua Bersih!</h3>
            <p className="text-zinc-400">Tidak ada konten yang menunggu review.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {pendingMedia.map((media) => (
              <AdminReviewCard key={media.id} media={media as any} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}