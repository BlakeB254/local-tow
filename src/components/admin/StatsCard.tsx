import { type LucideIcon, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  trend?: {
    value: string;
    direction: "up" | "down";
  };
  className?: string;
}

export function StatsCard({ icon: Icon, label, value, trend, className }: StatsCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-gray-200 bg-white p-6 transition-colors hover:border-gray-300",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="rounded-lg bg-[#FF6700]/10 p-2.5">
          <Icon className="h-5 w-5 text-[#FF6700]" />
        </div>
        {trend && (
          <div
            className={cn(
              "flex items-center gap-1 text-xs font-medium",
              trend.direction === "up" ? "text-emerald-600" : "text-red-500"
            )}
          >
            {trend.direction === "up" ? (
              <TrendingUp className="h-3.5 w-3.5" />
            ) : (
              <TrendingDown className="h-3.5 w-3.5" />
            )}
            {trend.value}
          </div>
        )}
      </div>
      <div className="mt-4">
        <p className="text-2xl font-bold text-[#003366]">{value}</p>
        <p className="mt-1 text-sm text-gray-500">{label}</p>
      </div>
    </div>
  );
}
