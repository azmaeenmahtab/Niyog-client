"use client";

import Link from "next/link";
import { Oswald } from "next/font/google";
import { Icon } from "@iconify/react";

const oswald = Oswald({
  subsets: ["latin"],
});

export default function RootNotFound() {
  return (
    <div className="min-h-screen bg-[#faf5ee] text-[#3a302a] flex flex-col items-center justify-center px-6 font-sans selection:bg-[#fbe8d8] selection:text-[#401a08]">
      <div className="max-w-md w-full text-center space-y-8 p-8 bg-white rounded-3xl shadow-[0_8px_32px_rgba(58,48,42,0.03)] border border-[#d8d0c8]/40 relative overflow-hidden">
        {/* Accent Top Border */}
        <div className="absolute top-0 left-0 w-full h-2 bg-[#e2613a]" />

        {/* Brand Icon or Identifier */}
        <div className="flex justify-center pt-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#f3ede2] text-[#e2613a]">
            <Icon icon="material-symbols:explore-off-outline" className="text-3xl animate-pulse" />
          </div>
        </div>

        {/* Main Header / Status */}
        <div className="space-y-3">
          <h1 className={`${oswald.className} text-7xl font-bold tracking-tight text-[#e2613a] -skew-x-6`}>
            404
          </h1>
          <h2 className="font-serif text-2xl italic font-semibold">
            Route Not Found
          </h2>
          <p className="text-[#605850] text-sm leading-relaxed max-w-xs mx-auto">
            The workspace component or listing directory you are trying to reach does not exist or has been modified.
          </p>
        </div>

        {/* Divider Line */}
        <div className="border-t border-[#d8d0c8]/30 my-2" />

        {/* Dynamic Navigation Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
          <Link
            href="/"
            className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-full bg-[#e2613a] px-6 py-2.5 text-sm font-semibold text-white transition hover:brightness-110 shadow-sm"
          >
            <Icon icon="material-symbols:home-outline" className="text-base" />
            Return Home
          </Link>

          <button
            onClick={() => window.history.back()}
            className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-full border border-black/10 bg-[#f3ede2] px-6 py-2.5 text-sm font-medium text-[#1a1a1a] transition hover:bg-black/5"
          >
            <Icon icon="material-symbols:arrow-back" className="text-base" />
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}