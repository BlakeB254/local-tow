import { createMetadata } from "@/lib/metadata";
import { brand } from "@/config/brand";
import { SectionWrapper } from "@/components/layout/SectionWrapper";
import { ScrollReveal } from "@/components/animations/ScrollReveal";

export const metadata = createMetadata({
  title: `Privacy Policy | ${brand.name}`,
  description: `Privacy Policy for ${brand.name} — how we collect, use, and protect your data.`,
});

export default function PrivacyPage() {
  return (
    <SectionWrapper>
      <ScrollReveal>
        <div className="max-w-3xl mx-auto prose prose-gray">
          <h1 className="font-display text-4xl font-bold text-gray-900">
            Privacy Policy
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Last updated: February 24, 2026
          </p>

          <div className="mt-8 space-y-6 text-gray-600 leading-relaxed">
            <section>
              <h2 className="text-xl font-semibold text-gray-900">1. Information We Collect</h2>
              <p>We collect the following types of information:</p>
              <ul className="list-disc pl-6 space-y-1 mt-2">
                <li><strong>Account Information:</strong> Name, email, phone number, and address when you create an account.</li>
                <li><strong>Location Data:</strong> Pickup and dropoff addresses for tow requests. Real-time GPS location when a job is active (Providers only).</li>
                <li><strong>Payment Information:</strong> Processed securely through our third-party payment processor. We do not store full credit card numbers.</li>
                <li><strong>Vehicle Information:</strong> Make, model, year, and condition of vehicles submitted in tow requests.</li>
                <li><strong>Verification Documents:</strong> Driver&apos;s license, towing license, and insurance certificates (Providers only).</li>
                <li><strong>Usage Data:</strong> How you interact with the platform, device information, and browser type.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900">2. How We Use Your Information</h2>
              <ul className="list-disc pl-6 space-y-1 mt-2">
                <li>To facilitate tow requests between Customers and Providers.</li>
                <li>To process payments and issue payouts.</li>
                <li>To verify Provider credentials and maintain safety standards.</li>
                <li>To send service-related notifications (job updates, account alerts).</li>
                <li>To improve our platform and develop new features.</li>
                <li>To resolve disputes between users.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900">3. Location Data</h2>
              <p>
                We collect location data to match Customers with nearby Providers and to enable
                real-time job tracking. Provider GPS location is only shared with the Customer
                during an active job. We do not track your location when you are offline or
                outside of active jobs.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900">4. Data Sharing</h2>
              <p>We share your information only in the following circumstances:</p>
              <ul className="list-disc pl-6 space-y-1 mt-2">
                <li><strong>Between Users:</strong> Limited information is shared between Customers and Providers during a tow (name, phone, location).</li>
                <li><strong>Payment Processing:</strong> With our payment processor to handle transactions.</li>
                <li><strong>Legal Requirements:</strong> When required by law or to protect our rights.</li>
                <li><strong>With Your Consent:</strong> For any other purpose with your explicit permission.</li>
              </ul>
              <p className="mt-2">
                We do not sell your personal information to third parties.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900">5. Data Security</h2>
              <p>
                We use industry-standard security measures to protect your data, including
                encryption in transit and at rest. However, no method of electronic transmission
                or storage is 100% secure.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900">6. Data Retention</h2>
              <p>
                We retain your account data for as long as your account is active. Job history
                and transaction records are retained for 7 years for legal and financial reporting
                purposes. You may request deletion of your account at any time.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900">7. Your Rights</h2>
              <p>You have the right to:</p>
              <ul className="list-disc pl-6 space-y-1 mt-2">
                <li>Access the personal data we hold about you.</li>
                <li>Request correction of inaccurate data.</li>
                <li>Request deletion of your account and associated data.</li>
                <li>Opt out of marketing communications.</li>
                <li>Export your data in a portable format.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900">8. Children&apos;s Privacy</h2>
              <p>
                The Service is not intended for users under 18 years of age. We do not knowingly
                collect information from children.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900">9. Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. We will notify you of
                significant changes via email or through the platform.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900">10. Contact Us</h2>
              <p>
                If you have questions about this Privacy Policy or your data, contact us at{" "}
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
