import { NextRequest } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { jobs } from "@/lib/db/schema";
import { apiSuccess, apiError, apiNotFound } from "@/lib/api/utils";

// ---------- GET /api/jobs/[id] ----------

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const jobId = parseInt(id, 10);
    if (isNaN(jobId)) return apiError("Invalid job ID");

    const [row] = await db
      .select()
      .from(jobs)
      .where(eq(jobs.id, jobId))
      .limit(1);

    if (!row) return apiNotFound("Job");

    return apiSuccess(row);
  } catch (err) {
    console.error("GET /api/jobs/[id] error:", err);
    return apiError("Failed to fetch job", 500);
  }
}
