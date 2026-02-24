"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, MapPin, Car, DollarSign, Clock, User } from "lucide-react";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { formatCents } from "@/lib/fees";

interface TowRequestDetail {
  id: number;
  requestNumber: string;
  customerEmail: string;
  customerName: string | null;
  customerPhone: string | null;
  pickupAddress: string;
  pickupCity: string;
  pickupState: string;
  pickupZip: string;
  pickupNotes: string | null;
  dropoffAddress: string;
  dropoffCity: string;
  dropoffState: string;
  dropoffZip: string;
  dropoffNotes: string | null;
  distanceMiles: number | null;
  estimatedDuration: number | null;
  vehicleMake: string;
  vehicleModel: string;
  vehicleYear: number | null;
  vehicleColor: string | null;
  vehicleCondition: string;
  vehicleNotes: string | null;
  offeredPrice: number;
  agreedPrice: number | null;
  platformFee: number | null;
  providerPayout: number | null;
  urgency: string;
  status: string;
  offerCount: number;
  jobId: number | null;
  expiresAt: string;
  acceptedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

interface Offer extends Record<string, unknown> {
  id: number;
  offerNumber: string;
  providerId: number;
  providerName?: string;
  offerType: string;
  offerPrice: number;
  estimatedArrival: number;
  message: string | null;
  status: string;
  createdAt: string;
}

const placeholderRequest: TowRequestDetail = {
  id: 1,
  requestNumber: "TOW-20260224-0012",
  customerEmail: "maria@example.com",
  customerName: "Maria Santos",
  customerPhone: "(312) 555-1234",
  pickupAddress: "1200 N Lake Shore Dr",
  pickupCity: "Chicago",
  pickupState: "IL",
  pickupZip: "60610",
  pickupNotes: "Near the entrance to the parking garage",
  dropoffAddress: "3400 N Western Ave",
  dropoffCity: "Chicago",
  dropoffState: "IL",
  dropoffZip: "60618",
  dropoffNotes: null,
  distanceMiles: 5.2,
  estimatedDuration: 18,
  vehicleMake: "Toyota",
  vehicleModel: "Camry",
  vehicleYear: 2019,
  vehicleColor: "Silver",
  vehicleCondition: "runs_no_drive",
  vehicleNotes: "Flat front left tire, cannot drive",
  offeredPrice: 5500,
  agreedPrice: null,
  platformFee: null,
  providerPayout: null,
  urgency: "asap",
  status: "open",
  offerCount: 3,
  jobId: null,
  expiresAt: "2026-02-24T16:30:00Z",
  acceptedAt: null,
  createdAt: "2026-02-24T14:30:00Z",
  updatedAt: "2026-02-24T14:30:00Z",
};

const placeholderOffers: Offer[] = [
  { id: 1, offerNumber: "OFF-20260224-0001", providerId: 3, providerName: "Tony's Towing", offerType: "accept", offerPrice: 5500, estimatedArrival: 12, message: "I can be there in 12 minutes.", status: "pending", createdAt: "2026-02-24T14:35:00Z" },
  { id: 2, offerNumber: "OFF-20260224-0002", providerId: 7, providerName: "Quick Haul LLC", offerType: "counter", offerPrice: 6500, estimatedArrival: 8, message: "Slightly higher but I'm very close and available now.", status: "pending", createdAt: "2026-02-24T14:38:00Z" },
  { id: 3, offerNumber: "OFF-20260224-0003", providerId: 12, providerName: "Midwest Tow Co", offerType: "accept", offerPrice: 5500, estimatedArrival: 20, message: null, status: "pending", createdAt: "2026-02-24T14:42:00Z" },
];

function InfoField({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <dt className="text-sm text-gray-500">{label}</dt>
      <dd className="mt-0.5 text-sm font-medium text-[#003366]">{value || "\u2014"}</dd>
    </div>
  );
}

export default function RequestDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [request, setRequest] = useState<TowRequestDetail>(placeholderRequest);
  const [offers, setOffers] = useState<Offer[]>(placeholderOffers);

