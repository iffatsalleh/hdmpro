import { prisma } from "@/lib/db/prisma";
import type Stripe from "stripe";
import { SubscriptionStatus } from "@prisma/client";

export class SubscriptionService {
  async getUserSubscription(userId: string) {
    return prisma.subscription.findUnique({
      where: { userId },
    });
  }

  async isUserEntitled(userId: string): Promise<boolean> {
    const sub = await this.getUserSubscription(userId);
    if (!sub) return false;
    return sub.status === "ACTIVE" || sub.status === "TRIALING";
  }

  async handleWebhookEvent(event: Stripe.Event) {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId || session.client_reference_id;
        const customerId = session.customer as string;
        const subscriptionId = session.subscription as string;

        if (userId) {
          await prisma.subscription.upsert({
            where: { userId },
            update: {
              stripeCustomerId: customerId,
              stripeSubscriptionId: subscriptionId,
              status: SubscriptionStatus.ACTIVE,
            },
            create: {
              userId,
              stripeCustomerId: customerId,
              stripeSubscriptionId: subscriptionId,
              status: SubscriptionStatus.ACTIVE,
            },
          });
        }
        break;
      }

      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        let status: SubscriptionStatus = SubscriptionStatus.INCOMPLETE;
        if (subscription.status === "active") status = SubscriptionStatus.ACTIVE;
        else if (subscription.status === "trialing") status = SubscriptionStatus.TRIALING;
        else if (subscription.status === "canceled") status = SubscriptionStatus.CANCELED;
        else if (subscription.status === "past_due") status = SubscriptionStatus.PAST_DUE;
        else if (subscription.status === "unpaid") status = SubscriptionStatus.UNPAID;

        const existing = await prisma.subscription.findUnique({
          where: { stripeCustomerId: customerId },
        });

        if (existing) {
          await prisma.subscription.update({
            where: { id: existing.id },
            data: {
              status,
              cancelAtPeriodEnd: subscription.cancel_at_period_end,
              currentPeriodStart: (subscription as any).current_period_start
                ? new Date((subscription as any).current_period_start * 1000)
                : undefined,
              currentPeriodEnd: (subscription as any).current_period_end
                ? new Date((subscription as any).current_period_end * 1000)
                : undefined,
            },
          });
        }
        break;
      }
    }
  }
}

export const subscriptionService = new SubscriptionService();
