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

  const allAgreed = agreed.every(Boolean);

  const handleSubmit = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 2000));
    setSubmitted(true);
    setLoading(false);
  };

  const toggleAgreed = (i: number) => {
    const next = [...agreed];
    next[i] = !next[i];
    setAgreed(next);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6">
        <div className="max-w-lg w-full text-center">
          <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
            <svg width="40" height="40" fill="#1DB954" viewBox="0 0 24 24">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
            </svg>
          </div>
          <h1 className="text-white text-3xl font-black mb-3">Pendaftaran Dikirim!</h1>
          <p className="text-zinc-400 mb-6 leading-relaxed">
            Terima kasih,{" "}
            <span className="text-white font-semibold">{form.artistName}</span>!
            Tim SoundWave akan mereview dalam{" "}
            <span className="text-green-400 font-semibold">3-5 hari kerja</span>.
            Notifikasi dikirim ke{" "}
            <span className="text-white">{form.email}</span>.
          </p>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mb-8 text-left">
            <p className="text-zinc-400 text-xs uppercase tracking-wider font-semibold mb-4">
              Proses Selanjutnya:
            </p>
            <div className="space-y-3">
              {[
                { n: "1", label: "Tim admin mereview profil dan karya sample kamu", done: true },
                { n: "2", label: "Verifikasi identitas via email", done: false },
                { n: "3", label: "Akun Creator diaktifkan", done: false },
                { n: "4", label: "Mulai upload dan dapatkan royalti", done: false },
              ].map((s) => (
                <div key={s.n} className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${s.done ? "bg-green-500 text-black" : "bg-zinc-800 text-zinc-400"}`}>
                    {s.done ? "✓" : s.n}
                  </div>
                  <span className={`text-sm ${s.done ? "text-white" : "text-zinc-500"}`}>
                    {s.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <Link
            href="/login"
            className="block bg-green-500 hover:bg-green-400 text-black font-bold px-8 py-3 rounded-full transition-all"
          >
            Kembali ke Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="border-b border-zinc-800 px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <svg width="32" height="32" viewBox="0 0 40 40" fill="none">
            <circle cx="20" cy="20" r="20" fill="#1DB954" />
            <path
              d="M12 22c4-3 10-3 16 0M10 17c6-4 14-4 20 0M14 27c3-2 9-2 12 0"
              stroke="white" strokeWidth="2.5" strokeLinecap="round"
            />
          </svg>
          <span className="text-white font-bold text-lg">SoundWave</span>
        </Link>
        <Link href="/login" className="text-zinc-400 hover:text-white text-sm transition-colors">
          Sudah punya akun? Masuk
        </Link>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-10">
        {/* Progress */}
        <div className="flex items-center mb-10">
          {[
            { n: 1, label: "Persyaratan" },
            { n: 2, label: "Data Diri" },
            { n: 3, label: "Detail Karya" },
          ].map((s, i) => (
            <div key={s.n} className="flex items-center flex-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 transition-all ${step >= s.n ? "bg-green-500 text-black" : "bg-zinc-800 text-zinc-500"}`}>
                {step > s.n ? "✓" : s.n}
              </div>
              <span className={`text-xs font-medium mx-2 hidden sm:block ${step >= s.n ? "text-white" : "text-zinc-600"}`}>
                {s.label}
              </span>
              {i < 2 && (
                <div className={`flex-1 h-0.5 mr-2 ${step > s.n ? "bg-green-500" : "bg-zinc-800"}`} />
              )}
            </div>
          ))}
        </div>

        {/* STEP 1 */}
        {step === 1 && (
          <div>
            <div className="mb-8">
              <h1 className="text-white text-3xl font-black mb-2">Daftar sebagai Creator</h1>
              <p className="text-zinc-400">
                Bergabunglah dengan ribuan artist di SoundWave dan mulai monetisasi karyamu.
                Baca dan setujui persyaratan berikut.
              </p>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mb-6">
              <h2 className="text-white font-bold mb-5 flex items-center gap-2">
                <span className="text-xl">📋</span>
                Persyaratan Pendaftaran Creator
              </h2>
              <div className="space-y-4">
                {REQUIREMENTS.map((req, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 cursor-pointer group"
                    onClick={() => toggleAgreed(i)}
                  >
                    <div className={`w-5 h-5 rounded flex-shrink-0 mt-0.5 border-2 flex items-center justify-center transition-all ${agreed[i] ? "bg-green-500 border-green-500" : "border-zinc-600 hover:border-zinc-400"}`}>
                      {agreed[i] && (
                        <svg width="10" height="10" fill="black" viewBox="0 0 24 24">
                          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                        </svg>
                      )}
                    </div>
                    <span className={`text-sm leading-relaxed transition-colors ${agreed[i] ? "text-white" : "text-zinc-400 group-hover:text-zinc-300"}`}>
                      {req}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-green-500/5 border border-green-500/20 rounded-xl p-4 mb-6">
              <p className="text-green-400 text-sm leading-relaxed">
                <span className="font-bold">Info:</span> Pendaftaran Creator memerlukan
                review admin 3-5 hari kerja. Setelah disetujui, kamu bisa upload musik
                dan video serta mulai mendapat royalti.
              </p>
            </div>

            <button
              onClick={() => setStep(2)}
              disabled={!allAgreed}
              className="w-full bg-green-500 hover:bg-green-400 disabled:opacity-40 disabled:cursor-not-allowed text-black font-bold py-4 rounded-full transition-all"
            >
              {allAgreed
                ? "Lanjutkan"
                : `Centang semua persyaratan (${agreed.filter(Boolean).length}/${REQUIREMENTS.length})`}
            </button>

            <p className="text-center text-zinc-500 text-sm mt-4">
              Bukan artist?{" "}
              <Link href="/register" className="text-zinc-300 hover:text-green-400 transition-colors">
                Daftar sebagai pendengar
              </Link>
            </p>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div>
            <div className="mb-8">
              <h1 className="text-white text-3xl font-black mb-2">Data Diri</h1>
              <p className="text-zinc-400">Isi informasi dirimu sebagai artist.</p>
            </div>

            <div className="space-y-4">
              {[
                { label: "Nama Artist/Panggung *", key: "artistName", placeholder: "Contoh: Raisa, Noah Band", type: "text" },
                { label: "Nama Asli *", key: "realName", placeholder: "Nama lengkap sesuai KTP", type: "text" },
                { label: "Email Aktif *", key: "email", placeholder: "email@kamu.com", type: "email" },
                { label: "Nomor WhatsApp *", key: "phone", placeholder: "08xxxxxxxxxx", type: "tel" },
              ].map((field) => (
                <div key={field.key}>
                  <label className="block text-zinc-300 text-sm font-medium mb-2">
                    {field.label}
                  </label>
                  <input
                    type={field.type}
                    value={(form as any)[field.key]}
                    onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                    placeholder={field.placeholder}
                    className="w-full bg-zinc-900 border border-zinc-700 text-white placeholder-zinc-500 rounded-xl px-4 py-3 focus:outline-none focus:border-green-500 transition-colors text-sm"
                  />
                </div>
              ))}

              <div>
                <label className="block text-zinc-300 text-sm font-medium mb-2">Genre Utama *</label>
                <select
                  value={form.genre}
                  onChange={(e) => setForm({ ...form, genre: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-green-500 transition-colors text-sm"
                >
                  <option value="">Pilih genre...</option>
                  {GENRES.map((g) => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-zinc-300 text-sm font-medium mb-2">Bio Singkat *</label>
                <textarea
                  value={form.bio}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
                  placeholder="Ceritakan tentang dirimu sebagai artist..."
                  rows={4}
                  className="w-full bg-zinc-900 border border-zinc-700 text-white placeholder-zinc-500 rounded-xl px-4 py-3 focus:outline-none focus:border-green-500 transition-colors text-sm resize-none"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setStep(1)}
                className="flex-1 border border-zinc-700 text-zinc-300 font-bold py-3 rounded-full hover:border-zinc-500 transition-all"
              >
                Kembali
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={!form.artistName || !form.realName || !form.email || !form.phone || !form.genre || !form.bio}
                className="flex-1 bg-green-500 hover:bg-green-400 disabled:opacity-40 disabled:cursor-not-allowed text-black font-bold py-3 rounded-full transition-all"
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
              <h1 className="text-white text-3xl font-black mb-2">Detail Karya</h1>
              <p className="text-zinc-400">Tunjukkan karyamu kepada tim SoundWave.</p>
            </div>

            <div className="space-y-4">
              {[
                { label: "Instagram (opsional)", key: "instagram", placeholder: "@username", type: "text" },
                { label: "YouTube (opsional)", key: "youtube", placeholder: "https://youtube.com/@channel", type: "url" },
                { label: "Link Karya Sample *", key: "sampleWork", placeholder: "YouTube, SoundCloud, Google Drive, dll", type: "url" },
              ].map((field) => (
                <div key={field.key}>
                  <label className="block text-zinc-300 text-sm font-medium mb-2">
                    {field.label}
                  </label>
                  <input
                    type={field.type}
                    value={(form as any)[field.key]}
                    onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                    placeholder={field.placeholder}
                    className="w-full bg-zinc-900 border border-zinc-700 text-white placeholder-zinc-500 rounded-xl px-4 py-3 focus:outline-none focus:border-green-500 transition-colors text-sm"
                  />
                </div>
              ))}

              <div>
                <label className="block text-zinc-300 text-sm font-medium mb-2">
                  Mengapa ingin bergabung SoundWave? *
                </label>
                <textarea
                  value={form.reason}
                  onChange={(e) => setForm({ ...form, reason: e.target.value })}
                  placeholder="Ceritakan motivasimu dan rencana konten yang akan kamu upload..."
                  rows={4}
                  className="w-full bg-zinc-900 border border-zinc-700 text-white placeholder-zinc-500 rounded-xl px-4 py-3 focus:outline-none focus:border-green-500 transition-colors text-sm resize-none"
                />
              </div>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 mt-6">
              <p className="text-zinc-400 text-xs uppercase tracking-wider mb-3 font-semibold">
                Ringkasan Pendaftaran
              </p>
              <div className="space-y-2 text-sm">
                {[
                  { label: "Nama Artist", value: form.artistName },
                  { label: "Email", value: form.email },
                  { label: "Genre", value: form.genre },
                ].map((item) => (
                  <div key={item.label} className="flex justify-between">
                    <span className="text-zinc-500">{item.label}</span>
                    <span className="text-white font-medium">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setStep(2)}
                className="flex-1 border border-zinc-700 text-zinc-300 font-bold py-3 rounded-full hover:border-zinc-500 transition-all"
              >
                Kembali
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading || !form.sampleWork || !form.reason}
                className="flex-1 bg-green-500 hover:bg-green-400 disabled:opacity-40 disabled:cursor-not-allowed text-black font-bold py-3 rounded-full transition-all"
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
