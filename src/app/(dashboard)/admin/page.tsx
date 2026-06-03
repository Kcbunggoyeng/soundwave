import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { AdminReviewCard } from "@/components/admin/AdminReviewCard";
import { CreatorApplicationCard } from "@/components/admin/CreatorApplicationCard";

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
  const [total, pending, approved, rejected, users, creators, pendingCreators] = await Promise.all([
    db.media.count(),
    db.media.count({ where: { status: "PENDING" } }),
    db.media.count({ where: { status: "APPROVED" } }),
    db.media.count({ where: { status: "REJECTED" } }),
    db.user.count(),
    db.user.count({ where: { role: "CREATOR" } }),
    db.creatorApplication.count({ where: { status: "PENDING" } }),
  ]);
  return { total, pending, approved, rejected, users, creators, pendingCreators };
}

async function getPendingCreatorApplications() {
  return db.creatorApplication.findMany({
    where: { status: "PENDING" },
    orderBy: { createdAt: "asc" },
  });
}

export default async function AdminPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });

  if (user?.role !== "ADMIN") redirect("/home");

  const [pendingMedia, stats, pendingApplications] = await Promise.all([
    getPendingMedia(),
    getAdminStats(),
    getPendingCreatorApplications(),
  ]);

  return (
    <div className="p-6 max-w-6xl">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-14 h-14 rounded-2xl bg-coral/10 flex items-center justify-center">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ff4d6d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L2 7l10 5 10-5-10-5z"/>
            <path d="M2 17l10 5 10-5"/>
            <path d="M2 12l10 5 10-5"/>
          </svg>
        </div>
        <div>
          <h1 className="text-chalk text-3xl font-bold">Admin Panel</h1>
          <p className="text-mist">Kelola konten dan pengguna platform</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {[
          { label: "Total Konten", value: stats.total, color: "text-chalk" },
          { label: "Menunggu", value: stats.pending, color: "text-amber-400" },
          { label: "Disetujui", value: stats.approved, color: "text-coral" },
          { label: "Ditolak", value: stats.rejected, color: "text-red-400" },
          { label: "Total User", value: stats.users, color: "text-blue-400" },
          { label: "Creator", value: stats.creators, color: "text-purple-400" },
          { label: "Pendaftar", value: stats.pendingCreators, color: "text-amber-300" },
          { label: "Royalti", value: "$0.004", color: "text-emerald-400" },
        ].map((s) => (
          <div key={s.label} className="bg-surface rounded-xl p-4 border border-surface-hi/40 text-center">
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-mist/50 text-xs mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div>
        <div className="flex items-center gap-3 mb-6">
          <h2 className="text-chalk text-xl font-bold">Konten Menunggu Review</h2>
          {stats.pending > 0 && (
            <span className="bg-amber-500/10 text-amber-400 text-xs font-bold px-2.5 py-1 rounded-md border border-amber-500/20">
              {stats.pending} baru
            </span>
          )}
        </div>

        {pendingMedia.length === 0 ? (
          <div className="bg-surface rounded-xl p-12 text-center border border-surface-hi/40">
            <svg className="w-12 h-12 mx-auto mb-4 text-mist/30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
            <h3 className="text-chalk text-xl font-bold mb-2">Semua Bersih</h3>
            <p className="text-mist">Tidak ada konten yang menunggu review.</p>
          </div>
        ) : (
          <div className="space-y-4">
          {pendingMedia.map((media: any) => (
              <AdminReviewCard key={media.id} media={media as any} />
            ))}
          </div>
        )}
      </div>

      {/* Creator Applications */}
      <div className="mt-12">
        <div className="flex items-center gap-3 mb-6">
          <h2 className="text-chalk text-xl font-bold">Pendaftaran Creator</h2>
          {stats.pendingCreators > 0 && (
            <span className="bg-amber-500/10 text-amber-400 text-xs font-bold px-2.5 py-1 rounded-md border border-amber-500/20">
              {stats.pendingCreators} baru
            </span>
          )}
        </div>

        {pendingApplications.length === 0 ? (
          <div className="bg-surface rounded-xl p-12 text-center border border-surface-hi/40">
            <svg className="w-12 h-12 mx-auto mb-4 text-mist/30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 00-3-3.87"/>
              <path d="M16 3.13a4 4 0 010 7.75"/>
            </svg>
            <h3 className="text-chalk text-xl font-bold mb-2">Tidak Ada Pengajuan</h3>
            <p className="text-mist">Belum ada artist yang mendaftar.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {pendingApplications.map((app: any) => (
              <CreatorApplicationCard key={app.id} app={app as any} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}