import type { ReactNode } from "react";

export default function JobsLayout({ children }: { children: ReactNode }) {
  return (
    <section className="min-h-screen w-full bg-[#f3ede2] text-[#1a1a1a]">
      <div className="mx-auto w-full max-w-6xl px-4 pt-12 pb-20 sm:px-6 lg:px-8 lg:pt-16">
        <header className="mb-10">
          <h1 className="font-serif text-4xl font-medium tracking-tight sm:text-5xl lg:text-[56px] lg:leading-[1.05]">
            Find Your Next{" "}
            <span className="font-serif italic font-medium text-[#e2613a]">
              Opportunity
            </span>
          </h1>
          <p className="mt-4 max-w-2xl text-[15px] leading-7 text-[#1a1a1a]/65 sm:text-base">
            Discover curated roles from sun-baked startups to global leaders.
            Your career journey, refined and simplified through the Niyog lens.
          </p>
        </header>
        {children}
      </div>
    </section>
  );
}
