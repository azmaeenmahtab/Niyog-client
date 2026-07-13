import { Suspense } from "react";
import Filter from "./Filter";
import JobsListing, { type JobItem } from "./JobsListing";
import { getAllJobs } from "@/lib/api/jobs";
import { getAllJobsQueryParams } from "@/lib/api/jobs";
import Pagination from "@/app/jobs/Pagination";

 

interface JobsPageProps {
  searchParams: Promise<getAllJobsQueryParams>; // ← must be Promise in Next.js 15
}

interface JobsFetchResult {
  jobs: JobItem[];
  pagination: {
    totalCount: number;
    totalPages: number;
    currentPage: number;
    limit: number;
  };
}

const buildBackendUrl = (params: getAllJobsQueryParams) => {
  const search = new URLSearchParams();
  if (params.type) search.set("type", params.type);
  if (params.location) search.set("location", params.location);
  if (params.salary) {
    const sliderVal = Number(params.salary);
    // slider goes 0–250, salary display = sliderVal * 2, so max = $500
    if (!Number.isNaN(sliderVal)) search.set("salary", String(sliderVal * 2));
  }
  if (params.keyword) search.set("keyword", params.keyword);
  if (params.place) search.set("place", params.place);
  const qs = search.toString();
  return qs ;
};

const formatSalary = (doc: any): string => {
  if (typeof doc.salary === "string" && doc.salary.trim()) return doc.salary;
  if (typeof doc.salaryRange === "string" && doc.salaryRange.trim()) return doc.salaryRange;

  const min = doc.salaryMin ?? doc.minSalary;
  const max = doc.salaryMax ?? doc.maxSalary;
  const currency = doc.currency ?? "USD";

  if (min != null && max != null) {
    return `${currency} ${min}–${max}`;
  }
  if (min != null) return `${currency} ${min}+`;
  if (max != null) return `Up to ${currency} ${max}`;

  return "Negotiable";
};

const mapToJobItem = (doc: any): JobItem => ({
  _id: String(doc._id),
  title: doc.title ?? "Untitled role",
  company: doc.company ?? doc.companyName ?? "Unknown company",
  companyLogoUrl: doc.companyLogoUrl ?? doc.logoUrl ?? null,
  location: doc.location ?? doc.city ?? "Remote",
  type: doc.type ?? doc.employmentType ?? "Full-time",
  category: doc.category,
  salary: formatSalary(doc),
  description: doc.description ?? doc.summary ?? "",
  tags: doc.tags ?? (doc.type ? [doc.type] : []),
});

// ... mapToJobItem stays the same ...

async function fetchJobs(params: getAllJobsQueryParams): Promise<JobsFetchResult> {
  console.log("[page.tsx] fetchJobs() called with params:", params);
  const fallback: JobsFetchResult = {
    jobs: [],
    pagination: { totalCount: 0, totalPages: 1, currentPage: 1, limit: 10 },
  };

  try {
    const apiParams: getAllJobsQueryParams = { ...params };

    if (apiParams.location) {
      const loc = apiParams.location.toLowerCase();
      if (loc === "remote") {
        apiParams.isRemote = "true";
        delete (apiParams as any).location;
      } else if (loc === "on-site" || loc === "onsite") {
        apiParams.isRemote = "false";
        delete (apiParams as any).location;
      }
    }

    // page comes straight through from the URL — no scaling needed
    console.log("[page.tsx] apiParams (after copy):", apiParams);

    const json = await getAllJobs(apiParams);
    const data = Array.isArray(json?.data) ? json.data : [];
    const pagination = json?.pagination ?? fallback.pagination;

    console.log("[page.tsx] mapped jobs count:", data.length, "pagination:", pagination);

    return {
      jobs: data.map(mapToJobItem),
      pagination,
    };
  } catch (err) {
    console.error("[page.tsx] fetchJobs error:", err);
    return fallback;
  }
}

export default async function JobsPage({ searchParams }: JobsPageProps) {
  const params = await searchParams;
  console.log("[page.tsx] JobsPage raw searchParams:", params);
  const { jobs, pagination } = await fetchJobs(params);

  return (
    <>  
    <div className="mx-auto w-full max-w-6xl">
        <header className="mb-10">
          <h1 className="font-serif text-4xl font-medium tracking-tight sm:text-5xl lg:text-[56px] lg:leading-[1.05]">
            Find Your Next{" "}
            <span className="font-serif italic font-medium text-[#e2613a]">
              Opportunity
            </span>
          </h1>
          <p className="mt-4 max-w-2xl text-[15px] leading-7 text-[#1a1a1a]/65 sm:text-base">
            Discover curated roles from sun-baked startups to global leaders.
            Your career journey, refined and simplified through the Niyog lens.
          </p>
        </header>
        {/* {children} */}
      </div>
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-[260px_1fr]">
      
      <Suspense fallback={null}>
        <Filter />
      </Suspense>
      <div>
        <JobsListing jobs={jobs} />
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
        />
      </div>
    </div>
    </>
  );
}