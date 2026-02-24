import { NextRequest } from "next/server";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { providers } from "@/lib/db/schema";
import { createConnectAccount, createOnboardingLink } from "@/lib/stripe/connect";
import { apiSuccess, apiError, apiNotFound, safeValidateBody } from "@/lib/api/utils";

const stripeOnboardingSchema = z.object({
  providerId: z.number().int().positive("Valid provider ID is required"),
});

// ---------- POST /api/providers/stripe ----------
// Creates a Stripe Connect account for a provider and returns an onboarding link.

export async function POST(request: NextRequest) {
  try {
    const { data, error } = await safeValidateBody(request, stripeOnboardingSchema);
    if (error) return apiError(error);

    // Fetch the provider
    const [provider] = await db
      .select()
      .from(providers)
      .where(eq(providers.id, data.providerId))
      .limit(1);

    if (!provider) return apiNotFound("Provider");

    // If provider already has a Stripe account, just generate a new onboarding link
    if (provider.stripeAccountId) {
      const onboardingUrl = await createOnboardingLink(
        provider.stripeAccountId,
        String(provider.id)
      );
      return apiSuccess({
        stripeAccountId: provider.stripeAccountId,
        onboardingUrl,
        isExisting: true,
      });
    }

    // Create a new Stripe Connect account
    const stripeAccountId = await createConnectAccount(
      String(provider.id),
      provider.email
    );

    // Update provider with Stripe account ID
    await db
      .update(providers)
      .set({
        stripeAccountId,
        stripeOnboardingStatus: "in_progress",
        updatedAt: new Date(),
      })
      .where(eq(providers.id, data.providerId));

    // Generate onboarding link
    const onboardingUrl = await createOnboardingLink(
      stripeAccountId,
      String(provider.id)
    );

    return apiSuccess({
      stripeAccountId,
      onboardingUrl,
      isExisting: false,
    }, 201);
  } catch (err) {
    console.error("POST /api/providers/stripe error:", err);
    return apiError("Failed to create Stripe Connect account", 500);
  }
}
