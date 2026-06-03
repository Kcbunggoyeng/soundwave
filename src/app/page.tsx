import Link from "next/link";

function WaveLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 32" fill="none" className={className}>
      <path
        d="M4 20c4-8 8-4 12-12s8 4 12-4"
        stroke="#ff4d6d"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M32 24c6-10 10-2 14-14s6 6 10-2"
        stroke="#ff4d6d"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
        opacity="0.7"
      />
      <text
        x="58"
        y="23"
        fill="#f0f0f5"
        fontFamily="Inter, system-ui, sans-serif"
        fontSize="18"
        fontWeight="700"
        letterSpacing="-0.5"
      >
        SoundWave
      </text>
    </svg>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-ink text-chalk relative overflow-hidden">
      {/* Ambient background gradients */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-[#ff4d6d] opacity-[0.07] blur-[120px]" />
        <div className="absolute top-20 right-0 w-[400px] h-[400px] rounded-full bg-[#7c3aed] opacity-[0.06] blur-[100px]" />
        <div className="absolute bottom-0 left-1/3 w-[600px] h-[300px] rounded-full bg-[#0ea5e9] opacity-[0.04] blur-[100px]" />
      </div>

      {/* Noise texture overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative max-w-6xl mx-auto px-6 py-10 flex flex-col min-h-screen">
        {/* Header */}
        <header className="flex items-center justify-between mb-24">
          <WaveLogo className="h-7 w-auto" />
          <div className="flex items-center gap-6">
            <Link
              href="/login"
              className="text-sm text-mist hover:text-chalk transition-colors"
            >
              Masuk
            </Link>
            <Link
              href="/register"
              className="text-sm bg-coral hover:bg-coral-hover text-ink font-semibold px-5 py-2 rounded-lg transition-all"
            >
              Daftar
            </Link>
          </div>
        </header>

        {/* Hero — asymmetric split */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-32">
          <div className="lg:col-span-7">
            <p className="text-coral text-xs font-bold uppercase tracking-[0.2em] mb-4">
              Platform independen
            </p>
            <h1 className="text-4xl md:text-6xl font-bold leading-[1.1] mb-6 tracking-tight">
              Bukan cuma streaming.{" "}
              <span className="text-mist block mt-2">
                Ini soal karya yang punya harga diri.
              </span>
            </h1>
            <p className="text-mist/80 text-lg leading-relaxed max-w-xl mb-10">
              SoundWave dibangun buat artist yang capek lihat royalti lenyap di tengah
              algoritma. Upload, dengarkan, dan bayaran transparan — tanpa
              embel-embel korporasi.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/register"
                className="bg-coral hover:bg-coral-hover text-ink font-bold px-8 py-3.5 rounded-lg transition-all text-sm"
              >
                Mulai gratis — tanpa kartu kredit
              </Link>
              <Link
                href="/creator-register"
                className="border border-surface-hi hover:border-coral/40 text-chalk px-8 py-3.5 rounded-lg transition-all text-sm"
              >
                Daftar sebagai artist
              </Link>
            </div>

            <p className="text-mist/50 text-xs mt-4">
              Sudah 2,847 artist independen bergabung minggu ini.
            </p>
          </div>

          <div className="lg:col-span-5 relative hidden lg:block">
            {/* Abstract visual — stacked cards */}
            <div className="relative w-full aspect-square max-w-sm mx-auto">
              <div className="absolute inset-0 bg-gradient-to-br from-coral/10 to-transparent rounded-2xl border border-surface-hi/50" />
              <div className="absolute top-6 left-6 right-6 bottom-6 bg-surface rounded-xl border border-white/5 p-5 flex flex-col justify-between shadow-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-coral/20 flex items-center justify-center">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="#ff4d6d">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Midnight Sessions</p>
                    <p className="text-xs text-mist">The Hush Project</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-1 bg-surface-hi rounded-full overflow-hidden">
                    <div className="h-full w-2/3 bg-coral rounded-full" />
                  </div>
                  <div className="flex justify-between text-xs text-mist">
                    <span>2:14</span>
                    <span>3:42</span>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 w-3/4 bg-surface rounded-xl border border-white/5 p-4 shadow-xl rotate-3">
                <div className="flex items-center justify-between text-xs text-mist mb-2">
                  <span>Royalti bulan ini</span>
                  <span className="text-coral font-bold">+12.4%</span>
                </div>
                <p className="text-xl font-bold">Rp 847.000</p>
              </div>
            </div>
          </div>
        </section>

        {/* Features — staggered list, not grid */}
        <section className="mb-32">
          <div className="max-w-2xl mb-16">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Kenapa artist pindah ke sini?
            </h2>
            <p className="text-mist">
              Bukan karena kita lebih besar. Karena kita lebih jujur.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "Royalti yang bisa dihitung",
                body: "Setiap play bernilai tetap. Tidak ada formula rahasia yang mengubah-ubah rate tiap bulan.",
              },
              {
                title: "Tanpa gatekeeper",
                body: "Tidak ada label yang memutuskan karya kamu layak atau tidak. Komunitas yang menilai.",
              },
              {
                title: "Data milik kamu",
                body: "Export audience data kapan saja. Kami tidak membenamkannya di balik dashboard premium.",
              },
            ].map((f, i) => (
              <div
                key={f.title}
                className="group border border-surface-hi/60 hover:border-coral/30 bg-surface/50 rounded-xl p-7 transition-all hover:-translate-y-1"
              >
                <span className="text-coral/60 text-xs font-bold tracking-widest uppercase mb-3 block">
                  0{i + 1}
                </span>
                <h3 className="text-lg font-bold mb-2 group-hover:text-coral transition-colors">
                  {f.title}
                </h3>
                <p className="text-mist/70 text-sm leading-relaxed">{f.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA footer */}
        <section className="mt-auto mb-10 bg-surface border border-surface-hi/50 rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-bold mb-1">Siap rilis karya pertama?</h3>
            <p className="text-mist text-sm">
              Pendaftaran artist gratis. Review manual oleh tim kami 1–3 hari kerja.
            </p>
          </div>
          <Link
            href="/creator-register"
            className="bg-coral hover:bg-coral-hover text-ink font-bold px-7 py-3 rounded-lg transition-all text-sm whitespace-nowrap"
          >
            Ajukan akun creator
          </Link>
        </section>

        {/* Footer */}
        <footer className="text-mist/40 text-xs flex items-center justify-between py-6 border-t border-surface-hi/30">
          <p>© {new Date().getFullYear()} SoundWave. Royalti jujur untuk artist independen.</p>
          <div className="flex gap-4">
            <span className="hover:text-mist cursor-pointer transition-colors">Syarat</span>
            <span className="hover:text-mist cursor-pointer transition-colors">Privasi</span>
            <span className="hover:text-mist cursor-pointer transition-colors">Kontak</span>
          </div>
        </footer>
      </div>
    </div>
  );
}