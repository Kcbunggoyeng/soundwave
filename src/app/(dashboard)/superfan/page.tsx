"use client";

import { useState } from "react";

const TIP_AMOUNTS = [5000, 10000, 25000, 50000, 100000];

export default function SuperFanPage() {
  const [selected, setSelected] = useState<number>(10000);
  const [custom, setCustom] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const finalAmount = custom ? parseInt(custom) : selected;
  const artistShare = Math.round(finalAmount * 0.9);
  const platformFee = Math.round(finalAmount * 0.1);

  const handleTip = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setSuccess(true);
    setLoading(false);
  };

  return (
    <div className="p-6 max-w-2xl">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">💎</span>
          <h1 className="text-white text-3xl font-bold">Super Fan</h1>
          <span className="bg-gradient-to-r from-yellow-400 to-orange-400 text-black text-xs font-black px-3 py-1 rounded-full">
            EKSKLUSIF
          </span>
        </div>
        <p className="text-zinc-400">
          Dukung artist favoritmu secara langsung. 90% dari tipmu langsung ke kantong mereka.
        </p>
      </div>

      {success ? (
        <div className="bg-zinc-900 border border-green-500/30 rounded-2xl p-10 text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-white text-2xl font-black mb-3">Terima Kasih, Super Fan!</h2>
          <p className="text-zinc-400 mb-4">Kamu baru saja mendukung artist dengan</p>
          <p className="text-green-400 text-3xl font-black mb-6">
            Rp {finalAmount.toLocaleString("id-ID")}
          </p>
          <div className="bg-zinc-800 rounded-xl p-4 mb-6 text-sm space-y-2">
            <div className="flex justify-between">
              <span className="text-zinc-400">Ke Artist (90%)</span>
              <span className="text-green-400 font-bold">Rp {artistShare.toLocaleString("id-ID")}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Platform fee (10%)</span>
              <span className="text-zinc-500">Rp {platformFee.toLocaleString("id-ID")}</span>
            </div>
          </div>
          <div className="inline-flex items-center gap-2 bg-yellow-400/10 border border-yellow-400/30 rounded-full px-4 py-2 mb-6">
            <span>💎</span>
            <span className="text-yellow-400 font-bold text-sm">Super Fan Verified</span>
          </div>
          <button
            onClick={() => { setSuccess(false); setCustom(""); setSelected(10000); }}
            className="block w-full bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-3 rounded-full transition-all"
          >
            Dukung Artist Lain
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: "💎", title: "Pilih Nominal", desc: "Mulai dari Rp5.000" },
              { icon: "⚡", title: "Transfer Instan", desc: "90% ke artist langsung" },
              { icon: "🏆", title: "Dapat Badge", desc: "Super Fan di profilmu" },
            ].map((s) => (
              <div key={s.title} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-center">
                <div className="text-2xl mb-2">{s.icon}</div>
                <p className="text-white text-xs font-bold mb-1">{s.title}</p>
                <p className="text-zinc-500 text-xs">{s.desc}</p>
              </div>
            ))}
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <p className="text-zinc-300 text-sm font-medium mb-4">Pilih nominal dukungan:</p>
            <div className="grid grid-cols-5 gap-2 mb-4">
              {TIP_AMOUNTS.map((amount) => (
                <button
                  key={amount}
                  onClick={() => { setSelected(amount); setCustom(""); }}
                  className={`py-3 rounded-xl text-sm font-bold transition-all ${
                    selected === amount && !custom
                      ? "bg-green-500 text-black"
                      : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                  }`}
                >
                  {amount >= 1000 ? `${amount / 1000}K` : amount}
                </button>
              ))}
            </div>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 text-sm">Rp</span>
              <input
                type="number"
                value={custom}
                onChange={(e) => { setCustom(e.target.value); setSelected(0); }}
                placeholder="Nominal custom..."
                className="w-full bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-green-500 transition-colors text-sm"
              />
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-2">
            <p className="text-zinc-400 text-sm font-medium mb-3">Rincian pembayaran:</p>
            <div className="flex justify-between">
              <span className="text-zinc-400 text-sm">Total tip</span>
              <span className="text-white font-bold">Rp {(finalAmount || 0).toLocaleString("id-ID")}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-green-400 text-sm">Ke artist (90%)</span>
              <span className="text-green-400 font-bold">Rp {(artistShare || 0).toLocaleString("id-ID")}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500 text-sm">Platform fee (10%)</span>
              <span className="text-zinc-500">Rp {(platformFee || 0).toLocaleString("id-ID")}</span>
            </div>
          </div>

          <button
            onClick={handleTip}
            disabled={loading || !finalAmount || finalAmount < 1000}
            className="w-full bg-gradient-to-r from-yellow-400 to-orange-400 hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed text-black font-black py-4 rounded-full transition-all text-lg"
          >
            {loading ? "Memproses..." : "💎 Dukung Sekarang"}
          </button>

          <p className="text-zinc-600 text-xs text-center">
            Minimum tip Rp1.000 • 90% langsung ke artist • 10% biaya platform
          </p>
        </div>
      )}
    </div>
  );
}