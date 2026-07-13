"use client";

import React, { useEffect, useState } from "react";
import { Checkbox, Chip, Table, Dropdown, Label } from "@heroui/react";
import { Icon } from "@iconify/react";
import { getApplicationsByJobId, updateApplicationStatusAction, Application } from "@/lib/api/application";
import { toast } from "sonner";

// Your exact color rules mapping status keys to HeroUI badge variants
const statusColorMap: Record<Application["status"], "default" | "accent" | "warning" | "success" | "danger"> = {
  applied: "default",
  reviewed: "accent",
  shortlisted: "warning",
  accepted: "success",
  rejected: "danger",
};

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function JobApplicationsPage({ params }: PageProps) {
  // Unwrap the async dynamic routing params slug using React.use()
  const { slug: jobId } = React.use(params);

  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const result = await getApplicationsByJobId(jobId);
        if (!result.success) {
          setError(result.message || "Failed to fetch applications");
          return;
        }
        if (result.data) {
          setApplications(result.data);
        }
      } catch {
        setError("Something went wrong while retrieving applications.");
      } finally {
        setLoading(false);
      }
    };

    if (jobId) fetchApplications();
  }, [jobId]);

  // Handles updating individual row application status options
  const handleStatusChange = async (applicationId: string, newStatus: Application["status"]) => {
    // Optimistic Update: Modify interface right away for smooth UX responsiveness
    const previousState = [...applications];
    setApplications((prev) =>
      prev.map((app) => (app._id === applicationId ? { ...app, status: newStatus } : app))
    );

    const response = await updateApplicationStatusAction(applicationId, newStatus);
    if (!response.success) {
      // Revert back safely if API throws an unexpected network error
      setApplications(previousState);
      toast.error(response.message || "Failed to update status on server.");
    }

    toast.success(`Application status updated to "${newStatus}" successfully.`);
  };

  if (loading) return <p className="text-sm text-muted p-4">Loading applications...</p>;
  if (error) return <p className="text-sm text-danger p-4">{error}</p>;
  if (!applications.length) return <p className="text-sm text-muted p-4">No candidates have applied to this job posting yet.</p>;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-4">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">
          Applications for: <span className="text-primary">{applications[0]?.jobTitle || "Job Post"}</span>
        </h1>
        <p className="text-xs text-muted">Review incoming candidate profiles and adjust tracking statuses.</p>
      </div>

      <Table>
        <Table.ScrollContainer>
          <Table.Content aria-label="Applications tracking board" className="min-w-200">
            <Table.Header>
              <Table.Column className="pr-0">
                <Checkbox aria-label="Select all applications" slot="selection">
                  <Checkbox.Control>
                    <Checkbox.Indicator />
                  </Checkbox.Control>
                </Checkbox>
              </Table.Column>


              <Table.Column id="email" isRowHeader>Applicant Email</Table.Column>
              <Table.Column>Applied On</Table.Column>
              <Table.Column>Current Status</Table.Column>
              <Table.Column className="text-end">Update Progress</Table.Column>
            </Table.Header>

            <Table.Body>
              {applications.map((app) => (
                <Table.Row key={app._id} id={app._id}>
                  <Table.Cell className="pr-0">
                    <Checkbox aria-label={`Select application from ${app.email}`} slot="selection" variant="secondary">
                      <Checkbox.Control>
                        <Checkbox.Indicator />
                      </Checkbox.Control>
                    </Checkbox>
                  </Table.Cell>

                  <Table.Cell>
                    <span className="text-sm font-medium">{app.email}</span>
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
                      color={statusColorMap[app.status]}
                      size="sm"
                      variant="soft"
                      className="capitalize"
                    >
                      {app.status}
                    </Chip>
                  </Table.Cell>

                  <Table.Cell>
                    <div className="flex items-center justify-end">
                      {/* HeroUI v3 Compound Dropdown Design Structure */}
                      <Dropdown >
                        <Dropdown.Trigger className="inline-flex h-9 items-center gap-2 rounded-md border border-default-200 bg-white px-3 text-sm font-medium text-foreground shadow-sm transition hover:bg-default-50">
                          Update Status
                          <Icon icon="gravity-ui:chevron-down" className="size-3.5" />
                        </Dropdown.Trigger>
                        <Dropdown.Popover placement="bottom end">
                          <Dropdown.Menu 
                            aria-label="Progress milestone settings menu"
                            onAction={(key) => handleStatusChange(app._id, key as Application["status"])}
                          >
                            <Dropdown.Item id="applied" textValue="Applied">
                              <Label>Applied (Default)</Label>
                            </Dropdown.Item>
                            <Dropdown.Item id="reviewed" textValue="Reviewed">
                              <Label>Reviewed</Label>
                            </Dropdown.Item>
                            <Dropdown.Item id="shortlisted" textValue="Shortlisted">
                              <Label>Shortlisted</Label>
                            </Dropdown.Item>
                            <Dropdown.Item id="accepted" textValue="Accepted">
                              <Label>Accepted</Label>
                            </Dropdown.Item>
                            <Dropdown.Item id="rejected" textValue="Rejected" variant="danger">
                              <Label>Rejected</Label>
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown.Popover>
                      </Dropdown>
                    </div>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Content>
        </Table.ScrollContainer>
      </Table>
    </div>
  );
}