"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";
import { getApplicantStats, type ApplicantStats } from "@/lib/api/dashboard";
import { StatCard } from "@/components/shared/StatCard";

export default function ApplicantHomePage() {
  const session = useSession();
  const userId = session?.data?.user?.id;
  const [stats, setStats] = useState<ApplicantStats | null>(null);

  useEffect(() => {
    if (!userId) return;
    getApplicantStats(userId).then((result) => {
      if (result.success) setStats(result.data ?? null);
    });
  }, [userId]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-white">
        Welcome back, {session?.data?.user?.name || "Applicant"}
      </h1>
      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon="gravity-ui:file-text" label="Total Applications" value={stats?.totalApplications ?? "—"} />
        <StatCard icon="gravity-ui:bookmark" label="Saved Jobs" value={stats?.savedJobs ?? "—"} />
        <StatCard icon="gravity-ui:star" label="Shortlisted" value={stats?.shortlisted ?? "—"} />
        <StatCard icon="gravity-ui:clock" label="Pending Review" value={stats?.pendingReview ?? "—"} />
      </div>
    </div>
  );
}