import { NextRequest } from "next/server";
import { desc } from "drizzle-orm";
import { db } from "@/lib/db";
import { serviceAreas } from "@/lib/db/schema";
import { apiSuccess, apiError } from "@/lib/api/utils";

// ---------- GET /api/service-areas ----------
// Returns all community areas with their stats. No pagination needed (77 areas max).

export async function GET(_request: NextRequest) {
  try {
    const rows = await db
      .select()
      .from(serviceAreas)
      .orderBy(desc(serviceAreas.communityAreaNumber));

    return apiSuccess(rows);
  } catch (err) {
    console.error("GET /api/service-areas error:", err);
    return apiError("Failed to fetch service areas", 500);
  }
}
