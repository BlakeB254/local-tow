"use client";

import { Check, Clock, Truck, MapPin, Loader, Navigation, Flag, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { jobStatusSteps } from "@/config/brand";

const iconMap: Record<string, React.FC<{ size?: number; className?: string }>> = {
  clock: Clock,
  check: Check,
  truck: Truck,
  "map-pin": MapPin,
  loader: Loader,
  navigation: Navigation,
  flag: Flag,
  "check-circle": CheckCircle,
};

interface StatusTimelineProps {
  currentStatus: string;
  className?: string;
}

export function StatusTimeline({ currentStatus, className }: StatusTimelineProps) {
  const currentIndex = jobStatusSteps.findIndex((s) => s.id === currentStatus);

  return (
    <div className={cn("space-y-1", className)}>
      {jobStatusSteps.map((step, index) => {
        const Icon = iconMap[step.icon] ?? Clock;
        const isCompleted = index < currentIndex;
        const isCurrent = index === currentIndex;
        const isPending = index > currentIndex;

        return (
          <div key={step.id} className="flex items-start gap-3">
            {/* Vertical connector + circle */}
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                  isCompleted && "border-green-500 bg-green-500 text-white",
                  isCurrent && "border-[#FF6700] bg-[#FF6700] text-white",
                  isPending && "border-gray-200 bg-white text-gray-400"
                )}
              >
                {isCompleted ? <Check size={14} /> : <Icon size={14} />}
              </div>
              {index < jobStatusSteps.length - 1 && (
                <div
                  className={cn(
                    "w-0.5 h-8",
                    isCompleted ? "bg-green-500" : "bg-gray-200"
                  )}
                />
              )}
            </div>

            {/* Label + description */}
            <div className="pt-1 pb-2">
              <p
                className={cn(
                  "text-sm font-medium",
                  isCompleted && "text-green-600",
                  isCurrent && "text-[#FF6700] font-semibold",
                  isPending && "text-gray-400"
                )}
              >
                {step.label}
              </p>
              {isCurrent && (
                <p className="text-xs text-muted-foreground mt-0.5">
                  {step.description}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
