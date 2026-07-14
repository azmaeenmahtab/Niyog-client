"use client";

import { Button, Chip, Table } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  getAllReports,
  dismissReport,
  deactivateReportedJob,
  deleteReportedJob,
  type JobReport,
} from "@/lib/api/reports";
import { SortableColumnHeader } from "../Applicant/SortableColumnHeader";
import { ConfirmModal } from "../Modals/ConfirmationModal";


interface SortDescriptor {
  column: keyof JobReport;
  direction: "ascending" | "descending";
}

const STATUS_FILTERS = ["pending", "reviewed", "dismissed", "all"] as const;

const statusColorMap: Record<string, "success" | "danger" | "warning" | "default"> = {
  pending: "warning",
  reviewed: "success",
  dismissed: "default",
};

export function ReportsTable() {
  const [reports, setReports] = useState<JobReport[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<(typeof STATUS_FILTERS)[number]>("pending");
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "reportedAt",
    direction: "descending",
  });
  const [confirmAction, setConfirmAction] = useState<
    { type: "deactivate" | "delete"; reportId: string; jobId: string } | null
  >(null);

  useEffect(() => {
    async function fetchReports() {
    setLoading(true);
    setError("");
    const result = await getAllReports(statusFilter);
    if (result.success) {
      setReports(result.data ?? []);
    } else {
      setError(result.message);
    }
    setLoading(false);
  }
    fetchReports();
  }, [statusFilter]);

  

  const sortedReports = useMemo(() => {
    return [...reports].sort((a, b) => {
      const col = sortDescriptor.column;
      const first = String(a[col] ?? "");
      const second = String(b[col] ?? "");
      let cmp = first.localeCompare(second);
      if (sortDescriptor.direction === "descending") cmp *= -1;
      return cmp;
    });
  }, [reports, sortDescriptor]);

  async function handleDismiss(reportId: string) {
    setActionLoadingId(reportId);
    const result = await dismissReport(reportId);
    if (result.success) {
      toast.success("Report dismissed.");
      setReports((prev) => prev.filter((r) => r._id !== reportId));
    } else {
      toast.error(result.message);
    }
    setActionLoadingId(null);
  }

async function handleDeactivateJob(reportId: string, jobId: string) {
  setActionLoadingId(reportId);
  const result = await deactivateReportedJob(reportId, jobId);
  if (result.success) {
    toast.success("Job deactivated and report marked reviewed.");
    setReports((prev) => prev.filter((r) => r._id !== reportId));
  } else {
    toast.error(result.message);
  }
  setActionLoadingId(null);
  setConfirmAction(null);
}

async function handleDeleteJob(reportId: string, jobId: string) {
  setActionLoadingId(reportId);
  const result = await deleteReportedJob(reportId, jobId);
  if (result.success) {
    toast.success("Job deleted and report marked reviewed.");
    setReports((prev) => prev.filter((r) => r._id !== reportId));
  } else {
    toast.error(result.message);
  }
  setActionLoadingId(null);
  setConfirmAction(null);
}

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        {STATUS_FILTERS.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setStatusFilter(s)}
            className={`rounded-full px-3.5 py-1.5 text-xs font-semibold capitalize transition ${
              statusFilter === s
                ? "bg-gray-950 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-sm text-muted p-4">Loading reports...</p>
      ) : error ? (
        <p className="text-sm text-danger p-4">{error}</p>
      ) : !reports.length ? (
        <p className="text-sm text-muted p-4">No {statusFilter !== "all" ? statusFilter : ""} reports found.</p>
      ) : (
        <Table>
          <Table.ScrollContainer>
            <Table.Content
              aria-label="Reports table"
              className="min-w-[900px]"
              sortDescriptor={sortDescriptor}
              onSortChange={(descriptor) => setSortDescriptor(descriptor as SortDescriptor)}
            >
              <Table.Header>
                <Table.Column allowsSorting id="jobTitle" isRowHeader>
                  {({ sortDirection }) => (
                    <SortableColumnHeader sortDirection={sortDirection}>Job</SortableColumnHeader>
                  )}
                </Table.Column>
                <Table.Column allowsSorting id="reason">
                  {({ sortDirection }) => (
                    <SortableColumnHeader sortDirection={sortDirection}>Reason</SortableColumnHeader>
                  )}
                </Table.Column>
                <Table.Column allowsSorting id="reportedAt">
                  {({ sortDirection }) => (
                    <SortableColumnHeader sortDirection={sortDirection}>Reported On</SortableColumnHeader>
                  )}
                </Table.Column>
                <Table.Column allowsSorting id="status">
                  {({ sortDirection }) => (
                    <SortableColumnHeader sortDirection={sortDirection}>Status</SortableColumnHeader>
                  )}
                </Table.Column>
                <Table.Column className="text-end">Actions</Table.Column>
              </Table.Header>
              <Table.Body>
                {sortedReports.map((report) => (
                  <Table.Row key={report._id} id={report._id}>
                    <Table.Cell>
                      <Link
                        href={`/jobs/details/${report.jobId}`}
                        className="text-sm font-medium text-gray-900 hover:underline"
                      >
                        {report.jobTitle}
                      </Link>
                    </Table.Cell>
                    <Table.Cell>
                      <div className="flex flex-col gap-0.5">
                        <span className="text-sm">{report.reason}</span>
                        {report.details && (
                          <span className="text-xs text-muted line-clamp-1">{report.details}</span>
                        )}
                      </div>
                    </Table.Cell>
                    <Table.Cell>
                      <span className="text-xs">
                        {new Date(report.reportedAt).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </Table.Cell>
                    <Table.Cell>
                      <Chip color={statusColorMap[report.status] ?? "default"} size="sm" variant="soft">
                        {report.status}
                      </Chip>
                    </Table.Cell>
                    <Table.Cell>
                      <div className="flex items-center justify-end gap-1">
                        {report.status === "pending" && (
                          <>
                            <Button
                              size="sm"
                              variant="tertiary"
                              isDisabled={actionLoadingId === report._id}
                              onClick={() => handleDismiss(report._id)}
                            >
                              Dismiss
                            </Button>
                            <Button
  size="sm"
  variant="danger-soft"
  isDisabled={actionLoadingId === report._id}
  onClick={() => setConfirmAction({ type: "deactivate", reportId: report._id, jobId: report.jobId })}
>
  Deactivate Job
</Button>
<Button
  size="sm"
  variant="danger-soft"
  isDisabled={actionLoadingId === report._id}
  onClick={() => setConfirmAction({ type: "delete", reportId: report._id, jobId: report.jobId })}
>
  Delete Job
</Button>
                          </>
                        )}
                      </div>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Content>
          </Table.ScrollContainer>
        </Table>

      )}

      {confirmAction && (
  <ConfirmModal
    title={confirmAction.type === "deactivate" ? "Deactivate this job?" : "Delete this job?"}
    description={
      confirmAction.type === "deactivate"
        ? "The job will be hidden from applicants immediately. You can re-activate it later from the jobs list."
        : "This will permanently remove the job listing. This cannot be undone."
    }
    confirmLabel={confirmAction.type === "deactivate" ? "Deactivate" : "Delete"}
    variant={confirmAction.type === "deactivate" ? "warning" : "danger"}
    isLoading={actionLoadingId === confirmAction.reportId}
    onCancel={() => setConfirmAction(null)}
    onConfirm={() =>
      confirmAction.type === "deactivate"
        ? handleDeactivateJob(confirmAction.reportId, confirmAction.jobId)
        : handleDeleteJob(confirmAction.reportId, confirmAction.jobId)
    }
  />
)}
    </div>
  );
}