"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { brand } from "@/config/brand";
import { SectionWrapper } from "@/components/layout/SectionWrapper";
import { MetatronsCube } from "@/components/sacred/MetatronsCube";

export function CTASection() {
  return (
    <SectionWrapper id="cta" className="relative overflow-hidden">
      {/* Sacred geometry background decoration */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/4 opacity-30 dark:opacity-100">
        <MetatronsCube size={600} opacity={0.03} animate />
      </div>

      <div className="relative z-10 text-center max-w-3xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="font-display text-3xl font-bold sm:text-4xl md:text-5xl"
        >
          Ready to Get Started?
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-fib-5 text-lg text-muted-foreground"
        >
          Join {brand.name} and take the next step. We&apos;re here to help you succeed.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-fib-6"
        >
          <Link
            href="/contact"
            className="btn-cta inline-block rounded-fib-3 px-fib-7 py-fib-4 text-lg font-medium text-white animate-glow-pulse"
          >
            Contact Us Today
          </Link>
        </motion.div>
      </div>
    </SectionWrapper>
  );
}
