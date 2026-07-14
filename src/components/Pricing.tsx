"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface PricingTier {
  name: string;
  price: string;
  features: string[];
  featured?: boolean;
  ctaLabel: string;
}

const TIERS: PricingTier[] = [
  {
    name: "Seed",
    price: "$99",
    features: ["Single active listing", "Basic applicant tracking", "Standard support"],
    ctaLabel: "Start with Seed",
  },
  {
    name: "Growth",
    price: "$299",
    features: ["5 active listings", "Featured placement", "Advanced filtering tools", "Priority support"],
    featured: true,
    ctaLabel: "Choose Growth",
  },
  {
    name: "Scale",
    price: "$599",
    features: ["Unlimited active listings", "Dedicated account manager", "API access", "Custom branding"],
    ctaLabel: "Contact for Scale",
  },
];

const FAQS = [
  {
    question: "Can I change plans at any time?",
    answer:
      "Absolutely. You can upgrade or downgrade your plan at any time from your dashboard. Price adjustments will be prorated for the remainder of your billing cycle.",
  },
  {
    question: "What kind of listings are allowed?",
    answer:
      "Niyog is a platform for high-quality, professional roles. We vet all listings to ensure they provide fair compensation and clear responsibilities for creative, technical, and leadership talent.",
  },
  {
    question: "Do you offer a free trial?",
    answer:
      "While we don't offer a traditional trial, our Seed plan is designed to be accessible for individual hires. If you aren't satisfied within the first 14 days, contact our support for a full refund.",
  },
  {
    question: "What is Priority Support?",
    answer:
      "Growth and Scale plan users get access to our dedicated support channel with a guaranteed 4-hour response time during business hours, plus a dedicated account manager for the Scale tier.",
  },
];

export default function PricingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-[#f3ede2] text-[#1a1a1a]">
      <Navbar />

      <main className="mx-auto max-w-7xl px-8 py-8  ">
        {/* Hero */}
        <div className="mb-20 text-center">
          <h1 className="font-serif text-4xl italic leading-tight text-[#1a1a1a] md:text-5xl lg:text-7xl">
            Invest in Quality Talent.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-md leading-relaxed text-[#1a1a1a]/70 md:text-lg">
            Choose a plan that fits your team&apos;s growth, from agile startups to global enterprises.
            Sun-baked simplicity for modern recruitment.
          </p>
        </div>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 items-stretch gap-8 md:grid-cols-3">
          {TIERS.map((tier) => (
            <div
              key={tier.name}
              className={
                tier.featured
                  ? "relative z-10 flex scale-105 flex-col rounded-xl border-2 border-[#e2613a] bg-white p-8 shadow-[0_8px_30px_rgba(226,97,58,0.08)] md:p-12"
                  : "flex flex-col rounded-xl border border-[#1a1a1a]/10 bg-white/70 p-8 shadow-[0_4px_20px_rgba(40,24,8,0.05)] transition-all duration-300 hover:border-[#1a1a1a]/25 md:p-10"
              }
            >
              {tier.featured && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-[#e2613a] px-4 py-1 text-xs font-bold uppercase tracking-widest text-white">
                  Most Popular
                </div>
              )}

              <div className="mb-8">
                <h3 className={`font-serif italic ${tier.featured ? "text-4xl" : "text-3xl"} mb-2`}>
                  {tier.name}
                </h3>
                <div className="flex items-baseline gap-1">
                  <span className={`font-serif text-[#e2613a] ${tier.featured ? "text-5xl" : "text-4xl"}`}>
                    {tier.price}
                  </span>
                  <span className="text-sm text-[#1a1a1a]/60">/mo</span>
                </div>
              </div>

              <div className={`flex-grow ${tier.featured ? "space-y-5 mb-12" : "space-y-4 mb-10"}`}>
                {tier.features.map((feature, idx) => (
                  <div key={feature} className="flex items-start gap-3">
                    <Icon
                      icon={
                        tier.featured && idx === 0
                          ? "material-symbols:stars"
                          : "material-symbols:check-circle"
                      }
                      className="mt-1 h-4 w-4 shrink-0 text-[#e2613a]"
                    />
                    <p className={tier.featured && idx === 0 ? "font-semibold text-[#1a1a1a]" : "text-[#1a1a1a]/70"}>
                      {feature}
                    </p>
                  </div>
                ))}
              </div>

              <button
                type="button"
                className={
                  tier.featured
                    ? "w-full rounded-lg bg-[#e2613a] py-5 text-sm font-bold text-white shadow-[0_10px_24px_rgba(226,97,58,0.25)] transition-all hover:brightness-110 active:scale-95"
                    : "w-full rounded-lg border border-[#e2613a] bg-transparent py-4 text-sm font-bold text-[#e2613a] transition-colors hover:bg-[#e2613a]/10 active:scale-95"
                }
              >
                {tier.ctaLabel}
              </button>
            </div>
          ))}
        </div>

        {/* Atmospheric Image */}
        <div className="group relative mt-32 h-96 overflow-hidden rounded-2xl">
          <div className="absolute inset-0 z-10 bg-[#e2613a]/10 transition-colors duration-700 group-hover:bg-transparent" />
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAn94iknAFvzah1WtoMvhnK8QqxL8zf8t_v4b_tibcC-ktYK-ASNze766T2FmRxr880ffLSFkJ0N4tHk4e_VKll2zsfaND13uf0ASDts_lDqSBfy3rc8gKhPwdg99kqpjHlq5JCiN4KG5ASToeW9I1IDUQb4qPFdgfCl_yqDrJHi4Zac9G0tXn8VrDLyC55osucOYEzbUDSPT2QnYTUB78zvTDKrLEBkMnVtgw3bUDZvfPA4O6KOpdOKg7iFgynxB-Y4ev6QJbWCr4"
            alt="Sun-lit minimalist workspace"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-gradient-to-t from-[#f3ede2]/80 to-transparent p-8 text-center">
            <h2 className="mb-4 font-serif text-4xl italic text-[#1a1a1a]">
              Built for the modern craftsperson.
            </h2>
            <p className="max-w-lg text-[#1a1a1a]/70">
              We prioritize quality over volume. Join 500+ top-tier agencies and startups finding their
              next core team member.
            </p>
          </div>
        </div>

        {/* FAQ */}
        <section className="mx-auto mt-32 max-w-4xl">
          <h2 className="mb-12 text-center font-serif text-4xl italic">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={faq.question}
                  className="cursor-pointer border-b border-[#1a1a1a]/10 pb-6"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-serif text-xl transition-colors hover:text-[#e2613a]">
                      {faq.question}
                    </h4>
                    <Icon
                      icon="material-symbols:expand-more"
                      className={`h-6 w-6 shrink-0 transition-transform duration-300 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      isOpen ? "mt-4 max-h-96 opacity-100" : "max-h-0 opacity-0"
                    }`}
                  >
                    <p className="leading-relaxed text-[#1a1a1a]/70">{faq.answer}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}