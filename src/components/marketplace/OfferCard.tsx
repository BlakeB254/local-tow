"use client";

import { Clock, Star, Truck, CheckCircle, XCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PriceTag } from "./PriceTag";
import { cn } from "@/lib/utils";

export interface OfferCardData {
  id: string;
  providerId: string;
  providerName: string;
  providerRating?: number;
  providerJobCount?: number;
  priceInCents: number;
  etaMinutes: number;
  equipmentType?: string;
  message?: string;
}

interface OfferCardProps {
  offer: OfferCardData;
  onAccept?: (offerId: string) => void;
  onDecline?: (offerId: string) => void;
  /** Whether buttons are disabled (e.g. already accepted another) */
  disabled?: boolean;
  className?: string;
}

export function OfferCard({
  offer,
  onAccept,
  onDecline,
  disabled = false,
  className,
}: OfferCardProps) {
  return (
    <Card
      className={cn(
        "transition-all hover:shadow-md",
        disabled && "opacity-60",
        className
      )}
    >
      <CardContent className="p-4">
        {/* Provider info row */}
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="font-semibold text-foreground">{offer.providerName}</p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
              {offer.providerRating != null && (
                <span className="flex items-center gap-0.5">
                  <Star size={12} className="text-amber-500 fill-amber-500" />
                  {offer.providerRating.toFixed(1)}
                </span>
              )}
              {offer.providerJobCount != null && (
                <span>{offer.providerJobCount} jobs</span>
              )}
              {offer.equipmentType && (
                <span className="flex items-center gap-0.5">
                  <Truck size={12} />
                  {offer.equipmentType}
                </span>
              )}
            </div>
          </div>
          <PriceTag priceInCents={offer.priceInCents} size="lg" />
        </div>

        {/* ETA */}
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-3">
          <Clock size={14} />
          <span>ETA: {offer.etaMinutes} min</span>
        </div>

        {/* Optional message */}
        {offer.message && (
          <p className="text-sm text-muted-foreground bg-muted/50 rounded-md p-2 mb-3 italic">
            &ldquo;{offer.message}&rdquo;
          </p>
        )}

        {/* Action buttons */}
        {(onAccept || onDecline) && (
          <div className="flex items-center gap-2">
            {onAccept && (
              <Button
                onClick={() => onAccept(offer.id)}
                disabled={disabled}
                className="flex-1 bg-[#FF6700] hover:bg-[#e55d00] text-white"
              >
                <CheckCircle size={16} className="mr-1.5" />
                Accept
              </Button>
            )}
            {onDecline && (
              <Button
                onClick={() => onDecline(offer.id)}
                disabled={disabled}
                variant="outline"
                className="flex-1"
              >
                <XCircle size={16} className="mr-1.5" />
                Decline
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
