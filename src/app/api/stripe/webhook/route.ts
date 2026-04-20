import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      const email = session.customer_email || session.customer_details?.email;
      const userId = session.metadata?.userId;
      const customerId =
        typeof session.customer === "string" ? session.customer : null;

      if (!email && !userId) break;

      // Find user by ID first, then by email
      const where = userId
        ? { id: userId }
        : email
          ? { email }
          : null;

      if (!where) break;

      const updateData: Record<string, unknown> = {
        hasPaid: true,
        paidAt: new Date(),
      };

      if (customerId) {
        updateData.stripeCustomerId = customerId;
      }

      if (session.mode === "subscription" && session.subscription) {
        updateData.stripeSubId =
          typeof session.subscription === "string"
            ? session.subscription
            : null;
        updateData.subscriptionStatus = "active";
      }

      try {
        await prisma.user.update({ where, data: updateData });

        // Auto-enroll in all published courses
        const user = await prisma.user.findUnique({
          where,
          select: { id: true },
        });
        if (user) {
          const courses = await prisma.course.findMany({
            where: { published: true },
            select: { id: true },
          });
          for (const course of courses) {
            await prisma.enrollment.upsert({
              where: {
                userId_courseId: { userId: user.id, courseId: course.id },
              },
              update: {},
              create: { userId: user.id, courseId: course.id },
            });
          }
        }
      } catch (err) {
        console.error("Failed to update user after payment:", err);
      }
      break;
    }

    case "customer.subscription.updated":
    case "customer.subscription.deleted": {
      const subscription = event.data.object;
      const customerId =
        typeof subscription.customer === "string"
          ? subscription.customer
          : null;

      if (!customerId) break;

      const status = subscription.status;
      const isActive = status === "active" || status === "trialing";

      try {
        await prisma.user.update({
          where: { stripeCustomerId: customerId },
          data: {
            subscriptionStatus: status,
            hasPaid: isActive,
          },
        });
      } catch (err) {
        console.error("Failed to update subscription status:", err);
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}
