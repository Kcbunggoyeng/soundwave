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

    const app = await db.creatorApplication.findUnique({
      where: { id: params.id },
    });
    if (!app) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    if (app.status !== "PENDING") {
      return NextResponse.json(
        { error: "Application sudah diproses" },
        { status: 400 }
      );
    }

    const newStatus = action === "approve" ? "APPROVED" : "REJECTED";
    const updateData: any = { status: newStatus };
    if (action === "reject" && reason) {
      updateData.rejectionReason = reason;
    }

    const updated = await db.creatorApplication.update({
      where: { id: params.id },
      data: updateData,
    });

    if (action === "approve") {
      const existingUser = await db.user.findUnique({
        where: { email: app.email },
      });
      if (existingUser) {
        await db.user.update({
          where: { id: existingUser.id },
          data: { role: "CREATOR" },
        });
      }
    }

    return NextResponse.json({
      message: action === "approve" ? "Creator disetujui!" : "Creator ditolak.",
      application: updated,
    });
  } catch (error) {
    console.error("[ADMIN_CREATOR_REVIEW_ERROR]", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}