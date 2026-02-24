"use client";

import Link from "next/link";
import { Plus, Clock, CheckCircle, Truck, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RequestCard, type RequestCardData } from "@/components/marketplace/RequestCard";
import { SectionWrapper } from "@/components/layout/SectionWrapper";

// Placeholder data - will come from API
const activeRequests: RequestCardData[] = [
  {
    id: "req-001",
    pickupAddress: "1234 W Division St, Chicago, IL 60622",
    dropoffAddress: "5678 N Lincoln Ave, Chicago, IL 60625",
    priceInCents: 4500,
    status: "pending",
    vehicleInfo: "2019 Honda Civic",
    urgency: "asap",
    createdAt: "5 min ago",
  },
];

const pastTows: RequestCardData[] = [
  {
    id: "req-002",
    pickupAddress: "900 N Michigan Ave, Chicago, IL 60611",
    dropoffAddress: "2200 S State St, Chicago, IL 60616",
    priceInCents: 5500,
    status: "completed",
    vehicleInfo: "2021 Toyota Camry",
    createdAt: "2 days ago",
  },
  {
    id: "req-003",
    pickupAddress: "3100 W Fullerton Ave, Chicago, IL 60647",
    dropoffAddress: "4500 W Diversey Ave, Chicago, IL 60639",
    priceInCents: 3500,
    status: "completed",
    vehicleInfo: "2018 Ford F-150",
    createdAt: "1 week ago",
  },
];

const dashboardStats = [
  { label: "Active Requests", value: "1", icon: Clock, color: "text-amber-600" },
  { label: "Completed Tows", value: "2", icon: CheckCircle, color: "text-green-600" },
  { label: "Total Saved", value: "$240", icon: Truck, color: "text-[#FF6700]" },
];

export default function CustomerDashboard() {
  return (
    <SectionWrapper>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold text-gray-900">
              My Dashboard
            </h1>
            <p className="mt-1 text-gray-600">
              Manage your tow requests and track active jobs.
            </p>
          </div>
          <Link href="/customer/request/new">
            <Button className="bg-[#FF6700] hover:bg-[#e55d00] text-white">
              <Plus size={16} className="mr-1.5" />
              New Request
            </Button>
          </Link>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          {dashboardStats.map((stat) => (
            <Card key={stat.label}>
              <CardContent className="flex items-center gap-3 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-50">
                  <stat.icon size={20} className={stat.color} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-xs text-gray-500">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Active Requests */}
        <div className="mb-10">
          <h2 className="font-display text-xl font-semibold text-gray-900 mb-4">
            Active Requests
          </h2>
          {activeRequests.length > 0 ? (
            <div className="space-y-3">
              {activeRequests.map((req) => (
                <RequestCard
                  key={req.id}
                  request={req}
                  href={`/customer/request/${req.id}`}
                />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <AlertCircle size={32} className="text-gray-300 mb-3" />
                <p className="text-gray-500">No active requests</p>
                <Link href="/customer/request/new">
                  <Button variant="link" className="text-[#FF6700] mt-2">
                    Create your first request
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Past Tows */}
        <div>
          <h2 className="font-display text-xl font-semibold text-gray-900 mb-4">
            Past Tows
          </h2>
          {pastTows.length > 0 ? (
            <div className="space-y-3">
              {pastTows.map((req) => (
                <RequestCard
                  key={req.id}
                  request={req}
                  href={`/customer/request/${req.id}`}
                />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <Truck size={32} className="text-gray-300 mb-3" />
                <p className="text-gray-500">No past tows yet</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </SectionWrapper>
  );
}
