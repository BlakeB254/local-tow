"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { brand, type HeroVariant } from "@/config/brand";
import { FlowerOfLife } from "@/components/sacred/FlowerOfLife";
import { cn } from "@/lib/utils";

interface HeroSectionProps {
  variant?: HeroVariant;
}

function CenteredHero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Sacred geometry background */}
      <div className="absolute inset-0 flex items-center justify-center opacity-30 dark:opacity-100">
        <FlowerOfLife size={800} opacity={0.04} />
      </div>
      <div className="absolute inset-0 bg-mesh-dark dark:block hidden" />

      <div className="relative z-10 mx-auto max-w-4xl px-fib-5 text-center">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-fib-4 text-sm font-medium uppercase tracking-widest text-primary"
        >
          {brand.tagline}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-display text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
        >
          {brand.name}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-fib-5 text-lg text-muted-foreground max-w-2xl mx-auto md:text-xl"
        >
          {brand.description}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-fib-6 flex flex-col sm:flex-row gap-fib-4 justify-center"
        >
          <Link
            href="/contact"
            className="btn-cta rounded-fib-3 px-fib-6 py-fib-4 text-base font-medium text-white"
          >
            Get Started
          </Link>
          <Link
            href="/about"
            className="rounded-fib-3 border border-border px-fib-6 py-fib-4 text-base font-medium text-foreground transition-colors hover:bg-muted"
          >
            Learn More
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

function SplitHero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      <div className="absolute inset-0 bg-mesh-dark dark:block hidden" />

      <div className="relative z-10 mx-auto max-w-7xl px-fib-5 grid grid-cols-1 lg:grid-cols-2 gap-fib-7 items-center">
        {/* Text side */}
        <div>
          <motion.p
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-fib-3 text-sm font-medium uppercase tracking-widest text-primary"
          >
            {brand.tagline}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-display text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl"
          >
            {brand.name}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-fib-5 text-lg text-muted-foreground max-w-lg"
          >
            {brand.description}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-fib-6 flex gap-fib-4"
          >
            <Link
              href="/contact"
              className="btn-cta rounded-fib-3 px-fib-6 py-fib-4 text-base font-medium text-white"
            >
              Get Started
            </Link>
            <Link
              href="/about"
              className="rounded-fib-3 border border-border px-fib-6 py-fib-4 text-base font-medium text-foreground transition-colors hover:bg-muted"
            >
              Learn More
            </Link>
          </motion.div>
        </div>

        {/* Visual side — sacred geometry */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="hidden lg:flex items-center justify-center"
        >
          <FlowerOfLife size={500} opacity={0.08} />
        </motion.div>
      </div>
    </section>
  );
}

function FullscreenHero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background">
      <div className="absolute inset-0 sacred-pattern" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />

      <div className="relative z-10 text-center px-fib-5">
        <motion.h1
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="font-display text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl text-gradient-brand"
        >
          {brand.name}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-fib-5 text-xl text-muted-foreground"
        >
          {brand.tagline}
        </motion.p>
      </div>
    </section>
  );
}

const heroVariants: Record<HeroVariant, React.FC> = {
  centered: CenteredHero,
  split: SplitHero,
  fullscreen: FullscreenHero,
  parallax: CenteredHero, // Parallax uses centered layout but with ParallaxLayer — upgraded per-site
};

export function HeroSection({ variant }: HeroSectionProps) {
  const Hero = heroVariants[variant || brand.heroVariant];
  return <Hero />;
}
