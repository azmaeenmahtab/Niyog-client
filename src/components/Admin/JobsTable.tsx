'use client';

import Link from "next/link";
import { Button, Chip, Table } from "@heroui/react";
import { useState } from "react";
import { toast } from "sonner";
import Pagination from "@/app/jobs/Pagination";
import type { JobItem } from "@/app/jobs/JobsListing";
import { deleteJob, updateJob } from "@/lib/actions/jobs";
import { ConfirmModal } from "@/components/Modals/ConfirmationModal";

interface AdminJobsTableProps {
    jobs: JobItem[];
    pagination: {
        totalCount: number;
        totalPages: number;
        currentPage: number;
        limit: number;
    };
    basePath?: string;
}

const AdminJobsTable = ({ jobs, pagination, basePath = "/dashboard/admin/manage/jobs" }: AdminJobsTableProps) => {
    const [jobRows, setJobRows] = useState(jobs);
    const [updatingJobId, setUpdatingJobId] = useState<string | null>(null);
    const [deletingJobId, setDeletingJobId] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleStatusChange = async (job: JobItem) => {
        const nextStatus = job.status?.toLowerCase() === "active" ? "inactive" : "active";
        setUpdatingJobId(job._id);

        try {
            const result = await updateJob(job._id, { status: nextStatus });
            if (!result.success) {
                toast.error(result.message || "Failed to update job status.");
                return;
            }

            setJobRows((currentJobs) =>
                currentJobs.map((currentJob) =>
                    currentJob._id === job._id ? { ...currentJob, status: nextStatus } : currentJob,
                ),
            );
            toast.success(`Job set to ${nextStatus}.`);
        } finally {
            setUpdatingJobId(null);
        }
    };

    const handleDelete = async () => {
        if (!deletingJobId) return;
        setIsDeleting(true);

        try {
            const result = await deleteJob(deletingJobId);
            if (!result.success) {
                toast.error(result.message || "Failed to delete job.");
                return;
            }

            setJobRows((currentJobs) => currentJobs.filter((job) => job._id !== deletingJobId));
            toast.success("Job deleted successfully.");
        } finally {
            setIsDeleting(false);
            setDeletingJobId(null);
        }
    };

    if (!jobRows.length) {
        return (
            <div className="rounded-2xl border border-[#1a1a1a]/10 bg-white/60 p-8 text-sm text-[#1a1a1a]/60">
                No jobs found.
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight text-white">Manage Jobs</h1>
                    <p className="mt-1 text-sm text-white/60">
                        {pagination.totalCount} total jobs across {pagination.totalPages} pages.
                    </p>
                </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-[#1a1a1a]/10 bg-white/70 shadow-[0_10px_30px_rgba(40,24,8,0.05)]">
                <Table>
                    <Table.ScrollContainer>
                        <Table.Content aria-label="Admin jobs table" className="min-w-175">
                            <Table.Header >
                                <Table.Column isRowHeader>Title</Table.Column>
                                <Table.Column>Company</Table.Column>
                                <Table.Column>Type</Table.Column>
                                <Table.Column>Status</Table.Column>
                                <Table.Column>Salary</Table.Column>
                                <Table.Column className="text-end">Action</Table.Column>
                            </Table.Header>

                            <Table.Body>
                                {jobRows.map((job) => (
                                    <Table.Row key={job._id} id={job._id}>
                                        <Table.Cell>
                                            <div className="min-w-0">
                                                <p className="font-medium text-[#1a1a1a]">{job.title}</p>
                                                <p className="mt-1 truncate text-xs text-[#1a1a1a]/55">{job.location}</p>
                                            </div>
                                        </Table.Cell>
                                        <Table.Cell>
                                            <span className="text-sm text-[#1a1a1a]/75">{job.company}</span>
                                        </Table.Cell>
                                        <Table.Cell>
                                            <Chip size="sm" variant="soft" color="default" className="capitalize">
                                                {job.type}
                                            </Chip>
                                        </Table.Cell>
                                        <Table.Cell>
                                            <Chip
                                                size="sm"
                                                variant="soft"
                                                color={job.status?.toLowerCase() === "active" ? "success" : "danger"}
                                                className="capitalize"
                                            >
                                                {job.status ?? "inactive"}
                                            </Chip>
                                        </Table.Cell>
                                        <Table.Cell>
                                            <span className="text-sm text-[#1a1a1a]/75">{job.salary}</span>
                                        </Table.Cell>
                                        <Table.Cell>
                                            <div className="flex justify-end">
                                                <Button
                                                    size="sm"
                                                    variant="secondary"
                                                    isDisabled={updatingJobId === job._id}
                                                    onClick={() => handleStatusChange(job)}
                                                >
                                                    {updatingJobId === job._id
                                                        ? "Updating..."
                                                        : job.status?.toLowerCase() === "active"
                                                            ? "Deactivate"
                                                            : "Activate"}
                                                </Button>
                                                <Link
                                                    href={`/jobs/details/${job._id}`}
                                                    className="ml-2 inline-flex items-center rounded-md border border-[#1a1a1a]/10 bg-white px-3 py-1.5 text-sm font-medium text-[#1a1a1a]/75 transition hover:bg-[#1a1a1a]/5"
                                                >
                                                    View
                                                </Link>
                                                <Button
                                                    size="sm"
                                                    variant="danger-soft"
                                                    className="ml-2"
                                                    onClick={() => setDeletingJobId(job._id)}
                                                >
                                                    Delete
                                                </Button>
                                            </div>
                                        </Table.Cell>
                                    </Table.Row>
                                ))}
                            </Table.Body>
                        </Table.Content>
                    </Table.ScrollContainer>
                </Table>
            </div>

            <Pagination currentPage={pagination.currentPage} totalPages={pagination.totalPages} basePath={basePath} />

            {deletingJobId && (
                <ConfirmModal
                    title="Delete this job?"
                    description="This will permanently remove the job listing. This cannot be undone."
                    confirmLabel="Delete"
                    variant="danger"
                    isLoading={isDeleting}
                    onCancel={() => setDeletingJobId(null)}
                    onConfirm={handleDelete}
                />
            )}
        </div>
    );
};

export default AdminJobsTable;
