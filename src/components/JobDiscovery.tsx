import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faBriefcase, faClock, faLocationDot } from "@fortawesome/free-solid-svg-icons";

const jobs = [
  {
    title: "Frontend Developer",
    description: "Build polished interfaces for a fast-growing product team focused on modern web experiences.",
    location: "New York, USA",
    workMode: "Hybrid",
    salary: "€25-€40/hour",
  },
  {
    title: "UI Engineer",
    description: "Own accessible component systems and visual quality across consumer and admin surfaces.",
    location: "Berlin, Germany",
    workMode: "Remote",
    salary: "€30-€45/hour",
  },
  {
    title: "Product Designer",
    description: "Shape product direction with user journeys, wireframes, and high-fidelity handoff work.",
    location: "London, UK",
    workMode: "On-site",
    salary: "€28-€42/hour",
  },
  {
    title: "Full Stack Developer",
    description: "Ship end-to-end features spanning frontend, APIs, and performance-sensitive backend flows.",
    location: "Toronto, Canada",
    workMode: "Hybrid",
    salary: "€35-€50/hour",
  },
  {
    title: "Motion Designer",
    description: "Create expressive motion systems for landing pages, product transitions, and brand moments.",
    location: "Paris, France",
    workMode: "Remote",
    salary: "€24-€36/hour",
  },
  {
    title: "Frontend Architect",
    description: "Guide scalable UI architecture, design tokens, and code quality for a multi-product platform.",
    location: "Amsterdam, Netherlands",
    workMode: "Hybrid",
    salary: "€40-€60/hour",
  },
];

function InfoPill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-white/6 px-3 py-1 text-white/80 ring-1 ring-white/8">
      {children}
    </span>
  );
}

export default function JobDiscovery() {
  return (
    <section className="bg-[#050505] px-4 pb-24 pt-10 text-white sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 text-[13px] uppercase tracking-[0.35em] text-white/55">
            <span className="h-1.5 w-1.5 rounded-sm bg-[#5f55ff]" />
            <span>Smart Job Discovery</span>
            <span className="h-1.5 w-1.5 rounded-sm bg-[#5f55ff]" />
          </div>

          <h2 className="mx-auto mt-5 max-w-3xl text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-[48px] lg:leading-[1.05]">
            The Roles you&apos;d never find by searching
          </h2>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {jobs.map((job) => (
            <article
              key={`${job.title}-${job.location}`}
              className="flex h-full min-h-80 flex-col justify-between rounded-[18px] bg-[#171717] px-6 py-8 shadow-[0_16px_40px_rgba(0,0,0,0.28)] ring-1 ring-white/5"
            >
              <h3 className="text-2xl font-medium leading-tight text-white">
                {job.title}
              </h3>

              <p className="mt-3 leading-6 text-white/45">
                {job.description}
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                <InfoPill>
                  <FontAwesomeIcon icon={faLocationDot} className="w-4 text-[#d39be8]" />
                  {job.location}
                </InfoPill>
                <InfoPill>
                  <FontAwesomeIcon icon={faBriefcase} className="w-4 text-[#d39be8]" />
                  {job.workMode}
                </InfoPill>
                <InfoPill>
                  <FontAwesomeIcon icon={faClock} className="w-4 text-[#d39be8]" />
                  {job.salary}
                </InfoPill>
              </div>

              <Link
                href="#"
                className="inline-flex items-center gap-2 pt-10 text-[14px] font-medium text-white transition hover:text-[#cfc8ff]"
              >
                Apply Now
                <FontAwesomeIcon icon={faArrowRight} className="text-[12px] w-5" />
              </Link>
            </article>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <button className="rounded-xl bg-white px-6 py-3 text-[14px] font-medium text-[#111] shadow-[0_10px_24px_rgba(255,255,255,0.12)] transition hover:brightness-95">
            View all job open
          </button>
        </div>
      </div>
    </section>
  );
}
