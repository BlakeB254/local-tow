"use client";

import { useEffect, useState } from "react";
import { MapPin, Users, Truck, ToggleLeft, ToggleRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { chicagoCommunityAreas } from "@/config/brand";

interface ServiceArea {
  communityAreaNumber: number;
  communityAreaName: string;
  status: "active" | "coming_soon" | "inactive";
  activeProviders: number;
  totalJobs: number;
}

// Build placeholder data from brand config
const placeholderAreas: ServiceArea[] = chicagoCommunityAreas.map((area) => ({
  communityAreaNumber: area.number,
  communityAreaName: area.name,
  // First 20 areas active, next 30 coming_soon, rest inactive for demo
  status: area.number <= 20 ? "active" : area.number <= 50 ? "coming_soon" : "inactive",
  activeProviders: area.number <= 20 ? Math.floor(Math.random() * 8) + 1 : 0,
  totalJobs: area.number <= 20 ? Math.floor(Math.random() * 150) + 10 : 0,
}));

const STATUS_FILTERS = [
  { value: "", label: "All (77)" },
  { value: "active", label: "Active" },
  { value: "coming_soon", label: "Coming Soon" },
  { value: "inactive", label: "Inactive" },
];

export default function ServiceAreasPage() {
  const [areas, setAreas] = useState<ServiceArea[]>(placeholderAreas);
  const [filter, setFilter] = useState("");
  const [toggling, setToggling] = useState<number | null>(null);

  useEffect(() => {
    async function fetchAreas() {
      try {
        const res = await fetch("/api/service-areas");
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.data?.length > 0) {
            setAreas(data.data as ServiceArea[]);
          }
        }
      } catch {
        // Keep placeholder
      }
    }

    fetchAreas();
  }, []);

  async function toggleStatus(areaNumber: number, currentStatus: string) {
    setToggling(areaNumber);
    const newStatus = currentStatus === "active" ? "inactive" : "active";

    try {
      await fetch(`/api/admin/service-areas`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ communityAreaNumber: areaNumber, status: newStatus }),
      });

      // Optimistic update
      setAreas((prev) =>
        prev.map((a) =>
          a.communityAreaNumber === areaNumber ? { ...a, status: newStatus as ServiceArea["status"] } : a
        )
      );
    } catch {
      // Ignore
    } finally {
      setToggling(null);
    }
  }

  const filteredAreas = filter ? areas.filter((a) => a.status === filter) : areas;
  const activeCounts = {
    active: areas.filter((a) => a.status === "active").length,
    coming_soon: areas.filter((a) => a.status === "coming_soon").length,
    inactive: areas.filter((a) => a.status === "inactive").length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#003366]">Service Areas</h1>
        <p className="mt-1 text-gray-500">
          Manage Chicago's 77 community areas - {activeCounts.active} active, {activeCounts.coming_soon} coming soon, {activeCounts.inactive} inactive
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-center">
          <p className="text-2xl font-bold text-emerald-700">{activeCounts.active}</p>
          <p className="text-sm text-emerald-600">Active Areas</p>
        </div>
        <div className="rounded-xl border border-purple-200 bg-purple-50 p-4 text-center">
          <p className="text-2xl font-bold text-purple-700">{activeCounts.coming_soon}</p>
          <p className="text-sm text-purple-600">Coming Soon</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-center">
          <p className="text-2xl font-bold text-gray-700">{activeCounts.inactive}</p>
          <p className="text-sm text-gray-500">Inactive</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-1 rounded-lg bg-gray-100 p-1 w-fit">
        {STATUS_FILTERS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setFilter(tab.value)}
            className={cn(
              "rounded-md px-4 py-2 text-sm font-medium transition-colors",
              filter === tab.value
                ? "bg-white text-[#003366] shadow-sm"
                : "text-gray-500 hover:text-[#003366]"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Areas Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredAreas.map((area) => (
          <div
            key={area.communityAreaNumber}
            className={cn(
              "rounded-xl border bg-white p-4 transition-colors",
              area.status === "active"
                ? "border-emerald-200 hover:border-emerald-300"
                : area.status === "coming_soon"
                ? "border-purple-200 hover:border-purple-300"
                : "border-gray-200 hover:border-gray-300"
            )}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold",
                    area.status === "active"
                      ? "bg-emerald-100 text-emerald-700"
                      : area.status === "coming_soon"
                      ? "bg-purple-100 text-purple-700"
                      : "bg-gray-100 text-gray-500"
                  )}
                >
                  {area.communityAreaNumber}
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#003366]">{area.communityAreaName}</p>
                  <StatusBadge status={area.status} />
                </div>
              </div>
              <button
                onClick={() => toggleStatus(area.communityAreaNumber, area.status)}
                disabled={toggling === area.communityAreaNumber}
                className="text-gray-400 hover:text-[#003366] transition-colors disabled:opacity-50"
                title={area.status === "active" ? "Deactivate" : "Activate"}
              >
                {area.status === "active" ? (
                  <ToggleRight className="h-6 w-6 text-emerald-500" />
                ) : (
                  <ToggleLeft className="h-6 w-6" />
                )}
              </button>
            </div>

            <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <Users className="h-3.5 w-3.5" />
                {area.activeProviders} providers
              </span>
              <span className="flex items-center gap-1">
                <Truck className="h-3.5 w-3.5" />
                {area.totalJobs} jobs
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
