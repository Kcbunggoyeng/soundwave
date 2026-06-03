"use client";

import { useState } from "react";

interface NamedInputEvent {
  target: {
    name: string;
    value: string;
  };
}

export default function CreatorRegisterPage() {
  const [form, setForm] = useState({
    artistName: "",
    genre: "",
    bio: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e: NamedInputEvent) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/creator/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Gagal mendaftar");

      setMessage("Pendaftaran berhasil dikirim! Tunggu persetujuan admin.");
      setForm({ artistName: "", genre: "", bio: "" });
    } catch {
      setMessage("Terjadi kesalahan. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-ink text-chalk flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md bg-surface border border-white/5 rounded-2xl p-8 shadow-xl">
        <h2 className="text-2xl font-bold mb-2">
          Daftar <span className="text-coral">Creator</span>
        </h2>
        <p className="text-mist text-sm mb-6">
          Isi data di bawah untuk mengajukan akun kreator.
        </p>

        {message && (
          <div className="mb-4 rounded-lg bg-coral/10 border border-coral/20 px-4 py-3 text-sm text-coral">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nama Artis / Band</label>
            <input
              name="artistName"
              value={form.artistName}
              onChange={handleChange}
              required
              className="w-full rounded-lg bg-ink border border-white/10 px-4 py-2 text-sm text-chalk placeholder-mist focus:border-coral focus:outline-none"
              placeholder="Nama panggungmu"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Genre Utama</label>
            <input
              name="genre"
              value={form.genre}
              onChange={handleChange}
              required
              className="w-full rounded-lg bg-ink border border-white/10 px-4 py-2 text-sm text-chalk placeholder-mist focus:border-coral focus:outline-none"
              placeholder="Contoh: Indie, Jazz, Rock"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Bio Singkat</label>
            <textarea
              name="bio"
              value={form.bio}
              onChange={handleChange}
              rows={4}
              required
              className="w-full rounded-lg bg-ink border border-white/10 px-4 py-2 text-sm text-chalk placeholder-mist focus:border-coral focus:outline-none resize-none"
              placeholder="Ceritakan dirimu..."
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-coral px-4 py-2.5 text-sm font-semibold text-white shadow hover:bg-[#e64460] transition disabled:opacity-60"
          >
            {loading ? "Mengirim..." : "Kirim Pendaftaran"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-mist">
          Kembali ke{" "}
          <a href="/" className="text-coral hover:underline">
            beranda
          </a>
        </p>
      </div>
    </main>
  );
}