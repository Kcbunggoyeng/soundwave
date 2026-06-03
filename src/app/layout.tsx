// src/app/layout.tsx — Root layout

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SoundWave — Royalti Jujur untuk Artist Independen",
  description: "Platform streaming musik bukan buat korporasi. Upload, dengar, dan bayaran transparan langsung ke artist.",
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="dark">
      <body className={`${inter.className} bg-ink text-chalk antialiased`}>
        {children}
      </body>
    </html>
  );
}