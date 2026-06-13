import DashboardNavbar from "@/components/RecruiterDashboard/DashboardNavbar";
import { Sidebar } from "@/components/RecruiterDashboard/Sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <DashboardNavbar />
      <div className="flex gap-4 min-h-screen bg-[#121212] text-white">
        <div>
          <Sidebar />
        </div>
        <div className="flex-1 p-6">
          {children}
        </div>
      </div>
    </div>
  );
}
