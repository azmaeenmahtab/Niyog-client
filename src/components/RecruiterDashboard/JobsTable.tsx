"use client";

import { Button, Checkbox, Chip, Table, cn } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useEffect, useMemo, useState } from "react";
import { getAllJobsByCompanyId } from "@/lib/api/jobs";

interface Job {
  _id: string;
  title: string;
  category?: string;
  type?: string;
  deadline: string;
  status?: string;
}

interface SortDescriptor {
  column: keyof Job;
  direction: "ascending" | "descending";
}

const statusColorMap: Record<string, "success" | "danger" | "warning" | "default"> = {
  active: "success",
  inactive: "danger",
  paused: "warning",
  draft: "default",
};

const typeColorMap: Record<string, "warning" | "success" | "accent" | "default"> = {
  internship: "warning",
  fulltime: "success",
  parttime: "accent",
  contract: "default",
};

function SortableColumnHeader({ children, sortDirection }: { children: React.ReactNode; sortDirection?: string | null }) {
  return (
    <span className="flex items-center justify-between">
      {children}
      {!!sortDirection && (
        <Icon
          icon="gravity-ui:chevron-up"
          className={cn(
            "size-3 transform transition-transform duration-100 ease-out",
            sortDirection === "descending" ? "rotate-180" : "",
          )}
        />
      )}
    </span>
  );
}

export function JobsTable() {
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "title",
    direction: "ascending",
  });
  const [jobs, setJobs] = useState<Job[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const result = await getAllJobsByCompanyId("abc123", "active");
        if (!result?.success) {
          setError(result?.message || "Failed to fetch jobs");
          return;
        }
        setJobs(result.data);
      } catch {
        setError("Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const sortedJobs = useMemo(() => {
    return [...jobs].sort((a, b) => {
      const col = sortDescriptor.column;
      const first = String(a[col] ?? "");
      const second = String(b[col] ?? "");
      let cmp = first.localeCompare(second);
      if (sortDescriptor.direction === "descending") cmp *= -1;
      return cmp;
    });
  }, [jobs, sortDescriptor]);

  if (loading) return <p className="text-sm text-muted p-4">Loading jobs...</p>;
  if (error) return <p className="text-sm text-danger p-4">{error}</p>;
  if (!jobs.length) return <p className="text-sm text-muted p-4">No jobs found.</p>;

  return (
    <Table>
      <Table.ScrollContainer>
        <Table.Content
          aria-label="Jobs table"
          className="min-w-[700px]"
          selectedKeys={selectedKeys}
          selectionMode="multiple"
          sortDescriptor={sortDescriptor}
          onSelectionChange={(keys) => setSelectedKeys(keys as Set<string>)}
          onSortChange={(descriptor) => setSortDescriptor(descriptor as SortDescriptor)}
        >
          <Table.Header>
            <Table.Column className="pr-0">
              <Checkbox aria-label="Select all" slot="selection">
                <Checkbox.Control>
                  <Checkbox.Indicator />
                </Checkbox.Control>
              </Checkbox>
            </Table.Column>
            <Table.Column allowsSorting id="title">
              {({ sortDirection }) => (
                <SortableColumnHeader sortDirection={sortDirection}>Job Role</SortableColumnHeader>
              )}
            </Table.Column>
            <Table.Column allowsSorting id="type">
              {({ sortDirection }) => (
                <SortableColumnHeader sortDirection={sortDirection}>Type</SortableColumnHeader>
              )}
            </Table.Column>
            <Table.Column allowsSorting id="deadline">
              {({ sortDirection }) => (
                <SortableColumnHeader sortDirection={sortDirection}>Deadline</SortableColumnHeader>
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
            {sortedJobs.map((job) => (
              <Table.Row key={job._id} id={job._id}>
                <Table.Cell className="pr-0">
                  <Checkbox aria-label={`Select ${job.title}`} slot="selection" variant="secondary">
                    <Checkbox.Control>
                      <Checkbox.Indicator />
                    </Checkbox.Control>
                  </Checkbox>
                </Table.Cell>
                <Table.Cell>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-medium">{job.title}</span>
                    <span className="text-xs text-muted capitalize">{job.category}</span>
                  </div>
                </Table.Cell>
                <Table.Cell>
                  <Chip
                    color={typeColorMap[job.type?.toLowerCase() ?? ""] ?? "default"}
                    size="sm"
                    variant="soft"
                  >
                    {job.type}
                  </Chip>
                </Table.Cell>
                <Table.Cell>
                  <span className="text-xs">
                    {new Date(job.deadline).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </Table.Cell>
                <Table.Cell>
                  <Chip
                    color={statusColorMap[job.status?.toLowerCase() ?? ""] ?? "default"}
                    size="sm"
                    variant="soft"
                  >
                    {job.status}
                  </Chip>
                </Table.Cell>
                <Table.Cell>
                  <div className="flex items-center justify-end gap-1">
                    <Button isIconOnly size="sm" variant="tertiary">
                      <Icon className="size-4" icon="gravity-ui:eye" />
                    </Button>
                    <Button isIconOnly size="sm" variant="tertiary">
                      <Icon className="size-4" icon="gravity-ui:pencil" />
                    </Button>
                    <Button isIconOnly size="sm" variant="danger-soft">
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
