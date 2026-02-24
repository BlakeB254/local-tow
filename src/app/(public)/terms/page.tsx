import { createMetadata } from "@/lib/metadata";
import { brand } from "@/config/brand";
import { SectionWrapper } from "@/components/layout/SectionWrapper";
import { ScrollReveal } from "@/components/animations/ScrollReveal";

export const metadata = createMetadata({
  title: `Terms of Service | ${brand.name}`,
  description: `Terms of Service for ${brand.name} — community towing marketplace.`,
});

export default function TermsPage() {
  return (
    <SectionWrapper>
      <ScrollReveal>
        <div className="max-w-3xl mx-auto prose prose-gray">
          <h1 className="font-display text-4xl font-bold text-gray-900">
            Terms of Service
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Last updated: February 24, 2026
          </p>

          <div className="mt-8 space-y-6 text-gray-600 leading-relaxed">
            <section>
              <h2 className="text-xl font-semibold text-gray-900">1. Agreement to Terms</h2>
              <p>
                By accessing or using the {brand.name} platform (&quot;Service&quot;), you agree to be
                bound by these Terms of Service (&quot;Terms&quot;). If you do not agree to these Terms,
                you may not use the Service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900">2. Description of Service</h2>
              <p>
                {brand.name} is a marketplace platform that connects vehicle owners (&quot;Customers&quot;)
                with independent tow operators (&quot;Providers&quot;). We facilitate the connection but
                are not a towing company. All towing services are provided by independent Providers.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900">3. User Accounts</h2>
              <p>
                You must create an account to use certain features of the Service. You are responsible
                for maintaining the confidentiality of your account credentials and for all activities
                that occur under your account.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900">4. Pricing and Fees</h2>
              <p>
                Customers set the price for tow requests. Providers may accept the offered price or
                submit counter-offers. {brand.name} charges a platform fee of 10% per transaction,
                capped at $5.00. This fee is deducted from the Customer&apos;s payment before the
                Provider receives their payout.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900">5. Provider Requirements</h2>
              <p>
                Providers must maintain valid towing licenses, commercial vehicle insurance, and a
                valid driver&apos;s license. {brand.name} reserves the right to verify these documents
                and suspend or terminate any Provider account that fails to meet requirements.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900">6. Cancellation Policy</h2>
              <p>
                Customers may cancel requests before a Provider begins transit to the pickup location
                at no cost. Cancellations after a Provider is en route may incur a cancellation fee.
                Providers who repeatedly cancel accepted jobs may have their accounts suspended.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900">7. Limitation of Liability</h2>
              <p>
                {brand.name} is a marketplace facilitator and does not provide towing services directly.
                We are not liable for any damages to vehicles during towing, personal injury, or any
                disputes between Customers and Providers. All Providers are required to carry their
                own insurance.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900">8. Dispute Resolution</h2>
              <p>
                In the event of a dispute between a Customer and a Provider, both parties agree to
                first attempt to resolve the matter through our platform&apos;s dispute resolution
                process before pursuing any legal action.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900">9. Modifications</h2>
              <p>
                We reserve the right to modify these Terms at any time. We will notify users of
                significant changes via email or through the platform. Continued use of the Service
                after modifications constitutes acceptance of the updated Terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900">10. Contact</h2>
              <p>
                If you have questions about these Terms, contact us at{" "}
                <a href={`mailto:${brand.contactEmail}`} className="text-[#FF6700] hover:underline">
                  {brand.contactEmail}
                </a>
                .
              </p>
            </section>
          </div>
        </div>
      </ScrollReveal>
    </SectionWrapper>
  );
}
