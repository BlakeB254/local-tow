"use client";

import Link from "next/link";
import {
  ArrowLeft,
  DollarSign,
  TrendingUp,
  Calendar,
  Clock,
  ArrowDownRight,
  CheckCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { SectionWrapper } from "@/components/layout/SectionWrapper";
import { formatCents } from "@/lib/fees";

// Placeholder data
const earningsSummary = {
  thisWeek: 45000,
  lastWeek: 38500,
  thisMonth: 182000,
  pendingPayout: 45000,
  nextPayoutDate: "March 1, 2026",
  totalEarnings: 642000,
};

const payoutHistory = [
  { id: "pay-001", date: "Feb 22, 2026", amount: 38500, status: "completed", jobs: 8 },
  { id: "pay-002", date: "Feb 15, 2026", amount: 42000, status: "completed", jobs: 9 },
  { id: "pay-003", date: "Feb 8, 2026", amount: 35500, status: "completed", jobs: 7 },
  { id: "pay-004", date: "Feb 1, 2026", amount: 41000, status: "completed", jobs: 8 },
  { id: "pay-005", date: "Jan 25, 2026", amount: 33000, status: "completed", jobs: 6 },
];

const recentEarnings = [
  { id: "job-201", date: "Today, 2:30 PM", pickup: "Division & Milwaukee", amount: 4500, fee: 450 },
  { id: "job-202", date: "Today, 11:15 AM", pickup: "Fullerton & Ashland", amount: 5000, fee: 500 },
  { id: "job-203", date: "Yesterday, 8:45 PM", pickup: "North Ave & Damen", amount: 3500, fee: 350 },
  { id: "job-204", date: "Yesterday, 3:20 PM", pickup: "Belmont & Western", amount: 6000, fee: 500 },
];

export default function ProviderEarningsPage() {
  const weekChange =
    earningsSummary.lastWeek > 0
      ? Math.round(
          ((earningsSummary.thisWeek - earningsSummary.lastWeek) / earningsSummary.lastWeek) * 100
        )
      : 0;

  return (
    <SectionWrapper>
      <div className="max-w-4xl mx-auto">
        {/* Back link */}
        <Link
          href="/provider"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft size={14} />
          Back to Dashboard
        </Link>

        <h1 className="font-display text-3xl font-bold text-gray-900 mb-8">
          Earnings
        </h1>

        {/* Summary cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign size={14} className="text-green-600" />
                <p className="text-xs text-gray-500">This Week</p>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {formatCents(earningsSummary.thisWeek)}
              </p>
              {weekChange !== 0 && (
                <p className={`text-xs mt-1 ${weekChange > 0 ? "text-green-600" : "text-red-600"}`}>
                  {weekChange > 0 ? "+" : ""}
                  {weekChange}% vs last week
                </p>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp size={14} className="text-[#FF6700]" />
                <p className="text-xs text-gray-500">This Month</p>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {formatCents(earningsSummary.thisMonth)}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock size={14} className="text-amber-600" />
                <p className="text-xs text-gray-500">Pending Payout</p>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {formatCents(earningsSummary.pendingPayout)}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Next: {earningsSummary.nextPayoutDate}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign size={14} className="text-blue-600" />
                <p className="text-xs text-gray-500">All Time</p>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {formatCents(earningsSummary.totalEarnings)}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent earnings */}
          <div>
            <h2 className="font-display text-xl font-semibold text-gray-900 mb-4">
              Recent Earnings
            </h2>
            <Card>
              <CardContent className="p-0 divide-y divide-gray-100">
                {recentEarnings.map((earning) => (
                  <div key={earning.id} className="flex items-center justify-between px-4 py-3">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{earning.pickup}</p>
                      <p className="text-xs text-gray-500">{earning.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-green-700">
                        +{formatCents(earning.amount - earning.fee)}
                      </p>
                      <p className="text-xs text-gray-400">
                        fee: {formatCents(earning.fee)}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Payout history */}
          <div>
            <h2 className="font-display text-xl font-semibold text-gray-900 mb-4">
              Payout History
            </h2>
            <Card>
              <CardContent className="p-0 divide-y divide-gray-100">
                {payoutHistory.map((payout) => (
                  <div key={payout.id} className="flex items-center justify-between px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                        <ArrowDownRight size={14} className="text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{payout.date}</p>
                        <p className="text-xs text-gray-500">{payout.jobs} jobs</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-900">
                        {formatCents(payout.amount)}
                      </p>
                      <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                        <CheckCircle size={10} className="mr-0.5" />
                        {payout.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
