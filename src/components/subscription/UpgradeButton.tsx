"use client";

import { useState } from "react";

interface Props {
  plan: "PREMIUM" | "CREATOR";
  highlight: boolean;
}

export function UpgradeButton({ plan, highlight }: Props) {
  const [loading, setLoading] = useState(false);

  const handleUpgrade = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/payments/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error ?? "Gagal membuat sesi pembayaran");
      }
    } catch {
      alert("Terjadi kesalahan. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleUpgrade}
      disabled={loading}
      className={`w-full py-3 rounded-full text-sm font-bold transition-all disabled:opacity-50 ${
        highlight
          ? "bg-black text-white hover:bg-zinc-900"
          : "bg-green-500 text-black hover:bg-green-400"
      }`}
    >
      {loading ? "Memproses..." : `Upgrade ke ${plan}`}
    </button>
  );
}