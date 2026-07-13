"use client";

import { Chip, Table } from "@heroui/react";
import { useEffect, useMemo, useState } from "react";
import { getApplicationsByUserId, type Application } from "@/lib/api/application";
import { useSession } from "@/lib/auth-client";
import { applicationStatusColorMap } from "@/lib/constants/applicationStatus";
import { SortableColumnHeader } from "./SortableColumnHeader";

interface SortDescriptor {
  column: keyof Application;
  direction: "ascending" | "descending";
}

export function ApplicationsTable() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "appliedAt",
    direction: "descending",
  });

  const session = useSession();
  const userId = session?.data?.user?.id;

  useEffect(() => {
    if (!userId) return;

    const fetchApplications = async () => {
      setLoading(true);
      try {
        const result = await getApplicationsByUserId(userId);
        if (!result.success) {
          setError(result.message || "Failed to fetch applications");
          return;
        }
        setApplications(result.data ?? []);
      } catch {
        setError("Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [userId]);

  const sortedApplications = useMemo(() => {
    return [...applications].sort((a, b) => {
      const col = sortDescriptor.column;
      const first = String(a[col] ?? "");
      const second = String(b[col] ?? "");
      let cmp = first.localeCompare(second);
      if (sortDescriptor.direction === "descending") cmp *= -1;
      return cmp;
    });
  }, [applications, sortDescriptor]);

  if (loading) return <p className="text-sm text-muted p-4">Loading applications...</p>;
  if (error) return <p className="text-sm text-danger p-4">{error}</p>;
  if (!applications.length) return <p className="text-sm text-muted p-4">You haven&apos;t applied to any jobs yet.</p>;

  return (
    <Table>
      <Table.ScrollContainer>
        <Table.Content
          aria-label="Applications table"
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
            <Table.Column allowsSorting id="appliedAt">
              {({ sortDirection }) => (
                <SortableColumnHeader sortDirection={sortDirection}>Applied On</SortableColumnHeader>
              )}
            </Table.Column>
            <Table.Column allowsSorting id="status">
              {({ sortDirection }) => (
                <SortableColumnHeader sortDirection={sortDirection}>Status</SortableColumnHeader>
              )}
            </Table.Column>
          </Table.Header>
          <Table.Body>
            {sortedApplications.map((app) => (
              <Table.Row key={app._id} id={app._id}>
                <Table.Cell>
                  <span className="text-sm font-medium">{app.jobTitle}</span>
                </Table.Cell>
                <Table.Cell>
                  <span className="text-xs">
                    {new Date(app.appliedAt).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </Table.Cell>
                <Table.Cell>
                  <Chip
                    color={applicationStatusColorMap[app.status?.toLowerCase() ?? ""] ?? "default"}
                    size="sm"
                    variant="soft"
                  >
                    {app.status}
                  </Chip>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Content>
      </Table.ScrollContainer>
    </Table>
  );
}