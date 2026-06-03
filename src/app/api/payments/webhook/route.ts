// src/app/api/payments/webhook/route.ts
// Stripe Webhook — update database otomatis saat pembayaran berhasil/gagal
// Tambahkan di Stripe Dashboard: endpoint = https://domain.com/api/payments/webhook

import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";
import type Stripe from "stripe";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("[WEBHOOK_SIGNATURE_ERROR]", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;
        if (!userId || !session.subscription) break;

        const sub = await stripe.subscriptions.retrieve(
          session.subscription as string
        );
        const priceId = sub.items.data[0]?.price.id;

        let plan: "PREMIUM" | "CREATOR" = "PREMIUM";
        if (priceId === process.env.STRIPE_CREATOR_PRICE_ID) {
          plan = "CREATOR";
          await db.user.update({
            where: { id: userId },
            data: { role: "CREATOR" },
          });
        }

        await db.subscription.upsert({
          where: { stripeSubId: sub.id },
          update: {
            status: "ACTIVE",
            plan,
            currentPeriodEnd: new Date(sub.current_period_end * 1000),
          },
          create: {
            userId,
            stripeSubId: sub.id,
            plan,
            status: "ACTIVE",
            currentPeriodEnd: new Date(sub.current_period_end * 1000),
          },
        });

        await db.payment.create({
          data: {
            userId,
            stripePaymentId: session.payment_intent as string,
            amount: session.amount_total ?? 0,
            currency: session.currency ?? "usd",
            status: "SUCCEEDED",
            description: `Subscription ${plan}`,
          },
        });
        break;
      }

      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        await db.subscription.updateMany({
          where: { stripeSubId: sub.id },
          data: { status: "CANCELED" },
        });
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        if (invoice.subscription) {
          await db.subscription.updateMany({
            where: { stripeSubId: invoice.subscription as string },
            data: { status: "PAST_DUE" },
          });
        }
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("[WEBHOOK_HANDLER_ERROR]", error);
    return NextResponse.json({ error: "Webhook handler error" }, { status: 500 });
  }
}