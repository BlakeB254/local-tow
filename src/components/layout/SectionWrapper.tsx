import { cn } from "@/lib/utils";

interface SectionWrapperProps {
  children: React.ReactNode;
  id?: string;
  className?: string;
  /** Full-bleed removes max-width constraint */
  fullBleed?: boolean;
}

/**
 * Consistent section wrapper with sacred geometry spacing.
 * Uses Fibonacci py-fib-9 (144px) for major section gaps.
 */
export function SectionWrapper({ children, id, className, fullBleed }: SectionWrapperProps) {
  return (
    <section id={id} className={cn("py-fib-8 md:py-fib-9", className)}>
      <div className={cn(!fullBleed && "mx-auto max-w-7xl px-fib-5")}>
        {children}
      </div>
    </section>
  );
}
