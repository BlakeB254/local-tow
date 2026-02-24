import { NextRequest } from "next/server";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { jobs } from "@/lib/db/schema";
import { apiSuccess, apiError, apiNotFound, safeValidateBody } from "@/lib/api/utils";

const updateLocationSchema = z.object({
  lng: z.number().min(-180).max(180),
  lat: z.number().min(-90).max(90),
  estimatedArrival: z.number().int().min(0).optional(),
});

// ---------- POST /api/jobs/[id]/location ----------

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const jobId = parseInt(id, 10);
    if (isNaN(jobId)) return apiError("Invalid job ID");

    const { data, error } = await safeValidateBody(request, updateLocationSchema);
    if (error) return apiError(error);

    // Fetch the job
    const [job] = await db
      .select()
      .from(jobs)
      .where(eq(jobs.id, jobId))
      .limit(1);

    if (!job) return apiNotFound("Job");

    // Only allow location updates for active jobs
    const activeStatuses = ["accepted", "en_route", "at_pickup", "loading", "transporting", "at_dropoff"];
    if (!activeStatuses.includes(job.status)) {
      return apiError(`Cannot update location for a job with status '${job.status}'`);
    }

    const now = new Date();
    const gpsPoint = { lng: data.lng, lat: data.lat, ts: now.getTime() };

    // Append to GPS path
    const currentPath = (job.gpsPath || []) as Array<{ lng: number; lat: number; ts: number }>;
    const updatedPath = [...currentPath, gpsPoint];

    const updateFields: Record<string, unknown> = {
      providerLng: data.lng,
      providerLat: data.lat,
      lastLocationUpdate: now,
      gpsPath: updatedPath,
      updatedAt: now,
    };

    if (data.estimatedArrival !== undefined) {
      updateFields.estimatedArrival = data.estimatedArrival;
    }

    const [updated] = await db
      .update(jobs)
      .set(updateFields)
      .where(eq(jobs.id, jobId))
      .returning();

    return apiSuccess({
      id: updated.id,
      providerLng: updated.providerLng,
      providerLat: updated.providerLat,
      lastLocationUpdate: updated.lastLocationUpdate,
      estimatedArrival: updated.estimatedArrival,
    });
  } catch (err) {
    console.error("POST /api/jobs/[id]/location error:", err);
    return apiError("Failed to update location", 500);
  }
}
