"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Icon } from "@iconify/react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const HELP_CATEGORIES = [
  {
    icon: "material-symbols:person-search-outline",
    title: "For Talent",
    description: "Optimization for your profile, job search tools, and career growth resources.",
  },
  {
    icon: "material-symbols:business-center-outline",
    title: "For Employers",
    description: "Hiring workflows, team management, and finding the perfect Niyog match.",
  },
  {
    icon: "material-symbols:shield-person-outline",
    title: "Account & Security",
    description: "Protecting your data, two-factor authentication, and privacy settings.",
  },
  {
    icon: "material-symbols:receipt-long-outline",
    title: "Billing",
    description: "Invoices, payment methods, and managing your premium subscriptions.",
  },
  {
    icon: "material-symbols:post-add-outline",
    title: "Job Postings",
    description: "Guidelines for listing, visibility controls, and application management.",
  },
  {
    icon: "material-symbols:info-outline",
    title: "Platform Basics",
    description: "New to Niyog? Learn the core features and how to navigate the ecosystem.",
  },
];

const FEATURED_ARTICLES = [
  { text: "How do I verify my account?", href: "#" },
  { text: "Managing listing visibility for recruiters", href: "#" },
  { text: "Understanding our fee structure for sun-baked careers", href: "#" },
  { text: "Updating your portfolio to meet premium standards", href: "#" },
];

export default function SupportPage() {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="min-h-screen bg-[#faf5ee] text-[#3a302a] font-sans selection:bg-[#fbe8d8] selection:text-[#401a08]">
      <Navbar />

      {/* Hero Section Container with Custom Gradient */}
      <main className="bg-[radial-gradient(circle_at_top_right,rgba(194,101,42,0.05),transparent_40%)]">
        
        {/* Search Hero */}
        <section className="max-w-4xl mx-auto pt-24 pb-16 px-6 text-center">
          <h1 className="font-serif text-5xl md:text-7xl italic leading-tight mb-8">
            How can we help?
          </h1>
          <div className="relative max-w-2xl mx-auto">
            <input
              type="text"
              className="w-full h-16 pl-14 pr-6 rounded-full bg-white border border-[#d8d0c8]/40 focus:ring-1 focus:ring-[#c2652a] focus:border-[#c2652a] outline-none transition-all text-lg shadow-[0_2px_16px_rgba(58,48,42,0.04)]"
              placeholder="Search for answers..."
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
            />
            <Icon
              icon="material-symbols:search"
              className={`absolute left-5 top-1/2 -translate-y-1/2 text-xl transition-colors duration-200 ${
                isFocused ? "text-[#c2652a]" : "text-[#9a9088]"
              }`}
            />
          </div>
          <p className="mt-6 text-[#605850] text-sm">
            Or browse topics below to find what you need.
          </p>
        </section>

        {/* Categorized Help Grid */}
        <section className="max-w-7xl mx-auto px-6 py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {HELP_CATEGORIES.map((category) => (
              <div
                key={category.title}
                className="bg-[#f6f0e8] p-8 rounded-xl border border-[#d8d0c8]/30 hover:border-[#c2652a]/30 transition-all cursor-pointer group"
              >
                <Icon
                  icon={category.icon}
                  className="text-[#c2652a] text-3xl mb-4 block"
                />
                <h3 className="font-serif text-2xl italic mb-3">
                  {category.title}
                </h3>
                <p className="text-[#605850] leading-relaxed">
                  {category.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Featured Articles */}
        <section className="max-w-5xl mx-auto px-6 py-20 bg-[#e6e0d6]/20 rounded-3xl mb-20">
          <h2 className="font-serif text-4xl italic text-center mb-16">
            Featured Articles
          </h2>
          <div className="space-y-4">
            {FEATURED_ARTICLES.map((article, idx) => (
              <Link
                key={idx}
                href={article.href}
                className="flex items-center justify-between p-6 bg-white rounded-lg border border-[#d8d0c8]/20 hover:border-[#c2652a] transition-all group"
              >
                <span className="text-lg">{article.text}</span>
                <Icon
                  icon="material-symbols:arrow-forward"
                  className="text-[#9a9088] group-hover:text-[#c2652a] transition-colors text-xl"
                />
              </Link>
            ))}
          </div>
        </section>

        {/* Contact Team Section */}
        <section className="max-w-7xl mx-auto px-6 py-24 text-center border-t border-[#d8d0c8]/20">
          <div className="inline-block p-4 rounded-full bg-[#c2652a]/5 mb-8">
            <Icon
              icon="material-symbols:support-agent-outline"
              className="text-[#c2652a] text-4xl block"
            />
          </div>
          <h2 className="font-serif text-5xl italic mb-6">Still need help?</h2>
          <p className="text-[#605850] max-w-xl mx-auto mb-12 text-lg">
            Our curated support team is available around the clock to ensure
            your journey remains as seamless as a sunset.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <button
              type="button"
              className="bg-[#c2652a] text-white px-10 py-4 rounded-lg font-bold hover:bg-[#e08850] transition-all shadow-[0_2px_16px_rgba(58,48,42,0.04)]"
            >
              Contact Support
            </button>
            <button
              type="button"
              className="border-2 border-[#c2652a] text-[#c2652a] px-10 py-4 rounded-lg font-bold hover:bg-[#c2652a] hover:text-white transition-all"
            >
              Live Chat
            </button>
          </div>
        </section>

        {/* Editorial Visual Break Component */}
        <section className="max-w-7xl mx-auto px-6 mb-20">
          <div className="relative h-[400px] rounded-3xl overflow-hidden shadow-[0_2px_16px_rgba(58,48,42,0.04)]">
            <Image
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCYGo47HJVDv0mP0eE9oq2uFwmoiQjX3pBfW-4ruuPQu-2TyyY3dvjO1_eJINnMqIhWZHyRTVYQGkLmbcWMtamofyTv98wif8-cuNFRm0Ce29EfgHsAopmxVdRVjzcNQFDae-2CLaP11VdcwqeOb92t7ttD9bWz5Is89GtRYRHpgtWKpbAi5Ulj3Oi97OnoGgzew93V-UMz4RJ7V8cdUOUDvNzHN7w6NUqFo2_N0LooZq3iVJHaSe_ruu7kr7TgO3IKtaGWD4w9rj8"
              alt="A serene, high-end minimalist office space bathed in warm afternoon sunlight"
              fill
              className="object-cover"
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent flex items-end p-12">
              <p className="text-white font-serif text-3xl italic max-w-md">
                &quot;Simplicity is the ultimate sophistication in career support.&quot;
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}