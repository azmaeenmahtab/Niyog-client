"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Hero() {
  const router = useRouter();
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");

  const trendingItems = [
    "Product Designer",
    "AI Engineering",
    "Dev-ops Engineer",
    "Frontend Developer",
    "Full Stack",
  ];

  const headings = ["Dream Job", "Next Adventure", "Tech Career"];
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex((prevIndex) => (prevIndex + 1) % headings.length);
        setVisible(true);
      }, 300);
    }, 3000);
    return () => clearInterval(interval);
  }, [headings.length]);

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const params = new URLSearchParams();
    if (keyword.trim()) {
      params.set("keyword", keyword.trim());
    }
    if (location.trim()) {
      const locLower = location.trim().toLowerCase();
      if (locLower === "remote") {
        params.set("location", "Remote");
      } else if (locLower === "on-site" || locLower === "onsite") {
        params.set("location", "On-site");
      } else {
        params.set("place", location.trim());
      }
    }
    const query = params.toString();
    router.push(`/jobs${query ? `?${query}` : ""}`);
  };

  return (
    <section className="relative w-full bg-[#f3ede2] text-[#1a1a1a]">
      <div className="mx-auto flex w-full max-w-5xl flex-col items-center px-4 pb-16 pt-12 text-center sm:px-6 lg:px-8 lg:pt-16">
        
        {/* --- BADGE WITH RADAR DOT --- */}
        <Link
          href="/jobs"
          className="group inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/55 px-4 py-1.5 text-[12px] font-medium text-[#1a1a1a]/75 shadow-[0_4px_20px_rgba(40,24,8,0.05)] backdrop-blur-md transition hover:bg-white/80 hover:scale-[1.02]"
        >
          <span className="relative flex size-2">
            {/* Radar ring ripple */}
            <span
              aria-hidden="true"
              className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#e2613a] opacity-75"
            />
            {/* Core solid dot */}
            <span
              aria-hidden="true"
              className="relative inline-flex size-1.5 rounded-full bg-[#e2613a]"
            />
          </span>
          <span className="font-semibold text-[#1a1a1a]">50,000+</span>
          <span className="tracking-[0.18em] text-[#1a1a1a]/55 group-hover:text-[#e2613a] transition-colors">
            NEW JOBS THIS MONTH →
          </span>
        </Link>

        {/* --- ANIMATED HEADING --- */}
        <h1 className="mt-7 font-serif text-4xl font-medium tracking-tight text-[#1a1a1a] sm:text-5xl lg:text-[68px] lg:leading-[1.05]">
          Find Your{" "}
          <span
            className={`inline-block font-serif italic font-medium text-[#e2613a] transition-all duration-300 ease-in-out transform ${
              visible ? "opacity-100 scale-100" : "opacity-0 scale-95"
            }`}
          >
            {headings[index]}
          </span>
        </h1>

        <p className="mt-5 max-w-2xl font-serif text-[15px] leading-7 text-[#1a1a1a]/65 sm:text-base">
          Niyog connects top talent with world-class companies. Browse
          thousands of curated opportunities and land your next role — faster.
        </p>

        <form onSubmit={handleSearch} className="mt-10 w-full max-w-3xl">
          <div className="flex flex-col items-stretch gap-2 rounded-2xl border border-white/60 bg-white/70 p-2 shadow-[0_10px_30px_rgba(40,24,8,0.06)] backdrop-blur-md sm:flex-row sm:items-center sm:gap-1 transition-all focus-within:ring-2 focus-within:ring-[#e2613a]/30 focus-within:border-[#e2613a]/40">
            <div className="flex flex-1 items-center gap-2.5 px-3 py-1.5 text-[#1a1a1a]/70">
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4 shrink-0 fill-none stroke-current stroke-[1.8] text-[#1a1a1a]/50"
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="M20 20l-3.5-3.5" strokeLinecap="round" />
              </svg>
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSearch();
                }}
                placeholder="Job title, skill or company"
                className="w-full bg-transparent text-[14px] text-[#1a1a1a] placeholder:text-[#1a1a1a]/45 focus:outline-none"
              />
            </div>

            <span
              className="hidden h-6 w-px bg-[#1a1a1a]/10 sm:block"
              aria-hidden="true"
            />

            <div className="flex flex-1 items-center gap-2.5 px-3 py-1.5 text-[#1a1a1a]/70 sm:border-l sm:border-[#1a1a1a]/5">
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4 shrink-0 fill-none stroke-current stroke-[1.8] text-[#1a1a1a]/50"
                aria-hidden="true"
              >
                <path d="M12 21s6-5.5 6-10a6 6 0 1 0-12 0c0 4.5 6 10 6 10Z" />
                <circle cx="12" cy="11" r="2" />
              </svg>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSearch();
                }}
                placeholder="Location or Remote"
                className="w-full bg-transparent text-[14px] text-[#1a1a1a] placeholder:text-[#1a1a1a]/45 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              aria-label="Search jobs"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#e2613a] px-6 text-[14px] font-semibold text-white shadow-[0_8px_18px_rgba(226,97,58,0.35)] transition hover:brightness-105 active:scale-[0.98] cursor-pointer"
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
              <Link
                key={item}
                href={`/jobs?keyword=${encodeURIComponent(item)}`}
                className="rounded-full border border-white/40 bg-white/55 px-4 py-1.5 text-[13px] text-[#1a1a1a]/70 shadow-[0_4px_12px_rgba(40,24,8,0.04)] backdrop-blur-md transition hover:bg-white hover:text-[#e2613a] hover:scale-[1.03] active:scale-[0.98]"
              >
                {item}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}