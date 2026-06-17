import { Suspense } from "react";
import Filter from "./Filter";
import JobsListing, { type JobItem } from "./JobsListing";
import { getAllJobs } from "@/lib/api/jobs";
import { getAllJobsQueryParams } from "@/lib/api/jobs";

 

interface JobsPageProps {
  searchParams: Promise<getAllJobsQueryParams>; // ← must be Promise in Next.js 15
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

async function fetchJobs(params: getAllJobsQueryParams): Promise<JobItem[]> {
  console.log("[page.tsx] fetchJobs() called with params:", params);
  try {
    // Salary slider scaling before sending to the API helper
    const apiParams: getAllJobsQueryParams = { ...params };

    // Translate the "Remote" / "On-site" string into a boolean for the backend
    // (DB stores isRemote as a boolean, not a string)
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

    console.log("[page.tsx] apiParams (after copy):", apiParams);

    const json = await getAllJobs(apiParams);
    console.log("[page.tsx] getAllJobs returned JSON keys:", json ? Object.keys(json) : null, "success:", json?.success, "data length:", Array.isArray(json?.data) ? json.data.length : "n/a");
    if (json && !Array.isArray(json?.data)) {
      console.log("[page.tsx] non-array data — full json:", JSON.stringify(json).slice(0, 500));
    }
    const data = Array.isArray(json?.data) ? json.data : [];
    console.log("[page.tsx] mapped jobs count:", data.length);
    return data.map(mapToJobItem);
  } catch (err) {
    console.error("[page.tsx] fetchJobs error:", err);
    return [];
  }
}

export default async function JobsPage({ searchParams }: JobsPageProps) {
  const params = await searchParams; // ← await it
  console.log("[page.tsx] JobsPage raw searchParams:", params);
  const jobs = await fetchJobs(params);

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-[260px_1fr]">
      <Suspense fallback={null}>
        <Filter />
      </Suspense>
      <JobsListing jobs={jobs} />
    </div>
  );
}