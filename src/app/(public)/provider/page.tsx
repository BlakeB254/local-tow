"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Power,
  DollarSign,
  TrendingUp,
  Truck,
  Clock,
  Star,
  MapPin,
  ArrowRight,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RequestCard, type RequestCardData } from "@/components/marketplace/RequestCard";
import { SectionWrapper } from "@/components/layout/SectionWrapper";
import { formatCents } from "@/lib/fees";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// Placeholder data
const providerStats = [
  { label: "Today's Earnings", value: 13500, prefix: true, icon: DollarSign, color: "text-green-600" },
  { label: "This Week", value: 45000, prefix: true, icon: TrendingUp, color: "text-[#FF6700]" },
  { label: "Completed Jobs", value: 142, icon: CheckCircle, color: "text-blue-600" },
  { label: "Rating", value: 4.8, icon: Star, color: "text-amber-500" },
];

const recentJobs: RequestCardData[] = [
  {
    id: "job-101",
    pickupAddress: "2100 N Damen Ave, Chicago, IL 60647",
    dropoffAddress: "1500 W Fullerton Ave, Chicago, IL 60614",
    priceInCents: 4500,
    status: "completed",
    vehicleInfo: "2020 Toyota RAV4",
    createdAt: "1 hour ago",
  },
  {
    id: "job-102",
    pickupAddress: "3300 N Ashland Ave, Chicago, IL 60657",
    dropoffAddress: "4100 N Western Ave, Chicago, IL 60618",
    priceInCents: 3500,
    status: "completed",
    vehicleInfo: "2018 Honda Accord",
    createdAt: "3 hours ago",
  },
];

export default function ProviderDashboard() {
  const [isOnline, setIsOnline] = useState(false);

  function toggleOnline() {
    setIsOnline(!isOnline);
    toast.success(isOnline ? "You are now offline" : "You are now online and accepting jobs!");
  }

  return (
    <SectionWrapper>
      <div className="max-w-4xl mx-auto">
        {/* Header with online toggle */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold text-gray-900">
              Provider Dashboard
            </h1>
            <p className="mt-1 text-gray-600">
              Manage your jobs and track your earnings.
            </p>
          </div>
          <button
            onClick={toggleOnline}
            className={cn(
              "flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-all shadow-md",
              isOnline
                ? "bg-green-500 text-white hover:bg-green-600"
                : "bg-gray-200 text-gray-600 hover:bg-gray-300"
            )}
          >
            <Power size={16} />
            {isOnline ? "Online" : "Offline"}
          </button>
        </div>

        {/* Online status banner */}
        {!isOnline && (
          <div className="mb-6 rounded-xl bg-amber-50 border border-amber-200 p-4 flex items-start gap-3">
            <AlertCircle size={20} className="text-amber-600 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-medium text-amber-900">You are currently offline</p>
              <p className="text-sm text-amber-700 mt-0.5">
                Go online to start receiving tow requests from customers in your area.
              </p>
            </div>
          </div>
        )}

        {/* Stats cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {providerStats.map((stat) => (
            <Card key={stat.label}>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <stat.icon size={16} className={stat.color} />
                  <p className="text-xs text-gray-500">{stat.label}</p>
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {stat.prefix ? formatCents(stat.value as number) : stat.value}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-10">
          <Link href="/provider/available">
            <Card className="hover:border-[#FF6700]/30 hover:shadow-md transition-all cursor-pointer h-full">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#FF6700]/10">
                  <MapPin size={18} className="text-[#FF6700]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Available Requests</p>
                  <p className="text-xs text-gray-500">Browse nearby jobs</p>
                </div>
                <ArrowRight size={14} className="ml-auto text-gray-400" />
              </CardContent>
            </Card>
          </Link>
          <Link href="/provider/earnings">
            <Card className="hover:border-[#FF6700]/30 hover:shadow-md transition-all cursor-pointer h-full">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
                  <DollarSign size={18} className="text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Earnings</p>
                  <p className="text-xs text-gray-500">View payouts</p>
                </div>
                <ArrowRight size={14} className="ml-auto text-gray-400" />
              </CardContent>
            </Card>
          </Link>
          <Link href="/provider/settings">
            <Card className="hover:border-[#FF6700]/30 hover:shadow-md transition-all cursor-pointer h-full">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                  <Truck size={18} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Settings</p>
                  <p className="text-xs text-gray-500">Profile & areas</p>
                </div>
                <ArrowRight size={14} className="ml-auto text-gray-400" />
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Recent jobs */}
        <div>
          <h2 className="font-display text-xl font-semibold text-gray-900 mb-4">
            Recent Jobs
          </h2>
          {recentJobs.length > 0 ? (
            <div className="space-y-3">
              {recentJobs.map((job) => (
                <RequestCard
                  key={job.id}
                  request={job}
                  href={`/provider/job/${job.id}`}
                />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <Truck size={32} className="text-gray-300 mb-3" />
                <p className="text-gray-500">No recent jobs</p>
                <p className="text-xs text-gray-400 mt-1">
                  Go online and start accepting requests!
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </SectionWrapper>
  );
}
