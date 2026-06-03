export default function FavoritesPage() {
  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-white text-3xl font-bold mb-1">Favorit Saya</h1>
        <p className="text-zinc-400">Musik yang kamu sukai</p>
      </div>
      <div className="text-center py-24">
        <div className="text-6xl mb-4">❤️</div>
        <h3 className="text-white text-xl font-bold mb-2">Belum ada favorit</h3>
        <p className="text-zinc-400 mb-6">
          Klik ikon hati pada musik untuk menambahkan ke favorit
        </p>
        <a
          href="/music"
          className="bg-green-500 hover:bg-green-400 text-black font-bold px-8 py-3 rounded-full transition-all inline-block"
        >
          Jelajahi Musik
        </a>
      </div>
    </div>
  );
}