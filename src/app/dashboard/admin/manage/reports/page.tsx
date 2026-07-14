import { ReportsTable } from "@/components/Admin/ReportsTable";

 
export default function ManageReportsPage() {
  return (
    <div className="p-6">
      <h1 className="text-xl font-bold text-gray-900">Manage Reports</h1>
      <p className="mt-1 text-sm text-gray-500">
        Review job listings flagged by applicants and take action.
      </p>
      <div className="mt-6">
        <ReportsTable />
      </div>
    </div>
  );
}