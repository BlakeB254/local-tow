/**
 * Stripe Connect utilities for provider payouts
 * Uses Express accounts for simplified onboarding.
 */

import stripe from "./client";
import { calculateFees } from "../fees";

const APP_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export async function createConnectAccount(providerId: string, email: string): Promise<string> {
  const account = await stripe.accounts.create({
    type: "express",
    country: "US",
    email,
    capabilities: { card_payments: { requested: true }, transfers: { requested: true } },
    business_type: "individual",
    metadata: { providerId },
  });
  return account.id;
}

export async function createOnboardingLink(accountId: string, providerId: string): Promise<string> {
  const link = await stripe.accountLinks.create({
    account: accountId,
    refresh_url: `${APP_URL}/provider/onboarding?refresh=true`,
    return_url: `${APP_URL}/provider/onboarding/complete?provider=${providerId}`,
    type: "account_onboarding",
  });
  return link.url;
}

export async function createDashboardLink(accountId: string): Promise<string> {
  const link = await stripe.accounts.createLoginLink(accountId);
  return link.url;
}

export async function getAccountStatus(accountId: string) {
  const account = await stripe.accounts.retrieve(accountId);
  return {
    chargesEnabled: account.charges_enabled || false,
    payoutsEnabled: account.payouts_enabled || false,
    detailsSubmitted: account.details_submitted || false,
  };
}

export async function createPaymentIntent(
  priceInCents: number,
  metadata: { towRequestId: string; offerId: string; providerId: string }
) {
  const intent = await stripe.paymentIntents.create({
    amount: priceInCents,
    currency: "usd",
    capture_method: "manual",
    metadata,
    automatic_payment_methods: { enabled: true },
  });
  return { paymentIntentId: intent.id, clientSecret: intent.client_secret! };
}

export async function capturePayment(paymentIntentId: string) {
  const intent = await stripe.paymentIntents.capture(paymentIntentId);
  return { captured: intent.status === "succeeded", amountCaptured: intent.amount_received };
}

export async function cancelPayment(paymentIntentId: string) {
  await stripe.paymentIntents.cancel(paymentIntentId);
}

export async function transferToProvider(
  priceInCents: number,
  destinationAccountId: string,
  metadata: { jobId: string }
) {
  const { providerPayout, platformFee } = calculateFees(priceInCents);
  const transfer = await stripe.transfers.create({
    amount: providerPayout,
    currency: "usd",
    destination: destinationAccountId,
    metadata,
    description: `Payout for job ${metadata.jobId}`,
  });
  return { transferId: transfer.id, amount: providerPayout, platformFee };
}
