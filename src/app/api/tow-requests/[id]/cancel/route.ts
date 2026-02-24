import { NextRequest } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { towRequests, offers } from "@/lib/db/schema";
import { apiSuccess, apiError, apiNotFound } from "@/lib/api/utils";

// ---------- POST /api/tow-requests/[id]/cancel ----------

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const requestId = parseInt(id, 10);
    if (isNaN(requestId)) return apiError("Invalid request ID");

    const [existing] = await db
      .select()
      .from(towRequests)
      .where(eq(towRequests.id, requestId))
      .limit(1);

    if (!existing) return apiNotFound("Tow request");

    if (existing.status === "cancelled") {
      return apiError("Request is already cancelled");
    }
    if (existing.status === "completed") {
      return apiError("Cannot cancel a completed request");
    }
    if (existing.status === "job_created") {
      return apiError("Cannot cancel request with an active job. Cancel the job instead.");
    }

    // Cancel the tow request
    const [updated] = await db
      .update(towRequests)
      .set({ status: "cancelled", updatedAt: new Date() })
      .where(eq(towRequests.id, requestId))
      .returning();

    // Expire all pending offers for this request
    await db
      .update(offers)
      .set({ status: "expired" })
      .where(eq(offers.towRequestId, requestId));

    return apiSuccess(updated);
  } catch (err) {
    console.error("POST /api/tow-requests/[id]/cancel error:", err);
    return apiError("Failed to cancel tow request", 500);
  }
}
