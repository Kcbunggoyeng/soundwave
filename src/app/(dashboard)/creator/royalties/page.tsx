import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { calculateRoyalty } from "@/lib/stripe";

type RoyaltyWithMedia = {
  id: string;
  streams: number;
  period: string;
  paid: boolean;
  paidAt: Date | null;
  media: { id: string; title: string; thumbnailUrl: string | null };
};

async function getRoyalties(userId: string) {
  const year = new Date().getFullYear().toString();
  const royalties = await db.royalty.findMany({
    where: { artistId: userId, period: { startsWith: year } },
    include: {
      media: { select: { id: true, title: true, thumbnailUrl: true } },
    },
    orderBy: { period: "desc" },
  }) as RoyaltyWithMedia[];

  const summary = {
    totalStreams: royalties.reduce((s: number, r: RoyaltyWithMedia) => s + r.streams, 0),
    totalEarned: royalties.reduce((s: number, r: RoyaltyWithMedia) => s + calculateRoyalty(r.streams), 0),
    totalPaid: royalties
      .filter((r: RoyaltyWithMedia) => r.paid)
      .reduce((s: number, r: RoyaltyWithMedia) => s + calculateRoyalty(r.streams), 0),
    pending: royalties
      .filter((r: RoyaltyWithMedia) => !r.paid)
      .reduce((s: number, r: RoyaltyWithMedia) => s + calculateRoyalty(r.streams), 0),
  };

  return { royalties, summary };
}

export default async function RoyaltiesPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });

  if (!user || !["CREATOR", "ADMIN"].includes(user.role)) {
    redirect("/subscription");
  }

  const { royalties, summary } = await getRoyalties(session.user.id);

  return (
    <div className="p-6 max-w-5xl">
      <h1 className="text-white text-3xl font-bold mb-2">Royalti Hak Cipta</h1>
      <p className="text-zinc-400 mb-8">
        Transparansi penuh — setiap stream dicatat otomatis.
        Rate: <span className="text-green-400 font-mono">$0.004 / stream</span>
      </p>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {[
          { label: "Total Stream", value: summary.totalStreams.toLocaleString(), color: "text-white" },
          { label: "Total Pendapatan", value: `$${summary.totalEarned.toFixed(2)}`, color: "text-green-400" },
          { label: "Sudah Dibayar", value: `$${summary.totalPaid.toFixed(2)}`, color: "text-blue-400" },
          { label: "Menunggu", value: `$${summary.pending.toFixed(2)}`, color: "text-yellow-400" },
        ].map((card) => (
          <div key={card.label} className="bg-zinc-900 rounded-xl p-5">
            <p className="text-zinc-500 text-xs uppercase tracking-wider mb-2">{card.label}</p>
            <p className={`text-2xl font-bold ${card.color}`}>{card.value}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-zinc-900 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-zinc-800">
          <h2 className="text-white font-semibold">Rincian per Lagu</h2>
        </div>
        {royalties.length === 0 ? (
          <div className="p-12 text-center text-zinc-500">
            <p className="text-lg mb-2">Belum ada data royalti</p>
            <p className="text-sm">Upload musik dan tunggu pendengar streaming karya Anda.</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="text-zinc-500 text-xs uppercase border-b border-zinc-800">
                <th className="text-left p-4">Lagu</th>
                <th className="text-left p-4">Periode</th>
                <th className="text-right p-4">Stream</th>
                <th className="text-right p-4">Pendapatan</th>
                <th className="text-center p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {royalties.map((r: RoyaltyWithMedia) => (
                <tr key={r.id} className="hover:bg-zinc-800/50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      {r.media.thumbnailUrl ? (
                        <img src={r.media.thumbnailUrl} alt="" className="w-10 h-10 rounded object-cover" />
                      ) : (
                        <div className="w-10 h-10 rounded bg-zinc-700 flex items-center justify-center">
                          <span className="text-zinc-500 text-xs">♫</span>
                        </div>
                      )}
                      <span className="text-white text-sm font-medium">{r.media.title}</span>
                    </div>
                  </td>
                  <td className="p-4 text-zinc-400 text-sm">{r.period}</td>
                  <td className="p-4 text-right text-white text-sm font-mono">{r.streams.toLocaleString()}</td>
                  <td className="p-4 text-right text-green-400 text-sm font-mono">
                    ${calculateRoyalty(r.streams).toFixed(4)}
                  </td>
                  <td className="p-4 text-center">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                      r.paid ? "bg-green-900 text-green-300" : "bg-yellow-900/50 text-yellow-400"
                    }`}>
                      {r.paid ? "✓ Dibayar" : "Menunggu"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}