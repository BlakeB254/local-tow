"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ClipboardList,
  Truck,
  Users,
  DollarSign,
  Star,
  ShieldCheck,
} from "lucide-react";
import { StatsCard } from "@/components/admin/StatsCard";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { formatCents } from "@/lib/fees";

interface DashboardStats {
  activeRequests: number;
  jobsInProgress: number;
  verifiedProviders: number;
  revenueThisMonth: number;
  avgRating: number;
  pendingVerifications: number;
}

interface RequestRow extends Record<string, unknown> {
  id: number;
  requestNumber: string;
  customerName: string | null;
  pickupAddress: string;
  offeredPrice: number;
  status: string;
  createdAt: string;
}

interface JobRow extends Record<string, unknown> {
  id: number;
  jobNumber: string;
  providerName: string;
  customerEmail: string;
  status: string;
  agreedPrice: number;
  createdAt: string;
}

// Placeholder data used when API is not yet wired
const placeholderStats: DashboardStats = {
  activeRequests: 24,
  jobsInProgress: 8,
  verifiedProviders: 42,
  revenueThisMonth: 128500,
  avgRating: 4.7,
  pendingVerifications: 5,
};

const placeholderRequests: RequestRow[] = [
  { id: 1, requestNumber: "TOW-20260224-0012", customerName: "Maria Santos", pickupAddress: "1200 N Lake Shore Dr", offeredPrice: 5500, status: "open", createdAt: "2026-02-24T14:30:00Z" },
  { id: 2, requestNumber: "TOW-20260224-0011", customerName: "James Wilson", pickupAddress: "3500 S Michigan Ave", offeredPrice: 7000, status: "pending", createdAt: "2026-02-24T13:15:00Z" },
  { id: 3, requestNumber: "TOW-20260224-0010", customerName: "Sarah Chen", pickupAddress: "800 W Fullerton Ave", offeredPrice: 4500, status: "accepted", createdAt: "2026-02-24T12:00:00Z" },
  { id: 4, requestNumber: "TOW-20260224-0009", customerName: "Mike Johnson", pickupAddress: "5200 N Broadway", offeredPrice: 6000, status: "completed", createdAt: "2026-02-24T10:45:00Z" },
  { id: 5, requestNumber: "TOW-20260224-0008", customerName: "Lisa Park", pickupAddress: "2100 W Division St", offeredPrice: 5000, status: "cancelled", createdAt: "2026-02-24T09:30:00Z" },
];

const placeholderJobs: JobRow[] = [
  { id: 1, jobNumber: "JOB-20260224-0004", providerName: "Tony's Towing", customerEmail: "sarah@example.com", status: "en_route", agreedPrice: 4500, createdAt: "2026-02-24T12:10:00Z" },
  { id: 2, jobNumber: "JOB-20260224-0003", providerName: "Quick Haul LLC", customerEmail: "james@example.com", status: "transporting", agreedPrice: 7000, createdAt: "2026-02-24T11:30:00Z" },
  { id: 3, jobNumber: "JOB-20260224-0002", providerName: "Midwest Tow Co", customerEmail: "mike@example.com", status: "completed", agreedPrice: 6000, createdAt: "2026-02-24T08:00:00Z" },
];

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats>(placeholderStats);
  const [recentRequests, setRecentRequests] = useState<RequestRow[]>(placeholderRequests);
  const [recentJobs, setRecentJobs] = useState<JobRow[]>(placeholderJobs);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const [reqRes, jobsRes] = await Promise.all([
          fetch("/api/tow-requests?limit=5"),
          fetch("/api/jobs?limit=5"),
        ]);

        if (reqRes.ok) {
          const reqData = await reqRes.json();
          if (reqData.success && reqData.data?.length > 0) {
            setRecentRequests(
              reqData.data.map((r: Record<string, unknown>) => ({
                ...r,
                customerName: r.customerName ?? r.customerEmail,
              })) as RequestRow[]
            );
          }
        }

        if (jobsRes.ok) {
          const jobsData = await jobsRes.json();
          if (jobsData.success && jobsData.data?.length > 0) {
            setRecentJobs(jobsData.data as JobRow[]);
          }
        }
      } catch {
        // Fall back to placeholder data
      } finally {
        setLoading(false);
      }
    }

    fetchDashboard();
  }, []);

  const requestColumns: Column<RequestRow>[] = [
    { key: "requestNumber", label: "Request #" },
    { key: "customerName", label: "Customer", render: (r) => r.customerName ?? "\u2014" },
    { key: "pickupAddress", label: "Pickup", render: (r) => <span className="max-w-[200px] truncate block">{r.pickupAddress}</span> },
    { key: "offeredPrice", label: "Price", render: (r) => formatCents(r.offeredPrice) },
    { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
    { key: "createdAt", label: "Created", render: (r) => new Date(r.createdAt).toLocaleDateString() },
  ];

  const jobColumns: Column<JobRow>[] = [
    { key: "jobNumber", label: "Job #" },
    { key: "providerName", label: "Provider", render: (j) => j.providerName || "\u2014" },
    { key: "status", label: "Status", render: (j) => <StatusBadge status={j.status} /> },
    { key: "agreedPrice", label: "Price", render: (j) => formatCents(j.agreedPrice) },
    { key: "createdAt", label: "Created", render: (j) => new Date(j.createdAt).toLocaleDateString() },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#003366]">Dashboard</h1>
        <p className="mt-1 text-gray-500">Overview of your towing marketplace</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <StatsCard
          icon={ClipboardList}
          label="Active Requests"
          value={stats.activeRequests.toString()}
          trend={{ value: "+12%", direction: "up" }}
        />
        <StatsCard
          icon={Truck}
          label="Jobs In Progress"
          value={stats.jobsInProgress.toString()}
          trend={{ value: "+5%", direction: "up" }}
        />
        <StatsCard
          icon={Users}
          label="Verified Providers"
          value={stats.verifiedProviders.toString()}
          trend={{ value: "+3", direction: "up" }}
        />
        <StatsCard
          icon={DollarSign}
          label="Revenue This Month"
          value={formatCents(stats.revenueThisMonth)}
          trend={{ value: "+18%", direction: "up" }}
        />
        <StatsCard
          icon={Star}
          label="Avg Rating"
          value={stats.avgRating.toFixed(1)}
          trend={{ value: "+0.2", direction: "up" }}
        />
        <StatsCard
          icon={ShieldCheck}
          label="Pending Verifications"
          value={stats.pendingVerifications.toString()}
          trend={{ value: "-2", direction: "down" }}
        />
      </div>

      {/* Recent Requests */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[#003366]">Recent Requests</h2>
          <button
            onClick={() => router.push("/admin/requests")}
            className="text-sm font-medium text-[#FF6700] hover:text-[#FF6700]/80 transition-colors"
          >
            View All
          </button>
        </div>
        <DataTable
          columns={requestColumns}
          data={recentRequests}
          onRowClick={(r) => router.push(`/admin/requests/${r.id}`)}
          emptyMessage="No requests yet"
        />
      </div>

      {/* Recent Jobs */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[#003366]">Recent Jobs</h2>
          <button
            onClick={() => router.push("/admin/jobs")}
            className="text-sm font-medium text-[#FF6700] hover:text-[#FF6700]/80 transition-colors"
          >
            View All
          </button>
        </div>
        <DataTable
          columns={jobColumns}
          data={recentJobs}
          onRowClick={(j) => router.push(`/admin/jobs/${j.id}`)}
          emptyMessage="No jobs yet"
        />
      </div>
    </div>
  );
}
