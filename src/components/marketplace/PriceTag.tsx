"use client";

import { formatCents, calculateFees, getFeeExplanation } from "@/lib/fees";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface PriceTagProps {
  /** Price in cents */
  priceInCents: number;
  /** Show fee breakdown tooltip */
  showFeeBreakdown?: boolean;
  /** Visual size */
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function PriceTag({
  priceInCents,
  showFeeBreakdown = true,
  size = "md",
  className,
}: PriceTagProps) {
  const fees = calculateFees(priceInCents);

  const sizeClasses = {
    sm: "text-sm",
    md: "text-lg font-semibold",
    lg: "text-2xl font-bold",
  };

  return (
    <div className={cn("inline-flex items-center gap-1.5", className)}>
      <span className={cn(sizeClasses[size], "text-[#FF6700]")}>
        {formatCents(priceInCents)}
      </span>

      {showFeeBreakdown && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Fee breakdown"
              >
                <Info size={size === "sm" ? 12 : size === "md" ? 14 : 16} />
              </button>
            </TooltipTrigger>
            <TooltipContent side="top" className="max-w-xs">
              <div className="space-y-1 text-xs">
                <p className="font-medium">Fee Breakdown</p>
                <div className="flex justify-between gap-4">
                  <span>Total price:</span>
                  <span>{formatCents(fees.totalPrice)}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span>Platform fee:</span>
                  <span>{getFeeExplanation(priceInCents)}</span>
                </div>
                <div className="flex justify-between gap-4 border-t border-border pt-1 font-medium">
                  <span>Provider receives:</span>
                  <span>{formatCents(fees.providerPayout)}</span>
                </div>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
}
