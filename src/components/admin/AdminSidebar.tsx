"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ClipboardList,
  Truck,
  Users,
  MapPin,
  DollarSign,
  Settings,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/requests", label: "Requests", icon: ClipboardList },
  { href: "/admin/jobs", label: "Jobs", icon: Truck },
  { href: "/admin/providers", label: "Providers", icon: Users },
  { href: "/admin/service-areas", label: "Service Areas", icon: MapPin },
  { href: "/admin/payouts", label: "Payouts", icon: DollarSign },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  }

  return (
    <aside className="fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-white border-r border-gray-200">
      {/* Brand */}
      <div className="flex h-16 items-center gap-2 border-b border-gray-200 px-6">
        <Truck className="h-6 w-6 text-[#FF6700]" />
        <span className="text-lg font-semibold text-[#003366]">
          Local Tow Admin
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-[#FF6700]/10 text-[#FF6700]"
                  : "text-[#003366]/70 hover:bg-gray-50 hover:text-[#003366]"
              )}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* View Site */}
      <div className="border-t border-gray-200 p-3">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-[#003366]/70 transition-colors hover:bg-gray-50 hover:text-[#003366]"
        >
          <ExternalLink className="h-5 w-5 shrink-0" />
          View Site
        </a>
      </div>
    </aside>
  );
}
