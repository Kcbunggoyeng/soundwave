"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export function RegisterForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const validate = () => {
    const e: Record<string, string> = {};
    if (formData.name.length < 2) e.name = "Nama minimal 2 karakter";
    if (!/\S+@\S+\.\S+/.test(formData.email)) e.email = "Email tidak valid";
    if (formData.password.length < 8) e.password = "Password minimal 8 karakter";
    if (!/[A-Z]/.test(formData.password)) e.password = "Harus ada huruf kapital";
    if (!/[0-9]/.test(formData.password)) e.password = "Harus ada angka";
    if (formData.password !== formData.confirmPassword)
      e.confirmPassword = "Password tidak cocok";
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrors(data.details ?? { general: data.error });
        return;
      }

      setSuccess(true);
      setTimeout(async () => {
        await signIn("credentials", {
          email: formData.email,
          password: formData.password,
          callbackUrl: "/home",
        });
      }, 1000);
    } catch {
      setErrors({ general: "Terjadi kesalahan server." });
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = () => {
    const p = formData.password;
    if (p.length === 0) return null;
    let score = 0;
    if (p.length >= 8) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[^a-zA-Z0-9]/.test(p)) score++;
    if (score <= 1) return { label: "Lemah", color: "bg-red-500", width: "w-1/4" };
    if (score === 2) return { label: "Cukup", color: "bg-yellow-500", width: "w-2/4" };
    if (score === 3) return { label: "Kuat", color: "bg-blue-500", width: "w-3/4" };
    return { label: "Sangat Kuat", color: "bg-green-500", width: "w-full" };
  };

  const strength = passwordStrength();

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <svg width="36" height="36" viewBox="0 0 40 40" fill="none">
              <circle cx="20" cy="20" r="20" fill="#1DB954" />
              <path
                d="M12 22c4-3 10-3 16 0M10 17c6-4 14-4 20 0M14 27c3-2 9-2 12 0"
                stroke="white" strokeWidth="2.5" strokeLinecap="round"
              />
            </svg>
            <span className="text-white text-2xl font-bold">SoundWave</span>
          </div>
          <h1 className="text-white text-xl font-bold mt-4">Buat akun gratis</h1>
        </div>

        {/* Google */}
        <button
          onClick={() => signIn("google", { callbackUrl: "/home" })}
          className="w-full flex items-center justify-center gap-3 bg-white text-black font-semibold py-3 px-4 rounded-full hover:bg-zinc-100 transition-all mb-4"
        >
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Daftar dengan Google
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-4">
          <hr className="flex-1 border-zinc-700" />
          <span className="text-zinc-500 text-xs uppercase tracking-wider">atau</span>
          <hr className="flex-1 border-zinc-700" />
        </div>

        {success && (
          <div className="bg-green-950 border border-green-700 text-green-300 text-sm p-3 rounded-lg mb-4 text-center">
            ✅ Akun berhasil dibuat! Mengalihkan ke beranda...
          </div>
        )}

        {errors.general && (
          <div className="bg-red-950 border border-red-800 text-red-300 text-sm p-3 rounded-lg mb-4">
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-zinc-300 text-sm font-medium mb-2">
              Nama Lengkap
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Nama Anda"
              required
              className="w-full bg-zinc-900 border border-zinc-700 text-white placeholder-zinc-500 rounded-lg px-4 py-3 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-colors"
            />
            {errors.name && (
              <p className="text-red-400 text-xs mt-1">{errors.name}</p>
            )}
          </div>

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
            {errors.email && (
              <p className="text-red-400 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-zinc-300 text-sm font-medium mb-2">
              Password
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="Min. 8 karakter, 1 huruf kapital, 1 angka"
              required
              className="w-full bg-zinc-900 border border-zinc-700 text-white placeholder-zinc-500 rounded-lg px-4 py-3 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-colors"
            />
            {strength && (
              <div className="mt-2">
                <div className="w-full bg-zinc-800 rounded-full h-1">
                  <div className={`h-1 rounded-full transition-all ${strength.color} ${strength.width}`} />
                </div>
                <p className="text-xs mt-1 text-zinc-400">
                  Kekuatan: <span className="font-medium">{strength.label}</span>
                </p>
              </div>
            )}
            {errors.password && (
              <p className="text-red-400 text-xs mt-1">{errors.password}</p>
            )}
          </div>

          <div>
            <label className="block text-zinc-300 text-sm font-medium mb-2">
              Konfirmasi Password
            </label>
            <input
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              placeholder="Ulangi password"
              required
              className="w-full bg-zinc-900 border border-zinc-700 text-white placeholder-zinc-500 rounded-lg px-4 py-3 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-colors"
            />
            {errors.confirmPassword && (
              <p className="text-red-400 text-xs mt-1">{errors.confirmPassword}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || success}
            className="w-full bg-green-500 hover:bg-green-400 disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold py-3 px-4 rounded-full transition-all text-sm tracking-wide mt-2"
          >
            {loading ? "Mendaftar..." : "Buat Akun Gratis"}
          </button>
        </form>

        <p className="text-zinc-500 text-xs text-center mt-4">
          Dengan mendaftar, Anda menyetujui Syarat & Ketentuan dan Kebijakan Privasi SoundWave.
        </p>

        <div className="text-center mt-4">
          <span className="text-zinc-400 text-sm">Sudah punya akun? </span>
          <Link
            href="/login"
            className="text-white text-sm font-semibold hover:text-green-400 transition-colors"
          >
            Masuk
          </Link>
        </div>
      </div>
    </div>
  );
}