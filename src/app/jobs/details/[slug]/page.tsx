'use client';

import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { checkJobReported, checkJobSaved, getJobById } from "@/lib/api/jobs";
import { useUserInfo } from "@/lib/contexts/userInfoContext";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { submitApplication } from "@/lib/actions/application"
import { reportJob, saveJob, unsaveJob } from "@/lib/actions/jobs";
import { ReportJobModal } from "@/components/Modals/ReportJobModal";

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

export default function JobDetailPage({ params }: JobDetailPageProps) {
  const userInfo = useUserInfo();
  const [job, setJob] = useState<JobDoc | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isApplying, setIsApplying] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isReporting, setIsReporting] = useState(false);
  const [isReported, setIsReported] = useState(false);

  console.log("User Info:", userInfo?.user?.role); // Debugging line to check user info

  const role = userInfo?.user?.role;

  useEffect(() => {
    const fetchJob = async () => {
      setIsLoading(true);
      const { slug } = await params;
      const result = await getJobById(slug);
      setJob(result);
      setIsLoading(false);

      if (result && userInfo?.user?.id) {
        const [savedResult, reportedResult] = await Promise.all([
          checkJobSaved(userInfo.user.id, result._id),
          checkJobReported(userInfo.user.id, result._id),
        ]);
        if (savedResult.success) setIsSaved(savedResult.data?.isSaved ?? false);
        if (reportedResult.success) setIsReported(reportedResult.data?.isReported ?? false);
      }
    };

    fetchJob();
  }, [params, userInfo?.user?.id]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-gray-500">Loading job details...</p>
      </div>
    );
  }

  if (!job) {
    notFound();
    return null; // This line will never be reached, but it's here to satisfy TypeScript
  }

  const remainingDays = daysUntil(job.deadline);
  const isClosed = job.status !== "active" || (remainingDays !== null && remainingDays < 0);


  const handleApplicationSubmit = async () => {
    if (role !== "applicant") {
      toast.error("Only applicants can apply for jobs.");
      return;
    }

    if (!userInfo?.user?.id || !userInfo?.user?.email) {
      toast.error("You must be logged in to apply.");
      return;
    }

    setIsApplying(true);
    try {
      const result = await submitApplication(
        userInfo.user.id,
        job._id,
        userInfo.user.email
      );

      if (result.success) {
        toast.success("Application submitted successfully!");
      } else {
        toast.error(result.message);
      }
    } finally {
      setIsApplying(false);
    }
  };

  const handleSaveToggle = async () => {
    if (!userInfo?.user?.id) {
      toast.error("You must be logged in to save jobs.");
      return;
    }
    setIsSaving(true);
    try {
      if (isSaved) {
        const result = await unsaveJob(userInfo.user.id, job._id);
        if (result.success) {
          setIsSaved(false);
          toast.success("Job removed from saved list.");
        } else {
          toast.error(result.message);
        }
      } else {
        const result = await saveJob(userInfo.user.id, job._id);
        if (result.success) {
          setIsSaved(true);
          toast.success("Job saved!");
        } else {
          toast.error(result.message);
        }
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleReportSubmit = async (reason: string, details: string) => {
    if (!userInfo?.user?.id) {
      toast.error("You must be logged in to report a job.");
      return;
    }
    setIsReporting(true);
    try {
      const result = await reportJob(userInfo.user.id, job._id, reason, details);
      if (result.success) {
        toast.success("Report submitted. Thanks for letting us know.");
        setIsReportModalOpen(false);
      } else {
        toast.error(result.message);
      }
    } finally {
      setIsReporting(false);
    }
  };

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

          <div className="flex items-center gap-2 mt-4">
            <button
              type="button"
              onClick={handleSaveToggle}
              disabled={isSaving}
              className={`flex-1 rounded-xl border py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${isSaved
                ? "border-gray-950 bg-gray-950 text-white hover:bg-gray-900"
                : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                }`}
            >
              {isSaving ? "..." : isSaved ? "Saved" : "Save Job"}
            </button>
            <button
              type="button"
              onClick={() => !isReported && setIsReportModalOpen(true)}
              disabled={isReported}
              className={`rounded-xl border px-4 py-3 text-sm font-semibold transition disabled:cursor-not-allowed ${isReported
                  ? "border-red-200 bg-red-50 text-red-400"
                  : "border-gray-200 bg-white text-gray-500 hover:bg-red-50 hover:text-red-600"
                }`}
            >
              {isReported ? "Reported" : "Report"}
            </button>
          </div>

          {isReportModalOpen && (
            <ReportJobModal
              onClose={() => setIsReportModalOpen(false)}
              onSubmit={handleReportSubmit}
              isSubmitting={isReporting}
            />
          )}
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
              onClick={handleApplicationSubmit}
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