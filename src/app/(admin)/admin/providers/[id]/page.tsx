"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  User,
  Truck,
  MapPin,
  CreditCard,
  BarChart3,
  ShieldCheck,
  Star,
} from "lucide-react";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { formatCents } from "@/lib/fees";

interface ProviderDetail {
  id: number;
  email: string;
  name: string;
  phone: string;
  businessName: string | null;
  addressStreet: string | null;
  addressCity: string;
  addressState: string;
  addressZip: string | null;
  communityAreaIds: number[];
  maxDistance: number;
  vehicleType: string;
  maxWeight: number | null;
  truckMake: string | null;
  truckModel: string | null;
  truckYear: number | null;
  verificationStatus: string;
  reviewNotes: string | null;
  reviewedAt: string | null;
  stripeAccountId: string | null;
  stripeOnboardingStatus: string;
  instantPayoutsEnabled: boolean;
  jobsCompleted: number;
  totalEarnings: number;
  averageRating: number | null;
  responseRate: number | null;
  lastJobAt: string | null;
  isOnline: boolean;
  createdAt: string;
  updatedAt: string;
}

interface RecentJob extends Record<string, unknown> {
  id: number;
  jobNumber: string;
  status: string;
  agreedPrice: number;
  customerEmail: string;
  createdAt: string;
}

const equipmentLabels: Record<string, string> = {
  flatbed: "Flatbed",
  wheel_lift: "Wheel-Lift",
  dolly: "Dolly / Tow Dolly",
  integrated: "Integrated (Heavy Duty)",
};

const placeholderProvider: ProviderDetail = {
  id: 1,
  email: "tony@tonystowing.com",
  name: "Tony Morales",
  phone: "(312) 555-9876",
  businessName: "Tony's Towing",
  addressStreet: "4521 N Western Ave",
  addressCity: "Chicago",
  addressState: "IL",
  addressZip: "60625",
  communityAreaIds: [3, 4, 5, 6, 7, 14, 21, 22],
  maxDistance: 15,
  vehicleType: "flatbed",
  maxWeight: 10000,
  truckMake: "Ford",
  truckModel: "F-550",
  truckYear: 2021,
  verificationStatus: "approved",
  reviewNotes: "All documents verified. Insurance current through 2027.",
  reviewedAt: "2026-01-15T10:00:00Z",
  stripeAccountId: "acct_1Ow1234567890",
  stripeOnboardingStatus: "completed",
  instantPayoutsEnabled: true,
  jobsCompleted: 156,
  totalEarnings: 12450000,
  averageRating: 4.8,
  responseRate: 0.92,
  lastJobAt: "2026-02-24T10:00:00Z",
  isOnline: true,
  createdAt: "2025-11-01T08:00:00Z",
  updatedAt: "2026-02-24T12:00:00Z",
};

const placeholderRecentJobs: RecentJob[] = [
  { id: 10, jobNumber: "JOB-20260224-0004", status: "en_route", agreedPrice: 4500, customerEmail: "sarah@example.com", createdAt: "2026-02-24T12:10:00Z" },
  { id: 8, jobNumber: "JOB-20260223-0007", status: "completed", agreedPrice: 5500, customerEmail: "luis@example.com", createdAt: "2026-02-23T18:00:00Z" },
  { id: 6, jobNumber: "JOB-20260223-0005", status: "completed", agreedPrice: 4000, customerEmail: "kim@example.com", createdAt: "2026-02-23T11:00:00Z" },
  { id: 3, jobNumber: "JOB-20260222-0002", status: "completed", agreedPrice: 7500, customerEmail: "dave@example.com", createdAt: "2026-02-22T09:00:00Z" },
];

function InfoField({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <dt className="text-sm text-gray-500">{label}</dt>
      <dd className="mt-0.5 text-sm font-medium text-[#003366]">{value || "\u2014"}</dd>
    </div>
  );
}

