/**
 * Fee calculation utilities for Local Tow
 * 10% platform fee capped at $5.00. All amounts in cents.
 */

export interface FeeBreakdown {
  totalPrice: number;
  platformFee: number;
  providerPayout: number;
  feePercentage: number;
}

export const PLATFORM_FEE_PERCENTAGE = 0.10;
export const PLATFORM_FEE_CAP_CENTS = 500;
export const MIN_PRICE_CENTS = 2000;
export const MAX_PRICE_CENTS = 50000;

export function calculateFees(priceInCents: number): FeeBreakdown {
  const rawFee = Math.round(priceInCents * PLATFORM_FEE_PERCENTAGE);
  const platformFee = Math.min(rawFee, PLATFORM_FEE_CAP_CENTS);
  const providerPayout = priceInCents - platformFee;
  const feePercentage = Math.round((platformFee / priceInCents) * 1000) / 10;

  return { totalPrice: priceInCents, platformFee, providerPayout, feePercentage };
}

export function formatCents(cents: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(cents / 100);
}

export function dollarsToCents(dollars: number | string): number {
  const amount = typeof dollars === "string" ? parseFloat(dollars) : dollars;
  return Math.round(amount * 100);
}

export function centsToDollars(cents: number): number {
  return cents / 100;
}

export function validatePrice(priceInCents: number): string | null {
  if (priceInCents < MIN_PRICE_CENTS) return `Minimum price is ${formatCents(MIN_PRICE_CENTS)}`;
  if (priceInCents > MAX_PRICE_CENTS) return `Maximum price is ${formatCents(MAX_PRICE_CENTS)}`;
  return null;
}

export function getFeeExplanation(priceInCents: number): string {
  const { platformFee, feePercentage } = calculateFees(priceInCents);
  if (platformFee >= PLATFORM_FEE_CAP_CENTS) return `${formatCents(PLATFORM_FEE_CAP_CENTS)} service fee (capped)`;
  return `${feePercentage}% service fee (${formatCents(platformFee)})`;
}

export function getPriceGuidance(distanceMiles: number) {
  if (distanceMiles < 2) return { tier: "short" as const, min: 3000, suggested: 4000, max: 5000 };
  if (distanceMiles < 5) return { tier: "medium" as const, min: 4000, suggested: 5500, max: 7500 };
  if (distanceMiles < 10) return { tier: "long" as const, min: 5000, suggested: 7000, max: 10000 };
  return { tier: "extended" as const, min: 7500, suggested: 10000, max: 20000 };
}
