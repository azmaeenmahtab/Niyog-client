"use client";

import { useRouter, useSearchParams } from "next/navigation";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath?: string;
}

export default function Pagination({ currentPage, totalPages, basePath = "/jobs" }: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    router.push(`${basePath}?${params.toString()}`);
  };

  if (totalPages <= 1) return null;

  // Keep the number list short even with many pages: show first, last,
  // current ±1, and collapse the rest into "…"
  const pageNumbers = (): (number | "ellipsis")[] => {
    const pages: (number | "ellipsis")[] = [];
    const range = new Set<number>([1, totalPages, currentPage, currentPage - 1, currentPage + 1]);
    const sorted = [...range].filter((p) => p >= 1 && p <= totalPages).sort((a, b) => a - b);

    let prev = 0;
    for (const p of sorted) {
      if (prev && p - prev > 1) pages.push("ellipsis");
      pages.push(p);
      prev = p;
    }
    return pages;
  };

  return (
    <nav
      aria-label="Jobs pagination"
      className="mt-8 flex items-center justify-center gap-1.5"
    >
      <button
        type="button"
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage === 1}
        className="rounded-lg border border-[#1a1a1a]/10 bg-white/60 px-3 py-2 text-[13px] font-semibold text-[#1a1a1a]/70 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
      >
        Prev
      </button>

      {pageNumbers().map((p, i) =>
        p === "ellipsis" ? (
          <span key={`ellipsis-${i}`} className="px-2 text-[13px] text-[#1a1a1a]/40">
            …
          </span>
        ) : (
          <button
            key={p}
            type="button"
            onClick={() => goToPage(p)}
            aria-current={p === currentPage ? "page" : undefined}
            className={`h-9 w-9 rounded-lg text-[13px] font-semibold transition ${
              p === currentPage
                ? "bg-[#e2613a] text-white"
                : "border border-[#1a1a1a]/10 bg-white/60 text-[#1a1a1a]/70 hover:bg-white"
            }`}
          >
            {p}
          </button>
        )
      )}

      <button
        type="button"
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="rounded-lg border border-[#1a1a1a]/10 bg-white/60 px-3 py-2 text-[13px] font-semibold text-[#1a1a1a]/70 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
      >
        Next
      </button>
    </nav>
  );
}