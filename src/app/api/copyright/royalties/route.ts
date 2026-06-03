import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { calculateRoyalty } from "@/lib/stripe";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const year = searchParams.get("year") ?? new Date().getFullYear().toString();

    const royalties = await db.royalty.findMany({
      where: {
        artistId: session.user.id,
        period: { startsWith: year },
      },
      include: {
        media: {
          select: { id: true, title: true, thumbnailUrl: true },
        },
      },
      orderBy: { period: "desc" },
    });

    const royaltiesWithCalc = royalties.map((r: any) => ({
      ...r,
      calculatedAmount: calculateRoyalty(r.streams),
    }));

    const summary = {
      totalStreams: royalties.reduce((sum: any, r: any) => sum + r.streams, 0),
      totalEarned: royalties.reduce((sum: any, r: any) => sum + calculateRoyalty(r.streams), 0),
      totalPaid: royalties
        .filter((r: any) => r.paid)
        .reduce((sum: any, r: any) => sum + calculateRoyalty(r.streams), 0),
      totalPending: royalties
        .filter((r: any) => !r.paid)
        .reduce((sum: any, r: any) => sum + calculateRoyalty(r.streams), 0),
    };

    return NextResponse.json({
      royalties: royaltiesWithCalc,
      summary,
      ratePerStream: 0.004,
      currency: "USD",
    });
  } catch (error) {
    console.error("[ROYALTIES_ERROR]", error);
    return NextResponse.json(
      { error: "Gagal memuat data royalti" },
      { status: 500 }
    );
  }
}