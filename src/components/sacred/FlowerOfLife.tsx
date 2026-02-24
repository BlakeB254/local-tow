"use client";

import { cn } from "@/lib/utils";

interface FlowerOfLifeProps {
  className?: string;
  size?: number;
  opacity?: number;
  color?: string;
}

/**
 * Flower of Life — overlapping circles forming the classic sacred geometry pattern.
 * Used as a subtle background decoration in "subtle" mode.
 */
export function FlowerOfLife({
  className,
  size = 400,
  opacity = 0.06,
  color = "currentColor",
}: FlowerOfLifeProps) {
  const r = size / 6;
  const cx = size / 2;
  const cy = size / 2;

  // 6 circles around center + center circle = Seed of Life pattern
  const angles = [0, 60, 120, 180, 240, 300];
  const circles = angles.map((angle) => {
    const rad = (angle * Math.PI) / 180;
    return {
      cx: cx + r * Math.cos(rad),
      cy: cy + r * Math.sin(rad),
    };
  });

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      xmlns="http://www.w3.org/2000/svg"
      className={cn("pointer-events-none", className)}
      aria-hidden="true"
    >
      {/* Center circle */}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth="0.5" opacity={opacity} />
      {/* Surrounding circles */}
      {circles.map((c, i) => (
        <circle key={i} cx={c.cx} cy={c.cy} r={r} fill="none" stroke={color} strokeWidth="0.5" opacity={opacity} />
      ))}
      {/* Outer ring */}
      <circle cx={cx} cy={cy} r={r * 2} fill="none" stroke={color} strokeWidth="0.3" opacity={opacity * 0.5} />
    </svg>
  );
}
