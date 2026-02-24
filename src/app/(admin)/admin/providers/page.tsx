"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { formatCents } from "@/lib/fees";

interface Provider extends Record<string, unknown> {
  id: number;
  name: string;
  businessName: string | null;
  vehicleType: string;
  verificationStatus: string;
  averageRating: number | null;
  jobsCompleted: number;
  totalEarnings: number;
}

const STATUS_TABS = [
  { value: "", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
];

const equipmentLabels: Record<string, string> = {
  flatbed: "Flatbed",
  wheel_lift: "Wheel-Lift",
  dolly: "Dolly",
  integrated: "Integrated (HD)",
};

const placeholderData: Provider[] = [
  { id: 1, name: "Tony Morales", businessName: "Tony's Towing", vehicleType: "flatbed", verificationStatus: "approved", averageRating: 4.8, jobsCompleted: 156, totalEarnings: 12450000 },
  { id: 2, name: "Darnell Jackson", businessName: "Quick Haul LLC", vehicleType: "wheel_lift", verificationStatus: "approved", averageRating: 4.6, jobsCompleted: 89, totalEarnings: 7120000 },
  { id: 3, name: "Maria Gonzalez", businessName: "Midwest Tow Co", vehicleType: "flatbed", verificationStatus: "approved", averageRating: 4.9, jobsCompleted: 201, totalEarnings: 16080000 },
  { id: 4, name: "Kevin O'Brien", businessName: "Chi-Town Tow", vehicleType: "integrated", verificationStatus: "approved", averageRating: 4.3, jobsCompleted: 45, totalEarnings: 3600000 },
  { id: 5, name: "Rashid Ahmed", businessName: null, vehicleType: "dolly", verificationStatus: "pending", averageRating: null, jobsCompleted: 0, totalEarnings: 0 },
  { id: 6, name: "Jennifer Wu", businessName: "JW Towing Services", vehicleType: "flatbed", verificationStatus: "pending", averageRating: null, jobsCompleted: 0, totalEarnings: 0 },
  { id: 7, name: "Andre Thompson", businessName: null, vehicleType: "wheel_lift", verificationStatus: "rejected", averageRating: null, jobsCompleted: 0, totalEarnings: 0 },
];

export default function ProvidersListPage() {
  const router = useRouter();
  const [providers, setProviders] = useState<Provider[]>(placeholderData);
  const [total, setTotal] = useState(placeholderData.length);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  const fetchProviders = useCallback(async () => {
    try {
      const params = new URLSearchParams({ page: page.toString(), limit: "20" });
      if (statusFilter) params.set("verification_status", statusFilter);

      const res = await fetch(`/api/providers?${params}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setProviders(data.data as Provider[]);
          setTotal(data.pagination?.totalDocs ?? data.data.length);
        }
      }
    } catch {
      // Keep placeholder
    }
  }, [page, statusFilter]);

  useEffect(() => {
    fetchProviders();
  }, [fetchProviders]);

  async function handleAction(providerId: number, action: "approved" | "rejected") {
    setActionLoading(providerId);
    try {
      const res = await fetch(`/api/providers/${providerId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ verificationStatus: action }),
      });

      if (res.ok) {
        // Optimistic update
        setProviders((prev) =>
          prev.map((p) =>
            p.id === providerId ? { ...p, verificationStatus: action } : p
          )
        );
      }
    } catch {
      // Ignore
    } finally {
      setActionLoading(null);
    }
  }

  const columns: Column<Provider>[] = [
    { key: "name", label: "Name", render: (p) => <span className="font-medium">{p.name}</span> },
    { key: "businessName", label: "Business", render: (p) => p.businessName ?? "\u2014" },
    { key: "vehicleType", label: "Equipment", render: (p) => equipmentLabels[p.vehicleType] ?? p.vehicleType },
    { key: "verificationStatus", label: "Verification", render: (p) => <StatusBadge status={p.verificationStatus} /> },
    { key: "averageRating", label: "Rating", render: (p) => p.averageRating ? `${p.averageRating.toFixed(1)} / 5` : "\u2014" },
    { key: "jobsCompleted", label: "Jobs", render: (p) => p.jobsCompleted.toString() },
    { key: "totalEarnings", label: "Earnings", render: (p) => formatCents(p.totalEarnings) },
    {
      key: "actions",
      label: "Actions",
      render: (p) => {
        if (p.verificationStatus !== "pending") return null;
        const isLoading = actionLoading === p.id;
        return (
          <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => handleAction(p.id, "approved")}
              disabled={isLoading}
              className="rounded-md bg-emerald-500 px-3 py-1 text-xs font-medium text-white hover:bg-emerald-600 disabled:opacity-50 transition-colors"
            >
              Approve
            </button>
            <button
              onClick={() => handleAction(p.id, "rejected")}
              disabled={isLoading}
              className="rounded-md bg-red-500 px-3 py-1 text-xs font-medium text-white hover:bg-red-600 disabled:opacity-50 transition-colors"
            >
              Reject
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#003366]">Providers</h1>
        <p className="mt-1 text-gray-500">Manage tow operator accounts and verifications</p>
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
        data={providers}
        total={total}
        page={page}
        limit={20}
        onPageChange={setPage}
        onRowClick={(p) => router.push(`/admin/providers/${p.id}`)}
        emptyMessage="No providers found for this filter"
      />
    </div>
  );
}
