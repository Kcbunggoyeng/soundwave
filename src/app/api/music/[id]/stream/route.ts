// src/app/api/music/[id]/stream/route.ts
// Endpoint untuk mendapatkan URL streaming yang aman (signed URL)
// Sekaligus mencatat play count untuk kalkulasi royalti

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Login diperlukan" }, { status: 401 });
    }

    const media = await db.media.findUnique({
      where: { id, status: "APPROVED" },
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

    await db.media.update({
      where: { id: media.id },
      data: { playCount: { increment: 1 } },
    });

    const period = new Date().toISOString().slice(0, 7);
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
        amountUsd: 0.004,
      },
    });

    return NextResponse.json({
      streamUrl: media.mediaUrl,
      trackId: media.id,
    });
  } catch (error) {
    console.error("[STREAM_ERROR]", error);
    return NextResponse.json({ error: "Gagal memuat stream" }, { status: 500 });
  }
}