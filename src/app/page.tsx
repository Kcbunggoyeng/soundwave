import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-ink text-chalk flex flex-col items-center justify-center px-6 py-20">
      <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
        Sound<span className="text-coral">Wave</span>
      </h1>
      <p className="text-mist text-lg md:text-xl max-w-xl text-center mb-10 leading-relaxed">
        Platform musik independen. Upload, dengar, dan dukung kreator favoritmu.
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          href="/login"
          className="inline-flex items-center justify-center rounded-xl bg-coral px-8 py-3 text-sm font-semibold text-white shadow hover:bg-[#e64460] transition"
        >
          Masuk
        </Link>
        <Link
          href="/register"
          className="inline-flex items-center justify-center rounded-xl border border-coral px-8 py-3 text-sm font-semibold text-coral hover:bg-coral/10 transition"
        >
          Daftar Akun
        </Link>
      </div>

      <div className="mt-16">
        <Link
          href="/creator-register"
          className="text-sm text-mist underline underline-offset-4 hover:text-coral transition"
        >
          Daftar sebagai artis / Creator
        </Link>
      </div>
    </main>
  );
}