import AdminJobsTable from '@/components/Admin/JobsTable';
import { getAllJobs, type getAllJobsQueryParams } from '@/lib/api/jobs';
import type { JobItem } from '@/app/jobs/JobsListing';

interface ManageJobsPageProps {
  searchParams: Promise<getAllJobsQueryParams>;
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

const formatSalary = (doc: any): string => {
  if (typeof doc.salary === "string" && doc.salary.trim()) return doc.salary;
  if (typeof doc.salaryRange === "string" && doc.salaryRange.trim()) return doc.salaryRange;

  const min = doc.salaryMin ?? doc.minSalary;
  const max = doc.salaryMax ?? doc.maxSalary;
  const currency = doc.currency ?? "USD";

  if (min != null && max != null) return `${currency} ${min}–${max}`;
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

async function fetchJobs(params: getAllJobsQueryParams): Promise<JobsFetchResult> {
  const fallback: JobsFetchResult = {
    jobs: [],
    pagination: { totalCount: 0, totalPages: 1, currentPage: 1, limit: 10 },
  };

  try {
    const json = await getAllJobs(params);
    const data = Array.isArray(json?.data) ? json.data : [];
    const pagination = json?.pagination ?? fallback.pagination;

    return {
      jobs: data.map(mapToJobItem),
      pagination,
    };
  } catch (error) {
    console.error("[admin/manage/jobs] fetchJobs error:", error);
    return fallback;
  }
}

export default async function ManageJobs({ searchParams }: ManageJobsPageProps) {
  const params = await searchParams;
  const { jobs, pagination } = await fetchJobs({ page: params.page });

  return (
    <div className="px-6 py-6">
      <AdminJobsTable jobs={jobs} pagination={pagination} basePath="/dashboard/admin/manage/jobs" />
    </div>
  );
}
