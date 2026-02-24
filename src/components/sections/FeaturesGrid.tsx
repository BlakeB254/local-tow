"use client";

import { Zap, Shield, Globe, Sparkles, BarChart3, HeartHandshake } from "lucide-react";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { StaggerChildren, StaggerItem } from "@/components/animations/StaggerChildren";
import { SectionWrapper } from "@/components/layout/SectionWrapper";

const features = [
  {
    icon: Zap,
    title: "Fast & Efficient",
    description: "Built for speed with optimized performance at every layer.",
  },
  {
    icon: Shield,
    title: "Secure by Design",
    description: "Enterprise-grade security baked into the foundation.",
  },
  {
    icon: Globe,
    title: "Global Reach",
    description: "Deployed worldwide for low-latency access anywhere.",
  },
  {
    icon: Sparkles,
    title: "Modern Experience",
    description: "Clean, intuitive interfaces that users love.",
  },
  {
    icon: BarChart3,
    title: "Data-Driven",
    description: "Analytics and insights to guide smart decisions.",
  },
  {
    icon: HeartHandshake,
    title: "Community First",
    description: "Built with and for the community we serve.",
  },
];

export function FeaturesGrid() {
  return (
    <SectionWrapper id="features">
      <ScrollReveal>
        <div className="text-center mb-fib-7">
          <h2 className="font-display text-3xl font-bold sm:text-4xl">
            Why Choose Us
          </h2>
          <p className="mt-fib-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to succeed, nothing you don&apos;t.
          </p>
        </div>
      </ScrollReveal>

      <StaggerChildren className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-fib-5">
        {features.map((feature) => (
          <StaggerItem key={feature.title}>
            <div className="group rounded-fib-4 border border-border bg-card p-fib-6 transition-all hover:border-primary/30 hover:shadow-lg">
              <div className="mb-fib-4 inline-flex rounded-fib-3 bg-primary/10 p-fib-3 text-primary">
                <feature.icon size={24} />
              </div>
              <h3 className="font-display text-lg font-semibold">{feature.title}</h3>
              <p className="mt-fib-2 text-sm text-muted-foreground">{feature.description}</p>
            </div>
          </StaggerItem>
        ))}
      </StaggerChildren>
    </SectionWrapper>
  );
}
