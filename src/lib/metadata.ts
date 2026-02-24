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
    openGraph: {
      type: "website",
      locale: "en_US",
      siteName: brand.name,
      title: typeof title === "string" ? title : brand.seo.title,
      description: typeof description === "string" ? description : brand.seo.description,
      url: brand.url,
    },
    twitter: {
      card: "summary_large_image",
      title: typeof title === "string" ? title : brand.seo.title,
      description: typeof description === "string" ? description : brand.seo.description,
    },
    metadataBase: new URL(brand.url),
    ...overrides,
  };
}
