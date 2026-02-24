import { NextRequest } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { towRequests } from "@/lib/db/schema";
import { apiSuccess, apiError, apiNotFound } from "@/lib/api/utils";

// ---------- GET /api/tow-requests/[id] ----------

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const requestId = parseInt(id, 10);
    if (isNaN(requestId)) return apiError("Invalid request ID");

    const [row] = await db
      .select()
      .from(towRequests)
      .where(eq(towRequests.id, requestId))
      .limit(1);

    if (!row) return apiNotFound("Tow request");

    return apiSuccess(row);
  } catch (err) {
    console.error("GET /api/tow-requests/[id] error:", err);
    return apiError("Failed to fetch tow request", 500);
  }
}
