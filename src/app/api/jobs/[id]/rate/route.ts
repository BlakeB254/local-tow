import { NextRequest } from "next/server";
import { z } from "zod";
import { eq, sql, and, isNotNull } from "drizzle-orm";
import { db } from "@/lib/db";
import { jobs, providers } from "@/lib/db/schema";
import { apiSuccess, apiError, apiNotFound, safeValidateBody } from "@/lib/api/utils";

const rateJobSchema = z.object({
  // Exactly one of these pairs should be provided
  customerRating: z.number().int().min(1).max(5).optional(),
  customerComment: z.string().max(1000).optional(),
  providerRating: z.number().int().min(1).max(5).optional(),
  providerComment: z.string().max(1000).optional(),
}).refine(
  (data) => {
    const hasCustomer = data.customerRating !== undefined;
    const hasProvider = data.providerRating !== undefined;
    return (hasCustomer || hasProvider) && !(hasCustomer && hasProvider);
  },
  { message: "Provide either customerRating or providerRating, but not both" }
);

// ---------- POST /api/jobs/[id]/rate ----------

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const jobId = parseInt(id, 10);
    if (isNaN(jobId)) return apiError("Invalid job ID");

    const { data, error } = await safeValidateBody(request, rateJobSchema);
    if (error) return apiError(error);

    const [job] = await db
      .select()
      .from(jobs)
      .where(eq(jobs.id, jobId))
      .limit(1);

    if (!job) return apiNotFound("Job");

    if (job.status !== "completed") {
      return apiError("Can only rate completed jobs");
    }

    const now = new Date();
    const updateFields: Record<string, unknown> = { updatedAt: now };

    if (data.customerRating !== undefined) {
      if (job.customerRating) {
        return apiError("Customer has already rated this job");
      }
      updateFields.customerRating = data.customerRating;
      updateFields.customerComment = data.customerComment || null;
      updateFields.customerRatedAt = now;
    }

    if (data.providerRating !== undefined) {
      if (job.providerRating) {
        return apiError("Provider has already rated this job");
      }
      updateFields.providerRating = data.providerRating;
      updateFields.providerComment = data.providerComment || null;
      updateFields.providerRatedAt = now;
    }

    const [updated] = await db
      .update(jobs)
      .set(updateFields)
      .where(eq(jobs.id, jobId))
      .returning();

    // If a customer just rated, recalculate the provider's average rating
    if (data.customerRating !== undefined) {
      const ratedJobs = await db
        .select({ rating: jobs.customerRating })
        .from(jobs)
        .where(
          and(
            eq(jobs.providerId, job.providerId),
            isNotNull(jobs.customerRating)
          )
        );

      if (ratedJobs.length > 0) {
        const totalRating = ratedJobs.reduce((sum, r) => sum + (r.rating ?? 0), 0);
        const avgRating = Math.round((totalRating / ratedJobs.length) * 10) / 10;

        await db
          .update(providers)
          .set({ averageRating: avgRating, updatedAt: now })
          .where(eq(providers.id, job.providerId));
      }
    }

    return apiSuccess(updated);
  } catch (err) {
    console.error("POST /api/jobs/[id]/rate error:", err);
    return apiError("Failed to submit rating", 500);
  }
}
