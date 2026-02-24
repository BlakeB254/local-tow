"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  MapPin,
  Filter,
  RefreshCw,
  DollarSign,
  Clock,
  Car,
  ArrowRight,
  AlertCircle,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { RequestCard, type RequestCardData } from "@/components/marketplace/RequestCard";
import { SectionWrapper } from "@/components/layout/SectionWrapper";
import { formatCents } from "@/lib/fees";
import { toast } from "sonner";

// Placeholder available requests
const mockRequests: RequestCardData[] = [
  {
    id: "req-201",
    pickupAddress: "1600 W North Ave, Chicago, IL 60622",
    dropoffAddress: "2500 N Clybourn Ave, Chicago, IL 60614",
    priceInCents: 5000,
    status: "pending",
    vehicleInfo: "2021 Hyundai Elantra",
    distanceMiles: 0.8,
    urgency: "asap",
    createdAt: "2 min ago",
  },
  {
    id: "req-202",
    pickupAddress: "900 W Armitage Ave, Chicago, IL 60614",
    dropoffAddress: "4200 N Lincoln Ave, Chicago, IL 60618",
    priceInCents: 5500,
    status: "pending",
    vehicleInfo: "2019 Ford Escape",
    distanceMiles: 1.2,
    urgency: "today",
    createdAt: "8 min ago",
  },
  {
    id: "req-203",
    pickupAddress: "3500 W Belmont Ave, Chicago, IL 60618",
    dropoffAddress: "5000 N Pulaski Rd, Chicago, IL 60641",
    priceInCents: 4000,
    status: "pending",
    vehicleInfo: "2017 Chevy Malibu",
    distanceMiles: 2.5,
    urgency: "today",
    createdAt: "15 min ago",
  },
  {
    id: "req-204",
    pickupAddress: "2200 S Michigan Ave, Chicago, IL 60616",
    dropoffAddress: "6100 S Cottage Grove Ave, Chicago, IL 60637",
    priceInCents: 6000,
    status: "pending",
    vehicleInfo: "2022 BMW 3 Series",
    distanceMiles: 4.1,
    urgency: "asap",
    createdAt: "3 min ago",
  },
];

export default function AvailableRequestsPage() {
  const [requests] = useState(mockRequests);

  function handleMakeOffer(requestId: string) {
    toast.info("Offer submission will be available when the API is connected.");
  }

  return (
    <SectionWrapper>
      <div className="max-w-3xl mx-auto">
        {/* Back link */}
        <Link
          href="/provider"
          className="inline-flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft size={14} />
          Back to Dashboard
        </Link>

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-display text-2xl font-bold text-gray-900">
              Available Requests
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              {requests.length} requests near you
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => toast.info("Refreshing...")}
          >
            <RefreshCw size={14} className="mr-1.5" />
            Refresh
          </Button>
        </div>

        {/* Requests list */}
        {requests.length > 0 ? (
          <div className="space-y-4">
            {requests.map((req) => (
              <div key={req.id}>
                <RequestCard request={req} showDistance />
                <div className="mt-2 flex justify-end gap-2">
                  <Link href={`/customer/request/${req.id}`}>
                    <Button variant="outline" size="sm" className="text-xs border-gray-300">
                      View Details
                    </Button>
                  </Link>
                  <Button
                    size="sm"
                    className="bg-[#FF6700] hover:bg-[#e55d00] text-white text-xs"
                    onClick={() => handleMakeOffer(req.id)}
                  >
                    <DollarSign size={12} className="mr-1" />
                    Make Offer
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <AlertCircle size={32} className="text-gray-300 mb-3" />
              <p className="text-gray-500">No requests available right now</p>
              <p className="text-xs text-gray-400 mt-1">
                New requests appear here in real time. Check back soon!
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </SectionWrapper>
  );
}
