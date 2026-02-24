"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { formatCents } from "@/lib/fees";

interface Job extends Record<string, unknown> {
  id: number;
  jobNumber: string;
  providerId: number;
  providerName?: string;
  customerEmail: string;
  status: string;
  agreedPrice: number;
  totalDurationMinutes: number | null;
  createdAt: string;
}

const STATUS_TABS = [
  { value: "", label: "All" },
  { value: "accepted", label: "Accepted" },
  { value: "en_route", label: "En Route" },
  { value: "loading", label: "Loading" },
  { value: "transporting", label: "Transporting" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

const placeholderData: Job[] = [
  { id: 1, jobNumber: "JOB-20260224-0004", providerId: 3, providerName: "Tony's Towing", customerEmail: "sarah@example.com", status: "en_route", agreedPrice: 4500, totalDurationMinutes: null, createdAt: "2026-02-24T12:10:00Z" },
  { id: 2, jobNumber: "JOB-20260224-0003", providerId: 7, providerName: "Quick Haul LLC", customerEmail: "james@example.com", status: "transporting", agreedPrice: 7000, totalDurationMinutes: null, createdAt: "2026-02-24T11:30:00Z" },
  { id: 3, jobNumber: "JOB-20260224-0002", providerId: 12, providerName: "Midwest Tow Co", customerEmail: "mike@example.com", status: "completed", agreedPrice: 6000, totalDurationMinutes: 42, createdAt: "2026-02-24T08:00:00Z" },
  { id: 4, jobNumber: "JOB-20260224-0001", providerId: 5, providerName: "Chi-Town Tow", customerEmail: "angela@example.com", status: "completed", agreedPrice: 8500, totalDurationMinutes: 55, createdAt: "2026-02-23T22:00:00Z" },
  { id: 5, jobNumber: "JOB-20260223-0008", providerId: 3, providerName: "Tony's Towing", customerEmail: "carlos@example.com", status: "cancelled", agreedPrice: 5000, totalDurationMinutes: null, createdAt: "2026-02-23T16:00:00Z" },
];

export default function JobsListPage() {
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>(placeholderData);
  const [total, setTotal] = useState(placeholderData.length);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: page.toString(), limit: "20" });
      if (statusFilter) params.set("status", statusFilter);

      const res = await fetch(`/api/jobs?${params}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setJobs(data.data as Job[]);
          setTotal(data.pagination?.totalDocs ?? data.data.length);
        }
      }
    } catch {
      // Keep placeholder data
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const columns: Column<Job>[] = [
    { key: "jobNumber", label: "Job #", render: (j) => <span className="font-medium">{j.jobNumber}</span> },
    { key: "providerName", label: "Provider", render: (j) => j.providerName ?? `Provider #${j.providerId}` },
    { key: "customerEmail", label: "Customer", render: (j) => j.customerEmail },
    { key: "status", label: "Status", render: (j) => <StatusBadge status={j.status} /> },
    { key: "agreedPrice", label: "Agreed Price", render: (j) => formatCents(j.agreedPrice) },
    { key: "totalDurationMinutes", label: "Duration", render: (j) => j.totalDurationMinutes ? `${j.totalDurationMinutes} min` : "\u2014" },
    { key: "createdAt", label: "Created", render: (j) => new Date(j.createdAt).toLocaleDateString() },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#003366]">Jobs</h1>
        <p className="mt-1 text-gray-500">Manage all active and completed tow jobs</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-1 rounded-lg bg-gray-100 p-1 w-fit overflow-x-auto">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => { setStatusFilter(tab.value); setPage(1); }}
            className={cn(
              "rounded-md px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap",
              statusFilter === tab.value
                ? "bg-white text-[#003366] shadow-sm"
                : "text-gray-500 hover:text-[#003366]"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={jobs}
        total={total}
        page={page}
        limit={20}
        onPageChange={setPage}
        onRowClick={(j) => router.push(`/admin/jobs/${j.id}`)}
        emptyMessage="No jobs found for this filter"
      />
    </div>
  );
}
