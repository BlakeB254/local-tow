import { createMetadata } from "@/lib/metadata";
import { brand } from "@/config/brand";
import { SectionWrapper } from "@/components/layout/SectionWrapper";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { StaggerChildren, StaggerItem } from "@/components/animations/StaggerChildren";
import {
  Heart,
  Shield,
  Users,
  MapPin,
  DollarSign,
  Lightbulb,
} from "lucide-react";

export const metadata = createMetadata({
  title: `About | ${brand.name}`,
  description: `Learn more about ${brand.name} — our mission to make towing fair for everyone in Chicago.`,
});

const values = [
  {
    icon: DollarSign,
    title: "Transparency First",
    description:
      "No hidden fees. No surge pricing. No after-hours markups. You know exactly what you will pay before the tow truck arrives.",
  },
  {
    icon: Heart,
    title: "Community Over Corporations",
    description:
      "We connect you with independent operators who live in your neighborhood, not distant dispatch centers.",
  },
  {
    icon: Shield,
    title: "Trust & Safety",
    description:
      "Every operator is verified, insured, and rated by real customers. Your vehicle is in good hands.",
  },
  {
    icon: Users,
    title: "Fair for Everyone",
    description:
      "Customers save money, operators earn more. We only take a small platform fee capped at $5, so the value stays local.",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Mission Statement */}
      <SectionWrapper>
        <ScrollReveal>
          <div className="max-w-3xl mx-auto">
            <span className="inline-block rounded-full bg-[#FF6700]/10 px-4 py-1.5 text-sm font-medium text-[#FF6700] mb-4">
              Our Mission
            </span>
            <h1 className="font-display text-4xl font-bold text-gray-900 sm:text-5xl">
              Towing Should Be <span className="text-[#FF6700]">Fair</span>
            </h1>
            <div className="mt-8 space-y-5 text-lg text-gray-600 leading-relaxed">
              <p>
                {brand.name} was born from a simple frustration: why does it cost $300 to move a car
                two miles? The traditional towing industry is built on opacity &mdash; hidden fees,
                surge pricing, and customers who have no choice but to pay whatever is demanded during
                their most stressful moments.
              </p>
              <p>
                We are building a different kind of towing marketplace. One where <strong>you set the
                price</strong>, local operators compete for your business, and the whole process is
                transparent from start to finish.
              </p>
            </div>
          </div>
        </ScrollReveal>
      </SectionWrapper>

      {/* The Story */}
      <SectionWrapper className="bg-gray-50">
        <ScrollReveal>
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-2 mb-4">
              <Lightbulb size={20} className="text-[#FF6700]" />
              <h2 className="font-display text-2xl font-bold text-gray-900">
                The Story
              </h2>
            </div>
            <div className="space-y-5 text-gray-600 leading-relaxed">
              <p>
                It started on a cold January night on the West Side of Chicago. A flat tire, a dead phone
                battery, and a $350 tow bill for a three-mile trip. That moment made something clear:
                towing prices are not based on the work being done &mdash; they are based on how stuck
                you are.
              </p>
              <p>
                Chicago has <strong>77 community areas</strong>, each with its own character, its own
                small businesses, and its own independent tow operators. Many of these operators are
                already driving through your neighborhood every day. They do not need to charge $300.
                They just need a way to find you.
              </p>
              <p>
                That is what {brand.name} does. We match vehicle owners who need a tow with
                operators who are already nearby. The result? A typical tow that would cost $200-500
                through traditional channels costs <strong>$40-60</strong> on our platform.
              </p>
            </div>
          </div>
        </ScrollReveal>
      </SectionWrapper>

      {/* Chicago Focus */}
      <SectionWrapper>
        <ScrollReveal>
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-2 mb-4">
              <MapPin size={20} className="text-[#FF6700]" />
              <h2 className="font-display text-2xl font-bold text-gray-900">
                Built for Chicago
              </h2>
            </div>
            <div className="space-y-5 text-gray-600 leading-relaxed">
              <p>
                We are not trying to be everywhere at once. {brand.name} is launching in Chicago
                because this is our city. We know the neighborhoods, we understand the transit patterns,
                and we have seen firsthand how predatory towing hurts communities.
              </p>
              <p>
                By focusing on Chicago&apos;s 77 community areas, we can build the kind of dense,
                hyper-local network that makes this model work. When an operator is already two blocks
                away, they can offer a tow for a fraction of what a company dispatching from 15 miles
                away would charge.
              </p>
              <p>
                Our vision is to expand to other cities, but only after we have proven the model here
                at home.
              </p>
            </div>
          </div>
        </ScrollReveal>
      </SectionWrapper>

      {/* Values */}
      <SectionWrapper className="bg-gray-50">
        <ScrollReveal>
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl font-bold text-gray-900 sm:text-4xl">
              What We Believe
            </h2>
          </div>
        </ScrollReveal>

        <StaggerChildren className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {values.map((value) => (
            <StaggerItem key={value.title}>
              <div className="flex gap-4 p-6 rounded-2xl bg-white border border-gray-100">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#FF6700]/10">
                  <value.icon size={22} className="text-[#FF6700]" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{value.title}</h3>
                  <p className="mt-1 text-sm text-gray-600 leading-relaxed">
                    {value.description}
                  </p>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerChildren>
      </SectionWrapper>

      {/* CTA */}
      <SectionWrapper className="bg-[#003366]">
        <ScrollReveal>
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="font-display text-3xl font-bold text-white sm:text-4xl">
              Join the Movement
            </h2>
            <p className="mt-4 text-lg text-gray-300">
              Whether you need a tow or you are an operator looking for a better way to work,
              {" "}{brand.name} is here for you.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/customer/request/new"
                className="inline-flex items-center justify-center rounded-xl bg-[#FF6700] px-8 py-4 text-base font-semibold text-white transition-all hover:bg-[#e55d00]"
              >
                Get a Tow
              </a>
              <a
                href="/provider/auth/register"
                className="inline-flex items-center justify-center rounded-xl border-2 border-white/30 px-8 py-4 text-base font-semibold text-white transition-all hover:bg-white/10"
              >
                Become a Provider
              </a>
            </div>
          </div>
        </ScrollReveal>
      </SectionWrapper>
    </>
  );
}
