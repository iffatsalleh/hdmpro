"use server";

import { stripe } from "@/lib/stripe/stripe";
import { auth } from "@/lib/auth/auth";

export async function createCheckoutSessionAction(priceType: "monthly" | "annual") {
  try {
    const session = await auth();
    const userId = session?.user?.id || "demo-member-id";
    const userEmail = session?.user?.email || "member@hdmpro.app";

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const unitAmount = priceType === "annual" ? 39900 : 4900; // in cents (e.g. MYR 399 or MYR 49)

    const stripeSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
      customer_email: userEmail,
      client_reference_id: userId,
      metadata: {
        userId,
        priceType,
      },
      line_items: [
        {
          price_data: {
            currency: "myr",
            product_data: {
              name: priceType === "annual" ? "HDMPro Membership (Tahunan)" : "HDMPro Membership (Bulanan)",
              description: "Akses tanpa had ke AI Coach, RAG Knowledge HDM, Modul & Penjejakan Progres",
            },
            unit_amount: unitAmount,
            recurring: {
              interval: priceType === "annual" ? "year" : "month",
            },
          },
          quantity: 1,
        },
      ],
      success_url: `${appUrl}/subscription?success=true`,
      cancel_url: `${appUrl}/subscription?canceled=true`,
    });

    return { success: true, url: stripeSession.url };
  } catch (error: any) {
    return {
      success: false,
      error: error?.message || "Ralat mencipta sesi pembayaran Stripe.",
    };
  }
}
