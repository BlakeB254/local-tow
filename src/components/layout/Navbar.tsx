"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { brand } from "@/config/brand";
import { cn } from "@/lib/utils";
import { MobileMenu } from "./MobileMenu";

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-border/40 shadow-sm">
      <nav className="container mx-auto flex items-center justify-between px-4 h-20 lg:h-24">
        {/* Logo — Large and prominent for brand recognition */}
        <Link href="/" className="flex items-center gap-2 flex-shrink-0">
          <Image
            src={brand.logo.horizontal}
            alt={brand.name}
            width={320}
            height={80}
            className="h-14 sm:h-16 lg:h-20 w-auto"
            priority
          />
        </Link>

        {/* Desktop Nav */}
        <ul className="hidden md:flex items-center gap-fib-5">
          {brand.nav.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* CTA Button (desktop) */}
        <div className="hidden md:block">
          <Link
            href="/contact"
            className="btn-cta rounded-fib-3 px-fib-5 py-fib-3 text-sm font-medium text-white"
          >
            Get Started
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-fib-2 text-foreground"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </header>
  );
}
