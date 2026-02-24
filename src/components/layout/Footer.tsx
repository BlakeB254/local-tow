import Link from "next/link";
import { brand } from "@/config/brand";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-fib-5 py-fib-7">
        <div className="flex flex-col items-center gap-fib-5 md:flex-row md:justify-between">
          {/* Brand */}
          <div>
            <Link href="/" className="font-display text-lg font-bold">
              {brand.name}
            </Link>
            <p className="mt-fib-2 text-sm text-muted-foreground max-w-xs">
              {brand.tagline}
            </p>
          </div>

          {/* Nav Links */}
          <nav className="flex gap-fib-5">
            {brand.nav.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Social Links */}
          {Object.keys(brand.social).length > 0 && (
            <div className="flex gap-fib-4">
              {Object.entries(brand.social).map(([platform, url]) =>
                url ? (
                  <a
                    key={platform}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground hover:text-foreground capitalize transition-colors"
                  >
                    {platform}
                  </a>
                ) : null
              )}
            </div>
          )}
        </div>

        <div className="mt-fib-6 border-t border-border pt-fib-5 text-center text-sm text-muted-foreground">
          &copy; {year} {brand.name}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
