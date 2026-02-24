"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { brand } from "@/config/brand";

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
}

export function MobileMenu({ open, onClose }: MobileMenuProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="md:hidden overflow-hidden border-t border-border bg-background/95 backdrop-blur-lg"
        >
          <nav className="flex flex-col gap-fib-2 px-fib-5 py-fib-5">
            {brand.nav.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={onClose}
                className="text-lg text-foreground py-fib-2 border-b border-border/50 transition-colors hover:text-primary"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/contact"
              onClick={onClose}
              className="btn-cta mt-fib-3 rounded-fib-3 px-fib-5 py-fib-4 text-center text-sm font-medium text-white"
            >
              Get Started
            </Link>
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
