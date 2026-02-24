"use client";

import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { StaggerChildren, StaggerItem } from "@/components/animations/StaggerChildren";
import { SectionWrapper } from "@/components/layout/SectionWrapper";

const testimonials = [
  {
    quote: "An absolutely transformative experience. The attention to detail is unmatched.",
    author: "Jane Doe",
    role: "CEO, Example Co",
  },
  {
    quote: "Professional, creative, and delivered beyond our expectations every time.",
    author: "John Smith",
    role: "Founder, StartupXYZ",
  },
  {
    quote: "The team understood our vision from day one and brought it to life beautifully.",
    author: "Sarah Johnson",
    role: "Director, OrgName",
  },
];

export function TestimonialsSection() {
  return (
    <SectionWrapper id="testimonials">
      <ScrollReveal>
        <div className="text-center mb-fib-7">
          <h2 className="font-display text-3xl font-bold sm:text-4xl">
            What People Say
          </h2>
        </div>
      </ScrollReveal>

      <StaggerChildren className="grid grid-cols-1 md:grid-cols-3 gap-fib-5">
        {testimonials.map((t) => (
          <StaggerItem key={t.author}>
            <blockquote className="rounded-fib-4 border border-border bg-card p-fib-6">
              <p className="text-foreground italic">&ldquo;{t.quote}&rdquo;</p>
              <footer className="mt-fib-4">
                <p className="font-semibold text-sm">{t.author}</p>
                <p className="text-xs text-muted-foreground">{t.role}</p>
              </footer>
            </blockquote>
          </StaggerItem>
        ))}
      </StaggerChildren>
    </SectionWrapper>
  );
}
