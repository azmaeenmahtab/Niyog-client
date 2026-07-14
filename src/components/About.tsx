"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Icon } from "@iconify/react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function AboutPage() {
  // Simple scroll reveal interaction using Intersection Observer
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("opacity-100", "translate-y-0");
          entry.target.classList.remove("opacity-0", "translate-y-10");
        }
      });
    }, observerOptions);

    const reveals = document.querySelectorAll(
      ".grid > div, section h2, .reveal-item"
    );
    reveals.forEach((el) => {
      el.classList.add(
        "transition-all",
        "duration-700",
        "opacity-0",
        "translate-y-10"
      );
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-[#faf5ee] text-[#3a302a] font-sans selection:bg-[#f0a878] selection:text-[#401a08]">
      <Navbar />

      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-8 md:pt-12 pb-16 md:pb-32 px-4 sm:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="font-serif text-2xl sm:text-3xl md:text-5xl lg:text-6xl xl:text-7xl text-[#3a302a] tracking-tight leading-tight md:leading-none mb-6 md:mb-10">
              Built for the <br />
              <span className="italic text-[#c2652a]">Modern Craftsperson</span>
            </h1>
            <p className="max-w-2xl mx-auto text-[#605850] text-sm sm:text-base md:text-lg lg:text-xl font-light leading-relaxed px-2">
              Niyog bridges the gap between visionary talent and innovative
              teams. We believe the future of work isn&apos;t just about
              output—it&apos;s about the soul of the craft.
            </p>
            <div className="mt-8 md:mt-12 flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 px-2">
              <button
                type="button"
                className="bg-[#c2652a] text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-medium hover:opacity-90 transition-all shadow-[0_2px_16px_rgba(58,48,42,0.04)]"
              >
                View Opportunities
              </button>
              <button
                type="button"
                className="border border-[#9a9088] px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-medium hover:bg-[#ece6dc] transition-all"
              >
                Our Story
              </button>
            </div>
          </div>
          {/* Decorative background element */}
          <div className="absolute -top-24 -right-24 w-48 sm:w-96 h-48 sm:h-96 bg-[#c2652a]/5 rounded-full blur-3xl -z-10" />
          <div className="absolute -bottom-24 -left-24 w-48 sm:w-96 h-48 sm:h-96 bg-[#8c3c3c]/5 rounded-full blur-3xl -z-10" />
        </section>

        {/* Story Section */}
        <section className="py-16 md:py-24 px-4 sm:px-8 bg-[#f6f0e8]">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 items-center">
            <div className="order-2 lg:order-1">
              <div className="aspect-[4/5] rounded-xl overflow-hidden shadow-[0_2px_16px_rgba(58,48,42,0.04)] relative h-[300px] sm:h-[450px] md:h-[500px] lg:h-[600px]">
                <Image
                  className="object-cover"
                  alt="A sun-drenched modern architectural studio with high ceilings"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuA8AMAkLFcHr1cSFwGkJRbZlReSUmy9ateXxdcZP6uWIf8HPJO3yCRr3SMu6zB72N_ulrXuYfdTe_Q_aF-5p_LJX5c7Zoi5NiCJYY7QlkMq2-C3f0lI8NMuiO5y5nS8PshFYjlMmPZenH0j20fKLu5IGkRzs9sQfChlFXT7u0K2K0cLoGk2PZOFOjvPYTsNpfGBaTY0YqKJj9t_DiplRX9xQSYLRhI20qnTKp102a134AwTYuVEpQhfLIXG_wOsLVMc_jqxSVm0MEs"
                  fill
                  priority
                  unoptimized
                />
              </div>
            </div>
            <div className="order-1 lg:order-2 space-y-6 md:space-y-8 px-2">
              <span className="text-[#c2652a] font-bold tracking-widest uppercase text-xs">
                Our Genesis
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-[#3a302a] leading-tight">
                Sun-baked roots, global ambition.
              </h2>
              <div className="space-y-4 sm:space-y-6 text-[#605850] text-sm sm:text-base md:text-lg leading-relaxed">
                <p>
                  Niyog was born out of a simple observation: the tools we use
                  to find work often feel cold, mechanical, and transactional. We
                  wanted to build something that felt like a warm afternoon—intentional,
                  clear, and human.
                </p>
                <p>
                  Named after the coconut tree—the &quot;tree of life&quot; that thrives in
                  the warmth—Niyog is a platform built to sustain the creative
                  ecosystem. We don&apos;t just match resumes to job descriptions; we
                  connect human values to company cultures.
                </p>
                <p className="font-serif italic text-lg sm:text-xl md:text-2xl text-[#3a302a]">
                  &quot;We believe in the beauty of a job well done and the dignity
                  of the individual craftsperson.&quot;
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16 md:py-32 px-4 sm:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12 md:mb-20 px-2">
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-4 md:mb-6">
                Our Core Ethos
              </h2>
              <p className="text-[#605850] max-w-xl mx-auto text-sm sm:text-base">
                The principles that guide every feature we build and every connection
                we facilitate.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
              {/* Value 1 */}
              <div className="p-6 sm:p-8 md:p-10 bg-white rounded-2xl shadow-[0_2px_16px_rgba(58,48,42,0.04)] hover:-translate-y-2 transition-transform duration-300">
                <div className="w-12 sm:w-14 h-12 sm:h-14 bg-[#fbe8d8] text-[#401a08] rounded-xl flex items-center justify-center mb-6 md:mb-8">
                  <Icon icon="material-symbols:verified-outline" className="text-2xl sm:text-3xl" />
                </div>
                <h3 className="font-serif text-lg sm:text-2xl mb-3 md:mb-4">Quality</h3>
                <p className="text-[#605850] leading-relaxed text-sm sm:text-base">
                  We prioritize depth over breadth. Every talent and team on Niyog
                  is vetted for excellence and intentionality.
                </p>
              </div>
              {/* Value 2 */}
              <div className="p-6 sm:p-8 md:p-10 bg-white rounded-2xl shadow-[0_2px_16px_rgba(58,48,42,0.04)] hover:-translate-y-2 transition-transform duration-300">
                <div className="w-12 sm:w-14 h-12 sm:h-14 bg-[#fce0e0] text-[#2e1515] rounded-xl flex items-center justify-center mb-6 md:mb-8">
                  <Icon icon="material-symbols:architecture-outline" className="text-2xl sm:text-3xl" />
                </div>
                <h3 className="font-serif text-lg sm:text-2xl mb-3 md:mb-4">Craft</h3>
                <p className="text-[#605850] leading-relaxed text-sm sm:text-base">
                  We celebrate the obsessive attention to detail that defines a true
                  master of their field.
                </p>
              </div>
              {/* Value 3 */}
              <div className="p-6 sm:p-8 md:p-10 bg-white rounded-2xl shadow-[0_2px_16px_rgba(58,48,42,0.04)] hover:-translate-y-2 transition-transform duration-300">
                <div className="w-12 sm:w-14 h-12 sm:h-14 bg-[#eae2da] text-[#605850] rounded-xl flex items-center justify-center mb-6 md:mb-8">
                  <Icon icon="material-symbols:flare-outline" className="text-2xl sm:text-3xl" />
                </div>
                <h3 className="font-serif text-lg sm:text-2xl mb-3 md:mb-4">Simplicity</h3>
                <p className="text-[#605850] leading-relaxed text-sm sm:text-base">
                  Removing the noise to let the work speak. Minimalist design for
                  maximum focus.
                </p>
              </div>
              {/* Value 4 */}
              <div className="p-6 sm:p-8 md:p-10 bg-white rounded-2xl shadow-[0_2px_16px_rgba(58,48,42,0.04)] hover:-translate-y-2 transition-transform duration-300">
                <div className="w-12 sm:w-14 h-12 sm:h-14 bg-[#e08850] text-[#fbe8d8] rounded-xl flex items-center justify-center mb-6 md:mb-8">
                  <Icon icon="material-symbols:visibility-outline" className="text-2xl sm:text-3xl" />
                </div>
                <h3 className="font-serif text-lg sm:text-2xl mb-3 md:mb-4">Transparency</h3>
                <p className="text-[#605850] leading-relaxed text-sm sm:text-base">
                  Clear expectations, honest communication, and no hidden barriers
                  between talent and growth.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Team/Founders Section */}
        <section className="py-16 md:py-24 px-4 sm:px-8 bg-[#f2ece4]">
          <div className="max-w-7xl mx-auto text-center">
            <span className="text-[#c2652a] font-bold tracking-widest uppercase text-xs mb-4 block">
              The Visionaries
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-12 md:mb-16 px-2">
              The heart behind the code.
            </h2>
            <div className="flex flex-col lg:flex-row items-center justify-center gap-8 md:gap-12 lg:gap-24 px-2">
              <div className="group max-w-sm text-left w-full sm:w-auto">
                <div className="aspect-square rounded-2xl overflow-hidden mb-6 shadow-[0_2px_16px_rgba(58,48,42,0.04)] relative h-[280px] sm:h-[350px] md:h-[380px] w-full reveal-item">
                  <Image
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    alt="Portrait of Elena Moretti, CEO & Co-Founder"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBcn9TOFYfyQGA50dpGxQq8SX6zba01Jaklqh7LZiKaN5DUQXTaaLXiGHzLqYF60fTZgg___ljU26CP9yB9piF1OC8l4ny3ojOuZ8m7SfCtcdwaGyPxaDwzoXjterdtvGZ88VjNxOLQI6Gvyo3fh-Vs8jAG4enkJdqfnSMLV8lqn_kDYwxdFXfgmiU8XnIiG8FNDNbJPnQu6UeNvwxeRvTD4gsEtMyinRmDBSTKGBirzjSyN11EGBCuF8p8Qum-lqyIaB2sLqkSIFY"
                    fill
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-[#c2652a]/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <h4 className="font-serif text-2xl sm:text-3xl mb-1">Elena Moretti</h4>
                <p className="text-[#c2652a] font-medium mb-3 md:mb-4 text-sm sm:text-base">CEO &amp; Co-Founder</p>
                <p className="text-[#605850] text-xs sm:text-sm leading-relaxed">
                  Elena spent a decade building design systems for world-class
                  studios before founding Niyog to solve the connection gap in the
                  creative industry.
                </p>
              </div>
              <div className="group max-w-sm text-left w-full sm:w-auto">
                <div className="aspect-square rounded-2xl overflow-hidden mb-6 shadow-[0_2px_16px_rgba(58,48,42,0.04)] relative h-[280px] sm:h-[350px] md:h-[380px] w-full reveal-item">
                  <Image
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    alt="Portrait of Julian Thorne, CTO & Co-Founder"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBI2J1C6HyuhF5L9lwpl7DRlZ64wfBphB9m3lTE9BK06iFkCoUiBrGndm79L0IwVUNdEz3zEvJ3TQjgkKhGrfvVeGJYM5sbOGlSQELpqL0VQ5MGj8mZDKULcSukiTWPXCDD_102MqPe9LfMkFC6ILXU7oCqBIksnjoccvUq8fJPZuG5Y-EqISRzj6rmCRIE32_UssacLrxBn1OKJjtPSocCyKPEWeXRuliUNfj9Jat3tWCm3UJfjxw2M7LJfXd8Q4_hMWPEhp1q5e4"
                    fill
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-[#c2652a]/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <h4 className="font-serif text-2xl sm:text-3xl mb-1">Julian Thorne</h4>
                <p className="text-[#c2652a] font-medium mb-3 md:mb-4 text-sm sm:text-base">CTO &amp; Co-Founder</p>
                <p className="text-[#605850] text-xs sm:text-sm leading-relaxed">
                  Julian is an engineer with an artist’s soul, ensuring that every
                  line of code at Niyog serves the user’s journey with elegance and
                  speed.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-32 px-4 sm:px-8">
          <div className="max-w-4xl mx-auto bg-[#c2652a] rounded-3xl p-8 sm:p-12 md:p-20 text-center relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="font-serif text-2xl sm:text-3xl md:text-5xl lg:text-6xl text-white mb-6 md:mb-8 leading-tight px-2">
                Ready to join the ecosystem?
              </h2>
              <p className="text-white/80 text-sm sm:text-base md:text-lg mb-8 md:mb-12 max-w-xl mx-auto px-2">
                Whether you&apos;re looking for your next masterpiece or the person
                to build it, we&apos;re here to help.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 px-2">
                <button
                  type="button"
                  className="bg-[#faf5ee] text-[#c2652a] px-6 sm:px-10 py-3 sm:py-4 rounded-lg font-bold hover:bg-[#f6f0e8] transition-all text-sm sm:text-base"
                >
                  Find Work
                </button>
                <button
                  type="button"
                  className="border-2 border-white text-white px-6 sm:px-10 py-3 sm:py-4 rounded-lg font-bold hover:bg-white hover:text-[#c2652a] transition-all text-sm sm:text-base"
                >
                  Hire Talent
                </button>
              </div>
            </div>
            {/* Abstract blobs for the CTA */}
            <div className="absolute -top-10 -right-10 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-white/5 rounded-full blur-2xl" />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}