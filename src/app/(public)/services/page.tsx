import { createMetadata } from "@/lib/metadata";
import { brand } from "@/config/brand";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FeaturesGrid } from "@/components/sections/FeaturesGrid";

export const metadata = createMetadata({
  title: `Services | ${brand.name}`,
  description: `Services and offerings from ${brand.name}.`,
});

export default function ServicesPage() {
  return (
    <>
      <Navbar />
      <main className="pt-fib-9">
        <FeaturesGrid />
      </main>
      <Footer />
    </>
  );
}
