import type { Metadata } from "next";
import { brand } from "@/config/brand";

export function createMetadata(overrides: Partial<Metadata> = {}): Metadata {
  const title = overrides.title ?? brand.seo.title;
  const description = overrides.description ?? brand.seo.description;

  return {
    title: {
      default: typeof title === "string" ? title : brand.seo.title,
      template: brand.seo.titleTemplate,
    },
    description,
    keywords: brand.seo.keywords,
    icons: {
      icon: brand.logo.favicon,
      apple: "/apple-touch-icon.png",
    },
    openGraph: {
      type: "website",
      locale: "en_US",
      siteName: brand.name,
      title: typeof title === "string" ? title : brand.seo.title,
      description: typeof description === "string" ? description : brand.seo.description,
      url: brand.url,
      images: [{ url: brand.logo.ogImage, width: 1200, height: 630, alt: brand.name }],
    },
    twitter: {
      card: "summary_large_image",
      title: typeof title === "string" ? title : brand.seo.title,
      description: typeof description === "string" ? description : brand.seo.description,
      images: [brand.logo.ogImage],
    },
    metadataBase: new URL(brand.url),
    ...overrides,
  };
}
