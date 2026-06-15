"use client";

import { useEffect, useState } from "react";
import { Button, Chip } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useRegisterCompanyModal } from "@/lib/contexts/registerCompanyModalContext";
import {
  getCompanyAction,
  type Company,
} from "@/lib/actions/company";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { useSession } from "@/lib/auth-client";

type CompanyStatus = "pending" | "approved" | "rejected";

interface CompanyCard {
  id: string;
  name: string;
  category: string;
  status: CompanyStatus;
  description: string;
  location: string;
  employeeRange: string;
  website: string;
  logoBg: string;
  logoInitial: string;
  logoUrl: string | null;
}

const statusColorMap: Record<CompanyStatus, "warning" | "success" | "danger"> = {
  pending: "warning",
  approved: "success",
  rejected: "danger",
};

const PALETTE = [
  "bg-black",
  "bg-[#F24E1E]",
  "bg-white",
  "bg-[#5f55ff]",
  "bg-[#d39be8]",
  "bg-[#0f172a]",
];

function pickBg(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash + id.charCodeAt(i)) % PALETTE.length;
  return PALETTE[hash];
}

function toCard(company: Company): CompanyCard {
  const id = company._id || company.name;
  return {
    id,
    name: company.name || "Unnamed company",
    category: company.industry || "Other",
    status: "pending",
    description: company.description || "No description provided yet.",
    location: company.location || "Location not set",
    employeeRange: company.employeeRange || "—",
    website: company.website || "#",
    logoBg: pickBg(id),
    logoInitial: (company.name || "?").charAt(0).toUpperCase(),
    logoUrl: company.logoUrl ?? null,
  };
}

export function CompanyProfile() {
  const { openModal } = useRegisterCompanyModal();
  const { data: session, isPending: sessionPending } = useSession();
  const [company, setCompany] = useState<CompanyCard | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const recruiterId = session?.user?.id;
      if (!recruiterId) {
        if (!cancelled) {
          setIsLoading(false);
          setCompany(null);
          if (!sessionPending) {
            setError("You must be logged in to view your companies.");
          }
        }
        return;
      }

      console.log("Company Profile fetching…");
      setIsLoading(true);
      setError(null);
      const result = await getCompanyAction(recruiterId);
      console.log("Company result", result);
      if (cancelled) return;
      if (!result.ok) {
        setError(result.message);
        setCompany(null);
      } else {
        const data = result.company;
        setCompany(data ? toCard(data) : null);
      }
      setIsLoading(false);
    }

    if (!sessionPending) load();
    return () => {
      cancelled = true;
    };
  }, [session?.user?.id, sessionPending]);

  return (
    <section className="w-full">
      <header className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white">My Company</h1>
          <p className="mt-1 text-sm text-white/55">
            Manage your registered company.
          </p>
        </div>
        <Button
          variant="primary"
          onPress={openModal}
          className="rounded-full bg-white text-black hover:bg-white/90"
        >
          <Icon icon="gravity-ui:plus" className="size-4" />
          Register your company
        </Button>
      </header>

      {isLoading ? (
        <p className="text-sm text-white/55">Loading companies…</p>
      ) : error ? (
        <p className="text-sm text-red-400">{error}</p>
      ) : !company ? (
        <p className="text-sm text-white/55">No company registered yet.</p>
      ) : (
        <article
          key={company.id}
          className="flex w-full flex-col gap-6 rounded-2xl border border-white/10 bg-[#181818] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.25)] md:p-8"
        >
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-center gap-4">
              <div
                className={`flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-white/10 ${
                  company.logoUrl ? "bg-[#0f0f0f]" : company.logoBg
                }`}
              >
                {company.logoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={company.logoUrl}
                    alt={`${company.name} logo`}
                    className="size-full object-cover"
                  />
                ) : (
                  <span
                    className={`text-lg font-semibold ${
                      company.logoBg === "bg-white" ? "text-black" : "text-white"
                    }`}
                  >
                    {company.logoInitial}
                  </span>
                )}
              </div>
              <div className="min-w-0">
                <h2 className="truncate text-xl font-semibold text-white md:text-2xl">
                  {company.name}
                </h2>
                <p className="mt-1 text-sm text-white/50">{company.category}</p>
              </div>
            </div>
            <Chip
              color={statusColorMap[company.status]}
              size="sm"
              variant="soft"
              className="self-start uppercase"
            >
              {company.status}
            </Chip>
          </div>

          <p className="max-w-3xl text-sm leading-6 text-white/70 md:text-base md:leading-7">
            {company.description}
          </p>

          <div className="h-px bg-white/10" />

          <dl className="grid w-full grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/2 px-4 py-3">
              <span className="flex size-9 items-center justify-center rounded-lg bg-white/5">
                <FontAwesomeIcon
                  icon={faLocationDot}
                  className="w-4 text-white/70"
                />
              </span>
              <div className="min-w-0">
                <dt className="text-[11px] uppercase tracking-wide text-white/40">
                  Location
                </dt>
                <dd className="truncate text-sm text-white/80">{company.location}</dd>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/2 px-4 py-3">
              <span className="flex size-9 items-center justify-center rounded-lg bg-white/5">
                <Icon icon="gravity-ui:persons" className="size-4 text-white/70" />
              </span>
              <div className="min-w-0">
                <dt className="text-[11px] uppercase tracking-wide text-white/40">
                  Team size
                </dt>
                <dd className="truncate text-sm text-white/80">{company.employeeRange}</dd>
              </div>
            </div>
            <a
              href={company.website}
              target="_blank"
              rel="noreferrer"
              className="group flex items-center gap-3 rounded-xl border border-white/5 bg-white/2 px-4 py-3 transition hover:border-white/15 hover:bg-white/5"
            >
              <span className="flex size-9 items-center justify-center rounded-lg bg-white/5">
                <Icon icon="gravity-ui:globe" className="size-4 text-white/70" />
              </span>
              <div className="min-w-0">
                <dt className="text-[11px] uppercase tracking-wide text-white/40">
                  Website
                </dt>
                <dd className="truncate text-sm text-white/80 group-hover:text-white">
                  Visit website
                </dd>
              </div>
            </a>
          </dl>
        </article>
      )}
    </section>
  );
}
