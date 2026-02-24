"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { brand } from "@/config/brand";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const defaultTheme =
    brand.darkMode === "dark-only"
      ? "dark"
      : brand.darkMode === "light-only"
        ? "light"
        : "system";

  const enableSystem = brand.darkMode === "toggle";

  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme={defaultTheme}
      enableSystem={enableSystem}
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  );
}
