"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { brand } from "@/config/brand";
import { cn } from "@/lib/utils";
import { MobileMenu } from "./MobileMenu";

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glassmorphic">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-fib-5 py-fib-4">
        {/* Logo / Brand Name */}
        <Link href="/" className="font-display text-xl font-bold tracking-tight">
          {brand.name}
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
