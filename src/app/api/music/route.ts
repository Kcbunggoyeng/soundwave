// src/app/api/music/route.ts
// GET: ambil daftar musik (public, dengan filter)
// POST: tambah musik baru (khusus creator/admin)

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

// ─── GET: Ambil musik ────────────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const genre = searchParams.get("genre");
    const search = searchParams.get("q");
    const page = parseInt(searchParams.get("page") ?? "1");
    const limit = Math.min(parseInt(searchParams.get("limit") ?? "20"), 50);
    const skip = (page - 1) * limit;

    const where: any = {
      type: "MUSIC",
      status: "APPROVED",
    };

    if (genre) where.genre = genre;
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { uploadedBy: { name: { contains: search, mode: "insensitive" } } },
      ];
    }

    const [music, total] = await Promise.all([
      db.media.findMany({
        where,
        skip,
        take: limit,
        orderBy: { playCount: "desc" },
        select: {
          id: true,
          title: true,
          description: true,
          thumbnailUrl: true,
          duration: true,
          genre: true,
          category: true,
          playCount: true,
          createdAt: true,
          uploadedBy: {
            select: { id: true, name: true, image: true },
          },
          // mediaUrl TIDAK disertakan di list publik — hanya saat play
        },
      }),
      db.media.count({ where }),
    ]);

    return NextResponse.json({
      music,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("[GET_MUSIC_ERROR]", error);
    return NextResponse.json({ error: "Gagal memuat musik" }, { status: 500 });
  }
}

// ─── POST: Upload musik baru ─────────────────────────────────────────────────
const uploadSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(2000).optional(),
  type: z.enum(["MUSIC", "VIDEO"]),
  mediaUrl: z.string().url(),
  thumbnailUrl: z.string().url().optional(),
  duration: z.number().positive().optional(),
  genre: z.string().max(50).optional(),
  category: z.string().max(50).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    if (!user || !["CREATOR", "ADMIN"].includes(user.role)) {
      return NextResponse.json(
        { error: "Hanya Creator atau Admin yang bisa upload" },
        { status: 403 }
      );
    }

    // Cek subscription creator aktif
    const sub = await db.subscription.findFirst({
      where: {
        userId: session.user.id,
        plan: "CREATOR",
        status: "ACTIVE",
        currentPeriodEnd: { gt: new Date() },
      },
    });

    if (!sub && user.role !== "ADMIN") {
      return NextResponse.json(
        {
          error: "Subscription Creator diperlukan untuk upload.",
          code: "SUBSCRIPTION_REQUIRED",
        },
        { status: 403 }
      );
    }

    const body = await req.json();
    const result = uploadSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Data tidak valid", details: result.error.flatten() },
        { status: 400 }
      );
    }

    const media = await db.media.create({
      data: {
        ...result.data,
        uploadedById: session.user.id,
        status: "PENDING", // admin review dulu
      },
    });

    return NextResponse.json({ media }, { status: 201 });
  } catch (error) {
    console.error("[POST_MUSIC_ERROR]", error);
    return NextResponse.json({ error: "Gagal upload musik" }, { status: 500 });
  }
}
