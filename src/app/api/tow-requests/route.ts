import { NextRequest } from "next/server";
import { z } from "zod";
import { eq, desc, and, count, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { towRequests } from "@/lib/db/schema";
import { validatePrice } from "@/lib/fees";
import {
  apiSuccess,
  apiPaginated,
  apiError,
  safeValidateBody,
  parsePagination,
  generateRequestNumber,
} from "@/lib/api/utils";

// ---------- Zod Schemas ----------

const createTowRequestSchema = z.object({
  customerEmail: z.string().email("Valid email is required"),
  customerName: z.string().min(1, "Name is required").optional(),
  customerPhone: z.string().min(10, "Valid phone number is required").optional(),

  pickupAddress: z.string().min(1, "Pickup address is required"),
  pickupCity: z.string().default("Chicago"),
  pickupState: z.string().default("IL"),
  pickupZip: z.string().min(5, "Valid zip code is required"),
  pickupLng: z.number().optional(),
  pickupLat: z.number().optional(),
  pickupNotes: z.string().optional(),
  pickupCommunityAreaId: z.number().int().positive().optional(),

  dropoffAddress: z.string().min(1, "Dropoff address is required"),
  dropoffCity: z.string().default("Chicago"),
  dropoffState: z.string().default("IL"),
  dropoffZip: z.string().min(5, "Valid zip code is required"),
  dropoffLng: z.number().optional(),
  dropoffLat: z.number().optional(),
  dropoffNotes: z.string().optional(),

  distanceMiles: z.number().positive().optional(),
  estimatedDuration: z.number().int().positive().optional(),

  vehicleMake: z.string().min(1, "Vehicle make is required"),
  vehicleModel: z.string().min(1, "Vehicle model is required"),
  vehicleYear: z.number().int().min(1900).max(2030).optional(),
  vehicleColor: z.string().optional(),
  vehicleCondition: z.enum(["runs", "runs_no_drive", "no_run", "damaged"]).default("runs"),
  vehicleNotes: z.string().optional(),

  offeredPrice: z.number().int().positive("Price must be positive"),

  urgency: z.enum(["asap", "few_hours", "today", "scheduled"]).default("asap"),
  scheduledTime: z.string().datetime().optional(),
});

// ---------- GET /api/tow-requests ----------

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const { page, limit, offset } = parsePagination(url);
    const status = url.searchParams.get("status");
    const urgency = url.searchParams.get("urgency");

    const conditions = [];
    if (status) conditions.push(eq(towRequests.status, status));
    if (urgency) conditions.push(eq(towRequests.urgency, urgency));

    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const [rows, totalResult] = await Promise.all([
      db
        .select()
        .from(towRequests)
        .where(where)
        .orderBy(desc(towRequests.createdAt))
        .limit(limit)
        .offset(offset),
      db.select({ count: count() }).from(towRequests).where(where),
    ]);

    const total = totalResult[0]?.count ?? 0;
    return apiPaginated(rows, total, page, limit);
  } catch (err) {
    console.error("GET /api/tow-requests error:", err);
    return apiError("Failed to fetch tow requests", 500);
  }
}

// ---------- POST /api/tow-requests ----------

export async function POST(request: NextRequest) {
  try {
    const { data, error } = await safeValidateBody(request, createTowRequestSchema);
    if (error) return apiError(error);

    // Validate price
    const priceError = validatePrice(data.offeredPrice);
    if (priceError) return apiError(priceError);

    // Calculate expiration based on urgency
    const now = new Date();
    let expiresAt: Date = new Date(now.getTime() + 2 * 60 * 60 * 1000); // default 2 hours
    switch (data.urgency) {
      case "asap":
        expiresAt = new Date(now.getTime() + 2 * 60 * 60 * 1000); // 2 hours
        break;
      case "few_hours":
        expiresAt = new Date(now.getTime() + 6 * 60 * 60 * 1000); // 6 hours
        break;
      case "today":
        expiresAt = new Date(now.getTime() + 12 * 60 * 60 * 1000); // 12 hours
        break;
      case "scheduled":
        expiresAt = data.scheduledTime
          ? new Date(new Date(data.scheduledTime).getTime() + 2 * 60 * 60 * 1000)
          : new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours
        break;
    }

    const requestNumber = generateRequestNumber();

    const [created] = await db
      .insert(towRequests)
      .values({
        requestNumber,
        customerEmail: data.customerEmail,
        customerName: data.customerName,
        customerPhone: data.customerPhone,
        pickupAddress: data.pickupAddress,
        pickupCity: data.pickupCity,
        pickupState: data.pickupState,
        pickupZip: data.pickupZip,
        pickupLng: data.pickupLng,
        pickupLat: data.pickupLat,
        pickupNotes: data.pickupNotes,
        pickupCommunityAreaId: data.pickupCommunityAreaId,
        dropoffAddress: data.dropoffAddress,
        dropoffCity: data.dropoffCity,
        dropoffState: data.dropoffState,
        dropoffZip: data.dropoffZip,
        dropoffLng: data.dropoffLng,
        dropoffLat: data.dropoffLat,
        dropoffNotes: data.dropoffNotes,
        distanceMiles: data.distanceMiles,
        estimatedDuration: data.estimatedDuration,
        vehicleMake: data.vehicleMake,
        vehicleModel: data.vehicleModel,
        vehicleYear: data.vehicleYear,
        vehicleColor: data.vehicleColor,
        vehicleCondition: data.vehicleCondition,
        vehicleNotes: data.vehicleNotes,
        offeredPrice: data.offeredPrice,
        urgency: data.urgency,
        scheduledTime: data.scheduledTime ? new Date(data.scheduledTime) : undefined,
        expiresAt,
      })
      .returning();

    return apiSuccess(created, 201);
  } catch (err) {
    console.error("POST /api/tow-requests error:", err);
    return apiError("Failed to create tow request", 500);
  }
}
