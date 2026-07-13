export const applicationStatusColorMap: Record<
  string,
  "success" | "danger" | "warning" | "default" | "accent"
> = {
  applied: "default",
  reviewed: "accent",
  shortlisted: "warning",
  accepted: "success",
  rejected: "danger",
};