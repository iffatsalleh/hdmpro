import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe/stripe";
import { subscriptionService } from "@/services/subscription.service";

export async function POST(req: Request) {
  const body = await req.text();
  const headerList = await headers();
  const signature = headerList.get("stripe-signature");

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    if (!signature || !webhookSecret) {
      // In development or when webhook secret is not set, log and return safe response
      return NextResponse.json({ received: true, note: "Webhook secret missing" });
    }

    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error("Stripe Webhook Signature Verification Error:", err.message);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  try {
    await subscriptionService.handleWebhookEvent(event);
    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error("Stripe Webhook Handler Error:", err.message);
    return NextResponse.json({ error: "Webhook handler failed." }, { status: 500 });
  }
}
