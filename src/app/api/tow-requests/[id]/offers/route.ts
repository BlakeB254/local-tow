import { NextRequest } from "next/server";
import { eq, desc } from "drizzle-orm";
import { db } from "@/lib/db";
import { offers, towRequests } from "@/lib/db/schema";
import { apiSuccess, apiError, apiNotFound } from "@/lib/api/utils";

// ---------- GET /api/tow-requests/[id]/offers ----------

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const requestId = parseInt(id, 10);
    if (isNaN(requestId)) return apiError("Invalid request ID");

    // Verify the request exists
    const [towRequest] = await db
      .select({ id: towRequests.id })
      .from(towRequests)
      .where(eq(towRequests.id, requestId))
      .limit(1);

    if (!towRequest) return apiNotFound("Tow request");

    const rows = await db
      .select()
      .from(offers)
      .where(eq(offers.towRequestId, requestId))
      .orderBy(desc(offers.createdAt));

    return apiSuccess(rows);
  } catch (err) {
    console.error("GET /api/tow-requests/[id]/offers error:", err);
    return apiError("Failed to fetch offers", 500);
  }
}
