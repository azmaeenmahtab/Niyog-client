"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";
import { getRecruiterStats, type RecruiterStats } from "@/lib/api/dashboard";
import { StatCard } from "@/components/shared/StatCard";

export default function RecruiterHomePage() {
  const session = useSession();
  const recruiterId = session?.data?.user?.id;
  const [stats, setStats] = useState<RecruiterStats | null>(null);

  useEffect(() => {
    if (!recruiterId) return;
    getRecruiterStats(recruiterId).then((result) => {
      if (result.success) setStats(result.data ?? null);
    });
  }, [recruiterId]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-white">
        Welcome back, {session?.data?.user?.name || "Recruiter"}
      </h1>
      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon="gravity-ui:file-text" label="Total Job Posts" value={stats?.totalJobPosts ?? "—"} />
        <StatCard icon="gravity-ui:persons" label="Total Applicants" value={stats?.totalApplicants ?? "—"} />
        <StatCard icon="gravity-ui:bolt" label="Active Jobs" value={stats?.activeJobs ?? "—"} />
        <StatCard icon="gravity-ui:circle-check" label="Jobs Closed" value={stats?.jobsClosed ?? "—"} />
      </div>
    </div>
  );
}