// src/app/api/payments/checkout/route.ts
// Buat Stripe Checkout Session untuk upgrade subscription

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createCheckoutSession, PLANS } from "@/lib/stripe";
import { z } from "zod";

const schema = z.object({
  plan: z.enum(["PREMIUM", "CREATOR"]),
});

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id || !session.user.email) {
      return NextResponse.json({ error: "Login diperlukan" }, { status: 401 });
    }

    const body = await req.json();
    const result = schema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: "Plan tidak valid" }, { status: 400 });
    }

    const { plan } = result.data;
    const planData = PLANS[plan];

    if (!planData.priceId) {
      return NextResponse.json({ error: "Price ID tidak dikonfigurasi" }, { status: 500 });
    }

    const baseUrl = process.env.NEXTAUTH_URL!;
    const checkoutSession = await createCheckoutSession({
      userId: session.user.id,
      userEmail: session.user.email,
      priceId: planData.priceId,
      successUrl: `${baseUrl}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${baseUrl}/subscription`,
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error("[CHECKOUT_ERROR]", error);
    return NextResponse.json({ error: "Gagal membuat sesi pembayaran" }, { status: 500 });
  }
}
