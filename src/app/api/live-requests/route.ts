import { NextRequest } from "next/server";
import { eq, and, gt, desc } from "drizzle-orm";
import { db } from "@/lib/db";
import { towRequests } from "@/lib/db/schema";
import { apiSuccess, apiError } from "@/lib/api/utils";

// ---------- GET /api/live-requests ----------
// Public endpoint returning recent open requests with limited fields (no PII).

export async function GET(_request: NextRequest) {
  try {
    const now = new Date();

    const rows = await db
      .select({
        id: towRequests.id,
        requestNumber: towRequests.requestNumber,
        pickupCity: towRequests.pickupCity,
        pickupZip: towRequests.pickupZip,
        pickupCommunityAreaId: towRequests.pickupCommunityAreaId,
        dropoffCity: towRequests.dropoffCity,
        dropoffZip: towRequests.dropoffZip,
        distanceMiles: towRequests.distanceMiles,
        vehicleMake: towRequests.vehicleMake,
        vehicleModel: towRequests.vehicleModel,
        vehicleYear: towRequests.vehicleYear,
        vehicleCondition: towRequests.vehicleCondition,
        offeredPrice: towRequests.offeredPrice,
        urgency: towRequests.urgency,
        status: towRequests.status,
        offerCount: towRequests.offerCount,
        expiresAt: towRequests.expiresAt,
        createdAt: towRequests.createdAt,
      })
      .from(towRequests)
      .where(
        and(
          eq(towRequests.status, "open"),
          gt(towRequests.expiresAt, now)
        )
      )
      .orderBy(desc(towRequests.createdAt))
      .limit(25);

    return apiSuccess(rows);
  } catch (err) {
    console.error("GET /api/live-requests error:", err);
    return apiError("Failed to fetch live requests", 500);
  }
}
