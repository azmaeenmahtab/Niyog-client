"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Oswald } from "next/font/google";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser, faBell } from "@fortawesome/free-regular-svg-icons";
import { faMagnifyingGlass, faChevronDown } from "@fortawesome/free-solid-svg-icons";
import whitelogo from "@/assets/whitelogo.png";
import { useSession } from "@/lib/auth-client";
import type { SessionUser } from "@/lib/auth-types";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

const oswald = Oswald({ subsets: ["latin"] });

export default function DashboardNavbar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [hasNotifications, setHasNotifications] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data: session } = useSession();
  const isLoggedIn = Boolean(session?.user);
  const router = useRouter();

  const userName = session?.user?.name || "Guest";
  const userEmail = session?.user?.email || "";
  const userRole = (session?.user as SessionUser | undefined)?.role || "Member";

  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/");
        },
      },
    });
  };

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-white/8 bg-[#141414] px-7 py-3">
      <div className="flex h-15 items-center gap-4">
        <div className="flex shrink-0 items-center gap-2 w-50">
          <Image src={whitelogo} alt="Niyog" className="h-7 w-auto" priority />
          <span
            className={`${oswald.className} inline-block text-[22px] font-semibold italic tracking-[0.06em] text-white -skew-x-12`}
          >
            Niyog
          </span>
        </div>

        <div className="mx-3 h-6 w-px bg-white/10 shrink-0" />

        <div className="relative flex flex-1 items-center">
          <FontAwesomeIcon
            icon={faMagnifyingGlass}
            className="pointer-events-none absolute left-3.5 h-3.5 w-3.5 text-white/30"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search applications, jobs, or talent…"
            className="h-9 w-full rounded-lg border border-white/8 bg-white/5 pl-9 pr-4 text-[13.5px] text-white/80 placeholder-white/25 outline-none transition focus:border-[#6e63ff]/50 focus:bg-white/8 focus:text-white"
          />
        </div>

        <div className="ml-3 flex shrink-0 items-center gap-3">
          <button
            className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-white/8 bg-white/5 text-white/60 transition hover:border-white/15 hover:bg-white/10 hover:text-white"
            aria-label="Notifications"
            onClick={() => setHasNotifications(false)}
          >
            <FontAwesomeIcon icon={faBell} className="h-4 w-4" />
            {hasNotifications && (
              <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[#6e63ff]" />
            )}
          </button>

          {isLoggedIn ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen((prev) => !prev)}
                className="flex items-center gap-2.5 rounded-lg border border-white/8 bg-white/5 py-1.5 pl-1.5 pr-3 transition hover:border-white/15 hover:bg-white/10"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-md border border-white/10 bg-white/8 text-white">
                  <FontAwesomeIcon icon={faCircleUser} className="h-4 w-4" />
                </span>
                <div className="flex flex-col items-start leading-none">
                  <span className="text-[13px] font-medium text-white/90">{userName}</span>
                  <span className="mt-0.5 text-[11px] text-white/40">{userRole}</span>
                </div>
                <FontAwesomeIcon
                  icon={faChevronDown}
                  className={`ml-1 h-3 w-3 text-white/30 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`}
                />
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 top-[calc(100%+8px)] w-52 rounded-xl border border-white/10 bg-[#1e1e1e] py-1.5 shadow-[0_16px_40px_rgba(0,0,0,0.4)]">
                  <div className="border-b border-white/8 px-4 py-2.5">
                    <p className="text-[12px] font-medium text-white/90 truncate">{userName}</p>
                    <p className="text-[11px] text-white/40 truncate">{userEmail}</p>
                  </div>
                  <ul className="mt-1 px-1.5">
                    <li>
                      <button className="w-full rounded-lg px-3 py-2 text-left text-[13px] text-white/70 transition hover:bg-white/8 hover:text-white">
                        Profile
                      </button>
                    </li>
                    <li>
                      <button className="w-full rounded-lg px-3 py-2 text-left text-[13px] text-white/70 transition hover:bg-white/8 hover:text-white">
                        Settings
                      </button>
                    </li>
                    <li className="mt-1 border-t border-white/8 pt-1">
                      <button
                        onClick={handleLogout}
                        className="w-full rounded-lg px-3 py-2 text-left text-[13px] text-[#6e63ff] transition hover:bg-white/8 hover:text-white"
                      >
                        Log out
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => router.push("/auth/login")}
              className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-[13px] text-[#6e63ff] transition hover:bg-white/10 hover:text-white"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
