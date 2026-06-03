import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { MusicCard } from "@/components/music/MusicCard";

async function getHomeData() {
  const [trending, recent] = await Promise.all([
    db.media.findMany({
      where: { status: "APPROVED", type: "MUSIC" },
      orderBy: { playCount: "desc" },
      take: 8,
      select: {
        id: true, title: true, thumbnailUrl: true, duration: true,
        playCount: true, genre: true,
        uploadedBy: { select: { id: true, name: true } },
      },
    }),
    db.media.findMany({
      where: { status: "APPROVED", type: "MUSIC" },
      orderBy: { createdAt: "desc" },
      take: 8,
      select: {
        id: true, title: true, thumbnailUrl: true, duration: true,
        playCount: true, genre: true,
        uploadedBy: { select: { id: true, name: true } },
      },
    }),
  ]);
  return { trending, recent };
}

export default async function HomePage() {
  const session = await auth();
  const { trending, recent } = await getHomeData();

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Selamat pagi"
    : hour < 17 ? "Selamat siang"
    : "Selamat malam";

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-white text-3xl font-bold mb-1">
          {greeting}, {session?.user?.name?.split(" ")[0] ?? "Pendengar"}!
        </h1>
        <p className="text-zinc-400">Temukan musik favoritmu hari ini</p>
      </div>

      <section className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white text-xl font-bold">🔥 Trending Sekarang</h2>
          <a href="/music" className="text-zinc-400 text-sm hover:text-white transition-colors">
            Lihat semua
          </a>
        </div>
        {trending.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {trending.map((track) => (
              <MusicCard key={track.id} track={track} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-zinc-500">
            Belum ada musik. Jadilah yang pertama upload!
          </div>
        )}
      </section>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white text-xl font-bold">✨ Terbaru Ditambahkan</h2>
        </div>
        {recent.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {recent.map((track) => (
              <MusicCard key={track.id} track={track} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-zinc-500">
            Belum ada musik baru.
          </div>
        )}
      </section>
    </div>
  );
}