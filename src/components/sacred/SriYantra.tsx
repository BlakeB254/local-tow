"use client";

import { cn } from "@/lib/utils";

interface SriYantraProps {
  className?: string;
  size?: number;
  opacity?: number;
  color?: string;
}

/**
 * Sri Yantra — simplified representation with concentric triangles.
 * 4 upward triangles (Shiva) and 5 downward triangles (Shakti).
 * Used as a decorative background element.
 */
export function SriYantra({
  className,
  size = 400,
  opacity = 0.06,
  color = "currentColor",
}: SriYantraProps) {
  const cx = size / 2;
  const cy = size / 2;
  const maxR = size * 0.4;

  // Simplified: concentric triangles pointing up and down
  const scales = [1, 0.75, 0.5, 0.3];

  function upTriangle(scale: number) {
    const r = maxR * scale;
    const top = `${cx},${cy - r}`;
    const bl = `${cx - r * 0.866},${cy + r * 0.5}`;
    const br = `${cx + r * 0.866},${cy + r * 0.5}`;
    return `${top} ${bl} ${br}`;
  }

  function downTriangle(scale: number) {
    const r = maxR * scale;
    const bottom = `${cx},${cy + r}`;
    const tl = `${cx - r * 0.866},${cy - r * 0.5}`;
    const tr = `${cx + r * 0.866},${cy - r * 0.5}`;
    return `${bottom} ${tl} ${tr}`;
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      xmlns="http://www.w3.org/2000/svg"
      className={cn("pointer-events-none", className)}
      aria-hidden="true"
    >
      {/* Outer circle */}
      <circle cx={cx} cy={cy} r={maxR} fill="none" stroke={color} strokeWidth="0.5" opacity={opacity} />
      {/* Inner circle */}
      <circle cx={cx} cy={cy} r={maxR * 0.85} fill="none" stroke={color} strokeWidth="0.3" opacity={opacity * 0.7} />
      {/* Upward triangles */}
      {scales.map((s, i) => (
        <polygon
          key={`up-${i}`}
          points={upTriangle(s)}
          fill="none" stroke={color} strokeWidth="0.5" opacity={opacity}
        />
      ))}
      {/* Downward triangles */}
      {scales.map((s, i) => (
        <polygon
          key={`dn-${i}`}
          points={downTriangle(s * 0.9)}
          fill="none" stroke={color} strokeWidth="0.5" opacity={opacity}
        />
      ))}
      {/* Bindu (center point) */}
      <circle cx={cx} cy={cy} r={2} fill={color} opacity={opacity * 2} />
    </svg>
  );
}
