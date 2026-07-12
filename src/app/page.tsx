'use client'

import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import JobDiscovery from "@/components/JobDiscovery";
import Footer from "@/components/Footer";
import {updateUserRole} from "@/lib/api/user"
import {useUserInfo} from "@/lib/contexts/userInfoContext"
import { auth } from "@/lib/auth"
import { useEffect } from "react";
import { useSession } from "@/lib/auth-client"; 

export default function Home() {
  // const {user} = useUserInfo(); // Ensure user info is loaded when the component mounts
  const { data: session } = useSession(); // Get the current session data
  
  useEffect(() => {
    const pendingRole = localStorage.getItem("pendingRole");
    if (!pendingRole || !session?.user?.id) return;

    updateUserRole(session.user.id, pendingRole as "applicant" | "recruiter")
      .then((res) => {
        if (res.success) {
          localStorage.removeItem("pendingRole");
        }
      });
  }, [session]);
  return (
    <main className="bg-[#f3ede2] text-[#1a1a1a]">
      <Navbar />
      <Hero />
      <JobDiscovery />
      <Footer />
    </main>
  );
}
