"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Truck, User, DollarSign, Clock, Star, XCircle } from "lucide-react";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { formatCents } from "@/lib/fees";
import { jobStatusSteps } from "@/config/brand";

interface JobDetail {
  id: number;
  jobNumber: string;
  towRequestId: number;
  offerId: number;
  providerId: number;
  providerName?: string;
  customerEmail: string;
  customerName?: string;
  status: string;
  agreedPrice: number;
  platformFee: number;
  providerPayout: number;
  stripePaymentIntentId: string | null;
  paymentStatus: string;
  estimatedArrival: number | null;
  acceptedAt: string | null;
  enRouteAt: string | null;
  arrivedAt: string | null;
  loadedAt: string | null;
  departedAt: string | null;
  deliveredAt: string | null;
  completedAt: string | null;
  totalDurationMinutes: number | null;
  customerRating: number | null;
  customerComment: string | null;
  customerRatedAt: string | null;
  providerRating: number | null;
  providerComment: string | null;
  providerRatedAt: string | null;
  cancelledBy: string | null;
  cancellationReason: string | null;
  cancellationExplanation: string | null;
  cancelledAt: string | null;
  cancellationFee: number | null;
  createdAt: string;
  updatedAt: string;
}

const placeholderJob: JobDetail = {
  id: 1,
  jobNumber: "JOB-20260224-0004",
  towRequestId: 3,
  offerId: 1,
  providerId: 3,
  providerName: "Tony's Towing",
  customerEmail: "sarah@example.com",
  customerName: "Sarah Chen",
  status: "en_route",
  agreedPrice: 4500,
  platformFee: 450,
  providerPayout: 4050,
  stripePaymentIntentId: "pi_3Ow1234567890",
  paymentStatus: "authorized",
  estimatedArrival: 8,
  acceptedAt: "2026-02-24T12:10:00Z",
  enRouteAt: "2026-02-24T12:12:00Z",
  arrivedAt: null,
  loadedAt: null,
  departedAt: null,
  deliveredAt: null,
  completedAt: null,
  totalDurationMinutes: null,
  customerRating: null,
  customerComment: null,
  customerRatedAt: null,
  providerRating: null,
  providerComment: null,
  providerRatedAt: null,
  cancelledBy: null,
  cancellationReason: null,
  cancellationExplanation: null,
  cancelledAt: null,
  cancellationFee: null,
  createdAt: "2026-02-24T12:10:00Z",
  updatedAt: "2026-02-24T12:12:00Z",
};

function InfoField({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <dt className="text-sm text-gray-500">{label}</dt>
      <dd className="mt-0.5 text-sm font-medium text-[#003366]">{value || "\u2014"}</dd>
    </div>
  );
}

