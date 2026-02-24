"use client";

import { useState } from "react";
import { brand } from "@/config/brand";
import { SectionWrapper } from "@/components/layout/SectionWrapper";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Users, Truck } from "lucide-react";
import { cn } from "@/lib/utils";

const customerFAQs = [
  {
    q: "How does pricing work?",
    a: "You set the price you want to pay when you create a tow request. Nearby operators can accept your price or send a counter-offer. There are no hidden fees, no surge pricing, and no after-hours markups. The price you agree on is the price you pay.",
  },
  {
    q: "What is the platform fee?",
    a: "We charge a 10% platform fee on every job, capped at $5.00 maximum. So on a $50 tow, the fee is $5. On a $100 tow, the fee is still $5. The operator receives the rest. This fee covers payment processing, insurance verification, and platform maintenance.",
  },
  {
    q: "How do I track my tow?",
    a: "Once an operator accepts your request, you can track their location in real time on the job tracking page. You will receive notifications at each stage: when they are en route, when they arrive at your vehicle, and when your car has been delivered.",
  },
  {
    q: "What if no one accepts my request?",
    a: "If your price is too low for the distance, operators may not respond. We provide price guidance based on the distance to help you set a fair price. You can always increase your offer or wait for operators to send counter-offers.",
  },
  {
    q: "Is my vehicle insured during the tow?",
    a: "Yes. All operators on Local Tow are required to carry active commercial towing insurance. We verify insurance documentation during the registration process and re-verify periodically.",
  },
  {
    q: "What types of vehicles can be towed?",
    a: "Most standard passenger vehicles, SUVs, and light trucks. For heavy-duty vehicles, motorcycles, or specialty vehicles, mention this in your request notes so operators with the right equipment can respond.",
  },
  {
    q: "How do I pay?",
    a: "Payment is handled securely through the platform. You will not be charged until the job is marked complete. We accept all major credit and debit cards.",
  },
  {
    q: "Can I cancel a request?",
    a: "You can cancel a request at any time before an operator begins the tow (before they arrive at your vehicle). If you cancel after the operator is already en route, a small cancellation fee may apply to compensate the operator for their time and fuel.",
  },
];

const providerFAQs = [
  {
    q: "How do I become a provider?",
    a: "Sign up through our provider registration page. You will need to provide your personal information, equipment details, service areas, and verification documents (driver's license, towing license, insurance). We review applications within 24-48 hours.",
  },
  {
    q: "How do payouts work?",
    a: "You receive the full customer payment minus our platform fee (10%, max $5). Payouts are processed weekly via direct deposit. For example, on a $50 job you receive $45. On a $100 job, you receive $95.",
  },
  {
    q: "What areas are covered?",
    a: `We are launching across all 77 community areas in Chicago. During registration, you select which community areas you want to serve. You will only see requests from your selected areas.`,
  },
  {
    q: "Can I set my own hours?",
    a: "Absolutely. You toggle online/offline whenever you want. There are no minimum hours, no shifts, and no penalties for going offline. Work when it works for you.",
  },
  {
    q: "What equipment do I need?",
    a: "You need a registered and insured tow vehicle (flatbed, wheel-lift, or dolly). We support all standard tow equipment types. You will specify your equipment during registration so customers know what to expect.",
  },
  {
    q: "How do I get more jobs?",
    a: "Three things help: serving more community areas, maintaining a high rating, and responding quickly to requests. Operators who respond within minutes get significantly more accepted offers.",
  },
  {
    q: "What if a customer disputes a charge?",
    a: "We have a dispute resolution process. Both parties can submit their account, and our team reviews the evidence. Job photos (which we encourage you to take at pickup and dropoff) are the best way to protect yourself.",
  },
];

type TabValue = "customers" | "providers";

export default function FAQPage() {
  const [activeTab, setActiveTab] = useState<TabValue>("customers");

  return (
    <>
      <SectionWrapper>
        <ScrollReveal>
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <h1 className="font-display text-4xl font-bold text-gray-900 sm:text-5xl">
                Frequently Asked Questions
              </h1>
              <p className="mt-4 text-lg text-gray-600">
                Everything you need to know about {brand.name}.
              </p>
            </div>

            {/* Tab buttons */}
            <div className="flex justify-center gap-2 mb-8">
              <button
                onClick={() => setActiveTab("customers")}
                className={cn(
                  "flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-medium transition-all",
                  activeTab === "customers"
                    ? "bg-[#FF6700] text-white shadow-md"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                )}
              >
                <Users size={16} />
                For Customers
              </button>
              <button
                onClick={() => setActiveTab("providers")}
                className={cn(
                  "flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-medium transition-all",
                  activeTab === "providers"
                    ? "bg-[#FF6700] text-white shadow-md"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                )}
              >
                <Truck size={16} />
                For Providers
              </button>
            </div>

            {/* Customer FAQs */}
            {activeTab === "customers" && (
              <Accordion type="single" collapsible className="space-y-2">
                {customerFAQs.map((faq, i) => (
                  <AccordionItem
                    key={i}
                    value={`customer-${i}`}
                    className="border border-gray-200 rounded-xl px-4 data-[state=open]:border-[#FF6700]/30 data-[state=open]:bg-orange-50/30"
                  >
                    <AccordionTrigger className="text-left text-sm font-medium text-gray-900 hover:text-[#FF6700] hover:no-underline py-4">
                      {faq.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-sm text-gray-600 leading-relaxed pb-4">
                      {faq.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            )}

            {/* Provider FAQs */}
            {activeTab === "providers" && (
              <Accordion type="single" collapsible className="space-y-2">
                {providerFAQs.map((faq, i) => (
                  <AccordionItem
                    key={i}
                    value={`provider-${i}`}
                    className="border border-gray-200 rounded-xl px-4 data-[state=open]:border-[#FF6700]/30 data-[state=open]:bg-orange-50/30"
                  >
                    <AccordionTrigger className="text-left text-sm font-medium text-gray-900 hover:text-[#FF6700] hover:no-underline py-4">
                      {faq.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-sm text-gray-600 leading-relaxed pb-4">
                      {faq.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            )}
          </div>
        </ScrollReveal>
      </SectionWrapper>

      {/* CTA */}
      <SectionWrapper className="bg-gray-50">
        <ScrollReveal>
          <div className="text-center max-w-xl mx-auto">
            <h2 className="font-display text-2xl font-bold text-gray-900">
              Still have questions?
            </h2>
            <p className="mt-2 text-gray-600">
              Reach out to our team and we will get back to you within 24 hours.
            </p>
            <a
              href={`mailto:${brand.contactEmail}`}
              className="mt-6 inline-flex items-center justify-center rounded-xl bg-[#FF6700] px-8 py-3 text-sm font-semibold text-white transition-all hover:bg-[#e55d00]"
            >
              Contact Support
            </a>
          </div>
        </ScrollReveal>
      </SectionWrapper>
    </>
  );
}
