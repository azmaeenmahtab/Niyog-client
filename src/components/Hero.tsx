"use client";

export default function Hero() {
  const trendingItems = [
    "Product Designer",
    "AI Engineering",
    "Dev-ops Engineer",
  ];

  return (
    <section className="relative w-full bg-[#f3ede2] text-[#1a1a1a]">
      <div className="mx-auto flex w-full max-w-5xl flex-col items-center px-4 pb-16 pt-12 text-center sm:px-6 lg:px-8 lg:pt-16">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/55 px-4 py-1.5 text-[12px] font-medium text-[#1a1a1a]/75 shadow-[0_4px_20px_rgba(40,24,8,0.05)] backdrop-blur-md">
          <span
            aria-hidden="true"
            className="inline-block size-1.5 rounded-full bg-[#e2613a]"
          />
          <span className="font-semibold text-[#1a1a1a]">50,000+</span>
          <span className="tracking-[0.18em] text-[#1a1a1a]/55">
            NEW JOBS THIS MONTH
          </span>
        </div>

        <h1 className="mt-7 font-serif text-4xl font-medium tracking-tight text-[#1a1a1a] sm:text-5xl lg:text-[68px] lg:leading-[1.05]">
          Find Your Dream{" "}
          <span className="font-serif italic font-medium text-[#e2613a]">
            Job
          </span>{" "}
          Today
        </h1>

        <p className="mt-5 max-w-2xl font-serif text-[15px] leading-7 text-[#1a1a1a]/65 sm:text-base">
          HireLoop connects top talent with world-class companies. Browse
          thousands of curated opportunities and land your next role — faster.
        </p>

        <form className="mt-10 w-full max-w-3xl">
          <div className="flex flex-col items-stretch gap-2 rounded-2xl border border-white/40 bg-white/55 p-2 shadow-[0_10px_30px_rgba(40,24,8,0.06)] backdrop-blur-md sm:flex-row sm:items-center sm:gap-1">
            <label className="flex flex-1 items-center gap-2 px-3 py-2 text-[#1a1a1a]/55">
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4 shrink-0 fill-none stroke-current stroke-[1.8]"
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="M20 20l-3.5-3.5" strokeLinecap="round" />
              </svg>
              <span className="text-[14px]">Job title, skill or company</span>
            </label>

            <span
              className="hidden h-6 w-px bg-[#1a1a1a]/10 sm:block"
              aria-hidden="true"
            />

            <label className="flex flex-1 items-center gap-2 px-3 py-2 text-[#1a1a1a]/55 sm:border-l sm:border-[#1a1a1a]/5">
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4 shrink-0 fill-none stroke-current stroke-[1.8]"
                aria-hidden="true"
              >
                <path d="M12 21s6-5.5 6-10a6 6 0 1 0-12 0c0 4.5 6 10 6 10Z" />
                <circle cx="12" cy="11" r="2" />
              </svg>
              <span className="text-[14px]">Location or Remote</span>
            </label>

            <button
              type="submit"
              aria-label="Search jobs"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#e2613a] px-5 text-[14px] font-semibold text-white shadow-[0_8px_18px_rgba(226,97,58,0.35)] transition hover:brightness-105"
            >
              <span>Search</span>
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4 fill-none stroke-current stroke-2"
                aria-hidden="true"
              >
                <path
                  d="M5 12h14M13 5l7 7-7 7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </form>

        <div className="mt-7 flex flex-col items-center gap-3 sm:flex-row sm:gap-4">
          <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#1a1a1a]/50">
            Trending Position
          </span>
          <div className="flex flex-wrap justify-center gap-2">
            {trendingItems.map((item) => (
              <span
                key={item}
                className="rounded-full border border-white/40 bg-white/55 px-4 py-1.5 text-[13px] text-[#1a1a1a]/70 shadow-[0_4px_12px_rgba(40,24,8,0.04)] backdrop-blur-md"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
