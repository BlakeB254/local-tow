"use client";

import { cn } from "@/lib/utils";

interface PortalVortexProps {
  className?: string;
  color?: string;
}

const rings = [
  { radius: 60, duration: 8, direction: 1, strokeWidth: 1.5, opacity: 0.4 },
  { radius: 110, duration: 12, direction: -1, strokeWidth: 1.2, opacity: 0.3 },
  { radius: 170, duration: 16, direction: 1, strokeWidth: 1, opacity: 0.25 },
  { radius: 240, duration: 20, direction: -1, strokeWidth: 0.8, opacity: 0.2 },
  { radius: 320, duration: 24, direction: 1, strokeWidth: 0.6, opacity: 0.15 },
];

/**
 * Concentric rotating rings forming a portal/vortex effect.
 * Ported from graphene-gangway, made brand-color-aware.
 * Best used with immersive mode or as hero background.
 */
export function PortalVortex({ className, color }: PortalVortexProps) {
  const strokeColor = color || "var(--brand-primary, #6366F1)";

  return (
    <div className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      <svg
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        width="700"
        height="700"
        viewBox="0 0 700 700"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <radialGradient id="portal-core" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={strokeColor} stopOpacity="0.35" />
            <stop offset="40%" stopColor={strokeColor} stopOpacity="0.1" />
            <stop offset="100%" stopColor={strokeColor} stopOpacity="0" />
          </radialGradient>
        </defs>

        <circle
          cx="350" cy="350" r="80"
          fill="url(#portal-core)"
          className="animate-[portal-pulse_3s_ease-in-out_infinite]"
        />

        {rings.map((ring, i) => (
          <circle
            key={i}
            cx="350" cy="350" r={ring.radius}
            fill="none"
            stroke={strokeColor}
            strokeWidth={ring.strokeWidth}
            strokeDasharray="8 12"
            opacity={ring.opacity}
            style={{
              transformOrigin: "350px 350px",
              animation: `portal-spin-${ring.direction > 0 ? "cw" : "ccw"} ${ring.duration}s linear infinite`,
            }}
          />
        ))}
      </svg>

      <style jsx>{`
        @keyframes portal-spin-cw {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes portal-spin-ccw {
          from { transform: rotate(0deg); }
          to { transform: rotate(-360deg); }
        }
        @keyframes portal-pulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
