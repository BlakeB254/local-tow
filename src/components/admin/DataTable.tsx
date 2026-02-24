"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Column<T> {
  key: string;
  label: string;
  render?: (item: T) => React.ReactNode;
}

export interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  total?: number;
  page?: number;
  limit?: number;
  onPageChange?: (page: number) => void;
  emptyMessage?: string;
  onRowClick?: (item: T) => void;
}

export function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  total = 0,
  page = 1,
  limit = 20,
  onPageChange,
  emptyMessage = "No data found",
  onRowClick,
}: DataTableProps<T>) {
  const totalPages = Math.max(1, Math.ceil(total / limit));

  if (data.length === 0) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-12 text-center">
        <p className="text-gray-400">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="px-4 py-3 text-left font-medium text-[#003366]/80 whitespace-nowrap"
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item, rowIndex) => (
              <tr
                key={rowIndex}
                onClick={() => onRowClick?.(item)}
                className={cn(
                  "border-b border-gray-100 transition-colors",
                  onRowClick
                    ? "cursor-pointer hover:bg-gray-50"
                    : "hover:bg-gray-50/50"
                )}
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className="px-4 py-3 text-[#003366] whitespace-nowrap"
                  >
                    {col.render
                      ? col.render(item)
                      : (item[col.key] as React.ReactNode) ?? "\u2014"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {total > limit && onPageChange && (
        <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3">
          <span className="text-sm text-gray-500">
            Page {page} of {totalPages} ({total} total)
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange(page - 1)}
              disabled={page <= 1}
              className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-[#003366]/70 transition-colors hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </button>
            <button
              onClick={() => onPageChange(page + 1)}
              disabled={page >= totalPages}
              className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-[#003366]/70 transition-colors hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
