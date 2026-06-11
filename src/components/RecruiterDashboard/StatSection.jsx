"use client";

import { useSession } from "@/lib/auth-client";
import { useState } from "react";
import StatCard from "./StatCard";
import {
  faFileLines,
  faUsers,
  faBolt,
  faCircleCheck,
} from "@fortawesome/free-solid-svg-icons";

const stats = [
  { icon: faFileLines,   label: "Total Job Posts",  value: 48   },
  { icon: faUsers,       label: "Total Applicants", value: 1284 },
  { icon: faBolt,        label: "Active Jobs",      value: 18   },
  { icon: faCircleCheck, label: "Jobs Closed",      value: 32   },
];

export default function RecruiterDashboardStats() {
  const { data: session } = useSession();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch by rendering stats only on client
  useState(() => {
    setMounted(true);
  }, []);

  
const userName = mounted ? (session?.user?.name || "there") : "there";
  return (
    <section className="w-full">
      <h1 className="mb-5 text-[22px] font-semibold text-white">
        Welcome back, {userName}
      </h1>
      <div className="flex gap-4">
        {stats.map((stat) => (
          <StatCard
            key={stat.label}
            icon={stat.icon}
            label={stat.label}
            value={stat.value}
          />
        ))}
      </div>
    </section>
  );
}