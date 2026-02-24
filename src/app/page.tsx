"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  MapPin,
  MessageSquare,
  Navigation,
  ShieldCheck,
  Heart,
  DollarSign,
  TrendingDown,
  Truck,
  Users,
  ArrowRight,
  Zap,
  Clock,
  CheckCircle,
  BadgeCheck,
} from "lucide-react";
import { brand, stats, chicagoCommunityAreas } from "@/config/brand";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SectionWrapper } from "@/components/layout/SectionWrapper";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { StaggerChildren, StaggerItem } from "@/components/animations/StaggerChildren";
import { Counter } from "@/components/animations/Counter";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------
   HERO SECTION
   ------------------------------------------------------------------ */
function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white">
      {/* Subtle mesh background */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-[#FF6700]/10 blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-[#003366]/10 blur-[100px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-4 py-1.5 text-sm font-medium text-red-700 border border-red-200">
            <TrendingDown size={14} />
            Stop Tow Gouging
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mt-6 font-display text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl md:text-7xl"
        >
          Community Towing.
          <br />
          <span className="text-[#FF6700]">Fair Prices.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto md:text-xl"
        >
          {brand.description}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-8 flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link
            href="/customer/request/new"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#FF6700] px-8 py-4 text-base font-semibold text-white shadow-lg shadow-[#FF6700]/25 transition-all hover:bg-[#e55d00] hover:shadow-xl hover:shadow-[#FF6700]/30 hover:-translate-y-0.5"
          >
            Get a Tow
            <ArrowRight size={18} />
          </Link>
          <Link
            href="/provider/auth/register"
            className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-[#003366] px-8 py-4 text-base font-semibold text-[#003366] transition-all hover:bg-[#003366] hover:text-white"
          >
            <Truck size={18} />
            Become a Provider
          </Link>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-4 text-sm text-gray-500"
        >
          Launching in {brand.launchMarket} &mdash; {chicagoCommunityAreas.length} community areas
        </motion.p>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------
   HOW IT WORKS
   ------------------------------------------------------------------ */
const howItWorksSteps = [
  {
    icon: MapPin,
    step: "1",
    title: "Enter Your Locations",
    description:
      "Tell us where your vehicle is and where it needs to go. Set the price you want to pay.",
  },
  {
    icon: MessageSquare,
    step: "2",
    title: "Operators Respond",
    description:
      "Nearby tow operators see your request and can accept your price or send a counter-offer.",
  },
  {
    icon: Navigation,
    step: "3",
    title: "Track & Pay",
    description:
      "Track your tow in real time. Pay securely through the app when the job is done.",
  },
];

function HowItWorksSection() {
  return (
    <SectionWrapper id="how-it-works" className="bg-white">
      <ScrollReveal>
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl font-bold text-gray-900 sm:text-4xl">
            How It Works
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Get a tow in three simple steps. No hidden fees, no price surprises.
          </p>
        </div>
      </ScrollReveal>

      <StaggerChildren className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {howItWorksSteps.map((item) => (
          <StaggerItem key={item.step}>
            <div className="relative text-center p-8 rounded-2xl bg-gray-50 border border-gray-100 hover:border-[#FF6700]/30 hover:shadow-lg transition-all">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#FF6700]/10">
                <item.icon size={28} className="text-[#FF6700]" />
              </div>
              <span className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-[#003366] text-xs font-bold text-white">
                {item.step}
              </span>
              <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
              <p className="mt-2 text-sm text-gray-600">{item.description}</p>
            </div>
          </StaggerItem>
        ))}
      </StaggerChildren>
    </SectionWrapper>
  );
}

/* ------------------------------------------------------------------
   PRICE COMPARISON
   ------------------------------------------------------------------ */
function PriceComparisonSection() {
  return (
    <SectionWrapper className="bg-[#003366]">
      <ScrollReveal>
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl font-bold text-white sm:text-4xl">
            See the Difference
          </h2>
          <p className="mt-4 text-lg text-gray-300 max-w-2xl mx-auto">
            Traditional towing companies charge whatever they want. We put pricing power back in your hands.
          </p>
        </div>
      </ScrollReveal>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* Traditional */}
        <ScrollReveal direction="left">
          <div className="rounded-2xl bg-white/5 border border-white/10 p-8 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-12 w-12 rounded-full bg-red-500/20 flex items-center justify-center">
                <TrendingDown size={24} className="text-red-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Traditional Towing</h3>
                <p className="text-sm text-gray-400">What you have been paying</p>
              </div>
            </div>
            <div className="space-y-3">
              {[
                "No price visibility upfront",
                "Base fee + per-mile + surcharges",
                "After-hours markups up to 50%",
                "Hidden storage fees",
                "No way to compare operators",
              ].map((item) => (
                <div key={item} className="flex items-start gap-2 text-sm text-gray-300">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-red-400 shrink-0" />
                  {item}
                </div>
              ))}
            </div>
            <div className="mt-6 text-center">
              <p className="text-3xl font-bold text-red-400">$200 &ndash; $500+</p>
              <p className="text-sm text-gray-400 mt-1">Average tow cost</p>
            </div>
          </div>
        </ScrollReveal>

        {/* Local Tow */}
        <ScrollReveal direction="right">
          <div className="rounded-2xl bg-[#FF6700]/10 border-2 border-[#FF6700]/40 p-8 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <span className="inline-flex items-center gap-1 rounded-full bg-[#FF6700] px-3 py-1 text-xs font-bold text-white">
                <Zap size={12} />
                SAVE 60%+
              </span>
            </div>
            <div className="flex items-center gap-3 mb-6">
              <div className="h-12 w-12 rounded-full bg-[#FF6700]/20 flex items-center justify-center">
                <DollarSign size={24} className="text-[#FF6700]" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Local Tow</h3>
                <p className="text-sm text-gray-300">What you should be paying</p>
              </div>
            </div>
            <div className="space-y-3">
              {[
                "You set the price",
                "Flat rates, no surprises",
                "Same price day or night",
                "No storage fees",
                "$5 max platform fee",
              ].map((item) => (
                <div key={item} className="flex items-start gap-2 text-sm text-gray-200">
                  <CheckCircle size={14} className="mt-0.5 text-[#FF6700] shrink-0" />
                  {item}
                </div>
              ))}
            </div>
            <div className="mt-6 text-center">
              <p className="text-3xl font-bold text-[#FF6700]">$40 &ndash; $60</p>
              <p className="text-sm text-gray-300 mt-1">Average tow cost</p>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </SectionWrapper>
  );
}

/* ------------------------------------------------------------------
   STATS SECTION
   ------------------------------------------------------------------ */
function LocalTowStats() {
  return (
    <SectionWrapper className="bg-gray-50">
      <ScrollReveal>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="font-display text-4xl font-bold text-[#FF6700] sm:text-5xl">
                <Counter
                  value={stat.value}
                  prefix={stat.prefix}
                  suffix={stat.suffix}
                />
              </div>
              <p className="mt-2 text-sm text-gray-600 font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
      </ScrollReveal>
    </SectionWrapper>
  );
}

/* ------------------------------------------------------------------
   WHY WE BUILT THIS (VALUE PROPS)
   ------------------------------------------------------------------ */
const valueProps = [
  {
    icon: DollarSign,
    title: "Price Control",
    description:
      "You name your price. No hidden fees, no surge pricing, no after-hours markups. Just honest, upfront pricing.",
    color: "bg-orange-100 text-[#FF6700]",
  },
  {
    icon: Heart,
    title: "Support Local",
    description:
      "Your money goes to independent operators in your neighborhood, not faceless corporations charging $300 for a 2-mile tow.",
    color: "bg-red-100 text-red-600",
  },
  {
    icon: MapPin,
    title: "Already Nearby",
    description:
      "Our operators live and work in your community area. They are already close by, which means faster response times.",
    color: "bg-blue-100 text-[#003366]",
  },
  {
    icon: BadgeCheck,
    title: "Verified Operators",
    description:
      "Every tow operator is verified with valid licensing, insurance, and real reviews from your neighbors.",
    color: "bg-green-100 text-green-700",
  },
];

function WhyWeBuiltThis() {
  return (
    <SectionWrapper className="bg-white">
      <ScrollReveal>
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl font-bold text-gray-900 sm:text-4xl">
            Why We Built This
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Because nobody should pay $300 to move a car 2 miles. Towing should be fair, local, and transparent.
          </p>
        </div>
      </ScrollReveal>

      <StaggerChildren className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {valueProps.map((prop) => (
          <StaggerItem key={prop.title}>
            <div className="flex gap-4 p-6 rounded-2xl border border-gray-100 hover:border-[#FF6700]/20 hover:shadow-md transition-all bg-white">
              <div className={cn("flex h-12 w-12 shrink-0 items-center justify-center rounded-xl", prop.color)}>
                <prop.icon size={22} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{prop.title}</h3>
                <p className="mt-1 text-sm text-gray-600 leading-relaxed">{prop.description}</p>
              </div>
            </div>
          </StaggerItem>
        ))}
      </StaggerChildren>
    </SectionWrapper>
  );
}

/* ------------------------------------------------------------------
   SERVICE AREA
   ------------------------------------------------------------------ */
function ServiceAreaSection() {
  return (
    <SectionWrapper id="service-area" className="bg-gray-50">
      <ScrollReveal>
        <div className="text-center mb-10">
          <h2 className="font-display text-3xl font-bold text-gray-900 sm:text-4xl">
            All {chicagoCommunityAreas.length} Chicago Community Areas
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Launching across every neighborhood in Chicago. If you live here, we have got you covered.
          </p>
        </div>
      </ScrollReveal>

      <div className="flex flex-wrap gap-2 justify-center max-w-5xl mx-auto">
        {chicagoCommunityAreas.map((area) => (
          <span
            key={area.number}
            className="inline-block rounded-full bg-white border border-gray-200 px-3 py-1 text-xs font-medium text-gray-700 hover:border-[#FF6700] hover:text-[#FF6700] transition-colors cursor-default"
          >
            {area.name}
          </span>
        ))}
      </div>
    </SectionWrapper>
  );
}

/* ------------------------------------------------------------------
   FOR OPERATORS CTA
   ------------------------------------------------------------------ */
function ForOperatorsCTA() {
  return (
    <SectionWrapper id="operators-cta" className="bg-[#003366]">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <ScrollReveal direction="left">
          <div>
            <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/80 mb-4">
              <Truck size={12} />
              For Tow Operators
            </span>
            <h2 className="font-display text-3xl font-bold text-white sm:text-4xl">
              Grow Your Business, Your Way
            </h2>
            <p className="mt-4 text-lg text-gray-300">
              No more waiting by the phone. Get requests from people in your neighborhood who need a tow right now.
            </p>
            <div className="mt-8">
              <Link
                href="/provider/auth/register"
                className="inline-flex items-center gap-2 rounded-xl bg-[#FF6700] px-8 py-4 text-base font-semibold text-white shadow-lg shadow-[#FF6700]/25 transition-all hover:bg-[#e55d00] hover:shadow-xl"
              >
                Sign Up as a Provider
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal direction="right">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Old Way */}
            <div className="rounded-xl bg-white/5 border border-white/10 p-6">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
                Old Way
              </h3>
              <div className="space-y-3">
                {[
                  "Wait for dispatch calls",
                  "Drive across town for jobs",
                  "Company takes 40-60%",
                  "No customer relationship",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-2 text-sm text-gray-400">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-red-400 shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
            </div>

            {/* Local Tow Way */}
            <div className="rounded-xl bg-[#FF6700]/10 border border-[#FF6700]/30 p-6">
              <h3 className="text-sm font-semibold text-[#FF6700] uppercase tracking-wider mb-4">
                Local Tow Way
              </h3>
              <div className="space-y-3">
                {[
                  "Jobs come to you nearby",
                  "Work in your neighborhood",
                  "Keep 90%+ of every job",
                  "Build repeat customers",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-2 text-sm text-gray-200">
                    <CheckCircle size={14} className="mt-0.5 text-[#FF6700] shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </SectionWrapper>
  );
}

/* ------------------------------------------------------------------
   ENHANCED FOOTER (with grouped links)
   ------------------------------------------------------------------ */
function LocalTowFooter() {
  const footerLinks = {
    Customer: [
      { href: "/customer/request/new", label: "Get a Tow" },
      { href: "/customer", label: "My Dashboard" },
      { href: "/faq", label: "FAQ" },
    ],
    Operator: [
      { href: "/provider/auth/register", label: "Become a Provider" },
      { href: "/provider", label: "Provider Dashboard" },
      { href: "/provider/earnings", label: "Earnings" },
    ],
    Company: [
      { href: "/about", label: "About" },
      { href: "/terms", label: "Terms of Service" },
      { href: "/privacy", label: "Privacy Policy" },
    ],
  };

  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="font-display text-xl font-bold text-gray-900">
              {brand.name}
            </Link>
            <p className="mt-2 text-sm text-gray-600 max-w-xs">
              {brand.tagline}
            </p>
            <p className="mt-1 text-sm text-gray-500">{brand.launchMarket}</p>
          </div>

          {/* Link groups */}
          {Object.entries(footerLinks).map(([group, links]) => (
            <div key={group}>
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
                {group}
              </h3>
              <ul className="mt-3 space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-600 hover:text-[#FF6700] transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 border-t border-gray-200 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} {brand.name}. All rights reserved.
          </p>
          <p className="text-sm text-gray-500">
            {brand.contactEmail} &middot; {brand.contactPhone}
          </p>
        </div>
      </div>
    </footer>
  );
}

/* ------------------------------------------------------------------
   PAGE
   ------------------------------------------------------------------ */
export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <HowItWorksSection />
        <PriceComparisonSection />
        <LocalTowStats />
        <WhyWeBuiltThis />
        <ServiceAreaSection />
        <ForOperatorsCTA />
      </main>
      <LocalTowFooter />
    </>
  );
}
