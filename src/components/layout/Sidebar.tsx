"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";

const navItems = [
  {
    label: "Beranda",
    href: "/home",
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? "white" : "#a1a1aa"}>
        <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
      </svg>
    ),
  },
  {
    label: "Cari",
    href: "/search",
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? "white" : "#a1a1aa"}>
        <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
      </svg>
    ),
  },
  {
    label: "Musik",
    href: "/music",
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? "white" : "#a1a1aa"}>
        <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
      </svg>
    ),
  },
  {
    label: "Playlist",
    href: "/playlists",
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? "white" : "#a1a1aa"}>
        <path d="M15 6H3v2h12V6zm0 4H3v2h12v-2zM3 16h8v-2H3v2zM17 6v8.18c-.31-.11-.65-.18-1-.18-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3V8h3V6h-5z"/>
      </svg>
    ),
  },
  {
    label: "Favorit",
    href: "/favorites",
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? "white" : "#a1a1aa"}>
        <path d="M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3z"/>
      </svg>
    ),
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const isCreator =
    (session?.user as any)?.role === "CREATOR" ||
    (session?.user as any)?.role === "ADMIN";

  return (
    <aside className="w-64 bg-zinc-950 border-r border-zinc-800 flex flex-col h-full fixed left-0 top-0 bottom-20 z-40">
      {/* Logo */}
      <div className="p-6 flex items-center gap-2 border-b border-zinc-800">
        <svg width="32" height="32" viewBox="0 0 40 40" fill="none">
          <circle cx="20" cy="20" r="20" fill="#1DB954" />
          <path
            d="M12 22c4-3 10-3 16 0M10 17c6-4 14-4 20 0M14 27c3-2 9-2 12 0"
            stroke="white" strokeWidth="2.5" strokeLinecap="round"
          />
        </svg>
        <span className="text-white text-xl font-bold tracking-tight">SoundWave</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 ${
                active
                  ? "bg-zinc-800 text-white"
                  : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
              }`}
            >
              {item.icon(active)}
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          );
        })}

        {/* Creator section */}
        {isCreator && (
          <>
            <hr className="border-zinc-800 my-3" />
            <p className="text-zinc-500 text-xs uppercase tracking-wider px-3 py-1">
              Creator
            </p>
            <Link
              href="/creator"
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 ${
                pathname === "/creator"
                  ? "bg-zinc-800 text-white"
                  : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
              }`}
            >
              <svg width="22" height="22" viewBox="0 0 24 24"
                fill={pathname === "/creator" ? "white" : "#a1a1aa"}>
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14l-5-5 1.41-1.41L12 14.17l7.59-7.59L21 8l-9 9z"/>
              </svg>
              <span className="text-sm font-medium">Dashboard Creator</span>
            </Link>
            <Link
              href="/creator/royalties"
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 ${
                pathname === "/creator/royalties"
                  ? "bg-zinc-800 text-white"
                  : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
              }`}
            >
              <svg width="22" height="22" viewBox="0 0 24 24"
                fill={pathname === "/creator/royalties" ? "white" : "#a1a1aa"}>
                <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/>
              </svg>
              <span className="text-sm font-medium">Royalti Hak Cipta</span>
            </Link>
          </>
        )}

        {/* Subscription */}
        <hr className="border-zinc-800 my-3" />
        <Link
          href="/subscription"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-zinc-400 hover:bg-zinc-900 hover:text-white transition-all"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="#a1a1aa">
            <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/>
          </svg>
          <span className="text-sm font-medium">Upgrade Premium</span>
        </Link>
      </nav>

      {/* User Profile */}
      {session?.user && (
        <div className="p-4 border-t border-zinc-800">
          <div className="flex items-center gap-3 mb-3">
            {session.user.image ? (
              <img
                src={session.user.image}
                alt="avatar"
                className="w-8 h-8 rounded-full"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-black text-sm font-bold">
                {session.user.name?.[0]?.toUpperCase() ?? "U"}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="text-white text-sm font-medium truncate">
                {session.user.name}
              </p>
              <p className="text-zinc-500 text-xs truncate">
                {session.user.email}
              </p>
            </div>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="w-full text-left text-zinc-400 hover:text-white text-xs py-1 transition-colors"
          >
            Keluar
          </button>
        </div>
      )}
    </aside>
  );
}