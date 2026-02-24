import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { jobs, providers, payouts } from "@/lib/db/schema";
import stripe from "@/lib/stripe/client";
import { transferToProvider } from "@/lib/stripe/connect";

// Stripe sends raw body, so we need to disable the default body parser
// Next.js App Router handles this automatically with request.text()

const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || "";

// ---------- POST /api/webhooks/stripe ----------

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get("stripe-signature");

    if (!signature) {
      return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 });
    }

    let event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, WEBHOOK_SECRET);
    } catch (err) {
      console.error("Stripe webhook signature verification failed:", err);
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    switch (event.type) {
      case "payment_intent.succeeded":
        await handlePaymentSucceeded(event.data.object);
        break;

      case "payment_intent.payment_failed":
        await handlePaymentFailed(event.data.object);
        break;

      case "account.updated":
        await handleAccountUpdated(event.data.object);
        break;

      default:
        // Unhandled event type - acknowledge receipt
        break;
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Stripe webhook error:", err);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}

// ---------- Event Handlers ----------

async function handlePaymentSucceeded(paymentIntent: { id: string; metadata: Record<string, string>; amount_received: number }) {
  const jobId = paymentIntent.metadata?.jobId;
  if (!jobId) {
    console.warn("payment_intent.succeeded without jobId metadata");
    return;
  }

  const numericJobId = parseInt(jobId, 10);

  // Update job payment status
  const [job] = await db
    .update(jobs)
    .set({
      paymentStatus: "captured",
      updatedAt: new Date(),
    })
    .where(eq(jobs.id, numericJobId))
    .returning();

  if (!job) {
    console.error(`Job ${jobId} not found for payment_intent.succeeded`);
    return;
  }

  // Find the provider to get their Stripe account
  const [provider] = await db
    .select()
    .from(providers)
    .where(eq(providers.id, job.providerId))
    .limit(1);

  if (!provider?.stripeAccountId) {
    console.error(`Provider ${job.providerId} has no Stripe account for transfer`);
    return;
  }

  try {
    // Transfer funds to provider
    const { transferId, amount, platformFee } = await transferToProvider(
      job.agreedPrice,
      provider.stripeAccountId,
      { jobId: String(job.id) }
    );

    // Update job payment status
    await db
      .update(jobs)
      .set({ paymentStatus: "transferred", updatedAt: new Date() })
      .where(eq(jobs.id, numericJobId));

    // Record the payout
    await db.insert(payouts).values({
      jobId: numericJobId,
      providerId: job.providerId,
      stripeTransferId: transferId,
      amount,
      platformFee,
      status: "completed",
      completedAt: new Date(),
    });
  } catch (err) {
    console.error(`Transfer failed for job ${jobId}:`, err);

    // Record the failed payout
    await db.insert(payouts).values({
      jobId: numericJobId,
      providerId: job.providerId,
      amount: job.providerPayout,
      platformFee: job.platformFee,
      status: "failed",
    });
  }
}

async function handlePaymentFailed(paymentIntent: { id: string; metadata: Record<string, string> }) {
  const jobId = paymentIntent.metadata?.jobId;
  if (!jobId) return;

  await db
    .update(jobs)
    .set({
      paymentStatus: "failed",
      updatedAt: new Date(),
    })
    .where(eq(jobs.id, parseInt(jobId, 10)));
}

async function handleAccountUpdated(account: { id: string; charges_enabled?: boolean; payouts_enabled?: boolean; details_submitted?: boolean }) {
  const stripeAccountId = account.id;

  // Determine onboarding status
  let onboardingStatus = "in_progress";
  if (account.charges_enabled && account.payouts_enabled && account.details_submitted) {
    onboardingStatus = "completed";
  } else if (account.details_submitted && (!account.charges_enabled || !account.payouts_enabled)) {
    onboardingStatus = "restricted";
  }

  await db
    .update(providers)
    .set({
      stripeOnboardingStatus: onboardingStatus,
      instantPayoutsEnabled: account.payouts_enabled || false,
      updatedAt: new Date(),
    })
    .where(eq(providers.stripeAccountId, stripeAccountId));
}
