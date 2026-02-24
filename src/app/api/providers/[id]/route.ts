import { NextRequest } from "next/server";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { providers } from "@/lib/db/schema";
import { apiSuccess, apiError, apiNotFound, safeValidateBody } from "@/lib/api/utils";

const updateProviderSchema = z.object({
  name: z.string().min(1).optional(),
  phone: z.string().min(10).optional(),
  businessName: z.string().optional(),

  addressStreet: z.string().optional(),
  addressCity: z.string().optional(),
  addressState: z.string().optional(),
  addressZip: z.string().optional(),
  addressLng: z.number().optional(),
  addressLat: z.number().optional(),

  communityAreaIds: z.array(z.number().int().positive()).optional(),
  maxDistance: z.number().int().min(1).max(50).optional(),

  vehicleType: z.enum(["flatbed", "wheel_lift", "dolly", "integrated"]).optional(),
  maxWeight: z.number().int().positive().optional(),
  truckMake: z.string().optional(),
  truckModel: z.string().optional(),
  truckYear: z.number().int().min(1980).max(2030).optional(),

  isOnline: z.boolean().optional(),
  currentLng: z.number().optional(),
  currentLat: z.number().optional(),

  pushEnabled: z.boolean().optional(),
  pushSubscription: z.record(z.unknown()).optional(),
});

// ---------- PATCH /api/providers/[id] ----------

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const providerId = parseInt(id, 10);
    if (isNaN(providerId)) return apiError("Invalid provider ID");

    const { data, error } = await safeValidateBody(request, updateProviderSchema);
    if (error) return apiError(error);

    // Verify provider exists
    const [existing] = await db
      .select({ id: providers.id })
      .from(providers)
      .where(eq(providers.id, providerId))
      .limit(1);

    if (!existing) return apiNotFound("Provider");

    const now = new Date();
    const updateFields: Record<string, unknown> = { updatedAt: now };

    // Map validated fields to update
    if (data.name !== undefined) updateFields.name = data.name;
    if (data.phone !== undefined) updateFields.phone = data.phone;
    if (data.businessName !== undefined) updateFields.businessName = data.businessName;
    if (data.addressStreet !== undefined) updateFields.addressStreet = data.addressStreet;
    if (data.addressCity !== undefined) updateFields.addressCity = data.addressCity;
    if (data.addressState !== undefined) updateFields.addressState = data.addressState;
    if (data.addressZip !== undefined) updateFields.addressZip = data.addressZip;
    if (data.addressLng !== undefined) updateFields.addressLng = data.addressLng;
    if (data.addressLat !== undefined) updateFields.addressLat = data.addressLat;
    if (data.communityAreaIds !== undefined) updateFields.communityAreaIds = data.communityAreaIds;
    if (data.maxDistance !== undefined) updateFields.maxDistance = data.maxDistance;
    if (data.vehicleType !== undefined) updateFields.vehicleType = data.vehicleType;
    if (data.maxWeight !== undefined) updateFields.maxWeight = data.maxWeight;
    if (data.truckMake !== undefined) updateFields.truckMake = data.truckMake;
    if (data.truckModel !== undefined) updateFields.truckModel = data.truckModel;
    if (data.truckYear !== undefined) updateFields.truckYear = data.truckYear;
    if (data.pushEnabled !== undefined) updateFields.pushEnabled = data.pushEnabled;
    if (data.pushSubscription !== undefined) updateFields.pushSubscription = data.pushSubscription;

    if (data.isOnline !== undefined) updateFields.isOnline = data.isOnline;

    if (data.currentLng !== undefined && data.currentLat !== undefined) {
      updateFields.currentLng = data.currentLng;
      updateFields.currentLat = data.currentLat;
      updateFields.lastLocationUpdate = now;
    }

    const [updated] = await db
      .update(providers)
      .set(updateFields)
      .where(eq(providers.id, providerId))
      .returning();

    return apiSuccess(updated);
  } catch (err) {
    console.error("PATCH /api/providers/[id] error:", err);
    return apiError("Failed to update provider", 500);
  }
}
