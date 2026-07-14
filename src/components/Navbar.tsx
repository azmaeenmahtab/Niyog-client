"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Oswald } from "next/font/google";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser } from "@fortawesome/free-regular-svg-icons";
import { faChevronDown, faBell } from "@fortawesome/free-solid-svg-icons";
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
  const [isAvatarMenuOpen, setIsAvatarMenuOpen] = useState(false);
  const avatarMenuRef = useRef<HTMLDivElement>(null);
  const { data: session, isPending } = useSession();
  const isLoggedIn = Boolean(session?.user);
  const router = useRouter();

  const userRole = (session?.user as SessionUser | undefined)?.role;
  const userName = session?.user?.name;
  const userEmail = session?.user?.email;
  const userImage = session?.user?.image;
  const userId = (session?.user as SessionUser | undefined)?.id;

  const dashboardHref =
    userRole === "applicant"
      ? "/dashboard/applicant"
      : userRole === "admin"
      ? "/dashboard/admin"
      : userRole === "recruiter"
      ? "/dashboard/recruiter"
      : "#";

  const navItems = [
    { label: "Browse Jobs", href: "/jobs" },
    { label: "Pricing", href: "/pricing" },
    { label: "About Us", href: "/about" },
    { label: "Support", href: "/support" },
  ];

  const handlelogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          setIsAvatarMenuOpen(false);
          router.push("/");
        },
      },
    });
  };

  // Close avatar dropdown when clicking outside of it
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        avatarMenuRef.current &&
        !avatarMenuRef.current.contains(event.target as Node)
      ) {
        setIsAvatarMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const initials = userName
    ? userName
        .split(" ")
        .map((part) => part[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : null;

  return (
    <nav className="sticky top-0 z-40 w-full px-4 pt-5 sm:px-6 lg:px-8">
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
            {isLoggedIn && (
              <li>
                <Link
                  href={dashboardHref}
                  className="transition-colors hover:text-[#1a1a1a]"
                >
                  Dashboard
                </Link>
              </li>
            )}
          </ul>
        </div>

        <div className="flex items-center gap-3">
          {isPending ? (
            <div className="h-9 w-9 animate-pulse rounded-full bg-black/10" />
          ) : isLoggedIn ? (
            <>
              <button
                className="hidden h-9 w-9 items-center justify-center rounded-full text-[#1a1a1a]/70 transition hover:bg-black/5 hover:text-[#1a1a1a] sm:flex"
                aria-label="Notifications"
              >
                <FontAwesomeIcon icon={faBell} className="h-4 w-4" />
              </button>

              <div className="relative" ref={avatarMenuRef}>
                <button
                  onClick={() => setIsAvatarMenuOpen((prev) => !prev)}
                  className="flex items-center gap-2 rounded-full border border-black/10 bg-[#f3ede2] py-1 pl-1 pr-2.5 text-[#1a1a1a] transition hover:bg-black/5"
                  aria-haspopup="true"
                  aria-expanded={isAvatarMenuOpen}
                >
                  {userImage ? (
                    <Image
                      src={userImage}
                      alt={userName || "Profile"}
                      width={28}
                      height={28}
                      className="h-7 w-7 rounded-full object-cover"
                    />
                  ) : initials ? (
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#e2613a] text-xs font-semibold text-white">
                      {initials}
                    </span>
                  ) : (
                    <FontAwesomeIcon icon={faCircleUser} className="h-7 w-7" />
                  )}
                  <div className="hidden text-left leading-tight sm:block">
                    <p className="text-[13px] font-semibold capitalize">
                      {userName || "Account"}
                    </p>
                    <p className="text-[11px] capitalize text-[#1a1a1a]/50">
                      {userRole || ""}
                    </p>
                  </div>
                  <FontAwesomeIcon
                    icon={faChevronDown}
                    className={`h-3 w-3 text-[#1a1a1a]/50 transition-transform ${
                      isAvatarMenuOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isAvatarMenuOpen && (
                  <div className="absolute right-0 top-[calc(100%+8px)] w-64 rounded-2xl border border-black/5 bg-white py-2 shadow-[0_16px_40px_rgba(40,24,8,0.14)]">
                    <div className="px-4 py-2">
                      <p className="text-[14px] font-semibold capitalize text-[#1a1a1a]">
                        {userName || "Account"}
                      </p>
                      <p className="truncate text-[13px] text-[#1a1a1a]/50">
                        {userEmail}
                      </p>
                    </div>
                    <div className="my-1 border-t border-black/5" />
                    <Link
                      href={userId ? `/profile/${userId}` : "#"}
                      onClick={() => setIsAvatarMenuOpen(false)}
                      className="block px-4 py-2.5 text-[14px] text-[#1a1a1a]/80 transition hover:bg-black/5 hover:text-[#1a1a1a]"
                    >
                      Profile
                    </Link>
                    <Link
                      href="/dashboard/settings"
                      onClick={() => setIsAvatarMenuOpen(false)}
                      className="block px-4 py-2.5 text-[14px] text-[#1a1a1a]/80 transition hover:bg-black/5 hover:text-[#1a1a1a]"
                    >
                      Settings
                    </Link>
                    <div className="my-1 border-t border-black/5" />
                    <button
                      onClick={handlelogout}
                      className="block w-full px-4 py-2.5 text-left text-[14px] font-medium text-[#e2613a] transition hover:bg-black/5"
                    >
                      Log out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="hidden text-[14px] text-[#1a1a1a]/75 transition-colors hover:text-[#1a1a1a] sm:inline"
              >
                Sign in
              </Link>
              <Link
                href="/auth/signup"
                className="rounded-full bg-[#e2613a] px-4 py-2 text-[14px] font-semibold text-white transition hover:brightness-110"
              >
                Sign up
              </Link>
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
                  onClick={() => setIsMenuOpen(false)}
                  className="block rounded-xl px-3 py-3 transition hover:bg-black/5 hover:text-[#1a1a1a]"
                >
                  {item.label}
                </Link>
              </li>
            ))}
            {isLoggedIn && (
              <li>
                <Link
                  href={dashboardHref}
                  onClick={() => setIsMenuOpen(false)}
                  className="block rounded-xl px-3 py-3 transition hover:bg-black/5 hover:text-[#1a1a1a]"
                >
                  Dashboard
                </Link>
              </li>
            )}
            {isLoggedIn ? (
              <>
                <li>
                  <Link
                    href={userId ? `/profile/${userId}` : "#"}
                    onClick={() => setIsMenuOpen(false)}
                    className="block rounded-xl px-3 py-3 transition hover:bg-black/5 hover:text-[#1a1a1a]"
                  >
                    Profile
                  </Link>
                </li>
                <li>
                  <Link
                    href="/dashboard/settings"
                    onClick={() => setIsMenuOpen(false)}
                    className="block rounded-xl px-3 py-3 transition hover:bg-black/5 hover:text-[#1a1a1a]"
                  >
                    Settings
                  </Link>
                </li>
                <li className="mt-2 border-t border-black/5 pt-3">
                  <button
                    onClick={handlelogout}
                    className="block w-full rounded-xl px-3 py-3 text-left text-[#1a1a1a]/75 transition hover:bg-black/5 hover:text-[#1a1a1a]"
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <li className="mt-2 border-t border-black/5 pt-3">
                <Link
                  href="/auth/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="block rounded-xl px-3 py-3 transition hover:bg-black/5 hover:text-[#1a1a1a]"
                >
                  Sign in
                </Link>
                <Link
                  href="/auth/signup"
                  onClick={() => setIsMenuOpen(false)}
                  className="mt-1 block rounded-xl bg-[#e2613a] px-3 py-3 text-center font-semibold text-white transition hover:brightness-110"
                >
                  Sign up
                </Link>
              </li>
            )}
          </ul>
        </div>
      )}
    </nav>
  );
}