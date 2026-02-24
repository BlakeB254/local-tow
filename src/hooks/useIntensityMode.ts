"use client";

import { brand, type IntensityMode } from "@/config/brand";

/**
 * Returns the site's intensity mode from brand config.
 * "subtle" = golden ratio layouts, gentle geometric patterns
 * "immersive" = full parallax, DMT visuals, particle fields
 */
export function useIntensityMode(): IntensityMode {
  return brand.intensity;
}
