export default function HeroText() {
  const trendingItems = ["Product Designer", "AI Engineering", "Dev-ops Engineer"];

  return (
    <section className="w-full bg-transparent text-white">
      <div className="mx-auto flex w-full max-w-4xl flex-col items-center px-4 text-center sm:px-6 lg:px-8">
        <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-black/35 px-5 py-2 text-sm text-white/70 shadow-[0_0_30px_rgba(91,72,255,0.18)] backdrop-blur-md">
          <span className="text-base">💼</span>
          <span className="font-semibold text-white">50,000+</span>
          <span className="font-medium tracking-[0.22em] text-white/55">NEW JOBS THIS MONTH</span>
        </div>

        <h1 className="mt-8 text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-[64px] lg:leading-[1.02]">
          Find Your Dream Job Today
        </h1>

        <p className="mt-5 max-w-3xl text-base leading-8 text-white/60 sm:text-lg">
          HireLoop connects top talent with world-class companies. Browse thousands of
          curated opportunities and land your next role - faster.
        </p>

        <form className="mt-12 w-full max-w-3xl">
          <div className="flex flex-col gap-px overflow-hidden rounded-[18px] border border-white/12 bg-[#181818]/80 shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur-md md:flex-row md:items-stretch">
            <label className="flex flex-1 items-center gap-3 px-5 py-4 text-white/70 md:py-5">
              <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0 fill-none stroke-current stroke-[1.8]" aria-hidden="true">
                <circle cx="11" cy="11" r="7" />
                <path d="M20 20l-3.5-3.5" strokeLinecap="round" />
              </svg>
              <span className="text-sm sm:text-base">Job title, skill or company</span>
            </label>

            <div className="hidden w-px bg-white/10 md:block" aria-hidden="true" />

            <label className="flex flex-1 items-center gap-3 px-5 py-4 text-white/70 md:py-5">
              <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0 fill-none stroke-current stroke-[1.8]" aria-hidden="true">
                <path d="M12 21s6-5.5 6-10a6 6 0 1 0-12 0c0 4.5 6 10 6 10Z" />
                <circle cx="12" cy="11" r="2" />
              </svg>
              <span className="text-sm sm:text-base">Location or Remote</span>
            </label>

            <button
              type="submit"
              aria-label="Search jobs"
              className="mx-3 mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#5f55ff] text-white transition hover:brightness-110 md:my-3 md:ml-0 md:mr-3 md:h-auto md:w-14"
            >
              <svg viewBox="0 0 24 24" className="h-6 w-6 fill-none stroke-current stroke-[1.8]" aria-hidden="true">
                <circle cx="11" cy="11" r="7" />
                <path d="M20 20l-3.5-3.5" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </form>

        <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:gap-4">
          <span className="text-sm text-white/55">Trending Position</span>
          <div className="flex flex-wrap justify-center gap-2">
            {trendingItems.map((item) => (
              <span
                key={item}
                className="rounded-full border border-white/10 bg-white/8 px-4 py-2 text-sm text-white/75 shadow-[0_8px_20px_rgba(0,0,0,0.18)]"
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
