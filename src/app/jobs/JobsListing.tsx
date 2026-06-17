export interface JobItem {
  _id: string;
  title: string;
  company: string;
  companyLogoUrl?: string | null;
  location: string;
  type: string;
  category?: string;
  salary: string;
  description: string;
  tags?: string[];
}

const SORT_OPTIONS = ["Newest First", "Oldest First", "Salary: High to Low"];

const tagColor: Record<string, string> = {
  Full: "bg-[#1a1a1a]/8 text-[#1a1a1a]/80",
  UX: "bg-[#1a1a1a]/8 text-[#1a1a1a]/80",
  UI: "bg-[#1a1a1a]/8 text-[#1a1a1a]/80",
  Contract: "bg-[#1a1a1a]/8 text-[#1a1a1a]/80",
  Marketing: "bg-[#1a1a1a]/8 text-[#1a1a1a]/80",
  Print: "bg-[#1a1a1a]/8 text-[#1a1a1a]/80",
  Freelance: "bg-[#1a1a1a]/8 text-[#1a1a1a]/80",
  Development: "bg-[#1a1a1a]/8 text-[#1a1a1a]/80",
  Training: "bg-[#1a1a1a]/8 text-[#1a1a1a]/80",
};

export default function JobsListing({ jobs }: { jobs: JobItem[] }) {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between px-1 text-[12px] text-[#1a1a1a]/60">
        <span>{jobs.length} jobs found in your area</span>
        <div className="flex items-center gap-2">
          <span className="font-semibold uppercase tracking-[0.2em] text-[#1a1a1a]/50">
            Sort by:
          </span>
          <select className="rounded-md border border-[#1a1a1a]/15 bg-white/60 px-2 py-1 text-[12px] font-semibold text-[#1a1a1a]/80 focus:outline-none">
            {SORT_OPTIONS.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {jobs.length === 0 ? (
        <div className="rounded-2xl border border-[#1a1a1a]/10 bg-white/55 p-10 text-center text-[#1a1a1a]/55 backdrop-blur-md">
          No jobs match your filters.
        </div>
      ) : (
        <ul className="flex flex-col gap-4">
          {jobs.map((job) => (
            <li
              key={job._id}
              className="rounded-2xl border border-[#1a1a1a]/10 bg-white/70 p-6 shadow-[0_10px_30px_rgba(40,24,8,0.05)] backdrop-blur-md"
            >
              <div className="flex items-start gap-5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[#1a1a1a]/8 bg-[#1a1a1a]/4 text-[18px] font-bold text-[#1a1a1a]/60">
                  {job.companyLogoUrl ? (
                    <img
                      src={job.companyLogoUrl}
                      alt={`${job.company} logo`}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span>{job.company.charAt(0).toUpperCase()}</span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-serif text-[22px] font-medium leading-tight text-[#1a1a1a]">
                        {job.title}
                      </h3>
                      <p className="mt-1 text-[13px] text-[#1a1a1a]/60">
                        {job.company} · {job.location}
                      </p>
                    </div>
                    <span className="font-serif text-[20px] italic text-[#e2613a]">
                      {job.salary}
                    </span>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {(job.tags ?? []).map((tag) => (
                      <span
                        key={tag}
                        className={`rounded-md px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider ${tagColor[tag] ?? "bg-[#1a1a1a]/8 text-[#1a1a1a]/80"}`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <p className="mt-4 line-clamp-2 text-[14px] leading-6 text-[#1a1a1a]/65">
                    {job.description}
                  </p>

                  <div className="mt-4 flex justify-end">
                    <button
                      type="button"
                      className="rounded-lg bg-[#e2613a] px-5 py-2 text-[13px] font-semibold text-white shadow-[0_6px_14px_rgba(226,97,58,0.3)] transition hover:brightness-105"
                    >
                      Apply Now
                    </button>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
