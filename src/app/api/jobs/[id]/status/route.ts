import { NextRequest } from "next/server";
import { z } from "zod";
import { eq, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { jobs, towRequests, providers } from "@/lib/db/schema";
import { apiSuccess, apiError, apiNotFound, safeValidateBody } from "@/lib/api/utils";

const validStatuses = [
  "en_route",
  "at_pickup",
  "loading",
  "transporting",
  "at_dropoff",
  "completed",
] as const;

const updateStatusSchema = z.object({
  status: z.enum(validStatuses),
});

// Define valid status transitions
const statusTransitions: Record<string, string[]> = {
  accepted: ["en_route"],
  en_route: ["at_pickup"],
  at_pickup: ["loading"],
  loading: ["transporting"],
  transporting: ["at_dropoff"],
  at_dropoff: ["completed"],
};

// Map status to the timestamp field it sets
const statusTimestampMap: Record<string, string> = {
  en_route: "enRouteAt",
  at_pickup: "arrivedAt",
  loading: "loadedAt",
  transporting: "departedAt",
  at_dropoff: "deliveredAt",
  completed: "completedAt",
};

// ---------- PATCH /api/jobs/[id]/status ----------

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const jobId = parseInt(id, 10);
    if (isNaN(jobId)) return apiError("Invalid job ID");

    const { data, error } = await safeValidateBody(request, updateStatusSchema);
    if (error) return apiError(error);

    // Fetch current job
    const [job] = await db
      .select()
      .from(jobs)
      .where(eq(jobs.id, jobId))
      .limit(1);

    if (!job) return apiNotFound("Job");

    if (job.status === "completed") {
      return apiError("Job is already completed");
    }
    if (job.status === "cancelled") {
      return apiError("Job is cancelled");
    }

    // Validate transition
    const allowedNext = statusTransitions[job.status];
    if (!allowedNext || !allowedNext.includes(data.status)) {
      return apiError(
        `Invalid status transition from '${job.status}' to '${data.status}'. Allowed: ${allowedNext?.join(", ") || "none"}`
      );
    }

    const now = new Date();
    const updateFields: Record<string, unknown> = {
      status: data.status,
      updatedAt: now,
    };

    // Set the appropriate timestamp
    const tsField = statusTimestampMap[data.status];
    if (tsField) {
      updateFields[tsField] = now;
    }

    // On completion, calculate total duration from acceptedAt
    if (data.status === "completed" && job.acceptedAt) {
      const durationMs = now.getTime() - new Date(job.acceptedAt).getTime();
      updateFields.totalDurationMinutes = Math.round(durationMs / 60000);
    }

    const [updated] = await db
      .update(jobs)
      .set(updateFields)
      .where(eq(jobs.id, jobId))
      .returning();

    // On completion, update the tow request status and provider stats
    if (data.status === "completed") {
      await db
        .update(towRequests)
        .set({ status: "completed", updatedAt: now })
        .where(eq(towRequests.id, job.towRequestId));

      await db
        .update(providers)
        .set({
          jobsCompleted: sql`${providers.jobsCompleted} + 1`,
          totalEarnings: sql`${providers.totalEarnings} + ${job.providerPayout}`,
          lastJobAt: now,
          updatedAt: now,
        })
        .where(eq(providers.id, job.providerId));
    }

    return apiSuccess(updated);
  } catch (err) {
    console.error("PATCH /api/jobs/[id]/status error:", err);
    return apiError("Failed to update job status", 500);
  }
}
