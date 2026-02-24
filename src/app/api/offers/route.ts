import { NextRequest } from "next/server";
import { z } from "zod";
import { eq, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { offers, towRequests, providers } from "@/lib/db/schema";
import { validatePrice } from "@/lib/fees";
import {
  apiSuccess,
  apiError,
  apiNotFound,
  safeValidateBody,
  generateOfferNumber,
} from "@/lib/api/utils";

const createOfferSchema = z.object({
  towRequestId: z.number().int().positive("Valid tow request ID is required"),
  providerId: z.number().int().positive("Valid provider ID is required"),
  offerType: z.enum(["accept", "counter"]),
  offerPrice: z.number().int().positive("Offer price must be positive"),
  estimatedArrival: z.number().int().min(1, "Estimated arrival must be at least 1 minute"),
  message: z.string().max(500).optional(),
  providerLng: z.number().optional(),
  providerLat: z.number().optional(),
  distanceToPickup: z.number().positive().optional(),
});

// ---------- POST /api/offers ----------

export async function POST(request: NextRequest) {
  try {
    const { data, error } = await safeValidateBody(request, createOfferSchema);
    if (error) return apiError(error);

    // Validate price
    const priceError = validatePrice(data.offerPrice);
    if (priceError) return apiError(priceError);

    // Verify the tow request exists and is open
    const [towRequest] = await db
      .select()
      .from(towRequests)
      .where(eq(towRequests.id, data.towRequestId))
      .limit(1);

    if (!towRequest) return apiNotFound("Tow request");

    if (towRequest.status !== "open" && towRequest.status !== "pending") {
      return apiError(`Cannot submit offer for a request with status '${towRequest.status}'`);
    }

    if (new Date() > towRequest.expiresAt) {
      return apiError("This tow request has expired");
    }

    // Verify the provider exists and is approved
    const [provider] = await db
      .select()
      .from(providers)
      .where(eq(providers.id, data.providerId))
      .limit(1);

    if (!provider) return apiNotFound("Provider");

    if (provider.verificationStatus !== "approved") {
      return apiError("Provider must be verified to submit offers");
    }

    const offerNumber = generateOfferNumber();
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes

    const [created] = await db
      .insert(offers)
      .values({
        offerNumber,
        towRequestId: data.towRequestId,
        providerId: data.providerId,
        offerType: data.offerType,
        offerPrice: data.offerPrice,
        estimatedArrival: data.estimatedArrival,
        message: data.message,
        providerLng: data.providerLng,
        providerLat: data.providerLat,
        distanceToPickup: data.distanceToPickup,
        expiresAt,
      })
      .returning();

    // Update the tow request offer count and set status to pending if first offer
    await db
      .update(towRequests)
      .set({
        offerCount: sql`${towRequests.offerCount} + 1`,
        status: towRequest.offerCount === 0 ? "pending" : towRequest.status,
        updatedAt: new Date(),
      })
      .where(eq(towRequests.id, data.towRequestId));

    return apiSuccess(created, 201);
  } catch (err) {
    console.error("POST /api/offers error:", err);
    return apiError("Failed to create offer", 500);
  }
}
