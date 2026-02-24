import { NextRequest } from "next/server";
import { z } from "zod";
import { eq, desc, and, count } from "drizzle-orm";
import { db } from "@/lib/db";
import { providers } from "@/lib/db/schema";
import {
  apiSuccess,
  apiPaginated,
  apiError,
  safeValidateBody,
  parsePagination,
} from "@/lib/api/utils";

const createProviderSchema = z.object({
  email: z.string().email("Valid email is required"),
  name: z.string().min(1, "Name is required"),
  phone: z.string().min(10, "Valid phone number is required"),
  businessName: z.string().optional(),

  addressStreet: z.string().optional(),
  addressCity: z.string().default("Chicago"),
  addressState: z.string().default("IL"),
  addressZip: z.string().optional(),
  addressLng: z.number().optional(),
  addressLat: z.number().optional(),

  communityAreaIds: z.array(z.number().int().positive()).default([]),
  maxDistance: z.number().int().min(1).max(50).default(15),

  vehicleType: z.enum(["flatbed", "wheel_lift", "dolly", "integrated"]),
  maxWeight: z.number().int().positive().optional(),
  truckMake: z.string().optional(),
  truckModel: z.string().optional(),
  truckYear: z.number().int().min(1980).max(2030).optional(),
});

// ---------- GET /api/providers ----------

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const { page, limit, offset } = parsePagination(url);
    const verificationStatus = url.searchParams.get("verificationStatus");
    const isOnline = url.searchParams.get("isOnline");

    const conditions = [];
    if (verificationStatus) conditions.push(eq(providers.verificationStatus, verificationStatus));
    if (isOnline !== null && isOnline !== undefined && isOnline !== "") {
      conditions.push(eq(providers.isOnline, isOnline === "true"));
    }

    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const [rows, totalResult] = await Promise.all([
      db
        .select()
        .from(providers)
        .where(where)
        .orderBy(desc(providers.createdAt))
        .limit(limit)
        .offset(offset),
      db.select({ count: count() }).from(providers).where(where),
    ]);

    const total = totalResult[0]?.count ?? 0;
    return apiPaginated(rows, total, page, limit);
  } catch (err) {
    console.error("GET /api/providers error:", err);
    return apiError("Failed to fetch providers", 500);
  }
}

// ---------- POST /api/providers ----------

export async function POST(request: NextRequest) {
  try {
    const { data, error } = await safeValidateBody(request, createProviderSchema);
    if (error) return apiError(error);

    // Check for duplicate email
    const [existing] = await db
      .select({ id: providers.id })
      .from(providers)
      .where(eq(providers.email, data.email))
      .limit(1);

    if (existing) {
      return apiError("A provider with this email already exists", 409);
    }

    const [created] = await db
      .insert(providers)
      .values({
        email: data.email,
        name: data.name,
        phone: data.phone,
        businessName: data.businessName,
        addressStreet: data.addressStreet,
        addressCity: data.addressCity,
        addressState: data.addressState,
        addressZip: data.addressZip,
        addressLng: data.addressLng,
        addressLat: data.addressLat,
        communityAreaIds: data.communityAreaIds,
        maxDistance: data.maxDistance,
        vehicleType: data.vehicleType,
        maxWeight: data.maxWeight,
        truckMake: data.truckMake,
        truckModel: data.truckModel,
        truckYear: data.truckYear,
      })
      .returning();

    return apiSuccess(created, 201);
  } catch (err) {
    console.error("POST /api/providers error:", err);
    return apiError("Failed to create provider", 500);
  }
}
