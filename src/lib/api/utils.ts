import { NextResponse } from "next/server";
import { z, ZodSchema } from "zod";

export function apiSuccess<T>(data: T, status = 200) {
  return NextResponse.json({ success: true, data }, { status });
}

export function apiPaginated<T>(data: T[], total: number, page: number, limit: number) {
  return NextResponse.json({
    success: true,
    data,
    pagination: {
      page,
      pageSize: limit,
      totalDocs: total,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page * limit < total,
      hasPrevPage: page > 1,
    },
  });
}

export function apiError(message: string, status = 400) {
  return NextResponse.json({ success: false, error: { message } }, { status });
}

export function apiNotFound(resource = "Resource") {
  return apiError(`${resource} not found`, 404);
}

export async function safeValidateBody<T>(request: Request, schema: ZodSchema<T>) {
  try {
    const body = await request.json();
    const result = schema.safeParse(body);
    if (!result.success) {
      return { data: null as never, error: result.error.errors.map((e) => e.message).join(", ") };
    }
    return { data: result.data, error: null };
  } catch {
    return { data: null as never, error: "Invalid JSON body" };
  }
}

export function parsePagination(url: URL) {
  const page = Math.max(1, parseInt(url.searchParams.get("page") || "1"));
  const limit = Math.min(100, Math.max(1, parseInt(url.searchParams.get("limit") || "20")));
  const offset = (page - 1) * limit;
  return { page, limit, offset };
}

export function generateRequestNumber(): string {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, "0");
  return `TOW-${date}-${random}`;
}

export function generateOfferNumber(): string {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, "0");
  return `OFF-${date}-${random}`;
}

export function generateJobNumber(): string {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, "0");
  return `JOB-${date}-${random}`;
}
