"use client";

import { useState } from "react";

const REPORT_REASONS = [
  "Spam or scam",
  "Misleading information",
  "Discriminatory content",
  "Job already filled / expired",
  "Other",
];

interface ReportJobModalProps {
  onClose: () => void;
  onSubmit: (reason: string, details: string) => void;
  isSubmitting: boolean;
}

export function ReportJobModal({ onClose, onSubmit, isSubmitting }: ReportJobModalProps) {
  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <h2 className="text-lg font-bold text-gray-900">Report this job</h2>
        <p className="mt-1 text-sm text-gray-500">
          Let us know what&apos;s wrong. Our team will review it.
        </p>

        <div className="mt-4 flex flex-col gap-2">
          {REPORT_REASONS.map((r) => (
            <label
              key={r}
              className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
            >
              <input
                type="radio"
                name="reportReason"
                value={r}
                checked={reason === r}
                onChange={() => setReason(r)}
                className="h-4 w-4"
              />
              {r}
            </label>
          ))}
        </div>

        <textarea
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          placeholder="Additional details (optional)"
          rows={3}
          className="mt-4 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 outline-none focus:border-gray-400"
        />

        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-sm font-semibold text-gray-500 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!reason || isSubmitting}
            onClick={() => onSubmit(reason, details)}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {isSubmitting ? "Submitting..." : "Submit Report"}
          </button>
        </div>
      </div>
    </div>
  );
}