import { NextRequest } from "next/server";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { offers } from "@/lib/db/schema";
import { apiSuccess, apiError, apiNotFound, safeValidateBody } from "@/lib/api/utils";

const updateOfferSchema = z.object({
  status: z.enum(["accepted", "declined", "withdrawn"]),
  declineReason: z.string().max(500).optional(),
});

// ---------- PATCH /api/offers/[id] ----------

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const offerId = parseInt(id, 10);
    if (isNaN(offerId)) return apiError("Invalid offer ID");

    const { data, error } = await safeValidateBody(request, updateOfferSchema);
    if (error) return apiError(error);

    // Fetch the existing offer
    const [existing] = await db
      .select()
      .from(offers)
      .where(eq(offers.id, offerId))
      .limit(1);

    if (!existing) return apiNotFound("Offer");

    if (existing.status !== "pending") {
      return apiError(`Cannot update an offer with status '${existing.status}'`);
    }

    const now = new Date();
    const updateFields: Record<string, unknown> = { status: data.status };

    switch (data.status) {
      case "accepted":
        updateFields.acceptedAt = now;
        break;
      case "declined":
        updateFields.declinedAt = now;
        updateFields.declineReason = data.declineReason || null;
        break;
      case "withdrawn":
        updateFields.declinedAt = now;
        updateFields.declineReason = data.declineReason || "Withdrawn by provider";
        break;
    }

    const [updated] = await db
      .update(offers)
      .set(updateFields)
      .where(eq(offers.id, offerId))
      .returning();

    return apiSuccess(updated);
  } catch (err) {
    console.error("PATCH /api/offers/[id] error:", err);
    return apiError("Failed to update offer", 500);
  }
}
