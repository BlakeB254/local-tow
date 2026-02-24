import { createMetadata } from "@/lib/metadata";
import { brand } from "@/config/brand";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SectionWrapper } from "@/components/layout/SectionWrapper";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { Mail } from "lucide-react";

export const metadata = createMetadata({
  title: `Contact | ${brand.name}`,
  description: `Get in touch with ${brand.name}.`,
});

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main className="pt-fib-9">
        <SectionWrapper>
          <ScrollReveal>
            <div className="max-w-2xl mx-auto text-center">
              <h1 className="font-display text-4xl font-bold sm:text-5xl">
                Get In Touch
              </h1>
              <p className="mt-fib-5 text-lg text-muted-foreground">
                We&apos;d love to hear from you. Reach out and let&apos;s build something great together.
              </p>

              <div className="mt-fib-7">
                <a
                  href={`mailto:${brand.contactEmail}`}
                  className="btn-cta inline-flex items-center gap-fib-3 rounded-fib-3 px-fib-6 py-fib-4 text-base font-medium text-white"
                >
                  <Mail size={20} />
                  {brand.contactEmail}
                </a>
              </div>
            </div>
          </ScrollReveal>
        </SectionWrapper>
      </main>
      <Footer />
    </>
  );
}
