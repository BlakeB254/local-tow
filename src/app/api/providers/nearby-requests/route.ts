import { NextRequest } from "next/server";
import { eq, and, sql, gt } from "drizzle-orm";
import { db } from "@/lib/db";
import { towRequests, providers } from "@/lib/db/schema";
import { apiSuccess, apiError, apiNotFound } from "@/lib/api/utils";

// ---------- GET /api/providers/nearby-requests ----------
// Query params: providerId (required), radiusMiles (optional, default 15)
// Returns open tow requests near the provider's current location or service areas.

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const providerIdParam = url.searchParams.get("providerId");

    if (!providerIdParam) {
      return apiError("providerId query parameter is required");
    }

    const providerId = parseInt(providerIdParam, 10);
    if (isNaN(providerId)) return apiError("Invalid provider ID");

    const radiusMiles = parseFloat(url.searchParams.get("radiusMiles") || "15");

    // Fetch the provider
    const [provider] = await db
      .select()
      .from(providers)
      .where(eq(providers.id, providerId))
      .limit(1);

    if (!provider) return apiNotFound("Provider");

    const now = new Date();

    // If provider has current GPS coordinates, use distance-based search
    if (provider.currentLat && provider.currentLng) {
      // Haversine distance approximation in SQL (miles)
      // 3959 = Earth's radius in miles
      const distanceExpr = sql`(
        3959 * acos(
          cos(radians(${provider.currentLat})) *
          cos(radians(${towRequests.pickupLat})) *
          cos(radians(${towRequests.pickupLng}) - radians(${provider.currentLng})) +
          sin(radians(${provider.currentLat})) *
          sin(radians(${towRequests.pickupLat}))
        )
      )`;

      const rows = await db
        .select({
          id: towRequests.id,
          requestNumber: towRequests.requestNumber,
          pickupAddress: towRequests.pickupAddress,
          pickupCity: towRequests.pickupCity,
          pickupZip: towRequests.pickupZip,
          pickupLng: towRequests.pickupLng,
          pickupLat: towRequests.pickupLat,
          dropoffAddress: towRequests.dropoffAddress,
          dropoffCity: towRequests.dropoffCity,
          distanceMiles: towRequests.distanceMiles,
          vehicleMake: towRequests.vehicleMake,
          vehicleModel: towRequests.vehicleModel,
          vehicleCondition: towRequests.vehicleCondition,
          offeredPrice: towRequests.offeredPrice,
          urgency: towRequests.urgency,
          status: towRequests.status,
          offerCount: towRequests.offerCount,
          expiresAt: towRequests.expiresAt,
          createdAt: towRequests.createdAt,
          distanceToPickup: distanceExpr.as("distance_to_pickup"),
        })
        .from(towRequests)
        .where(
          and(
            eq(towRequests.status, "open"),
            gt(towRequests.expiresAt, now),
            sql`${towRequests.pickupLat} IS NOT NULL`,
            sql`${towRequests.pickupLng} IS NOT NULL`,
            sql`${distanceExpr} <= ${radiusMiles}`
          )
        )
        .orderBy(sql`${distanceExpr} ASC`)
        .limit(50);

      return apiSuccess(rows);
    }

    // Fallback: filter by community area IDs if provider has them
    const communityIds = (provider.communityAreaIds || []) as number[];
    if (communityIds.length > 0) {
      const rows = await db
        .select()
        .from(towRequests)
        .where(
          and(
            eq(towRequests.status, "open"),
            gt(towRequests.expiresAt, now),
            sql`${towRequests.pickupCommunityAreaId} = ANY(${communityIds})`
          )
        )
        .orderBy(sql`${towRequests.createdAt} DESC`)
        .limit(50);

      return apiSuccess(rows);
    }

    // No location and no community areas: return all open requests
    const rows = await db
      .select()
      .from(towRequests)
      .where(
        and(
          eq(towRequests.status, "open"),
          gt(towRequests.expiresAt, now)
        )
      )
      .orderBy(sql`${towRequests.createdAt} DESC`)
      .limit(50);

    return apiSuccess(rows);
  } catch (err) {
    console.error("GET /api/providers/nearby-requests error:", err);
    return apiError("Failed to fetch nearby requests", 500);
  }
}
