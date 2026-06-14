import DashboardNavbar from "@/components/RecruiterDashboard/DashboardNavbar";
import { Sidebar } from "@/components/RecruiterDashboard/Sidebar";
import { RegisterCompanyModal } from "@/components/Modals/RegisterCompanyModal";
import { RegisterCompanyModalProvider } from "@/lib/contexts/registerCompanyModalContext";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <RegisterCompanyModalProvider>
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
      <RegisterCompanyModal />
    </RegisterCompanyModalProvider>
  );
}
