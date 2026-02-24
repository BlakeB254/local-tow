"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Phone,
  MessageSquare,
  MapPin,
  Car,
  Star,
  Truck,
  Navigation,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { StatusTimeline } from "@/components/marketplace/StatusTimeline";
import { PriceTag } from "@/components/marketplace/PriceTag";
import { SectionWrapper } from "@/components/layout/SectionWrapper";

// Placeholder data - will be fetched from API
const mockJob = {
  id: "job-001",
  requestId: "req-001",
  status: "en_route",
  pickupAddress: "1234 W Division St, Chicago, IL 60622",
  dropoffAddress: "5678 N Lincoln Ave, Chicago, IL 60625",
  priceInCents: 4500,
  vehicleInfo: "2019 Honda Civic",
  provider: {
    name: "Mike's Towing",
    rating: 4.8,
    jobCount: 142,
    phone: "(312) 555-0142",
    equipment: "Flatbed",
    eta: "4 min",
  },
  acceptedAt: "2 minutes ago",
};

export default function JobTrackingPage() {
  const params = useParams();
  const jobId = params.id as string;

  return (
    <SectionWrapper>
      <div className="max-w-3xl mx-auto">
        {/* Back link */}
        <Link
          href="/customer"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft size={14} />
          Back to Dashboard
        </Link>

        {/* Job header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="font-display text-2xl font-bold text-gray-900">
              Job #{jobId}
            </h1>
            <Badge className="mt-1 bg-blue-100 text-blue-800 text-xs">
              <Navigation size={10} className="mr-1" />
              En Route
            </Badge>
          </div>
          <PriceTag priceInCents={mockJob.priceInCents} size="lg" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column: Map placeholder + route */}
          <div className="lg:col-span-2 space-y-6">
            {/* Map placeholder */}
            <Card>
              <CardContent className="p-0">
                <div className="relative h-64 sm:h-80 bg-gray-100 rounded-xl flex items-center justify-center">
                  <div className="text-center">
                    <Navigation size={40} className="text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-400">Live map tracking</p>
                    <p className="text-xs text-gray-300 mt-1">
                      Real-time GPS will appear here
                    </p>
                  </div>
                  {/* ETA overlay */}
                  <div className="absolute top-4 left-4 rounded-lg bg-white shadow-md px-3 py-2">
                    <p className="text-xs text-gray-500">ETA</p>
                    <p className="text-lg font-bold text-[#FF6700]">{mockJob.provider.eta}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Route details */}
            <Card>
              <CardContent className="p-5">
                <p className="text-xs font-medium text-gray-500 uppercase mb-3">Route</p>
                <div className="space-y-3">
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
                </div>

                <Separator className="my-4" />

                <div className="flex items-center gap-2">
                  <Car size={14} className="text-gray-400" />
                  <p className="text-sm text-gray-700">{mockJob.vehicleInfo}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right column: Status + Provider */}
          <div className="space-y-6">
            {/* Provider card */}
            <Card>
              <CardContent className="p-5">
                <p className="text-xs font-medium text-gray-500 uppercase mb-3">Your Operator</p>
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-12 w-12 rounded-full bg-[#003366] flex items-center justify-center text-white font-bold text-lg">
                    {mockJob.provider.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{mockJob.provider.name}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span className="flex items-center gap-0.5">
                        <Star size={10} className="text-amber-500 fill-amber-500" />
                        {mockJob.provider.rating}
                      </span>
                      <span>{mockJob.provider.jobCount} jobs</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-4">
                  <Truck size={12} />
                  <span>{mockJob.provider.equipment}</span>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 text-xs"
                    asChild
                  >
                    <a href={`tel:${mockJob.provider.phone}`}>
                      <Phone size={12} className="mr-1" />
                      Call
                    </a>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 text-xs"
                  >
                    <MessageSquare size={12} className="mr-1" />
                    Message
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Status timeline */}
            <Card>
              <CardContent className="p-5">
                <p className="text-xs font-medium text-gray-500 uppercase mb-4">Status</p>
                <StatusTimeline currentStatus={mockJob.status} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
