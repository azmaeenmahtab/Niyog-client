"use client";

import { useEffect, useState } from "react";
import { getAdminStats, type AdminStats } from "@/lib/api/dashboard";
import { StatCard } from "@/components/shared/StatCard";

export default function AdminHomePage() {
  const [stats, setStats] = useState<AdminStats | null>(null);

  useEffect(() => {
    getAdminStats().then((result) => {
      if (result.success) setStats(result.data ?? null);
    });
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon="gravity-ui:persons" label="Total Users" value={stats?.totalUsers ?? "—"} />
        <StatCard icon="gravity-ui:file-text" label="Total Jobs" value={stats?.totalJobs ?? "—"} />
        <StatCard icon="gravity-ui:briefcase" label="Total Companies" value={stats?.totalCompanies ?? "—"} />
        <StatCard icon="gravity-ui:triangle-exclamation" label="Pending Reports" value={stats?.pendingReports ?? "—"} />
      </div>
    </div>
  );
}