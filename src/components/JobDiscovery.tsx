import Link from "next/link";
import { Icon } from "@iconify/react";

type Job = {
  title: string;
  description: string;
  location: string;
  salary: string;
  type: "Full-Time" | "Contract" | "Part-Time";
  icon: string;
};

const jobs: Job[] = [
  {
    title: "Senior Product Designer",
    description:
      "Lead the design of our core platform, focusing on high-end user experiences and craft-led interfaces.",
    location: "Remote",
    salary: "$85/hr",
    type: "Full-Time",
    icon: "solar:palette-round-bold",
  },
  {
    title: "Backend Engineer",
    description:
      "Architect scalable systems using modern cloud infrastructure and high-performance Go services.",
    location: "San Francisco",
    salary: "$120/hr",
    type: "Contract",
    icon: "solar:code-square-bold",
  },
  {
    title: "Marketing Lead",
    description:
      "Define our brand voice and drive growth through curated storytelling and strategic partnerships.",
    location: "London / Hybrid",
    salary: "$95/hr",
    type: "Full-Time",
    icon: "solar:megaphone-bold",
  },
  {
    title: "Frontend Engineer",
    description:
      "Ship polished interfaces for a fast-growing product team focused on modern web experiences.",
    location: "New York, USA",
    salary: "$70/hr",
    type: "Full-Time",
    icon: "solar:monitor-smartphone-bold",
  },
  {
    title: "Data Scientist",
    description:
      "Build forecasting models and experiment frameworks that inform product and growth decisions.",
    location: "Berlin, Germany",
    salary: "$90/hr",
    type: "Contract",
    icon: "solar:chart-square-bold",
  },
  {
    title: "Customer Success Manager",
    description:
      "Own relationships with enterprise customers and turn feedback into product improvements.",
    location: "Toronto, Canada",
    salary: "$60/hr",
    type: "Part-Time",
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
  return (
    <section className="bg-[#f3ede2] px-4 pb-24 pt-12 text-[#1a1a1a] sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        <div className="flex items-end justify-between gap-6">
          <h2 className="font-serif text-3xl font-medium italic tracking-tight text-[#1a1a1a] sm:text-4xl lg:text-[44px] lg:leading-[1.05]">
            Recent Opportunities
          </h2>
          <Link
            href="#"
            className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[#1a1a1a] transition hover:text-[#e2613a]"
          >
            View all jobs
            <Icon icon="solar:arrow-right-linear" className="size-4" />
          </Link>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {jobs.map((job) => (
            <article
              key={`${job.title}-${job.location}`}
              className="flex h-full flex-col rounded-2xl bg-[#faf6ec] p-6 ring-1 ring-[#1a1a1a]/8 shadow-[0_12px_30px_rgba(40,24,8,0.04)] sm:p-7"
            >
              <div className="flex items-center justify-between">
                <span className="flex size-10 items-center justify-center rounded-xl bg-[#fbe8d8] text-[#e2613a]">
                  <Icon icon={job.icon} className="size-5" />
                </span>
                <span className="rounded-full bg-[#fbe8d8] px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-[#e2613a]">
                  {job.type}
                </span>
              </div>

              <h3 className="mt-6 font-serif text-[22px] font-semibold leading-tight text-[#1a1a1a]">
                {job.title}
              </h3>

              <p className="mt-3 text-[14px] leading-6 text-[#1a1a1a]/65">
                {job.description}
              </p>

              <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2">
                <MetaItem icon="solar:map-point-linear">
                  {job.location}
                </MetaItem>
                <MetaItem icon="solar:dollar-linear">
                  <span className="font-semibold text-[#1a1a1a]">{job.salary}</span>
                </MetaItem>
              </div>

              <div className="mt-7 pt-2">
                <Link
                  href="#"
                  className="block w-full rounded-xl bg-[#e2613a] px-5 py-3 text-center text-[14px] font-semibold text-white shadow-[0_8px_18px_rgba(226,97,58,0.25)] transition hover:bg-[#c9522f]"
                >
                  Apply Now
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
