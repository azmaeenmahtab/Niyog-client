"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Oswald } from "next/font/google";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser } from "@fortawesome/free-regular-svg-icons";
import blacklogo from "@/assets/blacklogo.png";
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
    <nav className="sticky top-0 z-40 w-full bg-[#f3ede2] px-4 pt-5 sm:px-6 lg:px-8">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between rounded-full border border-black/5 bg-white/80 px-5 py-2.5 shadow-[0_8px_24px_rgba(40,24,8,0.06)] backdrop-blur-md sm:px-7">
        <div className="flex items-center gap-3">
          <button
            className="rounded-full p-2 text-[#1a1a1a]/80 transition hover:bg-black/5 hover:text-[#1a1a1a] md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
          >
            <svg
              className="h-5 w-5"
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

          <Link href="/" className="flex items-center gap-2">
            <Image
              src={blacklogo}
              alt="Niyog"
              className="h-7 w-auto"
              priority
            />
            <span
              className={`${oswald.className} text-[22px] font-semibold italic tracking-[0.04em] text-[#e2613a] -skew-x-12`}
            >
              Niyog
            </span>
          </Link>

          <ul className="ml-7 hidden items-center gap-7 text-[14px] text-[#1a1a1a]/75 md:flex">
            {navItems.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className="transition-colors hover:text-[#1a1a1a]"
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href={
                  userRole === "applicant"
                    ? "/dashboard/applicant"
                    : userRole === "recruiter"
                    ? "/dashboard/recruiter"
                    : "#"
                }
                className="transition-colors hover:text-[#1a1a1a]"
              >
                Dashboard
              </Link>
            </li>
          </ul>
        </div>

        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            <>
              <button
                onClick={handlelogout}
                className="hidden text-[14px] text-[#1a1a1a]/70 transition-colors hover:text-[#1a1a1a] sm:inline cursor-pointer"
              >
                Logout
              </button>
              <div
                className="flex h-9 w-9 items-center justify-center rounded-full border border-black/10 bg-[#f3ede2] text-[#1a1a1a]/80"
                title={session?.user?.name || session?.user?.email || "Account"}
                aria-label="Logged in account"
              >
                <FontAwesomeIcon icon={faCircleUser} className="h-5 w-5" />
              </div>
            </>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="hidden text-[14px] text-[#1a1a1a]/75 transition-colors hover:text-[#1a1a1a] sm:inline"
              >
                Logout
              </Link>
              <div
                className="flex h-9 w-9 items-center justify-center rounded-full border border-black/10 bg-[#f3ede2] text-[#1a1a1a]/80"
                aria-label="Account"
              >
                <FontAwesomeIcon icon={faCircleUser} className="h-5 w-5" />
              </div>
            </>
          )}
        </div>
      </header>

      {isMenuOpen && (
        <div className="mx-auto mt-2 w-full max-w-6xl rounded-3xl border border-black/5 bg-white px-4 py-4 shadow-[0_8px_24px_rgba(40,24,8,0.06)] md:hidden">
          <ul className="flex flex-col gap-1 text-[#1a1a1a]/80">
            {navItems.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className="block rounded-xl px-3 py-3 transition hover:bg-black/5 hover:text-[#1a1a1a]"
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href={
                  userRole === "applicant"
                    ? "/dashboard/applicant"
                    : userRole === "recruiter"
                    ? "/dashboard/recruiter"
                    : "#"
                }
                className="block rounded-xl px-3 py-3 transition hover:bg-black/5 hover:text-[#1a1a1a]"
              >
                Dashboard
              </Link>
            </li>
            {isLoggedIn ? (
              <li className="mt-2 border-t border-black/5 pt-3">
                <button
                  onClick={handlelogout}
                  className="block w-full rounded-xl px-3 py-3 text-left text-[#1a1a1a]/75 transition hover:bg-black/5 hover:text-[#1a1a1a]"
                >
                  Logout
                </button>
              </li>
            ) : null}
          </ul>
        </div>
      )}
    </nav>
  );
}
