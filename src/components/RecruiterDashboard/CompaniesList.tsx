"use client";

import { Button, Chip } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useRegisterCompanyModal } from "@/lib/contexts/registerCompanyModalContext";

type CompanyStatus = "pending" | "approved" | "rejected";

interface Company {
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
}

const statusColorMap: Record<CompanyStatus, "warning" | "success" | "danger"> = {
  pending: "warning",
  approved: "success",
  rejected: "danger",
};

const companies: Company[] = [
  {
    id: "vercel",
    name: "Vercel",
    category: "Technology",
    status: "pending",
    description:
      "Vercel is the platform for frontend developers, providing speed and reliability. Experience the best workflow for React, Next.js, and more.",
    location: "San Francisco",
    employeeRange: "201-500 range",
    website: "https://vercel.com",
    logoBg: "bg-black",
    logoInitial: "V",
  },
  {
    id: "figma",
    name: "Figma",
    category: "Technology",
    status: "approved",
    description:
      "Figma is the collaborative interface design tool — design, prototype, and gather feedback all in one place. Empowering teams to build better products.",
    location: "San Francisco",
    employeeRange: "501-1000 range",
    website: "https://figma.com",
    logoBg: "bg-[#F24E1E]",
    logoInitial: "F",
  },
  {
    id: "enosis",
    name: "Enosis Solutions",
    category: "Technology",
    status: "pending",
    description:
      "ENOSIS - Your trusted Software Development Partner: A top tier software development team assisting owners and decision makers to implement.",
    location: "Dhaka, Bangladesh",
    employeeRange: "51-200 range",
    website: "https://enosisbd.com",
    logoBg: "bg-white",
    logoInitial: "Enosis",
  },
];

export function CompaniesList() {
  const { openModal } = useRegisterCompanyModal();

  return (
    <section className="w-full">
      <header className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white">My Companies</h1>
          <p className="mt-1 text-sm text-white/55">
            Manage your registered companies and their verification statuses.
          </p>
        </div>
        <Button
          variant="primary"
          onPress={openModal}
          className="rounded-full bg-white text-black hover:bg-white/90"
        >
          <Icon icon="gravity-ui:plus" className="size-4" />
          Register a company
        </Button>
      </header>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {companies.map((company) => (
          <article
            key={company.id}
            className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-[#181818] p-5 shadow-[0_8px_30px_rgba(0,0,0,0.25)]"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div
                  className={`flex size-12 shrink-0 items-center justify-center rounded-xl border border-white/10 ${company.logoBg}`}
                >
                  <span
                    className={`text-sm font-semibold ${
                      company.logoBg === "bg-white" ? "text-black" : "text-white"
                    }`}
                  >
                    {company.logoInitial}
                  </span>
                </div>
                <div>
                  <h2 className="text-base font-semibold text-white">{company.name}</h2>
                  <p className="text-xs text-white/50">{company.category}</p>
                </div>
              </div>
              <Chip
                color={statusColorMap[company.status]}
                size="sm"
                variant="soft"
                className="uppercase"
              >
                {company.status}
              </Chip>
            </div>

            <p className="text-sm leading-6 text-white/65">{company.description}</p>

            <div className="h-px bg-white/10" />

            <div className="flex items-center justify-between text-xs text-white/60">
              <span className="inline-flex items-center gap-2">
                <Icon icon="gravity-ui:pin" className="size-4 text-white/45" />
                {company.location}
              </span>
              <span className="inline-flex items-center gap-2">
                <Icon icon="gravity-ui:persons" className="size-4 text-white/45" />
                {company.employeeRange}
              </span>
            </div>

            <a
              href={company.website}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-sm text-white/70 transition hover:text-white"
            >
              <Icon icon="gravity-ui:globe" className="size-4 text-white/60" />
              Visit Website
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}
