import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      artistName, realName, email, phone, genre, bio,
      instagram, youtube, sampleWork, reason,
    } = body;

    if (!artistName || !realName || !email || !phone || !genre || !bio || !sampleWork || !reason) {
      return NextResponse.json(
        { error: "Semua field wajib kecuali Instagram dan YouTube" },
        { status: 400 }
      );
    }

    const existing = await db.creatorApplication.findFirst({
      where: { email, status: "PENDING" },
    });
    if (existing) {
      return NextResponse.json(
        { error: "Email ini sudah mengajukan pendaftaran creator yang masih dalam review." },
        { status: 409 }
      );
    }

    const application = await db.creatorApplication.create({
      data: {
        artistName, realName, email, phone, genre, bio,
        instagram: instagram ?? null,
        youtube: youtube ?? null,
        sampleWork, reason,
      },
    });

    return NextResponse.json(
      { message: "Pendaftaran creator berhasil dikirim!", application },
      { status: 201 }
    );
  } catch (error) {
    console.error("[CREATOR_REGISTER_ERROR]", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server." },
      { status: 500 }
    );
  }
}

export async function GET(_req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });
    if (user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const applications = await db.creatorApplication.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ applications });
  } catch (error) {
    console.error("[CREATOR_LIST_ERROR]", error);
    return NextResponse.json({ error: "Gagal memuat data" }, { status: 500 });
  }
}