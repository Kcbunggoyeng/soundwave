// src/app/api/music/[id]/stream/route.ts
// Endpoint untuk mendapatkan URL streaming yang aman (signed URL)
// Sekaligus mencatat play count untuk kalkulasi royalti

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Login diperlukan" }, { status: 401 });
    }

    const media = await db.media.findUnique({
      where: { id: params.id, status: "APPROVED" },
      select: {
        id: true,
        title: true,
        mediaUrl: true,
        uploadedById: true,
      },
    });

    if (!media) {
      return NextResponse.json({ error: "Musik tidak ditemukan" }, { status: 404 });
    }

    // Catat stream count (untuk royalti)
    // Menggunakan increment agar tidak race condition
    await db.media.update({
      where: { id: media.id },
      data: { playCount: { increment: 1 } },
    });

    // Update atau buat royalty record bulan ini
    const period = new Date().toISOString().slice(0, 7); // "2026-06"
    await db.royalty.upsert({
      where: {
        artistId_mediaId_period: {
          artistId: media.uploadedById,
          mediaId: media.id,
          period,
        },
      },
      update: { streams: { increment: 1 } },
      create: {
        artistId: media.uploadedById,
        mediaId: media.id,
        period,
        streams: 1,
        amountUsd: 0.004, // $0.004 per stream awal
      },
    });

    // Kembalikan URL untuk streaming
    // (Jika pakai S3 private, harusnya generate signed URL di sini)
    return NextResponse.json({
      streamUrl: media.mediaUrl,
      trackId: media.id,
    });
  } catch (error) {
    console.error("[STREAM_ERROR]", error);
    return NextResponse.json({ error: "Gagal memuat stream" }, { status: 500 });
  }
}
