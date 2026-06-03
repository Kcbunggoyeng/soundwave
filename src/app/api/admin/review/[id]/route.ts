import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const admin = await db.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    if (admin?.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const { action, reason } = body;

    if (!["approve", "reject"].includes(action)) {
      return NextResponse.json({ error: "Action tidak valid" }, { status: 400 });
    }

    const media = await db.media.findUnique({
      where: { id: params.id },
      include: {
        uploadedBy: { select: { id: true, email: true, name: true } },
      },
    });

    if (!media) {
      return NextResponse.json({ error: "Konten tidak ditemukan" }, { status: 404 });
    }

    if (media.status !== "PENDING") {
      return NextResponse.json(
        { error: "Konten ini sudah diproses sebelumnya" },
        { status: 400 }
      );
    }

    const newStatus = action === "approve" ? "APPROVED" : "REJECTED";
    const updatedMedia = await db.media.update({
      where: { id: params.id },
      data: { status: newStatus },
    });

    console.log(`[ADMIN] ${action.toUpperCase()} - "${media.title}" by ${media.uploadedBy.email}`);

    return NextResponse.json({
      message: action === "approve"
        ? "Konten berhasil disetujui!"
        : "Konten berhasil ditolak.",
      media: updatedMedia,
    });
  } catch (error) {
    console.error("[ADMIN_REVIEW_ERROR]", error);
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}