  useEffect(() => {
    async function fetchDetail() {
      try {
        const [reqRes, offersRes] = await Promise.all([
          fetch(`/api/tow-requests/${params.id}`),
          fetch(`/api/tow-requests/${params.id}/offers`),
        ]);

        if (reqRes.ok) {
          const data = await reqRes.json();
          if (data.success) setRequest(data.data as TowRequestDetail);
        }

        if (offersRes.ok) {
          const data = await offersRes.json();
          if (data.success) setOffers(data.data as Offer[]);
        }
      } catch {
        // Keep placeholder
      }
    }

    if (params.id) fetchDetail();
  }, [params.id]);

  const conditionLabels: Record<string, string> = {
    runs: "Runs & Drives",
    runs_no_drive: "Runs, Doesn't Drive",
    no_run: "Doesn't Run",
    damaged: "Accident/Damaged",
  };

  const offerColumns: Column<Offer>[] = [
    { key: "offerNumber", label: "Offer #", render: (o) => <span className="font-medium">{o.offerNumber}</span> },
    { key: "providerName", label: "Provider", render: (o) => o.providerName ?? `Provider #${o.providerId}` },
    { key: "offerType", label: "Type", render: (o) => <StatusBadge status={o.offerType === "accept" ? "accepted" : "pending"} className="capitalize" /> },
    { key: "offerPrice", label: "Price", render: (o) => formatCents(o.offerPrice) },
    { key: "estimatedArrival", label: "ETA", render: (o) => `${o.estimatedArrival} min` },
    { key: "status", label: "Status", render: (o) => <StatusBadge status={o.status} /> },
    { key: "createdAt", label: "Sent", render: (o) => new Date(o.createdAt).toLocaleTimeString() },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.push("/admin/requests")}
          className="rounded-lg border border-gray-200 p-2 text-gray-500 hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-[#003366]">{request.requestNumber}</h1>
            <StatusBadge status={request.status} />
          </div>
          <p className="mt-1 text-sm text-gray-500">
            Created {new Date(request.createdAt).toLocaleString()} | Expires {new Date(request.expiresAt).toLocaleString()}
          </p>
        </div>
        {request.jobId && (
          <button
            onClick={() => router.push(`/admin/jobs/${request.jobId}`)}
            className="rounded-lg bg-[#FF6700] px-4 py-2 text-sm font-medium text-white hover:bg-[#FF6700]/90 transition-colors"
          >
            View Job
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Customer Info */}
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <div className="mb-4 flex items-center gap-2">
            <User className="h-5 w-5 text-[#FF6700]" />
            <h2 className="text-lg font-semibold text-[#003366]">Customer</h2>
          </div>
          <dl className="grid grid-cols-2 gap-4">
            <InfoField label="Name" value={request.customerName} />
            <InfoField label="Email" value={request.customerEmail} />
            <InfoField label="Phone" value={request.customerPhone} />
            <InfoField label="Urgency" value={<StatusBadge status={request.urgency} />} />
          </dl>
        </div>

        {/* Vehicle Info */}
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <div className="mb-4 flex items-center gap-2">
            <Car className="h-5 w-5 text-[#FF6700]" />
            <h2 className="text-lg font-semibold text-[#003366]">Vehicle</h2>
          </div>
          <dl className="grid grid-cols-2 gap-4">
            <InfoField label="Make" value={request.vehicleMake} />
            <InfoField label="Model" value={request.vehicleModel} />
            <InfoField label="Year" value={request.vehicleYear} />
            <InfoField label="Color" value={request.vehicleColor} />
            <InfoField label="Condition" value={conditionLabels[request.vehicleCondition] ?? request.vehicleCondition} />
            <InfoField label="Notes" value={request.vehicleNotes} />
          </dl>
        </div>

        {/* Pickup Info */}
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <div className="mb-4 flex items-center gap-2">
            <MapPin className="h-5 w-5 text-emerald-500" />
            <h2 className="text-lg font-semibold text-[#003366]">Pickup</h2>
          </div>
          <dl className="grid grid-cols-1 gap-4">
            <InfoField label="Address" value={`${request.pickupAddress}, ${request.pickupCity}, ${request.pickupState} ${request.pickupZip}`} />
            <InfoField label="Notes" value={request.pickupNotes} />
          </dl>
        </div>

        {/* Dropoff Info */}
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <div className="mb-4 flex items-center gap-2">
            <MapPin className="h-5 w-5 text-blue-500" />
            <h2 className="text-lg font-semibold text-[#003366]">Dropoff</h2>
          </div>
          <dl className="grid grid-cols-1 gap-4">
            <InfoField label="Address" value={`${request.dropoffAddress}, ${request.dropoffCity}, ${request.dropoffState} ${request.dropoffZip}`} />
            <InfoField label="Notes" value={request.dropoffNotes} />
          </dl>
        </div>

        {/* Pricing */}
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <div className="mb-4 flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-[#FF6700]" />
            <h2 className="text-lg font-semibold text-[#003366]">Pricing</h2>
          </div>
          <dl className="grid grid-cols-2 gap-4">
            <InfoField label="Offered Price" value={formatCents(request.offeredPrice)} />
            <InfoField label="Agreed Price" value={request.agreedPrice ? formatCents(request.agreedPrice) : "Not yet"} />
            <InfoField label="Platform Fee" value={request.platformFee ? formatCents(request.platformFee) : "\u2014"} />
            <InfoField label="Provider Payout" value={request.providerPayout ? formatCents(request.providerPayout) : "\u2014"} />
          </dl>
        </div>

        {/* Distance & Timing */}
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <div className="mb-4 flex items-center gap-2">
            <Clock className="h-5 w-5 text-[#FF6700]" />
            <h2 className="text-lg font-semibold text-[#003366]">Distance & Timing</h2>
          </div>
          <dl className="grid grid-cols-2 gap-4">
            <InfoField label="Distance" value={request.distanceMiles ? `${request.distanceMiles.toFixed(1)} mi` : "\u2014"} />
            <InfoField label="Est. Duration" value={request.estimatedDuration ? `${request.estimatedDuration} min` : "\u2014"} />
            <InfoField label="Accepted At" value={request.acceptedAt ? new Date(request.acceptedAt).toLocaleString() : "\u2014"} />
            <InfoField label="Offer Count" value={request.offerCount} />
          </dl>
        </div>
      </div>

      {/* Status Timeline */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold text-[#003366]">Status Timeline</h2>
        <div className="flex items-center gap-2 text-sm">
          {["open", "pending", "accepted", "job_created", "completed"].map((step, i) => {
            const isCurrent = request.status === step;
            const isPast =
              ["open", "pending", "accepted", "job_created", "completed"].indexOf(request.status) > i;
            const isCancelled = request.status === "cancelled" || request.status === "expired";

            return (
              <div key={step} className="flex items-center gap-2">
                {i > 0 && <div className={`h-0.5 w-8 ${isPast ? "bg-emerald-500" : "bg-gray-200"}`} />}
                <div
                  className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
                    isCurrent
                      ? "bg-[#FF6700]/10 text-[#FF6700] ring-2 ring-[#FF6700]/20"
                      : isPast
                      ? "bg-emerald-50 text-emerald-600"
                      : isCancelled && step === request.status
                      ? "bg-red-50 text-red-600"
                      : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {step.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Offers Table */}
      <div>
        <h2 className="mb-4 text-lg font-semibold text-[#003366]">
          Offers Received ({offers.length})
        </h2>
        <DataTable
          columns={offerColumns}
          data={offers}
          emptyMessage="No offers received yet"
        />
      </div>
    </div>
  );
}
