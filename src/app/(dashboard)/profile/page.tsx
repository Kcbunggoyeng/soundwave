import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      role: true,
      createdAt: true,
      subscriptions: {
        where: { status: "ACTIVE" },
        take: 1,
      },
      _count: {
        select: { uploads: true, playlists: true },
      },
    },
  });

  if (!user) redirect("/login");
  const currentPlan = user.subscriptions[0]?.plan ?? "FREE";

  return (
    <div className="p-6 max-w-3xl">
      <h1 className="text-white text-3xl font-bold mb-8">Profil Saya</h1>

      <div className="bg-zinc-900 rounded-2xl p-8 border border-zinc-800 mb-6">
        <div className="flex items-center gap-6 mb-8">
          {user.image ? (
            <img
              src={user.image}
              alt="avatar"
              className="w-20 h-20 rounded-full object-cover"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center text-black text-3xl font-black">
              {user.name?.[0]?.toUpperCase() ?? "U"}
            </div>
          )}
          <div>
            <h2 className="text-white text-2xl font-bold">{user.name}</h2>
            <p className="text-zinc-400">{user.email}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className={`text-xs px-3 py-1 rounded-full font-bold ${
                user.role === "CREATOR"
                  ? "bg-green-500/20 text-green-400"
                  : user.role === "ADMIN"
                  ? "bg-red-500/20 text-red-400"
                  : "bg-zinc-800 text-zinc-400"
              }`}>
                {user.role === "CREATOR" ? "✓ Creator"
                  : user.role === "ADMIN" ? "⚡ Admin"
                  : "Pendengar"}
              </span>
              <span className="text-xs px-3 py-1 rounded-full bg-zinc-800 text-zinc-400">
                {currentPlan}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 pt-6 border-t border-zinc-800">
          {[
            { label: "Upload", value: user._count.uploads },
            { label: "Playlist", value: user._count.playlists },
            { label: "Bergabung", value: new Date(user.createdAt).getFullYear() },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-white text-2xl font-bold">{s.value}</p>
              <p className="text-zinc-500 text-sm">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {[
          { label: "Upgrade Plan", href: "/subscription", icon: "⭐", desc: "Nikmati fitur premium" },
          { label: "Royalti Saya", href: "/creator/royalties", icon: "💰", desc: "Cek pendapatan" },
        ].map((link) => (
          <a
            key={link.label}
            href={link.href}
            className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 hover:border-zinc-700 transition-all"
          >
            <div className="text-3xl mb-3">{link.icon}</div>
            <p className="text-white font-semibold">{link.label}</p>
            <p className="text-zinc-500 text-sm">{link.desc}</p>
          </a>
        ))}
      </div>
    </div>
  );
}