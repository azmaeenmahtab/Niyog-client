"use client";

import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Input, Select, Textarea, Toggle } from "@/components/Dashboard/FormField";
import { usePostJobForm } from "./usePostJobForm";

const JOB_CATEGORIES = [
  "Engineering", "Design", "Marketing", "Sales", "Finance",
  "HR", "Operations", "Product", "Data", "Legal", "Other",
];
const JOB_TYPES = ["Full-time", "Part-time", "Remote", "Contract", "Internship"];
const CURRENCIES = ["USD", "BDT", "EUR", "GBP", "CAD", "AUD"];

export default function PostJobPage() {
  const { data: session } = useSession();
  const router = useRouter();

  // TODO: fetch real company from your API
  const company = { id: "abc123", name: "Niyog Inc.", industry: "Technology" };

  const {
    fields, errors, isRemote, setIsRemote,
    handleChange, handleSubmit, isSubmitting,
  } = usePostJobForm({ company, recruiter: session?.user });

  return (
    <div className="min-h-screen w-full px-6 py-8 bg-[#121212]">
      <div className="mx-auto max-w-3xl">

        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-[22px] font-semibold text-white">Post a New Job</h1>
          <p className="mt-1 text-[13px] text-white/40">
            Fill in the details to publish your listing on HireLoop.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">

          {/* ── Job Info ── */}
          <Section label="Job Info">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Job Title"
                placeholder="e.g. Senior Frontend Developer"
                value={fields.title}
                onChange={handleChange("title")}
                error={errors.title}
              />
              <Select
                label="Job Category"
                value={fields.category}
                onChange={handleChange("category")}
                error={errors.category}
              >
                <option value="" disabled>Select a category</option>
                {JOB_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Select
                label="Job Type"
                value={fields.type}
                onChange={handleChange("type")}
                error={errors.type}
              >
                <option value="" disabled>Select job type</option>
                {JOB_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </Select>
              <Input
                label="Application Deadline"
                type="date"
                value={fields.deadline}
                onChange={handleChange("deadline")}
                error={errors.deadline}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <Input
                label="Min Salary"
                type="number"
                placeholder="e.g. 50000"
                value={fields.salaryMin}
                onChange={handleChange("salaryMin")}
                error={errors.salaryMin}
              />
              <Input
                label="Max Salary"
                type="number"
                placeholder="e.g. 80000"
                value={fields.salaryMax}
                onChange={handleChange("salaryMax")}
                error={errors.salaryMax}
              />
              <Select
                label="Currency"
                value={fields.currency}
                onChange={handleChange("currency")}
                error={errors.currency}
              >
                {CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </Select>
            </div>

            {/* Location */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-medium uppercase tracking-wider text-white/40">
                  Location
                </span>
                <Toggle
                  label="Remote position"
                  checked={isRemote}
                  onChange={setIsRemote}
                />
              </div>
              {!isRemote && (
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    placeholder="City"
                    value={fields.city}
                    onChange={handleChange("city")}
                    error={errors.city}
                  />
                  <Input
                    placeholder="Country"
                    value={fields.country}
                    onChange={handleChange("country")}
                    error={errors.country}
                  />
                </div>
              )}
            </div>
          </Section>

          {/* ── Job Description ── */}
          <Section label="Job Description">
            <Textarea
              label="Responsibilities"
              placeholder="List the key responsibilities for this role…"
              rows={5}
              value={fields.responsibilities}
              onChange={handleChange("responsibilities")}
              error={errors.responsibilities}
            />
            <Textarea
              label="Requirements"
              placeholder="Required skills, experience, qualifications…"
              rows={5}
              value={fields.requirements}
              onChange={handleChange("requirements")}
              error={errors.requirements}
            />
            <Textarea
              label="Benefits (optional)"
              placeholder="Health insurance, flexible hours, equity…"
              rows={3}
              value={fields.benefits}
              onChange={handleChange("benefits")}
            />
          </Section>

          {/* ── Company ── */}
          <Section label="Company">
            {company ? (
              <div className="flex items-center gap-3 rounded-xl border border-white/8 bg-white/4 px-4 py-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/8 text-[13px] font-bold text-white/60">
                  {company.name?.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="text-[14px] font-medium text-white">{company.name}</p>
                  <p className="text-[12px] text-white/40">{company.industry} · Auto-linked to this post</p>
                </div>
                <span className="ml-auto shrink-0 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] text-emerald-400">
                  Approved
                </span>
              </div>
            ) : (
              <div className="rounded-xl border border-amber-500/20 bg-amber-500/8 px-4 py-3 text-[13px] text-amber-400">
                You need an approved company profile before posting a job.
              </div>
            )}
          </Section>

          {/* ── Actions ── */}
          <div className="flex justify-end gap-3 pb-8">
            <button
              type="button"
              onClick={() => router.back()}
              className="rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-[14px] text-white/70 transition hover:bg-white/10 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!company || isSubmitting}
              className="rounded-xl bg-gradient-to-r from-[#6f62ff] to-[#7a5cff] px-6 py-2.5 text-[14px] font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? "Posting…" : "Post Job"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

function Section({ label, children }) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-white/8 bg-[#1a1a1a] p-6">
      <p className="text-[11px] font-semibold uppercase tracking-widest text-white/30">
        {label}
      </p>
      {children}
    </div>
  );
}