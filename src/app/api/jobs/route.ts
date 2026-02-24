import { NextRequest } from "next/server";
import { eq, desc, and, count } from "drizzle-orm";
import { db } from "@/lib/db";
import { jobs } from "@/lib/db/schema";
import { apiPaginated, apiError, parsePagination } from "@/lib/api/utils";

// ---------- GET /api/jobs ----------

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const { page, limit, offset } = parsePagination(url);
    const status = url.searchParams.get("status");
    const providerId = url.searchParams.get("providerId");
    const customerEmail = url.searchParams.get("customerEmail");

    const conditions = [];
    if (status) conditions.push(eq(jobs.status, status));
    if (providerId) conditions.push(eq(jobs.providerId, parseInt(providerId, 10)));
    if (customerEmail) conditions.push(eq(jobs.customerEmail, customerEmail));

    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const [rows, totalResult] = await Promise.all([
      db
        .select()
        .from(jobs)
        .where(where)
        .orderBy(desc(jobs.createdAt))
        .limit(limit)
        .offset(offset),
      db.select({ count: count() }).from(jobs).where(where),
    ]);

    const total = totalResult[0]?.count ?? 0;
    return apiPaginated(rows, total, page, limit);
  } catch (err) {
    console.error("GET /api/jobs error:", err);
    return apiError("Failed to fetch jobs", 500);
  }
}
