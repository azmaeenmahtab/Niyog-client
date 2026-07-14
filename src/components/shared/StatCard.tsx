import { Icon } from "@iconify/react";

interface StatCardProps {
  icon: string;
  label: string;
  value: number | string;
}

export function StatCard({ icon, label, value }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10">
        <Icon icon={icon} className="size-4 text-white" />
      </div>
      <p className="mt-4 text-sm text-white/50">{label}</p>
      <p className="mt-1 text-3xl font-bold text-white">{value}</p>
    </div>
  );
}