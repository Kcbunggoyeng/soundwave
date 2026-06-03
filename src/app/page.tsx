import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6">

      {/* Logo */}
      <div className="flex items-center gap-3 mb-6">
        <svg width="52" height="52" viewBox="0 0 40 40" fill="none">
          <circle cx="20" cy="20" r="20" fill="#1DB954" />
          <path
            d="M12 22c4-3 10-3 16 0M10 17c6-4 14-4 20 0M14 27c3-2 9-2 12 0"
            stroke="white" strokeWidth="2.5" strokeLinecap="round"
          />
        </svg>
        <span className="text-white text-4xl font-bold tracking-tight">
          SoundWave
        </span>
      </div>

      {/* Tagline */}
      <h1 className="text-white text-3xl md:text-5xl font-bold text-center mb-4 max-w-2xl leading-tight">
        Musik Tanpa Batas,{" "}
        <span className="text-green-500">Royalti Transparan</span>
      </h1>

      <p className="text-zinc-400 text-center text-lg mb-10 max-w-xl">
        Dengarkan jutaan lagu, dukung artist favoritmu secara langsung.
        Setiap stream yang kamu putar, artist mendapat bayaran yang adil.
      </p>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <Link
          href="/register"
          className="bg-green-500 hover:bg-green-400 text-black font-bold px-10 py-4 rounded-full text-lg transition-all duration-200 text-center"
        >
          Mulai Gratis
        </Link>
        <Link
          href="/login"
          className="border border-zinc-600 hover:border-white text-white font-bold px-10 py-4 rounded-full text-lg transition-all duration-200 text-center"
        >
          Masuk
        </Link>
      </div>

      {/* Creator Register Link */}
      <div className="flex items-center gap-3 mb-16">
        <div className="h-px w-16 bg-zinc-800"/>
        <Link
          href="/creator-register"
          className="flex items-center gap-2 text-zinc-500 hover:text-green-400 text-sm transition-colors duration-200 group"
        >
          <span className="text-base">🎙️</span>
          <span className="group-hover:underline underline-offset-4">
            Daftar sebagai Artist / Creator
          </span>
          <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z"/>
          </svg>
        </Link>
        <div className="h-px w-16 bg-zinc-800"/>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl w-full">
        {[
          {
            icon: "🎵",
            title: "Stream Berkualitas Tinggi",
            desc: "Nikmati musik dengan kualitas audio terbaik tanpa gangguan.",
          },
          {
            icon: "💰",
            title: "Royalti Transparan",
            desc: "$0.004 per stream langsung ke kantong artist. Tidak ada potongan tersembunyi.",
          },
          {
            icon: "🔐",
            title: "Login Mudah",
            desc: "Masuk dengan Google atau email. Aman, cepat, dan mudah.",
          },
        ].map((f) => (
          <div
            key={f.title}
            className="bg-zinc-900 rounded-2xl p-6 text-center hover:bg-zinc-800 transition-all duration-200"
          >
            <div className="text-4xl mb-3">{f.icon}</div>
            <h3 className="text-white font-bold text-lg mb-2">{f.title}</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>

      {/* Footer */}
      <p className="text-zinc-600 text-sm mt-16">
        2026 SoundWave. Semua hak cipta dilindungi.
      </p>
    </div>
  );
}