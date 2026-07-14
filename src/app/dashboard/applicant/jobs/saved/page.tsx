import { SavedJobsTable } from "@/components/Applicant/SavedJobsTable";

 
export default function SavedJobsPage() {
  return (
    <div className="p-6">
      <h1 className="text-xl font-bold text-gray-900">Saved Jobs</h1>
      <p className="mt-1 text-sm text-gray-500">
        Jobs you&apos;ve bookmarked to review or apply to later.
      </p>
      <div className="mt-6">
        <SavedJobsTable />
      </div>
    </div>
  );
}