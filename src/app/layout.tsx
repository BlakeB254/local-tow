import type { Viewport } from "next";
import { inter, spaceGrotesk, jetbrainsMono } from "@/lib/fonts";
import { createMetadata } from "@/lib/metadata";
import { brand } from "@/config/brand";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { OrganizationJsonLd, WebSiteJsonLd } from "@/components/seo/JsonLd";
import "./globals.css";

export const metadata = createMetadata();

export const viewport: Viewport = {
  themeColor: brand.colors.primary,
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Inject brand colors as CSS custom properties
  const brandStyle = {
    "--brand-primary": brand.colors.primary,
    "--brand-accent": brand.colors.accent,
    "--brand-bg": brand.colors.background,
    "--brand-surface": brand.colors.surface,
    "--brand-muted": brand.colors.muted,
  } as React.CSSProperties;

  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
      style={brandStyle}
    >
      <body className="min-h-screen bg-background text-foreground antialiased overflow-x-hidden">
        <ThemeProvider>
          <OrganizationJsonLd />
          <WebSiteJsonLd />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
