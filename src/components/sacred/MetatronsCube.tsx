"use client";

import { cn } from "@/lib/utils";

interface MetatronsCubeProps {
  className?: string;
  size?: number;
  opacity?: number;
  color?: string;
  animate?: boolean;
}

/**
 * Metatron's Cube — 13 circles connected by lines forming all Platonic solids.
 * Used as a background element. Optionally rotates slowly when animate=true.
 */
export function MetatronsCube({
  className,
  size = 500,
  opacity = 0.05,
  color = "currentColor",
  animate = false,
}: MetatronsCubeProps) {
  const cx = size / 2;
  const cy = size / 2;
  const r1 = size / 6;   // Inner ring radius from center
  const r2 = size / 3;   // Outer ring radius from center
  const cr = size / 20;  // Circle radius

  // Center point
  const center = { x: cx, y: cy };

  // Inner ring — 6 points
  const inner = Array.from({ length: 6 }, (_, i) => {
    const angle = (i * 60 - 90) * (Math.PI / 180);
    return { x: cx + r1 * Math.cos(angle), y: cy + r1 * Math.sin(angle) };
  });

  // Outer ring — 6 points (offset by 30 degrees)
  const outer = Array.from({ length: 6 }, (_, i) => {
    const angle = (i * 60 - 60) * (Math.PI / 180);
    return { x: cx + r2 * Math.cos(angle), y: cy + r2 * Math.sin(angle) };
  });

  const allPoints = [center, ...inner, ...outer];

  // Generate all connecting lines between all 13 points
  const lines: { x1: number; y1: number; x2: number; y2: number }[] = [];
  for (let i = 0; i < allPoints.length; i++) {
    for (let j = i + 1; j < allPoints.length; j++) {
      lines.push({
        x1: allPoints[i].x, y1: allPoints[i].y,
        x2: allPoints[j].x, y2: allPoints[j].y,
      });
    }
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      xmlns="http://www.w3.org/2000/svg"
      className={cn("pointer-events-none", className)}
      aria-hidden="true"
      style={animate ? { animation: "spin 120s linear infinite" } : undefined}
    >
      {/* Connecting lines */}
      {lines.map((l, i) => (
        <line
          key={`l-${i}`}
          x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2}
          stroke={color} strokeWidth="0.3" opacity={opacity * 0.6}
        />
      ))}
      {/* Circles at each vertex */}
      {allPoints.map((p, i) => (
        <circle
          key={`c-${i}`}
          cx={p.x} cy={p.y} r={cr}
          fill="none" stroke={color} strokeWidth="0.5" opacity={opacity}
        />
      ))}
    </svg>
  );
}
