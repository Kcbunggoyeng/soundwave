"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export function LoginForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });
      if (result?.error) {
        setError("Email atau password salah. Pastikan akun sudah terdaftar.");
      } else if (result?.ok) {
        router.push("/home");
        router.refresh();
      }
    } catch {
      setError("Terjadi kesalahan. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-2 mb-2">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
              <circle cx="20" cy="20" r="20" fill="#1DB954" />
              <path
                d="M12 22c4-3 10-3 16 0M10 17c6-4 14-4 20 0M14 27c3-2 9-2 12 0"
                stroke="white" strokeWidth="2.5" strokeLinecap="round"
              />
            </svg>
            <span className="text-white text-3xl font-bold tracking-tight">
              SoundWave
            </span>
          </div>
          <p className="text-zinc-400 text-sm">
            Masuk untuk melanjutkan mendengarkan
          </p>
        </div>

        {/* Google Login */}
        <button
          onClick={() => signIn("google", { callbackUrl: "/home" })}
          className="w-full flex items-center justify-center gap-3 bg-white text-black font-semibold py-3 px-4 rounded-full hover:bg-zinc-100 transition-all duration-200 mb-4"
        >
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Lanjutkan dengan Google
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-4">
          <hr className="flex-1 border-zinc-700" />
          <span className="text-zinc-500 text-xs uppercase tracking-wider">atau</span>
          <hr className="flex-1 border-zinc-700" />
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-950 border border-red-800 text-red-300 text-sm p-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-zinc-300 text-sm font-medium mb-2">
              Alamat Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="email@contoh.com"
              required
              className="w-full bg-zinc-900 border border-zinc-700 text-white placeholder-zinc-500 rounded-lg px-4 py-3 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-zinc-300 text-sm font-medium mb-2">
              Password
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="Password Anda"
              required
              className="w-full bg-zinc-900 border border-zinc-700 text-white placeholder-zinc-500 rounded-lg px-4 py-3 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-500 hover:bg-green-400 disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold py-3 px-4 rounded-full transition-all duration-200 text-sm tracking-wide"
          >
            {loading ? "Memproses..." : "Masuk"}
          </button>
        </form>

        {/* Links */}
        <div className="text-center mt-6 space-y-3">
          <div>
            <span className="text-zinc-400 text-sm">Belum punya akun? </span>
            <Link
              href="/register"
              className="text-white text-sm font-semibold hover:text-green-400 transition-colors"
            >
              Daftar di sini
            </Link>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <hr className="flex-1 border-zinc-800" />
            <span className="text-zinc-600 text-xs">atau</span>
            <hr className="flex-1 border-zinc-800" />
          </div>

          {/* Creator Register */}
          <Link
            href="/creator-register"
            className="flex items-center justify-center gap-2 text-zinc-500 hover:text-green-400 text-sm transition-colors group"
          >
            <span className="text-base">🎙️</span>
            <span className="group-hover:underline underline-offset-4">
              Daftar sebagai Artist / Creator
            </span>
          </Link>
        </div>

      </div>
    </div>
  );
}