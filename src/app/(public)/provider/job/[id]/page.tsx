"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  MapPin,
  Car,
  Phone,
  MessageSquare,
  Camera,
  Navigation,
  CheckCircle,
  ArrowRight,
  Upload,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { StatusTimeline } from "@/components/marketplace/StatusTimeline";
import { PriceTag } from "@/components/marketplace/PriceTag";
import { SectionWrapper } from "@/components/layout/SectionWrapper";
import { jobStatusSteps } from "@/config/brand";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// Placeholder job data
const mockJob = {
  id: "job-101",
  status: "en_route",
  pickupAddress: "1600 W North Ave, Chicago, IL 60622",
  dropoffAddress: "2500 N Clybourn Ave, Chicago, IL 60614",
  priceInCents: 5000,
  vehicleInfo: "2021 Hyundai Elantra",
  vehicleCondition: "Runs & Drives",
  customer: {
    name: "Jordan M.",
    phone: "(312) 555-0198",
  },
  notes: "Silver car parked on the street, hazards on.",
};

const statusActions: Record<string, { nextStatus: string; label: string }> = {
  accepted: { nextStatus: "en_route", label: "Start Driving" },
  en_route: { nextStatus: "at_pickup", label: "Arrived at Pickup" },
  at_pickup: { nextStatus: "loading", label: "Start Loading" },
  loading: { nextStatus: "transporting", label: "Start Transport" },
  transporting: { nextStatus: "at_dropoff", label: "Arrived at Dropoff" },
  at_dropoff: { nextStatus: "completed", label: "Complete Job" },
};

export default function ProviderJobPage() {
  const params = useParams();
  const jobId = params.id as string;
  const [currentStatus, setCurrentStatus] = useState(mockJob.status);

  const nextAction = statusActions[currentStatus];

  function advanceStatus() {
    if (!nextAction) return;

    // POST to API to update status
    fetch(`/api/jobs/${jobId}/status`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: nextAction.nextStatus }),
    }).catch(() => {
      // API not connected yet, update locally
    });

    setCurrentStatus(nextAction.nextStatus);
    const stepLabel = jobStatusSteps.find((s) => s.id === nextAction.nextStatus)?.label;
    toast.success(`Status updated: ${stepLabel}`);
  }

  return (
    <SectionWrapper>
      <div className="max-w-3xl mx-auto">
        {/* Back link */}
        <Link
          href="/provider"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft size={14} />
          Back to Dashboard
        </Link>

        {/* Job header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="font-display text-2xl font-bold text-gray-900">
              Active Job #{jobId}
            </h1>
            <Badge className="mt-1 bg-blue-100 text-blue-800 text-xs">
              {jobStatusSteps.find((s) => s.id === currentStatus)?.label || currentStatus}
            </Badge>
          </div>
          <PriceTag priceInCents={mockJob.priceInCents} size="lg" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column: Map + Route + Controls */}
          <div className="lg:col-span-2 space-y-6">
            {/* GPS tracking placeholder */}
            <Card>
              <CardContent className="p-0">
                <div className="relative h-56 sm:h-72 bg-gray-100 rounded-xl flex items-center justify-center">
                  <div className="text-center">
                    <Navigation size={40} className="text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-400">GPS tracking active</p>
                    <p className="text-xs text-gray-300 mt-1">
                      Your location is being shared with the customer
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Route */}
            <Card>
              <CardContent className="p-5 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100 shrink-0">
                    <MapPin size={12} className="text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Pickup</p>
                    <p className="text-sm text-gray-900">{mockJob.pickupAddress}</p>
                  </div>
                </div>
                <div className="ml-3 border-l-2 border-dashed border-gray-200 h-4" />
                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-red-100 shrink-0">
                    <MapPin size={12} className="text-red-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Dropoff</p>
                    <p className="text-sm text-gray-900">{mockJob.dropoffAddress}</p>
                  </div>
                </div>

                <Separator />

                <div className="flex items-center gap-2">
                  <Car size={14} className="text-gray-400" />
                  <p className="text-sm text-gray-700">
                    {mockJob.vehicleInfo} &middot; {mockJob.vehicleCondition}
                  </p>
                </div>

                {mockJob.notes && (
                  <div className="rounded-lg bg-amber-50 border border-amber-100 p-3">
                    <p className="text-xs font-medium text-amber-800 mb-1">Customer Notes</p>
                    <p className="text-sm text-amber-700">{mockJob.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Photo upload area */}
            <Card>
              <CardContent className="p-5">
                <p className="text-xs font-medium text-gray-500 uppercase mb-3">Job Photos</p>
                <p className="text-sm text-gray-600 mb-3">
                  Take photos at pickup and dropoff to protect yourself in case of disputes.
                </p>
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-[#FF6700]/30 transition-colors cursor-pointer">
                  <Upload size={28} className="text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Tap to upload photos</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Photos are stored securely and only shared if needed
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right column: Status + Customer + Actions */}
          <div className="space-y-6">
            {/* Customer info */}
            <Card>
              <CardContent className="p-5">
                <p className="text-xs font-medium text-gray-500 uppercase mb-3">Customer</p>
                <p className="font-semibold text-gray-900 mb-3">{mockJob.customer.name}</p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1 text-xs" asChild>
                    <a href={`tel:${mockJob.customer.phone}`}>
                      <Phone size={12} className="mr-1" />
                      Call
                    </a>
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 text-xs">
                    <MessageSquare size={12} className="mr-1" />
                    Message
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Status timeline */}
            <Card>
              <CardContent className="p-5">
                <p className="text-xs font-medium text-gray-500 uppercase mb-4">Progress</p>
                <StatusTimeline currentStatus={currentStatus} />
              </CardContent>
            </Card>

            {/* Status action button */}
            {nextAction && (
              <Button
                onClick={advanceStatus}
                className="w-full bg-[#FF6700] hover:bg-[#e55d00] text-white py-6 text-base font-semibold"
              >
                {nextAction.label}
                <ArrowRight size={18} className="ml-2" />
              </Button>
            )}

            {currentStatus === "completed" && (
              <div className="rounded-xl bg-green-50 border border-green-200 p-4 text-center">
                <CheckCircle size={24} className="text-green-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-green-900">Job Complete!</p>
                <p className="text-xs text-green-700 mt-1">
                  Payment of {mockJob.priceInCents / 100} will be deposited within 7 days.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
