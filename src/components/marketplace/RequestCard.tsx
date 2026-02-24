"use client";

import Link from "next/link";
import { MapPin, ArrowRight, Clock, Car } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PriceTag } from "./PriceTag";
import { cn } from "@/lib/utils";

export interface RequestCardData {
  id: string;
  pickupAddress: string;
  dropoffAddress: string;
  priceInCents: number;
  status: string;
  vehicleInfo?: string;
  distanceMiles?: number;
  createdAt?: string;
  urgency?: "asap" | "today" | "scheduled";
}

interface RequestCardProps {
  request: RequestCardData;
  /** Link destination */
  href?: string;
  /** Show distance for provider views */
  showDistance?: boolean;
  className?: string;
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  accepted: "bg-green-100 text-green-800",
  en_route: "bg-blue-100 text-blue-800",
  at_pickup: "bg-purple-100 text-purple-800",
  loading: "bg-cyan-100 text-cyan-800",
  transporting: "bg-blue-100 text-blue-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

const urgencyLabels: Record<string, { label: string; color: string }> = {
  asap: { label: "ASAP", color: "bg-red-100 text-red-800" },
  today: { label: "Today", color: "bg-amber-100 text-amber-800" },
  scheduled: { label: "Scheduled", color: "bg-blue-100 text-blue-800" },
};

export function RequestCard({
  request,
  href,
  showDistance = false,
  className,
}: RequestCardProps) {
  const content = (
    <Card
      className={cn(
        "group transition-all hover:shadow-md hover:border-[#FF6700]/30 cursor-pointer",
        className
      )}
    >
      <CardContent className="p-4">
        {/* Header row: status + urgency + price */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className={cn("text-xs", statusColors[request.status])}>
              {request.status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
            </Badge>
            {request.urgency && urgencyLabels[request.urgency] && (
              <Badge variant="secondary" className={cn("text-xs", urgencyLabels[request.urgency].color)}>
                {urgencyLabels[request.urgency].label}
              </Badge>
            )}
          </div>
          <PriceTag priceInCents={request.priceInCents} size="md" showFeeBreakdown={false} />
        </div>

        {/* Route: pickup -> dropoff */}
        <div className="space-y-2">
          <div className="flex items-start gap-2">
            <MapPin size={16} className="mt-0.5 shrink-0 text-green-600" />
            <p className="text-sm text-foreground line-clamp-1">{request.pickupAddress}</p>
          </div>
          <div className="flex items-center gap-2 pl-2">
            <ArrowRight size={12} className="text-muted-foreground" />
          </div>
          <div className="flex items-start gap-2">
            <MapPin size={16} className="mt-0.5 shrink-0 text-red-600" />
            <p className="text-sm text-foreground line-clamp-1">{request.dropoffAddress}</p>
          </div>
        </div>

        {/* Footer: vehicle info, distance, time */}
        <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
          {request.vehicleInfo && (
            <span className="flex items-center gap-1">
              <Car size={12} />
              {request.vehicleInfo}
            </span>
          )}
          {showDistance && request.distanceMiles != null && (
            <span className="flex items-center gap-1">
              <MapPin size={12} />
              {request.distanceMiles.toFixed(1)} mi away
            </span>
          )}
          {request.createdAt && (
            <span className="flex items-center gap-1">
              <Clock size={12} />
              {request.createdAt}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
}