function RatingDisplay({ rating, comment, label, ratedAt }: { rating: number | null; comment: string | null; label: string; ratedAt: string | null }) {
  if (!rating) return <InfoField label={label} value="Not yet rated" />;
  return (
    <div>
      <dt className="text-sm text-gray-500">{label}</dt>
      <dd className="mt-0.5">
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`h-4 w-4 ${i < rating ? "fill-amber-400 text-amber-400" : "text-gray-200"}`}
            />
          ))}
          <span className="ml-1 text-sm font-medium text-[#003366]">{rating}/5</span>
        </div>
        {comment && <p className="mt-1 text-sm text-gray-600">{comment}</p>}
        {ratedAt && <p className="mt-0.5 text-xs text-gray-400">Rated {new Date(ratedAt).toLocaleString()}</p>}
      </dd>
    </div>
  );
}

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [job, setJob] = useState<JobDetail>(placeholderJob);

  useEffect(() => {
    async function fetchJob() {
      try {
        const res = await fetch(`/api/jobs/${params.id}`);
        if (res.ok) {
          const data = await res.json();
          if (data.success) setJob(data.data as JobDetail);
        }
      } catch {
        // Keep placeholder
      }
    }

    if (params.id) fetchJob();
  }, [params.id]);

  // Map timestamps for the status timeline
  const timestampMap: Record<string, string | null> = {
    accepted: job.acceptedAt,
    en_route: job.enRouteAt,
    at_pickup: job.arrivedAt,
    loading: job.loadedAt,
    transporting: job.departedAt,
    at_dropoff: job.deliveredAt,
    completed: job.completedAt,
  };

  const currentStepIndex = jobStatusSteps.findIndex((s) => s.id === job.status);
  const isCancelled = job.status === "cancelled" || job.status === "disputed";

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.push("/admin/jobs")}
          className="rounded-lg border border-gray-200 p-2 text-gray-500 hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-[#003366]">{job.jobNumber}</h1>
            <StatusBadge status={job.status} />
          </div>
          <p className="mt-1 text-sm text-gray-500">
            Created {new Date(job.createdAt).toLocaleString()}
          </p>
        </div>
        <button
          onClick={() => router.push(`/admin/requests/${job.towRequestId}`)}
          className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-[#003366] hover:bg-gray-50 transition-colors"
        >
          View Request
        </button>
      </div>

      {/* Status Timeline */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="mb-6 text-lg font-semibold text-[#003366]">Job Timeline</h2>
        <div className="relative">
          <div className="flex items-start justify-between">
            {jobStatusSteps.filter(s => s.id !== "pending").map((step, i) => {
              const stepIndex = jobStatusSteps.findIndex((s) => s.id === step.id);
              const isActive = step.id === job.status;
              const isPast = !isCancelled && currentStepIndex >= stepIndex;
              const ts = timestampMap[step.id];

              return (
                <div key={step.id} className="flex flex-col items-center text-center flex-1">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold ${
                      isActive
                        ? "bg-[#FF6700] text-white ring-4 ring-[#FF6700]/20"
                        : isPast
                        ? "bg-emerald-500 text-white"
                        : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    {i + 1}
                  </div>
                  <p className={`mt-2 text-xs font-medium ${isActive ? "text-[#FF6700]" : isPast ? "text-emerald-600" : "text-gray-400"}`}>
                    {step.label}
                  </p>
                  {ts && (
                    <p className="mt-0.5 text-[10px] text-gray-400">
                      {new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Provider Info */}
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <div className="mb-4 flex items-center gap-2">
            <Truck className="h-5 w-5 text-[#FF6700]" />
            <h2 className="text-lg font-semibold text-[#003366]">Provider</h2>
          </div>
          <dl className="grid grid-cols-2 gap-4">
            <InfoField label="Name" value={job.providerName ?? `Provider #${job.providerId}`} />
            <InfoField label="Provider ID" value={`#${job.providerId}`} />
            <InfoField label="ETA at Booking" value={job.estimatedArrival ? `${job.estimatedArrival} min` : "\u2014"} />
          </dl>
          <button
            onClick={() => router.push(`/admin/providers/${job.providerId}`)}
            className="mt-4 text-sm font-medium text-[#FF6700] hover:text-[#FF6700]/80 transition-colors"
          >
            View Provider Profile
          </button>
        </div>

        {/* Customer Info */}
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <div className="mb-4 flex items-center gap-2">
            <User className="h-5 w-5 text-[#FF6700]" />
            <h2 className="text-lg font-semibold text-[#003366]">Customer</h2>
          </div>
          <dl className="grid grid-cols-2 gap-4">
            <InfoField label="Name" value={job.customerName} />
            <InfoField label="Email" value={job.customerEmail} />
          </dl>
        </div>

        {/* Payment Details */}
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <div className="mb-4 flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-[#FF6700]" />
            <h2 className="text-lg font-semibold text-[#003366]">Payment</h2>
          </div>
          <dl className="grid grid-cols-2 gap-4">
            <InfoField label="Agreed Price" value={formatCents(job.agreedPrice)} />
            <InfoField label="Platform Fee" value={formatCents(job.platformFee)} />
            <InfoField label="Provider Payout" value={formatCents(job.providerPayout)} />
            <InfoField label="Payment Status" value={<StatusBadge status={job.paymentStatus} />} />
            <InfoField label="Stripe PI" value={job.stripePaymentIntentId ? <span className="font-mono text-xs">{job.stripePaymentIntentId}</span> : "\u2014"} />
          </dl>
        </div>

        {/* Duration & Timing */}
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <div className="mb-4 flex items-center gap-2">
            <Clock className="h-5 w-5 text-[#FF6700]" />
            <h2 className="text-lg font-semibold text-[#003366]">Timing</h2>
          </div>
          <dl className="grid grid-cols-2 gap-4">
            <InfoField label="Total Duration" value={job.totalDurationMinutes ? `${job.totalDurationMinutes} min` : "In progress"} />
            <InfoField label="Accepted At" value={job.acceptedAt ? new Date(job.acceptedAt).toLocaleString() : "\u2014"} />
            <InfoField label="Completed At" value={job.completedAt ? new Date(job.completedAt).toLocaleString() : "\u2014"} />
          </dl>
        </div>
      </div>

      {/* Ratings */}
      {(job.customerRating || job.providerRating) && (
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <div className="mb-4 flex items-center gap-2">
            <Star className="h-5 w-5 text-[#FF6700]" />
            <h2 className="text-lg font-semibold text-[#003366]">Ratings</h2>
          </div>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <RatingDisplay
              label="Customer Rating (of provider)"
              rating={job.customerRating}
              comment={job.customerComment}
              ratedAt={job.customerRatedAt}
            />
            <RatingDisplay
              label="Provider Rating (of customer)"
              rating={job.providerRating}
              comment={job.providerComment}
              ratedAt={job.providerRatedAt}
            />
          </div>
        </div>
      )}

      {/* Cancellation Info */}
      {isCancelled && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6">
          <div className="mb-4 flex items-center gap-2">
            <XCircle className="h-5 w-5 text-red-500" />
            <h2 className="text-lg font-semibold text-red-700">Cancellation Details</h2>
          </div>
          <dl className="grid grid-cols-2 gap-4">
            <InfoField label="Cancelled By" value={job.cancelledBy ? job.cancelledBy.charAt(0).toUpperCase() + job.cancelledBy.slice(1) : "\u2014"} />
            <InfoField label="Cancelled At" value={job.cancelledAt ? new Date(job.cancelledAt).toLocaleString() : "\u2014"} />
            <InfoField label="Reason" value={job.cancellationReason} />
            <InfoField label="Cancellation Fee" value={job.cancellationFee ? formatCents(job.cancellationFee) : "None"} />
            {job.cancellationExplanation && (
              <div className="col-span-2">
                <InfoField label="Explanation" value={job.cancellationExplanation} />
              </div>
            )}
          </dl>
        </div>
      )}
    </div>
  );
}
