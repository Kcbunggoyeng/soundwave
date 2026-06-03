import { db } from "@/lib/db";

function formatDuration(seconds: number | null) {
  if (!seconds) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

async function getVideos() {
  return db.media.findMany({
    where: { status: "APPROVED", type: "VIDEO" },
    orderBy: { playCount: "desc" },
    take: 30,
    select: {
      id: true,
      title: true,
      thumbnailUrl: true,
      duration: true,
      playCount: true,
      genre: true,
      uploadedBy: { select: { id: true, name: true } },
    },
  });
}

export default async function VideoPage() {
  const videos = await getVideos();

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-white text-3xl font-bold mb-2">Video dan Karaoke</h1>
        <p className="text-zinc-400">Tonton video musik, lyric video, dan karaoke favorit</p>
      </div>

      <div className="flex gap-2 mb-8 flex-wrap">
        {["Semua", "Music Video", "Karaoke", "Live Performance", "Lyric Video"].map((cat) => (
          <button
            key={cat}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              cat === "Semua"
                ? "bg-green-500 text-black"
                : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {videos.length === 0 ? (
        <div className="text-center py-24">
          <div className="text-6xl mb-4">🎬</div>
          <h3 className="text-white text-xl font-bold mb-2">Belum ada video</h3>
          <p className="text-zinc-400">Creator belum mengupload video apapun.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video: any) => (
            <div
              key={video.id}
              className="group bg-zinc-900 rounded-xl overflow-hidden hover:bg-zinc-800 transition-all border border-zinc-800 hover:border-zinc-700 cursor-pointer"
            >
              <div className="relative aspect-video bg-zinc-800">
                {video.thumbnailUrl ? (
                  <img
                    src={video.thumbnailUrl}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-5xl">🎬</span>
                  </div>
                )}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                  <div className="w-14 h-14 rounded-full bg-green-500 flex items-center justify-center">
                    <svg width="24" height="24" fill="black" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </div>
                </div>
                {video.duration && (
                  <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-0.5 rounded font-mono">
                    {formatDuration(video.duration)}
                  </div>
                )}
              </div>
              <div className="p-4">
                <p className="text-white text-sm font-semibold truncate mb-1">{video.title}</p>
                <p className="text-zinc-400 text-xs">{video.uploadedBy.name ?? "Unknown"}</p>
                <p className="text-zinc-600 text-xs mt-1">{video.playCount.toLocaleString()} views</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}