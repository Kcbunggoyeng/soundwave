import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { UpgradeButton } from "@/components/subscription/UpgradeButton";

export default async function SubscriptionPage() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const currentSub = await db.subscription.findFirst({
    where: { userId: session.user.id, status: "ACTIVE" },
    orderBy: { createdAt: "desc" },
  });
  const currentPlan = currentSub?.plan ?? "FREE";

  const plans = [
    {
      key: "FREE",
      name: "Free",
      price: "Rp 0",
      period: "selamanya",
      features: [
        "Stream dengan iklan",
        "Kualitas standar",
        "3 playlist",
        "Explore musik",
      ],
      highlight: false,
    },
    {
      key: "PREMIUM",
      name: "Premium",
      price: "Rp 49.900",
      period: "bulan",
      features: [
        "Tanpa iklan",
        "Kualitas Hi-Fi",
        "Playlist tak terbatas",
        "Download offline",
        "Lirik real-time",
      ],
      highlight: true,
    },
    {
      key: "CREATOR",
      name: "Creator",
      price: "Rp 99.900",
      period: "bulan",
      features: [
        "Semua fitur Premium",
        "Upload musik dan video",
        "Dashboard royalti",
        "Analytics mendalam",
        "Badge Creator ✓",
      ],
      highlight: false,
    },
  ];

  return (
    <div className="p-6 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-white text-3xl font-bold mb-2">Upgrade Plan</h1>
        <p className="text-zinc-400">
          Plan aktif:{" "}
          <span className="text-green-400 font-semibold">{currentPlan}</span>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {plans.map((plan) => (
          <div
            key={plan.key}
            className={`rounded-2xl p-8 relative border ${
              plan.highlight
                ? "bg-green-500 border-green-500"
                : currentPlan === plan.key
                ? "bg-zinc-900 border-green-500"
                : "bg-zinc-900 border-zinc-800"
            }`}
          >
            {plan.highlight && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-black text-green-400 text-xs font-bold px-4 py-1 rounded-full border border-green-500">
                PALING POPULER
              </div>
            )}
            {currentPlan === plan.key && !plan.highlight && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-green-500 text-black text-xs font-bold px-4 py-1 rounded-full">
                PLAN AKTIF
              </div>
            )}

            <h3 className={`text-2xl font-black mb-1 ${plan.highlight ? "text-black" : "text-white"}`}>
              {plan.name}
            </h3>
            <div className="mb-6">
              <span className={`text-3xl font-black ${plan.highlight ? "text-black" : "text-white"}`}>
                {plan.price}
              </span>
              <span className={`text-sm ml-1 ${plan.highlight ? "text-black/60" : "text-zinc-500"}`}>
                / {plan.period}
              </span>
            </div>

            <ul className="space-y-3 mb-8">
              {plan.features.map((f) => (
                <li
                  key={f}
                  className={`flex items-start gap-2 text-sm ${
                    plan.highlight ? "text-black/80" : "text-zinc-400"
                  }`}
                >
                  <span className={`mt-0.5 ${plan.highlight ? "text-black" : "text-green-400"}`}>
                    ✓
                  </span>
                  {f}
                </li>
              ))}
            </ul>

            {currentPlan === plan.key ? (
              <div className={`text-center py-3 rounded-full text-sm font-bold ${
                plan.highlight ? "bg-black/20 text-black" : "bg-zinc-800 text-zinc-400"
              }`}>
                Plan Saat Ini
              </div>
            ) : plan.key === "FREE" ? (
              <div className="text-center py-3 rounded-full text-sm font-bold bg-zinc-800 text-zinc-500">
                Gratis
              </div>
            ) : (
              <UpgradeButton
                plan={plan.key as "PREMIUM" | "CREATOR"}
                highlight={plan.highlight}
              />
            )}
          </div>
        ))}
      </div>

      {/* Royalty Info */}
      <div className="bg-zinc-900 rounded-2xl p-8 border border-zinc-800">
        <h2 className="text-white text-xl font-bold mb-4">
          💡 Tentang Sistem Royalti SoundWave
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: "$0.004 per Stream",
              desc: "Setiap kali lagu diputar, artist mendapat $0.004 USD secara otomatis.",
            },
            {
              title: "Transparansi Penuh",
              desc: "Artist bisa melihat real-time berapa stream dan pendapatan mereka.",
            },
            {
              title: "Pembayaran Bulanan",
              desc: "Royalti dibayarkan setiap tanggal 1 bulan berikutnya. Minimum payout $10.",
            },
          ].map((item) => (
            <div key={item.title}>
              <h3 className="text-green-400 font-bold mb-2">{item.title}</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}