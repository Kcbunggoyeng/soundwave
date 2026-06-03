import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/db";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const body = await request.json();
    const { status, rejectionReason } = body;

    const application = await prisma.creatorApplication.update({
      where: { id },
      data: {
        status,
        ...(rejectionReason && { rejectionReason }),
      },
    });

    return NextResponse.json({
      message: "Application updated",
      application,
    });
  } catch (error) {
    console.error("Failed to update application:", error);
    return NextResponse.json(
      { error: "Failed to update application" },
      { status: 500 }
    );
  }
}