export default function ProviderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [provider, setProvider] = useState<ProviderDetail>(placeholderProvider);
  const [recentJobs, setRecentJobs] = useState<RecentJob[]>(placeholderRecentJobs);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    async function fetchProvider() {
      try {
        const res = await fetch(`/api/providers/${params.id}`);
        if (res.ok) {
          const data = await res.json();
          if (data.success) setProvider(data.data as ProviderDetail);
        }
      } catch {
        // Keep placeholder
      }
    }

    if (params.id) fetchProvider();
  }, [params.id]);

  async function handleVerification(status: "approved" | "rejected") {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/providers/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ verificationStatus: status }),
      });

      if (res.ok) {
        setProvider((prev) => ({ ...prev, verificationStatus: status }));
      }
    } catch {
      // Ignore
    } finally {
      setActionLoading(false);
    }
  }

  const jobColumns: Column<RecentJob>[] = [
    { key: "jobNumber", label: "Job #", render: (j) => <span className="font-medium">{j.jobNumber}</span> },
    { key: "customerEmail", label: "Customer" },
    { key: "status", label: "Status", render: (j) => <StatusBadge status={j.status} /> },
    { key: "agreedPrice", label: "Price", render: (j) => formatCents(j.agreedPrice) },
    { key: "createdAt", label: "Date", render: (j) => new Date(j.createdAt).toLocaleDateString() },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.push("/admin/providers")}
          className="rounded-lg border border-gray-200 p-2 text-gray-500 hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-[#003366]">{provider.name}</h1>
            <StatusBadge status={provider.verificationStatus} />
            {provider.isOnline && (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-600">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Online
              </span>
            )}
          </div>
          <p className="mt-1 text-sm text-gray-500">
            {provider.businessName ?? "Independent Operator"} | Member since {new Date(provider.createdAt).toLocaleDateString()}
          </p>
        </div>
        {provider.verificationStatus === "pending" && (
          <div className="flex gap-2">
            <button
              onClick={() => handleVerification("approved")}
              disabled={actionLoading}
              className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-600 disabled:opacity-50 transition-colors"
            >
              Approve
            </button>
            <button
              onClick={() => handleVerification("rejected")}
              disabled={actionLoading}
              className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 disabled:opacity-50 transition-colors"
            >
              Reject
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Contact Info */}
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <div className="mb-4 flex items-center gap-2">
            <User className="h-5 w-5 text-[#FF6700]" />
            <h2 className="text-lg font-semibold text-[#003366]">Contact Info</h2>
          </div>
          <dl className="grid grid-cols-2 gap-4">
            <InfoField label="Name" value={provider.name} />
            <InfoField label="Email" value={provider.email} />
            <InfoField label="Phone" value={provider.phone} />
            <InfoField label="Business" value={provider.businessName} />
            <div className="col-span-2">
              <InfoField
                label="Address"
                value={
                  provider.addressStreet
                    ? `${provider.addressStreet}, ${provider.addressCity}, ${provider.addressState} ${provider.addressZip}`
                    : "\u2014"
                }
              />
            </div>
          </dl>
        </div>

        {/* Equipment */}
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <div className="mb-4 flex items-center gap-2">
            <Truck className="h-5 w-5 text-[#FF6700]" />
            <h2 className="text-lg font-semibold text-[#003366]">Equipment</h2>
          </div>
          <dl className="grid grid-cols-2 gap-4">
            <InfoField label="Vehicle Type" value={equipmentLabels[provider.vehicleType] ?? provider.vehicleType} />
            <InfoField label="Max Weight" value={provider.maxWeight ? `${provider.maxWeight.toLocaleString()} lbs` : "\u2014"} />
            <InfoField label="Truck" value={provider.truckMake ? `${provider.truckYear} ${provider.truckMake} ${provider.truckModel}` : "\u2014"} />
            <InfoField label="Max Distance" value={`${provider.maxDistance} mi`} />
          </dl>
        </div>

        {/* Service Areas */}
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <div className="mb-4 flex items-center gap-2">
            <MapPin className="h-5 w-5 text-[#FF6700]" />
            <h2 className="text-lg font-semibold text-[#003366]">Service Areas</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {provider.communityAreaIds.length > 0 ? (
              provider.communityAreaIds.map((areaId) => (
                <span
                  key={areaId}
                  className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-[#003366]"
                >
                  Area #{areaId}
                </span>
              ))
            ) : (
              <p className="text-sm text-gray-400">No service areas configured</p>
            )}
          </div>
        </div>

        {/* Verification */}
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <div className="mb-4 flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-[#FF6700]" />
            <h2 className="text-lg font-semibold text-[#003366]">Verification</h2>
          </div>
          <dl className="grid grid-cols-2 gap-4">
            <InfoField label="Status" value={<StatusBadge status={provider.verificationStatus} />} />
            <InfoField label="Reviewed At" value={provider.reviewedAt ? new Date(provider.reviewedAt).toLocaleDateString() : "\u2014"} />
            <div className="col-span-2">
              <InfoField label="Review Notes" value={provider.reviewNotes} />
            </div>
          </dl>
        </div>

        {/* Stripe */}
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <div className="mb-4 flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-[#FF6700]" />
            <h2 className="text-lg font-semibold text-[#003366]">Stripe Connect</h2>
          </div>
          <dl className="grid grid-cols-2 gap-4">
            <InfoField label="Account ID" value={provider.stripeAccountId ? <span className="font-mono text-xs">{provider.stripeAccountId}</span> : "Not connected"} />
            <InfoField label="Onboarding Status" value={<StatusBadge status={provider.stripeOnboardingStatus} />} />
            <InfoField label="Instant Payouts" value={provider.instantPayoutsEnabled ? "Enabled" : "Disabled"} />
          </dl>
        </div>

        {/* Stats */}
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <div className="mb-4 flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-[#FF6700]" />
            <h2 className="text-lg font-semibold text-[#003366]">Performance Stats</h2>
          </div>
          <dl className="grid grid-cols-2 gap-4">
            <InfoField label="Jobs Completed" value={provider.jobsCompleted.toString()} />
            <InfoField label="Total Earnings" value={formatCents(provider.totalEarnings)} />
            <InfoField
              label="Average Rating"
              value={
                provider.averageRating ? (
                  <span className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    {provider.averageRating.toFixed(1)} / 5
                  </span>
                ) : (
                  "\u2014"
                )
              }
            />
            <InfoField label="Response Rate" value={provider.responseRate ? `${(provider.responseRate * 100).toFixed(0)}%` : "\u2014"} />
            <InfoField label="Last Job" value={provider.lastJobAt ? new Date(provider.lastJobAt).toLocaleDateString() : "\u2014"} />
          </dl>
        </div>
      </div>

      {/* Recent Jobs */}
      <div>
        <h2 className="mb-4 text-lg font-semibold text-[#003366]">Recent Jobs</h2>
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
