'use client';

import { Sidebar } from "@/components/RecruiterDashboard/Sidebar";
import {useUserInfo} from "@/lib/contexts/userInfoContext";
export default function SeekerPage() {
  const { user } = useUserInfo();
  console.log(user)
  
  return (
    <div className="flex gap-4 min-h-screen bg-[#121212] text-white">
      <div className="flex-1 p-6">
        <h1>admin Dashboard</h1>
      </div>
    </div>
  );
}
