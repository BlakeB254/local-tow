/**
 * Sacred geometry mathematical constants and utilities.
 * Golden ratio (PHI) and Fibonacci sequence for harmonious design proportions.
 */

/** The golden ratio — φ ≈ 1.618033988749895 */
export const PHI = (1 + Math.sqrt(5)) / 2;

/** Inverse golden ratio — 1/φ ≈ 0.618033988749895 */
export const PHI_INVERSE = 1 / PHI;

/** Fibonacci sequence values used in spacing/sizing */
export const FIBONACCI = [1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610, 987, 1597] as const;

/** Fibonacci spacing scale in pixels (starting from 3px) */
export const FIB_SPACING = [3, 5, 8, 13, 21, 34, 55, 89, 144] as const;

/** Fibonacci-based animation durations in milliseconds */
export const FIB_DURATIONS = [144, 233, 377, 610, 987] as const;

/** Fibonacci-based breakpoints in pixels */
export const FIB_BREAKPOINTS = { sm: 377, md: 610, lg: 987, xl: 1597 } as const;

/**
 * Generate a Fibonacci number at a given index.
 * fibonacci(0) = 1, fibonacci(6) = 13
 */
export function fibonacci(n: number): number {
  if (n <= 1) return 1;
  let a = 1, b = 1;
  for (let i = 2; i <= n; i++) {
    [a, b] = [b, a + b];
  }
  return b;
}

/**
 * Scale a value by the golden ratio.
 * phiScale(16, 1) = 25.888... (one step up)
 * phiScale(16, -1) = 9.888... (one step down)
 */
export function phiScale(base: number, steps: number): number {
  return base * Math.pow(PHI, steps);
}

/**
 * Generate a phi-scaled type scale from a base size.
 * Returns sizes from -2 steps to +4 steps.
 */
export function phiTypeScale(base: number = 16) {
  return {
    xs: phiScale(base, -2),
    sm: phiScale(base, -1),
    base,
    lg: phiScale(base, 1),
    xl: phiScale(base, 2),
    "2xl": phiScale(base, 3),
    "3xl": phiScale(base, 4),
  };
}

/**
 * Calculate the golden ratio split for a container width.
 * Returns [larger, smaller] sections.
 */
export function goldenSplit(total: number): [number, number] {
  const larger = total / PHI;
  const smaller = total - larger;
  return [larger, smaller];
}
