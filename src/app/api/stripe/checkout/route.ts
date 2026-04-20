import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await auth();
  const { priceType } = await req.json();

  // Determine price ID
  const priceId =
    priceType === "monthly"
      ? process.env.STRIPE_PRICE_MONTHLY
      : process.env.STRIPE_PRICE_LIFETIME;

  if (!priceId) {
    return NextResponse.json(
      { error: "Price not configured" },
      { status: 500 }
    );
  }

  const mode = priceType === "monthly" ? "subscription" : "payment";

  // Build checkout session
  const checkoutParams: Stripe.Checkout.SessionCreateParams = {
    mode,
    payment_method_types: ["card"],
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${process.env.NEXTAUTH_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXTAUTH_URL}/buy`,
    metadata: {
      userId: session?.user?.id || "",
      priceType,
    },
  };

  // If user is logged in, pre-fill email and link to customer
  if (session?.user?.email) {
    checkoutParams.customer_email = session.user.email;
  }

  // If user already has a Stripe customer ID, use it
  if (session?.user?.id) {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { stripeCustomerId: true },
    });
    if (user?.stripeCustomerId) {
      delete checkoutParams.customer_email;
      checkoutParams.customer = user.stripeCustomerId;
    }
  }

  const checkoutSession = await stripe.checkout.sessions.create(checkoutParams);

  return NextResponse.json({ url: checkoutSession.url });
}
