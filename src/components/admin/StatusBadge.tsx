import { cn } from "@/lib/utils";

const statusStyles: Record<string, { bg: string; text: string; dot: string }> = {
  // Blue — open, en_route, loading, transporting, at_pickup, at_dropoff, in_progress, processing
  open: { bg: "bg-blue-500/10", text: "text-blue-600", dot: "bg-blue-500" },
  en_route: { bg: "bg-blue-500/10", text: "text-blue-600", dot: "bg-blue-500" },
  at_pickup: { bg: "bg-blue-500/10", text: "text-blue-600", dot: "bg-blue-500" },
  loading: { bg: "bg-blue-500/10", text: "text-blue-600", dot: "bg-blue-500" },
  transporting: { bg: "bg-blue-500/10", text: "text-blue-600", dot: "bg-blue-500" },
  at_dropoff: { bg: "bg-blue-500/10", text: "text-blue-600", dot: "bg-blue-500" },
  in_progress: { bg: "bg-blue-500/10", text: "text-blue-600", dot: "bg-blue-500" },
  processing: { bg: "bg-blue-500/10", text: "text-blue-600", dot: "bg-blue-500" },
  authorized: { bg: "bg-blue-500/10", text: "text-blue-600", dot: "bg-blue-500" },

  // Yellow — pending, needs_info, job_created
  pending: { bg: "bg-amber-500/10", text: "text-amber-600", dot: "bg-amber-500" },
  needs_info: { bg: "bg-amber-500/10", text: "text-amber-600", dot: "bg-amber-500" },
  job_created: { bg: "bg-amber-500/10", text: "text-amber-600", dot: "bg-amber-500" },

  // Green — accepted, approved, completed, captured, transferred, active, verified
  accepted: { bg: "bg-emerald-500/10", text: "text-emerald-600", dot: "bg-emerald-500" },
  approved: { bg: "bg-emerald-500/10", text: "text-emerald-600", dot: "bg-emerald-500" },
  completed: { bg: "bg-emerald-500/10", text: "text-emerald-600", dot: "bg-emerald-500" },
  captured: { bg: "bg-emerald-500/10", text: "text-emerald-600", dot: "bg-emerald-500" },
  transferred: { bg: "bg-emerald-500/10", text: "text-emerald-600", dot: "bg-emerald-500" },
  active: { bg: "bg-emerald-500/10", text: "text-emerald-600", dot: "bg-emerald-500" },
  verified: { bg: "bg-emerald-500/10", text: "text-emerald-600", dot: "bg-emerald-500" },

  // Red — cancelled, rejected, expired, failed, disputed, refunded
  cancelled: { bg: "bg-red-500/10", text: "text-red-600", dot: "bg-red-500" },
  rejected: { bg: "bg-red-500/10", text: "text-red-600", dot: "bg-red-500" },
  expired: { bg: "bg-red-500/10", text: "text-red-600", dot: "bg-red-500" },
  failed: { bg: "bg-red-500/10", text: "text-red-600", dot: "bg-red-500" },
  disputed: { bg: "bg-red-500/10", text: "text-red-600", dot: "bg-red-500" },
  refunded: { bg: "bg-red-500/10", text: "text-red-600", dot: "bg-red-500" },

  // Purple — coming_soon
  coming_soon: { bg: "bg-purple-500/10", text: "text-purple-600", dot: "bg-purple-500" },

  // Gray — inactive, not_started, standard, instant
  inactive: { bg: "bg-gray-500/10", text: "text-gray-500", dot: "bg-gray-400" },
  not_started: { bg: "bg-gray-500/10", text: "text-gray-500", dot: "bg-gray-400" },
  standard: { bg: "bg-gray-500/10", text: "text-gray-500", dot: "bg-gray-400" },
  instant: { bg: "bg-sky-500/10", text: "text-sky-600", dot: "bg-sky-500" },
};

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const style = statusStyles[status] ?? {
    bg: "bg-gray-500/10",
    text: "text-gray-500",
    dot: "bg-gray-400",
  };

  const label = status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium",
        style.bg,
        style.text,
        className
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", style.dot)} />
      {label}
    </span>
  );
}
