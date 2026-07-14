"use client";

import { Button, Table } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { getSavedJobs, SavedJob } from "@/lib/api/jobs";
import {unsaveJob } from "@/lib/actions/jobs";
import { useSession } from "@/lib/auth-client";
import { toast } from "sonner";
import { SortableColumnHeader } from "./SortableColumnHeader";

interface SortDescriptor {
  column: keyof SavedJob;
  direction: "ascending" | "descending";
}

export function SavedJobsTable() {
  const [savedJobs, setSavedJobs] = useState<SavedJob[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "savedAt",
    direction: "descending",
  });

  const session = useSession();
  const userId = session?.data?.user?.id;

  useEffect(() => {
    if (!userId) return;

    const fetchSavedJobs = async () => {
      setLoading(true);
      try {
        const result = await getSavedJobs(userId);
        if (!result.success) {
          setError(result.message || "Failed to fetch saved jobs");
          return;
        }
        setSavedJobs(result.data ?? []);
      } catch {
        setError("Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchSavedJobs();
  }, [userId]);

  const sortedJobs = useMemo(() => {
    return [...savedJobs].sort((a, b) => {
      const col = sortDescriptor.column;
      const first = String(a[col] ?? "");
      const second = String(b[col] ?? "");
      let cmp = first.localeCompare(second);
      if (sortDescriptor.direction === "descending") cmp *= -1;
      return cmp;
    });
  }, [savedJobs, sortDescriptor]);

  const handleRemove = async (jobId: string) => {
    if (!userId) return;
    setRemovingId(jobId);
    try {
      const result = await unsaveJob(userId, jobId);
      if (result.success) {
        setSavedJobs((prev) => prev.filter((j) => j.jobId !== jobId));
        toast.success("Job removed from saved list.");
      } else {
        toast.error(result.message);
      }
    } finally {
      setRemovingId(null);
    }
  };

  if (loading) return <p className="text-sm text-muted p-4">Loading saved jobs...</p>;
  if (error) return <p className="text-sm text-danger p-4">{error}</p>;
  if (!savedJobs.length) return <p className="text-sm text-muted p-4">You haven&apos;t saved any jobs yet.</p>;

  return (
    <Table>
      <Table.ScrollContainer>
        <Table.Content
          aria-label="Saved jobs table"
          className="min-w-[700px]"
          sortDescriptor={sortDescriptor}
          onSortChange={(descriptor) => setSortDescriptor(descriptor as SortDescriptor)}
        >
          <Table.Header>
            <Table.Column allowsSorting id="jobTitle" isRowHeader>
              {({ sortDirection }) => (
                <SortableColumnHeader sortDirection={sortDirection}>Job Role</SortableColumnHeader>
              )}
            </Table.Column>
            <Table.Column allowsSorting id="companyName">
              {({ sortDirection }) => (
                <SortableColumnHeader sortDirection={sortDirection}>Company</SortableColumnHeader>
              )}
            </Table.Column>
            <Table.Column allowsSorting id="savedAt">
              {({ sortDirection }) => (
                <SortableColumnHeader sortDirection={sortDirection}>Saved On</SortableColumnHeader>
              )}
            </Table.Column>
            <Table.Column className="text-end">Actions</Table.Column>
          </Table.Header>
          <Table.Body>
            {sortedJobs.map((saved) => (
              <Table.Row key={saved._id} id={saved._id}>
                <Table.Cell>
                  <span className="text-sm font-medium">{saved.jobTitle}</span>
                </Table.Cell>
                <Table.Cell>
                  <div className="flex items-center gap-2">
                    {saved.companyLogoUrl ? (
                      <img
                        src={saved.companyLogoUrl}
                        alt={saved.companyName}
                        className="h-6 w-6 rounded object-cover"
                      />
                    ) : (
                      <span className="flex h-6 w-6 items-center justify-center rounded bg-default text-[10px] font-bold">
                        {saved.companyName?.charAt(0).toUpperCase()}
                      </span>
                    )}
                    <span className="text-sm text-muted">{saved.companyName}</span>
                  </div>
                </Table.Cell>
                <Table.Cell>
                  <span className="text-xs">
                    {new Date(saved.savedAt).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </Table.Cell>
                <Table.Cell>
                  <div className="flex items-center justify-end gap-1">
                    <Link href={`/jobs/details/${saved.jobId}`}>
                      <Button isIconOnly size="sm" variant="tertiary">
                        <Icon className="size-4" icon="gravity-ui:eye" />
                      </Button>
                    </Link>
                    <Button
                      isIconOnly
                      size="sm"
                      variant="danger-soft"
                      isDisabled={removingId === saved.jobId}
                      onClick={() => handleRemove(saved.jobId)}
                    >
                      <Icon className="size-4" icon="gravity-ui:trash-bin" />
                    </Button>
                  </div>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Content>
      </Table.ScrollContainer>
    </Table>
  );
}