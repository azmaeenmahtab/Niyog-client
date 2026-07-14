'use client';

import Link from "next/link";
import { Button, Chip, Table } from "@heroui/react";
import Pagination from "@/app/jobs/Pagination";
import type { JobItem } from "@/app/jobs/JobsListing";

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
    if (!jobs.length) {
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
                                {jobs.map((job) => (
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
                                            <Chip size="sm" variant="soft" color="success" className="capitalize">
                                                Active
                                            </Chip>
                                        </Table.Cell>
                                        <Table.Cell>
                                            <span className="text-sm text-[#1a1a1a]/75">{job.salary}</span>
                                        </Table.Cell>
                                        <Table.Cell>
                                            <div className="flex justify-end">
                                                <Link
                                                    href={`/jobs/details/${job._id}`}
                                                    className="inline-flex items-center rounded-md border border-[#1a1a1a]/10 bg-white px-3 py-1.5 text-sm font-medium text-[#1a1a1a]/75 transition hover:bg-[#1a1a1a]/5"
                                                >
                                                    View
                                                </Link>
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
        </div>
    );
};

export default AdminJobsTable;
