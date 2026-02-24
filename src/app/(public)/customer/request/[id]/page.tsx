"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  MapPin,
  ArrowLeft,
  Clock,
  Car,
  DollarSign,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { OfferCard, type OfferCardData } from "@/components/marketplace/OfferCard";
import { PriceTag } from "@/components/marketplace/PriceTag";
import { SectionWrapper } from "@/components/layout/SectionWrapper";
import { toast } from "sonner";

// Placeholder data - will be fetched from API by request id
const mockRequest = {
  id: "req-001",
  pickupAddress: "1234 W Division St, Chicago, IL 60622",
  dropoffAddress: "5678 N Lincoln Ave, Chicago, IL 60625",
  priceInCents: 4500,
  status: "pending",
  vehicleInfo: "2019 Honda Civic",
  vehicleCondition: "Runs & Drives",
  urgency: "ASAP",
  notes: "Flat tire, on the shoulder of Division St heading west",
  createdAt: "5 minutes ago",
  offersCount: 2,
};

const mockOffers: OfferCardData[] = [
  {
    id: "offer-001",
    providerId: "prov-001",
    providerName: "Mike's Towing",
    providerRating: 4.8,
    providerJobCount: 142,
    priceInCents: 4500,
    etaMinutes: 6,
    equipmentType: "Flatbed",
    message: "I'm 3 blocks away on Milwaukee Ave. Can be there in under 10 minutes.",
  },
  {
    id: "offer-002",
    providerId: "prov-002",
    providerName: "Wicker Park Tow Co",
    providerRating: 4.5,
    providerJobCount: 89,
    priceInCents: 5000,
    etaMinutes: 12,
    equipmentType: "Wheel-Lift",
  },
];

export default function RequestDetailPage() {
  const params = useParams();
  const requestId = params.id as string;
  const [acceptedOffer, setAcceptedOffer] = useState<string | null>(null);

  function handleAccept(offerId: string) {
    setAcceptedOffer(offerId);
    toast.success("Offer accepted! The operator is on their way.");
  }

  function handleDecline(offerId: string) {
    toast.info("Offer declined.");
  }

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

        {/* Request header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="font-display text-2xl font-bold text-gray-900">
              Request #{requestId}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge className="bg-amber-100 text-amber-800 text-xs">
                {mockRequest.status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
              </Badge>
              <span className="text-xs text-gray-500 flex items-center gap-1">
                <Clock size={12} />
                {mockRequest.createdAt}
              </span>
            </div>
          </div>
          <PriceTag priceInCents={mockRequest.priceInCents} size="lg" />
        </div>

        {/* Request details */}
        <Card className="mb-8">
          <CardContent className="p-6 space-y-5">
            {/* Route */}
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase mb-2">Route</p>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <MapPin size={16} className="mt-0.5 text-green-600 shrink-0" />
                  <p className="text-sm text-gray-900">{mockRequest.pickupAddress}</p>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin size={16} className="mt-0.5 text-red-600 shrink-0" />
                  <p className="text-sm text-gray-900">{mockRequest.dropoffAddress}</p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Vehicle */}
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase mb-2">Vehicle</p>
              <div className="flex items-center gap-2">
                <Car size={16} className="text-gray-400" />
                <p className="text-sm text-gray-900">{mockRequest.vehicleInfo}</p>
                <span className="text-xs text-gray-500">({mockRequest.vehicleCondition})</span>
              </div>
            </div>

            <Separator />

            {/* Details */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase mb-1">Urgency</p>
                <Badge className="bg-red-100 text-red-800 text-xs">{mockRequest.urgency}</Badge>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase mb-1">Offers Received</p>
                <p className="text-sm font-medium text-gray-900">{mockOffers.length}</p>
              </div>
            </div>

            {mockRequest.notes && (
              <>
                <Separator />
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase mb-2">Notes</p>
                  <p className="text-sm text-gray-700">{mockRequest.notes}</p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Offers section */}
        <div>
          <h2 className="font-display text-xl font-semibold text-gray-900 mb-4">
            Offers ({mockOffers.length})
          </h2>

          {acceptedOffer ? (
            <div className="mb-6 rounded-xl bg-green-50 border border-green-200 p-4 flex items-start gap-3">
              <CheckCircle size={20} className="text-green-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium text-green-900">Offer accepted!</p>
                <p className="text-sm text-green-700 mt-0.5">
                  Your operator is preparing to come to your location. You can track the job from
                  your dashboard.
                </p>
                <Link href={`/customer/job/${requestId}`}>
                  <Button className="mt-3 bg-green-600 hover:bg-green-700 text-white text-sm">
                    Track Job
                  </Button>
                </Link>
              </div>
            </div>
          ) : null}

          <div className="space-y-4">
            {mockOffers.map((offer) => (
              <OfferCard
                key={offer.id}
                offer={offer}
                onAccept={handleAccept}
                onDecline={handleDecline}
                disabled={acceptedOffer !== null}
              />
            ))}
          </div>

          {mockOffers.length === 0 && (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <AlertCircle size={32} className="text-gray-300 mb-3" />
                <p className="text-gray-500">No offers yet</p>
                <p className="text-xs text-gray-400 mt-1">
                  Operators in your area are reviewing your request.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </SectionWrapper>
  );
}
