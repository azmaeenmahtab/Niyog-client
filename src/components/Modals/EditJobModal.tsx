"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { getJobById, } from "@/lib/api/jobs";
import { updateJob } from "@/lib/actions/jobs";

interface EditJobModalProps {
  jobId: string;
  onClose: () => void;
  onUpdated: () => void;
}

const JOB_TYPES = ["full-time", "part-time", "contract", "freelance", "internship"];
const STATUS_OPTIONS = ["active", "inactive"];

interface JobFormState {
  title: string;
  category: string;
  type: string;
  deadline: string;
  salaryMin: string;
  salaryMax: string;
  currency: string;
  city: string;
  country: string;
  isRemote: boolean;
  responsibilities: string;
  requirements: string;
  benefits: string;
  status: string;
}

const EMPTY_FORM: JobFormState = {
  title: "",
  category: "",
  type: "",
  deadline: "",
  salaryMin: "",
  salaryMax: "",
  currency: "",
  city: "",
  country: "",
  isRemote: false,
  responsibilities: "",
  requirements: "",
  benefits: "",
  status: "active",
};

export function EditJobModal({ jobId, onClose, onUpdated }: EditJobModalProps) {
  const [form, setForm] = useState<JobFormState>(EMPTY_FORM);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    const loadJob = async () => {
      setIsLoading(true);
      const job = await getJobById(jobId);
      if (!job) {
        setLoadError("Failed to load job details.");
        setIsLoading(false);
        return;
      }
      setForm({
        title: job.title ?? "",
        category: job.category ?? "",
        type: job.type ?? "",
        deadline: job.deadline ?? "",
        salaryMin: job.salaryMin ?? "",
        salaryMax: job.salaryMax ?? "",
        currency: job.currency ?? "",
        city: job.city ?? "",
        country: job.country ?? "",
        isRemote: Boolean(job.isRemote),
        responsibilities: job.responsibilities ?? "",
        requirements: job.requirements ?? "",
        benefits: job.benefits ?? "",
        status: job.status ?? "active",
      });
      setIsLoading(false);
    };
    loadJob();
  }, [jobId]);

  const handleChange = (key: keyof JobFormState, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    setIsSaving(true);
    try {
      const result = await updateJob(jobId, form as any);
      if (result.success) {
        toast.success("Job updated successfully.");
        onUpdated();
        onClose();
      } else {
        toast.error(result.message);
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-8">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">Edit Job</h2>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-700">
            ✕
          </button>
        </div>

        {isLoading ? (
          <p className="mt-6 text-sm text-gray-500">Loading job details...</p>
        ) : loadError ? (
          <p className="mt-6 text-sm text-red-500">{loadError}</p>
        ) : (
          <div className="mt-5 flex flex-col gap-4">
            <Field label="Job Title">
              <input
                type="text"
                value={form.title}
                onChange={(e) => handleChange("title", e.target.value)}
                className="input"
              />
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Category">
                <input
                  type="text"
                  value={form.category}
                  onChange={(e) => handleChange("category", e.target.value)}
                  className="input"
                />
              </Field>
              <Field label="Type">
                <select
                  value={form.type}
                  onChange={(e) => handleChange("type", e.target.value)}
                  className="input"
                >
                  <option value="">Select type</option>
                  {JOB_TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Salary Min">
                <input
                  type="number"
                  value={form.salaryMin}
                  onChange={(e) => handleChange("salaryMin", e.target.value)}
                  className="input"
                />
              </Field>
              <Field label="Salary Max">
                <input
                  type="number"
                  value={form.salaryMax}
                  onChange={(e) => handleChange("salaryMax", e.target.value)}
                  className="input"
                />
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Currency">
                <input
                  type="text"
                  value={form.currency}
                  onChange={(e) => handleChange("currency", e.target.value)}
                  className="input"
                />
              </Field>
              <Field label="Deadline">
                <input
                  type="date"
                  value={form.deadline?.slice(0, 10)}
                  onChange={(e) => handleChange("deadline", e.target.value)}
                  className="input"
                />
              </Field>
            </div>

            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={form.isRemote}
                onChange={(e) => handleChange("isRemote", e.target.checked)}
              />
              Remote position
            </label>

            {!form.isRemote && (
              <div className="grid grid-cols-2 gap-4">
                <Field label="City">
                  <input
                    type="text"
                    value={form.city}
                    onChange={(e) => handleChange("city", e.target.value)}
                    className="input"
                  />
                </Field>
                <Field label="Country">
                  <input
                    type="text"
                    value={form.country}
                    onChange={(e) => handleChange("country", e.target.value)}
                    className="input"
                  />
                </Field>
              </div>
            )}

            <Field label="Responsibilities">
              <textarea
                value={form.responsibilities}
                onChange={(e) => handleChange("responsibilities", e.target.value)}
                rows={3}
                className="input"
              />
            </Field>
            <Field label="Requirements">
              <textarea
                value={form.requirements}
                onChange={(e) => handleChange("requirements", e.target.value)}
                rows={3}
                className="input"
              />
            </Field>
            <Field label="Benefits">
              <textarea
                value={form.benefits}
                onChange={(e) => handleChange("benefits", e.target.value)}
                rows={2}
                className="input"
              />
            </Field>

            <Field label="Status">
              <select
                value={form.status}
                onChange={(e) => handleChange("status", e.target.value)}
                className="input"
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </Field>

            <div className="mt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                disabled={isSaving}
                className="rounded-lg px-4 py-2 text-sm font-semibold text-gray-500 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSaving}
                className="rounded-lg bg-gray-950 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-900 disabled:opacity-50"
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5 text-sm text-gray-700">
      {label}
      {children}
    </label>
  );
}