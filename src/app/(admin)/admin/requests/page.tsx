"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { formatCents } from "@/lib/fees";

interface TowRequest extends Record<string, unknown> {
  id: number;
  requestNumber: string;
  customerName: string | null;
  customerEmail: string;
  pickupAddress: string;
  offeredPrice: number;
  status: string;
  offerCount: number;
  createdAt: string;
}

const STATUS_TABS = [
  { value: "", label: "All" },
  { value: "open", label: "Open" },
  { value: "pending", label: "Pending" },
  { value: "accepted", label: "Accepted" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

const placeholderData: TowRequest[] = [
  { id: 1, requestNumber: "TOW-20260224-0012", customerName: "Maria Santos", customerEmail: "maria@example.com", pickupAddress: "1200 N Lake Shore Dr, Chicago", offeredPrice: 5500, status: "open", offerCount: 3, createdAt: "2026-02-24T14:30:00Z" },
  { id: 2, requestNumber: "TOW-20260224-0011", customerName: "James Wilson", customerEmail: "james@example.com", pickupAddress: "3500 S Michigan Ave, Chicago", offeredPrice: 7000, status: "pending", offerCount: 1, createdAt: "2026-02-24T13:15:00Z" },
  { id: 3, requestNumber: "TOW-20260224-0010", customerName: "Sarah Chen", customerEmail: "sarah@example.com", pickupAddress: "800 W Fullerton Ave, Chicago", offeredPrice: 4500, status: "accepted", offerCount: 5, createdAt: "2026-02-24T12:00:00Z" },
  { id: 4, requestNumber: "TOW-20260224-0009", customerName: "Mike Johnson", customerEmail: "mike@example.com", pickupAddress: "5200 N Broadway, Chicago", offeredPrice: 6000, status: "completed", offerCount: 2, createdAt: "2026-02-24T10:45:00Z" },
  { id: 5, requestNumber: "TOW-20260224-0008", customerName: "Lisa Park", customerEmail: "lisa@example.com", pickupAddress: "2100 W Division St, Chicago", offeredPrice: 5000, status: "cancelled", offerCount: 0, createdAt: "2026-02-24T09:30:00Z" },
  { id: 6, requestNumber: "TOW-20260224-0007", customerName: "Carlos Reyes", customerEmail: "carlos@example.com", pickupAddress: "4400 S Halsted St, Chicago", offeredPrice: 4000, status: "open", offerCount: 1, createdAt: "2026-02-24T08:15:00Z" },
  { id: 7, requestNumber: "TOW-20260224-0006", customerName: "Angela Davis", customerEmail: "angela@example.com", pickupAddress: "6800 S Stony Island Ave, Chicago", offeredPrice: 8500, status: "open", offerCount: 0, createdAt: "2026-02-24T07:00:00Z" },
];

export default function RequestsListPage() {
  const router = useRouter();
  const [requests, setRequests] = useState<TowRequest[]>(placeholderData);
  const [total, setTotal] = useState(placeholderData.length);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: page.toString(), limit: "20" });
      if (statusFilter) params.set("status", statusFilter);

      const res = await fetch(`/api/tow-requests?${params}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setRequests(data.data as TowRequest[]);
          setTotal(data.pagination?.totalDocs ?? data.data.length);
        }
      }
    } catch {
      // Keep placeholder data on error
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const columns: Column<TowRequest>[] = [
    { key: "requestNumber", label: "Request #", render: (r) => <span className="font-medium">{r.requestNumber}</span> },
    { key: "customerName", label: "Customer", render: (r) => r.customerName ?? r.customerEmail },
    { key: "pickupAddress", label: "Pickup", render: (r) => <span className="max-w-[220px] truncate block">{r.pickupAddress}</span> },
    { key: "offeredPrice", label: "Offered Price", render: (r) => formatCents(r.offeredPrice) },
    { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
    { key: "offerCount", label: "Offers", render: (r) => <span className="text-center block">{r.offerCount}</span> },
    { key: "createdAt", label: "Created", render: (r) => new Date(r.createdAt).toLocaleDateString() },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#003366]">Tow Requests</h1>
        <p className="mt-1 text-gray-500">Manage all customer tow requests</p>
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
        data={requests}
        total={total}
        page={page}
        limit={20}
        onPageChange={setPage}
        onRowClick={(r) => router.push(`/admin/requests/${r.id}`)}
        emptyMessage="No requests found for this filter"
      />
    </div>
  );
}
