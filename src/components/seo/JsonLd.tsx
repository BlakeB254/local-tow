import { brand } from "@/config/brand";

export function OrganizationJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: brand.name,
    description: brand.description,
    url: brand.url,
    ...(brand.contactEmail && { email: brand.contactEmail }),
    ...(brand.social.twitter && {
      sameAs: Object.values(brand.social).filter(Boolean),
    }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function WebSiteJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: brand.name,
    url: brand.url,
    description: brand.description,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
