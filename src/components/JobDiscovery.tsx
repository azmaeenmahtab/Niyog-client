"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { getAllJobs } from "@/lib/api/jobs";

interface DisplayJob {
  _id?: string;
  title: string;
  description: string;
  location: string;
  salary: string;
  type: string;
  company?: string;
  icon?: string;
  companyLogoUrl?: string | null;
}

const FALLBACK_JOBS: DisplayJob[] = [
  {
    _id: "demo-1",
    title: "Senior Product Designer",
    company: "DesignLab Studio",
    description:
      "Lead the design of our core platform, focusing on high-end user experiences and craft-led interfaces.",
    location: "Remote",
    salary: "$85/hr",
    type: "Full-time",
    icon: "solar:palette-round-bold",
  },
  {
    _id: "demo-2",
    title: "Backend Engineer",
    company: "CloudScale Inc",
    description:
      "Architect scalable systems using modern cloud infrastructure and high-performance Go services.",
    location: "San Francisco",
    salary: "$120/hr",
    type: "Contract",
    icon: "solar:code-square-bold",
  },
  {
    _id: "demo-3",
    title: "Marketing Lead",
    company: "Venture Brand Co",
    description:
      "Define our brand voice and drive growth through curated storytelling and strategic partnerships.",
    location: "London / Hybrid",
    salary: "$95/hr",
    type: "Full-time",
    icon: "solar:megaphone-bold",
  },
  {
    _id: "demo-4",
    title: "Frontend Engineer",
    company: "PixelForge",
    description:
      "Ship polished interfaces for a fast-growing product team focused on modern web experiences.",
    location: "New York, USA",
    salary: "$70/hr",
    type: "Full-time",
    icon: "solar:monitor-smartphone-bold",
  },
  {
    _id: "demo-5",
    title: "Data Scientist",
    company: "NeuralPulse AI",
    description:
      "Build forecasting models and experiment frameworks that inform product and growth decisions.",
    location: "Berlin, Germany",
    salary: "$90/hr",
    type: "Contract",
    icon: "solar:chart-square-bold",
  },
  {
    _id: "demo-6",
    title: "Customer Success Manager",
    company: "Nexus Enterprise",
    description:
      "Own relationships with enterprise customers and turn feedback into product improvements.",
    location: "Toronto, Canada",
    salary: "$60/hr",
    type: "Part-time",
    icon: "solar:users-group-rounded-bold",
  },
];

