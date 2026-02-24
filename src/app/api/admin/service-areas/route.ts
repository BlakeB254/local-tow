import { NextRequest } from "next/server";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { serviceAreas } from "@/lib/db/schema";
import { apiSuccess, apiError, safeValidateBody } from "@/lib/api/utils";

const upsertServiceAreaSchema = z.object({
  communityAreaNumber: z.number().int().min(1).max(77, "Chicago has 77 community areas"),
  communityAreaName: z.string().min(1, "Community area name is required"),
  status: z.enum(["active", "coming_soon", "inactive"]).default("coming_soon"),
  centerLng: z.number().optional(),
  centerLat: z.number().optional(),
  zipCodes: z.array(z.string()).default([]),
  minSuggestedPrice: z.number().int().positive().optional(),
  avgSuggestedPrice: z.number().int().positive().optional(),
  maxSuggestedPrice: z.number().int().positive().optional(),
});

// ---------- POST /api/admin/service-areas ----------
// Create or update a service area by community area number (upsert).

export async function POST(request: NextRequest) {
  try {
    const { data, error } = await safeValidateBody(request, upsertServiceAreaSchema);
    if (error) return apiError(error);

    // Check if area already exists by community area number
    const [existing] = await db
      .select()
      .from(serviceAreas)
      .where(eq(serviceAreas.communityAreaNumber, data.communityAreaNumber))
      .limit(1);

    if (existing) {
      // Update existing
      const [updated] = await db
        .update(serviceAreas)
        .set({
          communityAreaName: data.communityAreaName,
          status: data.status,
          centerLng: data.centerLng ?? existing.centerLng,
          centerLat: data.centerLat ?? existing.centerLat,
          zipCodes: (data.zipCodes ?? []).length > 0 ? data.zipCodes : existing.zipCodes,
          minSuggestedPrice: data.minSuggestedPrice ?? existing.minSuggestedPrice,
          avgSuggestedPrice: data.avgSuggestedPrice ?? existing.avgSuggestedPrice,
          maxSuggestedPrice: data.maxSuggestedPrice ?? existing.maxSuggestedPrice,
        })
        .where(eq(serviceAreas.id, existing.id))
        .returning();

      return apiSuccess(updated);
    }

    // Create new
    const [created] = await db
      .insert(serviceAreas)
      .values({
        communityAreaNumber: data.communityAreaNumber,
        communityAreaName: data.communityAreaName,
        status: data.status,
        centerLng: data.centerLng,
        centerLat: data.centerLat,
        zipCodes: data.zipCodes,
        minSuggestedPrice: data.minSuggestedPrice,
        avgSuggestedPrice: data.avgSuggestedPrice,
        maxSuggestedPrice: data.maxSuggestedPrice,
      })
      .returning();

    return apiSuccess(created, 201);
  } catch (err) {
    console.error("POST /api/admin/service-areas error:", err);
    return apiError("Failed to create/update service area", 500);
  }
}
