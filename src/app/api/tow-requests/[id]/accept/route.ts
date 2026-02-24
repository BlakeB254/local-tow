import { NextRequest } from "next/server";
import { z } from "zod";
import { eq, and } from "drizzle-orm";
import { db } from "@/lib/db";
import { towRequests, offers, jobs } from "@/lib/db/schema";
import { calculateFees } from "@/lib/fees";
import {
  apiSuccess,
  apiError,
  apiNotFound,
  safeValidateBody,
  generateJobNumber,
} from "@/lib/api/utils";

const acceptOfferSchema = z.object({
  offerId: z.number().int().positive("Valid offer ID is required"),
});

// ---------- POST /api/tow-requests/[id]/accept ----------

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const requestId = parseInt(id, 10);
    if (isNaN(requestId)) return apiError("Invalid request ID");

    const { data, error } = await safeValidateBody(request, acceptOfferSchema);
    if (error) return apiError(error);

    // Fetch the tow request
    const [towRequest] = await db
      .select()
      .from(towRequests)
      .where(eq(towRequests.id, requestId))
      .limit(1);

    if (!towRequest) return apiNotFound("Tow request");

    if (towRequest.status !== "open" && towRequest.status !== "pending") {
      return apiError(`Cannot accept offer on a request with status '${towRequest.status}'`);
    }

    // Fetch and validate the offer
    const [offer] = await db
      .select()
      .from(offers)
      .where(
        and(
          eq(offers.id, data.offerId),
          eq(offers.towRequestId, requestId)
        )
      )
      .limit(1);

    if (!offer) return apiNotFound("Offer");

    if (offer.status !== "pending") {
      return apiError(`Cannot accept an offer with status '${offer.status}'`);
    }

    if (new Date() > offer.expiresAt) {
      return apiError("This offer has expired");
    }

    // Calculate fees based on the offer price
    const { totalPrice, platformFee, providerPayout } = calculateFees(offer.offerPrice);
    const now = new Date();

    // Accept the offer
    await db
      .update(offers)
      .set({ status: "accepted", acceptedAt: now })
      .where(eq(offers.id, data.offerId));

    // Decline all other pending offers for this request
    await db
      .update(offers)
      .set({ status: "declined", declineReason: "Another offer was accepted", declinedAt: now })
      .where(
        and(
          eq(offers.towRequestId, requestId),
          eq(offers.status, "pending")
        )
      );

    // Create the job
    const jobNumber = generateJobNumber();
    const [job] = await db
      .insert(jobs)
      .values({
        jobNumber,
        towRequestId: requestId,
        offerId: data.offerId,
        providerId: offer.providerId,
        customerEmail: towRequest.customerEmail,
        status: "accepted",
        agreedPrice: totalPrice,
        platformFee,
        providerPayout,
        acceptedAt: now,
      })
      .returning();

    // Update the tow request
    await db
      .update(towRequests)
      .set({
        status: "accepted",
        acceptedOfferId: data.offerId,
        jobId: job.id,
        agreedPrice: totalPrice,
        platformFee,
        providerPayout,
        acceptedAt: now,
        updatedAt: now,
      })
      .where(eq(towRequests.id, requestId));

    return apiSuccess({ towRequestId: requestId, job, feeBreakdown: { totalPrice, platformFee, providerPayout } }, 201);
  } catch (err) {
    console.error("POST /api/tow-requests/[id]/accept error:", err);
    return apiError("Failed to accept offer", 500);
  }
}
