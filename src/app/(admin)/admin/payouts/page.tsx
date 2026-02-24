"use client";

import { useEffect, useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { formatCents } from "@/lib/fees";

interface Payout extends Record<string, unknown> {
  id: number;
  jobId: number;
  jobNumber?: string;
  providerId: number;
  providerName?: string;
  amount: number;
  platformFee: number;
  status: string;
  method: string;
  completedAt: string | null;
  createdAt: string;
}

const STATUS_TABS = [
  { value: "", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "processing", label: "Processing" },
  { value: "completed", label: "Completed" },
  { value: "failed", label: "Failed" },
];

const placeholderData: Payout[] = [
  { id: 1, jobId: 3, jobNumber: "JOB-20260224-0002", providerId: 12, providerName: "Midwest Tow Co", amount: 5400, platformFee: 600, status: "completed", method: "standard", completedAt: "2026-02-24T10:00:00Z", createdAt: "2026-02-24T08:30:00Z" },
  { id: 2, jobId: 4, jobNumber: "JOB-20260224-0001", providerId: 5, providerName: "Chi-Town Tow", amount: 7650, platformFee: 500, status: "completed", method: "instant", completedAt: "2026-02-24T00:30:00Z", createdAt: "2026-02-24T00:00:00Z" },
  { id: 3, jobId: 1, jobNumber: "JOB-20260224-0004", providerId: 3, providerName: "Tony's Towing", amount: 4050, platformFee: 450, status: "pending", method: "standard", completedAt: null, createdAt: "2026-02-24T12:15:00Z" },
  { id: 4, jobId: 2, jobNumber: "JOB-20260224-0003", providerId: 7, providerName: "Quick Haul LLC", amount: 6300, platformFee: 500, status: "processing", method: "standard", completedAt: null, createdAt: "2026-02-24T11:45:00Z" },
  { id: 5, jobId: 8, jobNumber: "JOB-20260223-0007", providerId: 3, providerName: "Tony's Towing", amount: 4950, platformFee: 500, status: "completed", method: "instant", completedAt: "2026-02-23T19:00:00Z", createdAt: "2026-02-23T18:30:00Z" },
];

export default function PayoutsPage() {
  const [payouts, setPayouts] = useState<Payout[]>(placeholderData);
  const [total, setTotal] = useState(placeholderData.length);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");

  const fetchPayouts = useCallback(async () => {
    try {
      const params = new URLSearchParams({ page: page.toString(), limit: "20" });
      if (statusFilter) params.set("status", statusFilter);

      const res = await fetch(`/api/payouts?${params}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setPayouts(data.data as Payout[]);
          setTotal(data.pagination?.totalDocs ?? data.data.length);
        }
      }
    } catch {
      // Keep placeholder
    }
  }, [page, statusFilter]);

  useEffect(() => {
    fetchPayouts();
  }, [fetchPayouts]);

  // Summary totals
  const totalPaidOut = payouts
    .filter((p) => p.status === "completed")
    .reduce((sum, p) => sum + p.amount, 0);
  const totalFees = payouts
    .filter((p) => p.status === "completed")
    .reduce((sum, p) => sum + p.platformFee, 0);

  const columns: Column<Payout>[] = [
    { key: "jobNumber", label: "Job #", render: (p) => <span className="font-medium">{p.jobNumber ?? `Job #${p.jobId}`}</span> },
    { key: "providerName", label: "Provider", render: (p) => p.providerName ?? `Provider #${p.providerId}` },
    { key: "amount", label: "Provider Amount", render: (p) => formatCents(p.amount) },
    { key: "platformFee", label: "Platform Fee", render: (p) => formatCents(p.platformFee) },
    { key: "status", label: "Status", render: (p) => <StatusBadge status={p.status} /> },
    {
      key: "method",
      label: "Method",
      render: (p) => (
        <span className={cn(
          "rounded-full px-2 py-0.5 text-xs font-medium",
          p.method === "instant" ? "bg-sky-50 text-sky-600" : "bg-gray-100 text-gray-600"
        )}>
          {p.method === "instant" ? "Instant" : "Standard"}
        </span>
      ),
    },
    { key: "createdAt", label: "Date", render: (p) => new Date(p.createdAt).toLocaleDateString() },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#003366]">Payouts</h1>
        <p className="mt-1 text-gray-500">Track provider payments and platform fees</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <p className="text-sm text-gray-500">Total Paid Out</p>
          <p className="mt-1 text-xl font-bold text-[#003366]">{formatCents(totalPaidOut)}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <p className="text-sm text-gray-500">Platform Fees Earned</p>
          <p className="mt-1 text-xl font-bold text-[#FF6700]">{formatCents(totalFees)}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <p className="text-sm text-gray-500">Pending Payouts</p>
          <p className="mt-1 text-xl font-bold text-amber-600">
            {payouts.filter((p) => p.status === "pending" || p.status === "processing").length}
          </p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <p className="text-sm text-gray-500">Total Payouts</p>
          <p className="mt-1 text-xl font-bold text-[#003366]">{total}</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-1 rounded-lg bg-gray-100 p-1 w-fit">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => { setStatusFilter(tab.value); setPage(1); }}
            className={cn(
              "rounded-md px-4 py-2 text-sm font-medium transition-colors",
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
        data={payouts}
        total={total}
        page={page}
        limit={20}
        onPageChange={setPage}
        emptyMessage="No payouts found"
      />
    </div>
  );
}
