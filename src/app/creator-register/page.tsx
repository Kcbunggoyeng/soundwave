"use client";

import { useState } from "react";
import Link from "next/link";

const REQUIREMENTS = [
  "Memiliki karya musik/video original yang belum pernah dipublikasikan di platform lain secara eksklusif",
  "Bersedia mematuhi kebijakan hak cipta SoundWave",
  "Memiliki hak penuh atas konten yang akan diupload",
  "Berkomitmen untuk tidak mengupload konten AI-generated tanpa label",
  "Memiliki identitas asli yang dapat diverifikasi",
];

const GENRES = [
  "Pop", "Rock", "Jazz", "Electronic", "Hip-Hop",
  "R&B", "Classical", "Dangdut", "Indie", "Lainnya",
];

export default function CreatorRegisterPage() {
  const [step, setStep] = useState(1);
  const [agreed, setAgreed] = useState<boolean[]>(
    new Array(REQUIREMENTS.length).fill(false)
  );
  const [form, setForm] = useState({
    artistName: "",
    realName: "",
    email: "",
    phone: "",
    genre: "",
    bio: "",
    instagram: "",
    youtube: "",
    sampleWork: "",
    reason: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const allAgreed = agreed.every(Boolean);

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/creator/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          artistName: form.artistName,
          realName: form.realName,
          email: form.email,
          phone: form.phone,
          genre: form.genre,
          bio: form.bio,
          instagram: form.instagram || null,
          youtube: form.youtube || null,
          sampleWork: form.sampleWork,
          reason: form.reason,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Gagal mengirim pendaftaran.");
        return;
      }
      setSubmitted(true);
    } catch {
      setError("Terjadi kesalahan jaringan. Coba lagi nanti.");
    } finally {
      setLoading(false);
    }
  };

  const toggleAgreed = (i: number) => {
    const next = [...agreed];
    next[i] = !next[i];
    setAgreed(next);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-ink flex items-center justify-center p-6">
        <div className="max-w-lg w-full text-center">
          <div className="w-16 h-16 rounded-xl bg-coral/15 flex items-center justify-center mx-auto mb-6">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="#ff4d6d">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
            </svg>
          </div>
          <h1 className="text-chalk text-2xl font-black mb-3">Pendaftaran Dikirim!</h1>
          <p className="text-mist mb-6 leading-relaxed">
            Terima kasih, <span className="text-chalk font-semibold">{form.artistName}</span>!
            Tim SoundWave akan mereview dalam <span className="text-coral font-semibold">3-5 hari kerja</span>.
            Notifikasi dikirim ke <span className="text-chalk">{form.email}</span>.
          </p>

          <div className="bg-surface border border-surface-hi/50 rounded-xl p-6 mb-8 text-left">
            <p className="text-mist/60 text-xs uppercase tracking-wider font-semibold mb-4">
              Proses Selanjutnya
            </p>
            <div className="space-y-3">
              {[
                { n: "1", label: "Tim admin mereview profil dan karya sample kamu", done: true },
                { n: "2", label: "Verifikasi identitas via email", done: false },
                { n: "3", label: "Akun Creator diaktifkan", done: false },
                { n: "4", label: "Mulai upload dan dapatkan royalti", done: false },
              ].map((s) => (
                <div key={s.n} className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${s.done ? "bg-coral text-ink" : "bg-surface-hi text-mist"}`}>
                    {s.done ? "✓" : s.n}
                  </div>
                  <span className={`text-sm ${s.done ? "text-chalk" : "text-mist/60"}`}>
                    {s.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <Link
            href="/login"
            className="inline-block bg-coral hover:bg-coral-hover text-ink font-bold px-8 py-3 rounded-lg transition-all text-sm"
          >
            Kembali ke Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ink">
      {/* Header */}
      <div className="border-b border-surface-hi/40 px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <svg width="32" height="32" viewBox="0 0 40 40" fill="none">
            <rect width="40" height="40" rx="10" fill="#ff4d6d" opacity="0.12" />
            <path
              d="M8 26c5-10 8-2 12-10s5 2 9-6"
              stroke="#ff4d6d"
              strokeWidth="2.8"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M8 32c4-4 7-2 10-8s4 4 8-2"
              stroke="#ff4d6d"
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
              opacity="0.55"
            />
            <circle cx="30" cy="10" r="2.5" fill="#ff4d6d" opacity="0.9" />
          </svg>
          <span className="text-chalk font-bold text-lg tracking-tight">SoundWave</span>
        </Link>
        <Link href="/login" className="text-mist hover:text-chalk text-sm transition-colors">
          Sudah punya akun? Masuk
        </Link>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-10">
        {/* Error global */}
        {error && (
          <div className="bg-red-950/50 border border-red-900/50 text-red-300 text-sm p-4 rounded-xl mb-6 text-center">
            {error}
          </div>
        )}

        {/* Progress */}
        <div className="flex items-center mb-10">
          {[
            { n: 1, label: "Persyaratan" },
            { n: 2, label: "Data Diri" },
            { n: 3, label: "Detail Karya" },
          ].map((s, i) => (
            <div key={s.n} className="flex items-center flex-1">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0 transition-all ${step >= s.n ? "bg-coral text-ink" : "bg-surface-hi text-mist"}`}>
                {step > s.n ? "✓" : s.n}
              </div>
              <span className={`text-xs font-medium mx-2 hidden sm:block ${step >= s.n ? "text-chalk" : "text-mist/40"}`}>
                {s.label}
              </span>
              {i < 2 && (
                <div className={`flex-1 h-0.5 mr-2 ${step > s.n ? "bg-coral" : "bg-surface-hi"}`} />
              )}
            </div>
          ))}
        </div>

        {/* STEP 1 */}
        {step === 1 && (
          <div>
            <div className="mb-8">
              <h1 className="text-chalk text-3xl font-black mb-2">Daftar sebagai Creator</h1>
              <p className="text-mist">
                Bergabung dengan ribuan artist di SoundWave dan mulai monetisasi karyamu.
              </p>
            </div>

            <div className="bg-surface border border-surface-hi/50 rounded-xl p-6 mb-6">
              <h2 className="text-chalk font-bold mb-5 flex items-center gap-2">
                <span className="text-coral text-lg">|</span>
                Persyaratan Pendaftaran Creator
              </h2>
              <div className="space-y-4">
                {REQUIREMENTS.map((req, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 cursor-pointer group"
                    onClick={() => toggleAgreed(i)}
                  >
                    <div className={`w-5 h-5 rounded flex-shrink-0 mt-0.5 border-2 flex items-center justify-center transition-all ${agreed[i] ? "bg-coral border-coral" : "border-mist/30 hover:border-mist"}`}>
                      {agreed[i] && (
                        <svg width="10" height="10" fill="#0a0a0f" viewBox="0 0 24 24">
                          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                        </svg>
                      )}
                    </div>
                    <span className={`text-sm leading-relaxed transition-colors ${agreed[i] ? "text-chalk" : "text-mist group-hover:text-chalk"}`}>
                      {req}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-coral/5 border border-coral/15 rounded-xl p-4 mb-6">
              <p className="text-coral/90 text-sm leading-relaxed">
                <span className="font-bold">Info:</span> Pendaftaran Creator memerlukan
                review admin 3-5 hari kerja. Setelah disetujui, kamu bisa upload musik
                dan video serta mulai mendapat royalti.
              </p>
            </div>

            <button
              onClick={() => setStep(2)}
              disabled={!allAgreed}
              className="w-full bg-coral hover:bg-coral-hover disabled:opacity-40 disabled:cursor-not-allowed text-ink font-bold py-4 rounded-lg transition-all text-sm"
            >
              {allAgreed
                ? "Lanjutkan"
                : `Centang semua persyaratan (${agreed.filter(Boolean).length}/${REQUIREMENTS.length})`}
            </button>

            <p className="text-center text-mist text-sm mt-4">
              Bukan artist?{" "}
              <Link href="/register" className="text-chalk hover:text-coral transition-colors">
                Daftar sebagai pendengar
              </Link>
            </p>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div>
            <div className="mb-8">
              <h1 className="text-chalk text-3xl font-black mb-2">Data Diri</h1>
              <p className="text-mist">Isi informasi dirimu sebagai artist.</p>
            </div>

            <div className="space-y-4">
              {[
                { label: "Nama Artist/Panggung *", key: "artistName", placeholder: "Contoh: Raisa, Noah Band", type: "text" },
                { label: "Nama Asli *", key: "realName", placeholder: "Nama lengkap sesuai KTP", type: "text" },
                { label: "Email Aktif *", key: "email", placeholder: "email@kamu.com", type: "email" },
                { label: "Nomor WhatsApp *", key: "phone", placeholder: "08xxxxxxxxxx", type: "tel" },
              ].map((field) => (
                <div key={field.key}>
                  <label className="block text-mist text-sm font-medium mb-2">
                    {field.label}
                  </label>
                  <input
                    type={field.type}
                    value={(form as any)[field.key]}
                    onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                    placeholder={field.placeholder}
                    className="w-full bg-surface border border-surface-hi/60 text-chalk placeholder-mist/30 rounded-lg px-4 py-3 focus:outline-none focus:border-coral/60 transition-colors text-sm"
                  />
                </div>
              ))}

              <div>
                <label className="block text-mist text-sm font-medium mb-2">Genre Utama *</label>
                <select
                  value={form.genre}
                  onChange={(e) => setForm({ ...form, genre: e.target.value })}
                  className="w-full bg-surface border border-surface-hi/60 text-chalk rounded-lg px-4 py-3 focus:outline-none focus:border-coral/60 transition-colors text-sm"
                >
                  <option value="">Pilih genre...</option>
                  {GENRES.map((g) => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-mist text-sm font-medium mb-2">Bio Singkat *</label>
                <textarea
                  value={form.bio}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
                  placeholder="Ceritakan tentang dirimu sebagai artist..."
                  rows={4}
                  className="w-full bg-surface border border-surface-hi/60 text-chalk placeholder-mist/30 rounded-lg px-4 py-3 focus:outline-none focus:border-coral/60 transition-colors text-sm resize-none"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setStep(1)}
                className="flex-1 border border-surface-hi/60 text-mist font-bold py-3 rounded-lg hover:border-mist/40 transition-all text-sm"
              >
                Kembali
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={!form.artistName || !form.realName || !form.email || !form.phone || !form.genre || !form.bio}
                className="flex-1 bg-coral hover:bg-coral-hover disabled:opacity-40 disabled:cursor-not-allowed text-ink font-bold py-3 rounded-lg transition-all text-sm"
              >
                Lanjutkan
              </button>
            </div>
          </div>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <div>
            <div className="mb-8">
              <h1 className="text-chalk text-3xl font-black mb-2">Detail Karya</h1>
              <p className="text-mist">Tunjukkan karyamu kepada tim SoundWave.</p>
            </div>

            <div className="space-y-4">
              {[
                { label: "Instagram (opsional)", key: "instagram", placeholder: "@username", type: "text" },
                { label: "YouTube (opsional)", key: "youtube", placeholder: "https://youtube.com/@channel", type: "url" },
                { label: "Link Karya Sample *", key: "sampleWork", placeholder: "YouTube, SoundCloud, Google Drive, dll", type: "url" },
              ].map((field) => (
                <div key={field.key}>
                  <label className="block text-mist text-sm font-medium mb-2">
                    {field.label}
                  </label>
                  <input
                    type={field.type}
                    value={(form as any)[field.key]}
                    onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                    placeholder={field.placeholder}
                    className="w-full bg-surface border border-surface-hi/60 text-chalk placeholder-mist/30 rounded-lg px-4 py-3 focus:outline-none focus:border-coral/60 transition-colors text-sm"
                  />
                </div>
              ))}

              <div>
                <label className="block text-mist text-sm font-medium mb-2">
                  Mengapa ingin bergabung SoundWave? *
                </label>
                <textarea
                  value={form.reason}
                  onChange={(e) => setForm({ ...form, reason: e.target.value })}
                  placeholder="Ceritakan motivasimu dan rencana konten yang akan kamu upload..."
                  rows={4}
                  className="w-full bg-surface border border-surface-hi/60 text-chalk placeholder-mist/30 rounded-lg px-4 py-3 focus:outline-none focus:border-coral/60 transition-colors text-sm resize-none"
                />
              </div>
            </div>

            <div className="bg-surface border border-surface-hi/50 rounded-lg p-5 mt-6">
              <p className="text-mist/60 text-xs uppercase tracking-wider mb-3 font-semibold">
                Ringkasan Pendaftaran
              </p>
              <div className="space-y-2 text-sm">
                {[
                  { label: "Nama Artist", value: form.artistName },
                  { label: "Email", value: form.email },
                  { label: "Genre", value: form.genre },
                ].map((item) => (
                  <div key={item.label} className="flex justify-between">
                    <span className="text-mist/50">{item.label}</span>
                    <span className="text-chalk font-medium">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setStep(2)}
                className="flex-1 border border-surface-hi/60 text-mist font-bold py-3 rounded-lg hover:border-mist/40 transition-all text-sm"
              >
                Kembali
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading || !form.sampleWork || !form.reason}
                className="flex-1 bg-coral hover:bg-coral-hover disabled:opacity-40 disabled:cursor-not-allowed text-ink font-bold py-3 rounded-lg transition-all text-sm"
              >
                {loading ? "Mengirim..." : "Kirim Pendaftaran"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}