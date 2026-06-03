"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { LogoWithText } from "@/components/brand";

const navItems = [
  {
    label: "Beranda",
    href: "/home",
    icon: (active: boolean) => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill={active ? "#f0f0f5" : "#8b8b9e"}>
        <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
      </svg>
    ),
  },
  {
    label: "Cari",
    href: "/search",
    icon: (active: boolean) => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill={active ? "#f0f0f5" : "#8b8b9e"}>
        <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
      </svg>
    ),
  },
  {
    label: "Musik",
    href: "/music",
    icon: (active: boolean) => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill={active ? "#f0f0f5" : "#8b8b9e"}>
        <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
      </svg>
    ),
  },
  {
    label: "Playlist",
    href: "/playlists",
    icon: (active: boolean) => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill={active ? "#f0f0f5" : "#8b8b9e"}>
        <path d="M15 6H3v2h12V6zm0 4H3v2h12v-2zM3 16h8v-2H3v2zM17 6v8.18c-.31-.11-.65-.18-1-.18-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3V8h3V6h-5z"/>
      </svg>
    ),
  },
  {
    label: "Favorit",
    href: "/favorites",
    icon: (active: boolean) => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill={active ? "#f0f0f5" : "#8b8b9e"}>
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
    <aside className="w-60 bg-surface border-r border-surface-hi/40 flex flex-col h-full fixed left-0 top-0 bottom-24 z-40">
      <div className="p-5 border-b border-surface-hi/40">
        <Link href="/home">
          <LogoWithText />
        </Link>
      </div>

      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all text-sm font-medium ${
                active
                  ? "bg-surface-hi/60 text-chalk"
                  : "text-mist hover:bg-surface-hi/40 hover:text-chalk"
              }`}
            >
              {item.icon(active)}
              <span>{item.label}</span>
            </Link>
          );
        })}

        {isCreator && (
          <>
            <div className="my-3 border-t border-surface-hi/40" />
            <p className="text-mist/50 text-[10px] font-bold uppercase tracking-wider px-3 mb-1">
              Studio
            </p>
            <Link
              href="/creator"
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all text-sm font-medium ${
                pathname === "/creator"
                  ? "bg-surface-hi/60 text-chalk"
                  : "text-mist hover:bg-surface-hi/40 hover:text-chalk"
              }`}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill={pathname === "/creator" ? "#f0f0f5" : "#8b8b9e"}>
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14l-5-5 1.41-1.41L12 14.17l7.59-7.59L21 8l-9 9z"/>
              </svg>
              <span>Dashboard Creator</span>
            </Link>
            <Link
              href="/creator/royalties"
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all text-sm font-medium ${
                pathname === "/creator/royalties"
                  ? "bg-surface-hi/60 text-chalk"
                  : "text-mist hover:bg-surface-hi/40 hover:text-chalk"
              }`}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill={pathname === "/creator/royalties" ? "#f0f0f5" : "#8b8b9e"}>
                <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/>
              </svg>
              <span>Royalti</span>
            </Link>
          </>
        )}

        <div className="my-3 border-t border-surface-hi/40" />
        <Link
          href="/subscription"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-mist hover:bg-surface-hi/40 hover:text-chalk transition-all"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#8b8b9e">
            <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/>
          </svg>
          <span>Upgrade</span>
        </Link>
      </nav>

      {session?.user && (
        <div className="p-4 border-t border-surface-hi/40">
          <div className="flex items-center gap-3 mb-3">
            {session.user.image ? (
              <img src={session.user.image} alt="avatar" className="w-8 h-8 rounded-lg" />
            ) : (
              <div className="w-8 h-8 rounded-lg bg-coral/20 flex items-center justify-center text-coral text-xs font-bold">
                {session.user.name?.[0]?.toUpperCase() ?? "U"}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="text-chalk text-sm font-medium truncate">{session.user.name}</p>
              <p className="text-mist text-xs truncate">{session.user.email}</p>
            </div>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="w-full text-left text-mist hover:text-chalk text-xs py-1 transition-colors"
          >
            Keluar
          </button>
        </div>
      )}
    </aside>
  );
}