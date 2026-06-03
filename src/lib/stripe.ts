import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "sk_test_placeholder", {
  apiVersion: "2024-06-20",
});

export const PLANS = {
  FREE: {
    name: "Free",
    price: 0,
    priceId: null,
    features: [
      "Stream musik dengan iklan",
      "Kualitas audio standar",
      "Playlist terbatas (3)",
    ],
  },
  PREMIUM: {
    name: "Premium",
    price: 4990,
    priceId: process.env.STRIPE_PREMIUM_PRICE_ID ?? null,
    features: [
      "Stream tanpa iklan",
      "Kualitas audio Hi-Fi",
      "Playlist tak terbatas",
      "Download offline",
    ],
  },
  CREATOR: {
    name: "Creator",
    price: 9990,
    priceId: process.env.STRIPE_CREATOR_PRICE_ID ?? null,
    features: [
      "Semua fitur Premium",
      "Upload musik & video",
      "Dashboard royalti transparan",
      "Laporan pendapatan bulanan",
    ],
  },
} as const;

export async function createCheckoutSession({
  userId,
  userEmail,
  priceId,
  successUrl,
  cancelUrl,
}: {
  userId: string;
  userEmail: string;
  priceId: string;
  successUrl: string;
  cancelUrl: string;
}) {
  const customers = await stripe.customers.list({ email: userEmail, limit: 1 });
  let customerId = customers.data[0]?.id;

  if (!customerId) {
    const customer = await stripe.customers.create({
      email: userEmail,
      metadata: { userId },
    });
    customerId = customer.id;
  }

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: { userId },
  });

  return session;
}

export function calculateRoyalty(streams: number): number {
  return Math.round(streams * 0.004 * 100) / 100;
}