function MetaItem({
  icon,
  children,
}: {
  icon: string;
  children: React.ReactNode;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 text-[13px] text-[#1a1a1a]/70">
      <Icon icon={icon} className="size-4 text-[#1a1a1a]/55" />
      {children}
    </span>
  );
}

export default function JobDiscovery() {
  const [jobsList, setJobsList] = useState<DisplayJob[]>(FALLBACK_JOBS);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function loadLatestJobs() {
      try {
        setIsLoading(true);
        const res = await getAllJobs({ page: "1" });
        if (isMounted && res?.data && Array.isArray(res.data) && res.data.length > 0) {
          const mapped: DisplayJob[] = res.data.slice(0, 6).map((doc: any) => {
            let salaryStr = "Negotiable";
            if (typeof doc.salary === "string" && doc.salary.trim()) {
              salaryStr = doc.salary;
            } else if (doc.salaryMin != null && doc.salaryMax != null) {
              salaryStr = `$${doc.salaryMin}–$${doc.salaryMax}/hr`;
            } else if (doc.salaryMin != null) {
              salaryStr = `$${doc.salaryMin}+/hr`;
            }

            return {
              _id: doc._id ? String(doc._id) : undefined,
              title: doc.title || "Untitled Role",
              company: doc.company || doc.companyName || "Top Company",
              description: doc.description || doc.summary || "Exciting opportunity to build impactful products.",
              location: doc.location || (doc.isRemote ? "Remote" : "On-site"),
              salary: salaryStr,
              type: doc.type || (doc.employmentType ?? "Full-time"),
              companyLogoUrl: doc.companyLogoUrl || doc.logoUrl,
              icon: "solar:case-round-bold",
            };
          });
          setJobsList(mapped);
        }
      } catch (err) {
        // Keep fallback jobs on error
        console.error("Failed to load dynamic jobs:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadLatestJobs();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="bg-[#f3ede2] px-4 pb-24 pt-12 text-[#1a1a1a] sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        <div className="flex items-end justify-between gap-6">
          <div>
            <span className="text-[12px] font-semibold uppercase tracking-[0.2em] text-[#e2613a]">
              Handpicked Roles
            </span>
            <h2 className="mt-1 font-serif text-3xl font-medium italic tracking-tight text-[#1a1a1a] sm:text-4xl lg:text-[44px] lg:leading-[1.05]">
              Recent Opportunities
            </h2>
          </div>
          <Link
            href="/jobs"
            className="group inline-flex items-center gap-1.5 rounded-full border border-[#1a1a1a]/10 bg-white/60 px-4 py-2 text-[13px] font-semibold text-[#1a1a1a] shadow-[0_2px_10px_rgba(40,24,8,0.04)] backdrop-blur-md transition hover:bg-white hover:text-[#e2613a] hover:shadow-[0_4px_16px_rgba(226,97,58,0.15)]"
          >
            <span>View all jobs</span>
            <Icon
              icon="solar:arrow-right-linear"
              className="size-4 transition-transform group-hover:translate-x-1"
            />
          </Link>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {jobsList.map((job, idx) => {
            const hasRealId = job._id && !job._id.startsWith("demo-");
            const jobDetailHref = hasRealId
              ? `/jobs/details/${job._id}`
              : `/jobs?keyword=${encodeURIComponent(job.title)}`;

            const typeHref = `/jobs?type=${encodeURIComponent(job.type)}`;
            const isRemote = job.location.toLowerCase().includes("remote");
            const locationHref = isRemote
              ? "/jobs?location=Remote"
              : `/jobs?place=${encodeURIComponent(job.location)}`;

            return (
              <article
                key={job._id || `${job.title}-${idx}`}
                className="group flex h-full flex-col justify-between rounded-2xl bg-[#faf6ec] p-6 ring-1 ring-[#1a1a1a]/8 shadow-[0_12px_30px_rgba(40,24,8,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(40,24,8,0.08)] hover:ring-[#e2613a]/30 sm:p-7"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#fbe8d8] text-[#e2613a] font-bold text-[16px]">
                        {job.companyLogoUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={job.companyLogoUrl}
                            alt={`${job.company || "Company"} logo`}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <Icon icon={job.icon || "solar:case-round-bold"} className="size-5" />
                        )}
                      </div>
                      {job.company && (
                        <span className="text-[13px] font-medium text-[#1a1a1a]/70 line-clamp-1">
                          {job.company}
                        </span>
                      )}
                    </div>

                    <Link
                      href={typeHref}
                      className="rounded-full bg-[#fbe8d8] px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-[#e2613a] transition hover:bg-[#f3d3ba]"
                    >
                      {job.type}
                    </Link>
                  </div>

                  <h3 className="mt-5 font-serif text-[22px] font-semibold leading-tight text-[#1a1a1a]">
                    <Link
                      href={jobDetailHref}
                      className="transition-colors group-hover:text-[#e2613a]"
                    >
                      {job.title}
                    </Link>
                  </h3>

                  <p className="mt-3 line-clamp-2 text-[14px] leading-6 text-[#1a1a1a]/65">
                    {job.description}
                  </p>

                  <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2">
                    <Link
                      href={locationHref}
                      className="transition hover:text-[#e2613a]"
                    >
                      <MetaItem icon="solar:map-point-linear">
                        {job.location}
                      </MetaItem>
                    </Link>
                    <MetaItem icon="solar:dollar-linear">
                      <span className="font-semibold text-[#1a1a1a]">{job.salary}</span>
                    </MetaItem>
                  </div>
                </div>

                <div className="mt-7 pt-2">
                  <Link
                    href={jobDetailHref}
                    className="block w-full rounded-xl bg-[#e2613a] px-5 py-3 text-center text-[14px] font-semibold text-white shadow-[0_8px_18px_rgba(226,97,58,0.25)] transition hover:bg-[#c9522f] hover:shadow-[0_10px_22px_rgba(226,97,58,0.35)] active:scale-[0.99]"
                  >
                    Apply Now
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
