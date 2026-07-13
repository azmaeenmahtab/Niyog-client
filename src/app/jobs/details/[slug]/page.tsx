import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getJobById } from "@/lib/api/jobs";

interface JobDetailPageProps {
  params: Promise<{ slug: string }>;
}

interface JobDoc {
  _id: string;
  title: string;
  type: string;
  category: string;
  status: string;
  isRemote: boolean;
  city?: string;
  country?: string;
  currency: string;
  salaryMin: string;
  salaryMax: string;
  deadline: string;
  postedAt: string;
  responsibilities: string;
  requirements: string;
  benefits: string;
  companyId: string;
  companyName: string;
  companyIndustry: string;
  companyLogoUrl?: string | null;
  recruiterId: string;
}

function formatSalary(job: JobDoc) {
  const currency = job.currency?.toUpperCase() || "USD";
  const min = Number(job.salaryMin);
  const max = Number(job.salaryMax);
  if (!min && !max) return "Negotiable";
  if (min && max) return `${currency} ${min.toLocaleString()} – ${max.toLocaleString()}`;
  if (min) return `${currency} ${min.toLocaleString()}+`;
  return `Up to ${currency} ${max.toLocaleString()}`;
}

function formatDate(dateStr: string) {
  if (!dateStr) return "—";
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

function daysUntil(dateStr: string) {
  const deadline = new Date(dateStr);
  if (Number.isNaN(deadline.getTime())) return null;
  return Math.ceil((deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
}

function formatLocation(job: JobDoc) {
  if (job.isRemote) return "Remote";
  const parts = [job.city, job.country].filter(Boolean);
  return parts.length ? parts.join(", ") : "Location not specified";
}

// Highly stylized content block parser that fixes hidden or messy raw text
function DetailedSection({ title, content, iconColor }: { title: string; content: string; iconColor: string }) {
  if (!content || content.trim() === "") return null;

  // Split lines and filter out empty breaks
  const rawLines = content.split("\n").map(line => line.trim()).filter(Boolean);

  return (
    <div className="bg-white rounded-2xl border border-gray-200/80 p-6 md:p-8 shadow-sm transition-all hover:border-gray-300">
      <div className="flex items-center gap-3 mb-6">
        <span className={`w-1.5 h-6 rounded-full ${iconColor}`} />
        <h2 className="text-xl font-bold text-gray-900 tracking-tight">{title}</h2>
      </div>
      
      <ul className="space-y-4">
        {rawLines.map((line, idx) => {
          // Clean standard bullets if they already exist in the database string
          const cleanText = line.replace(/^[-*•\d+.]\s*/, "");
          
          return (
            <li key={idx} className="flex items-start gap-3 text-[15px] leading-relaxed text-gray-600">
              <svg className={`w-5 h-5 mt-0.5 shrink-0 text-gray-400`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{cleanText}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default async function JobDetailPage({ params }: JobDetailPageProps) {
  const { slug } = await params;
  const job: JobDoc | null = await getJobById(slug);

  if (!job) {
    notFound();
  }

  const remainingDays = daysUntil(job.deadline);
  const isClosed = job.status !== "active" || (remainingDays !== null && remainingDays < 0);

  return (
    <div className="min-h-screen rounded-2xl bg-gray-50/50 pb-16">
      {/* Top Context Breadcrumb Bar */}
      <div className="max-w-6xl mx-auto px-4 pt-6">
        <Link href="/jobs" className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
          Back to Career Board
        </Link>
      </div>

      {/* Main Container */}
      <div className="max-w-6xl mx-auto px-4 mt-4 grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* LEFT COLUMN - Main Job Content */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Main Card Header */}
          <div className="bg-white rounded-2xl border border-gray-200/80 p-6 md:p-8 shadow-sm">
            <div className="flex flex-col sm:flex-row items-start justify-between gap-6">
              
              <div className="flex items-start gap-5">
                {/* Logo wrapper */}
                <div className="w-16 h-16 rounded-xl border border-gray-100 bg-gray-50 flex items-center justify-center shrink-0 overflow-hidden text-2xl font-black text-gray-400">
                  {job.companyLogoUrl ? (
                    <Image src={job.companyLogoUrl} alt={job.companyName} width={64} height={64} className="object-cover w-full h-full" />
                  ) : (
                    job.companyName?.charAt(0).toUpperCase()
                  )}
                </div>

                <div>
                  <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight leading-tight">
                    {job.title}
                  </h1>
                  <p className="text-gray-600 font-medium mt-1">
                    {job.companyName} <span className="text-gray-300 mx-2">|</span> <span className="text-gray-500 font-normal">{formatLocation(job)}</span>
                  </p>
                  
                  {/* Badges row */}
                  <div className="flex flex-wrap gap-2 mt-4">
                    <span className="px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded-md bg-blue-50 text-blue-700 border border-blue-100">
                      {job.type}
                    </span>
                    <span className="px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded-md bg-purple-50 text-purple-700 border border-purple-100">
                      {job.category}
                    </span>
                    {isClosed ? (
                      <span className="px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded-md bg-red-50 text-red-700 border border-red-100">
                        Closed
                      </span>
                    ) : (
                      <span className="px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded-md bg-emerald-50 text-emerald-700 border border-emerald-100">
                        Accepting Candidates
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Core Descriptive Text blocks wrapped elegantly */}
          <div className="space-y-6">
            <DetailedSection title="Core Responsibilities" content={job.responsibilities} iconColor="bg-blue-600" />
            <DetailedSection title="Requirements & Experience" content={job.requirements} iconColor="bg-purple-600" />
            <DetailedSection title="Compensations & Benefits" content={job.benefits} iconColor="bg-emerald-600" />
          </div>
        </div>

        {/* RIGHT COLUMN - Sticky Sidebar Metadata & Action */}
        <div className="space-y-6 lg:sticky lg:top-25">
          
          {/* Compensation Card */}
          <div className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Estimated Compensation</h3>
            <div className="text-2xl font-black text-gray-900 tracking-tight">
              {formatSalary(job)}
            </div>
            <span className="text-xs text-gray-500 block mt-0.5">Base compensation annualized</span>

            {/* Quick Timeline Specs */}
            <div className="mt-6 pt-6 border-t border-gray-100 space-y-4 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-gray-400 font-medium">Date Posted</span>
                <span className="text-gray-800 font-semibold">{formatDate(job.postedAt)}</span>
              </div>
              <div className="flex justify-between items-start">
                <span className="text-gray-400 font-medium">Application Window</span>
                <div className="text-right">
                  <span className="text-gray-800 font-semibold block">{formatDate(job.deadline)}</span>
                  {!isClosed && remainingDays !== null && remainingDays >= 0 && (
                    <span className="text-xs text-amber-600 font-bold bg-amber-50 px-2 py-0.5 rounded mt-1 inline-block">
                      {remainingDays} days remaining
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* CTA Action Hook */}
            <button
              type="button"
              disabled={isClosed}
              className="mt-6 w-full py-4 px-4 rounded-xl font-bold text-sm tracking-wide transition-all duration-150 bg-gray-950 text-white hover:bg-gray-900 active:scale-[0.99] shadow-md disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-gray-950"
            >
              {isClosed ? "Applications Blocked" : "Submit Application"}
            </button>
          </div>

          {/* Detailed Industrial Card */}
          <div className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">The Hiring Company</h3>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center shrink-0 font-bold text-gray-700 overflow-hidden">
                {job.companyLogoUrl ? (
                  <Image src={job.companyLogoUrl} alt={job.companyName} width={48} height={48} className="object-cover w-full h-full" />
                ) : (
                  job.companyName?.charAt(0).toUpperCase()
                )}
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-base leading-tight">{job.companyName}</h4>
                <p className="text-xs text-gray-500 font-medium capitalize mt-1">{job.companyIndustry} Sector</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}