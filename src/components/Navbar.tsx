"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Oswald } from "next/font/google";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser } from "@fortawesome/free-regular-svg-icons";
import whitelogo from "@/assets/whitelogo.png";
import { useSession } from "@/lib/auth-client";
import type { SessionUser } from "@/lib/auth-types";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

const oswald = Oswald({
  subsets: ["latin"],
});

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data: session } = useSession();
  const isLoggedIn = Boolean(session?.user);
  const router = useRouter();

  const userRole = (session?.user as SessionUser | undefined)?.role;

  const navItems = [
    { label: "Browse Jobs", href: "#" },
    { label: "Company", href: "#" },
    { label: "Pricing", href: "#" },
  ];

  const handlelogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/");
        },
      },
    });
  };

  return (
    <nav className="sticky top-0 z-40 w-full px-4 pt-6 bg-transparent">
      <header className="mx-auto flex w-full max-w-337.5 items-center justify-between rounded-[18px] border border-white/10 bg-[#1e1e1e] px-4 py-3 shadow-[0_10px_40px_rgba(0,0,0,0.28)] backdrop-blur-md sm:px-6">
        <div className="flex items-center gap-3">
          <button
            className="rounded-full p-2 text-white/80 transition hover:bg-white/10 hover:text-white md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
          <div className="flex items-center gap-2">
            <Image
              src={whitelogo}
              alt="Niyog"
              className="h-8 w-auto"
              priority
            />
            <span className={`${oswald.className} inline-block text-[24px] font-semibold italic tracking-[0.06em] text-white -skew-x-12`}>
              Niyog
            </span>
          </div>
        </div>
        <div className="ml-auto hidden items-center gap-8 md:flex">
          <ul className="flex items-center gap-8 text-[15px] text-white/85">
            {navItems.map((item) => (
              <li key={item.label}>
                <Link href={item.href} className="transition-colors hover:text-white">
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href={userRole === "applicant" ? "/dashboard/applicant" : userRole === "recruiter" ? "/dashboard/recruiter" : "#"} className="transition-colors hover:text-white">
                Dashboard
              </Link>
            </li>
          </ul>
          {isLoggedIn ? (
            <div className="flex items-center gap-4">
              <button onClick={handlelogout} className="border-l border-white/20 pl-4 text-[15px] text-[#6e63ff] transition-colors hover:text-white cursor-pointer">
                Logout
              </button>
              <div
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 cursor-pointer bg-white/8 text-white shadow-[0_8px_20px_rgba(0,0,0,0.18)]"
                title={session?.user?.name || session?.user?.email || "Account"}
                aria-label="Logged in account"
              >
                <FontAwesomeIcon icon={faCircleUser} className="h-auto w-5" />
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link
                href="/auth/login"
                className="border-l border-white/20 pl-4 text-[15px] text-[#6e63ff] transition-colors hover:text-white"
              >
                Sign In
              </Link>
              <Link
                href="/auth/signup"
                className="rounded-3xl bg-linear-to-r from-[#6f62ff] to-[#7a5cff] px-5 py-3 text-[15px] font-semibold text-white transition hover:brightness-110"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </header>
      {isMenuOpen && (
        <div className="mx-auto mt-2 w-full max-w-275 rounded-[18px] border border-white/10 bg-[#1e1e1e] px-4 py-4 shadow-[0_10px_40px_rgba(0,0,0,0.28)] md:hidden">
          <ul className="flex flex-col gap-1 text-white/85">
            {navItems.map((item) => (
              <li key={item.label}>
                <Link href={item.href} className="block rounded-xl px-3 py-3 transition hover:bg-white/10 hover:text-white">
                  {item.label}
                </Link>
              </li>
            ))}
            {isLoggedIn ? (
              <li className="mt-2 border-t border-white/10 pt-3">
                <div
                  className="flex items-center gap-3 rounded-xl px-2 py-2 text-white"
                  title={session?.user?.name || session?.user?.email || "Account"}
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/8 text-white">
                    <FontAwesomeIcon icon={faCircleUser} className="h-5 w-5" />
                  </span>
                  <span className="text-sm font-medium text-white/75">Account</span>
                </div>
              </li>
            ) : (
              <>
                <li className="mt-2 border-t border-white/10 pt-3">
                  <Link href="/auth/login" className="block rounded-xl px-3 py-3 text-[#6e63ff] transition hover:bg-white/10 hover:text-white">
                    Sign In
                  </Link>
                </li>
                <li>
                  <Link href="/auth/signup" className="mt-1 block rounded-3xl bg-linear-to-r from-[#6f62ff] to-[#7a5cff] px-5 py-3 text-center font-semibold text-white shadow-[0_10px_24px_rgba(111,98,255,0.35)] transition hover:brightness-110">
                    Get Started
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      )}
    </nav>
  );
}
