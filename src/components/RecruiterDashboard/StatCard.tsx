import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";

interface StatCardProps {
  icon: IconDefinition;
  label: string;
  value: number | string;
}

export default function StatCard({ icon, label, value }: StatCardProps) {
  return (
    <div className="flex flex-1 flex-col gap-6 rounded-2xl border border-white/8 bg-[#1a1a1a] p-5 min-w-0">
      <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/6 text-white/70">
        <FontAwesomeIcon icon={icon} className="h-4 w-4" />
      </span>
      <div className="flex flex-col gap-1.5">
        <p className="text-[13px] text-white/45">{label}</p>
        <p className="text-[28px] font-semibold leading-none tracking-tight text-white">
          {typeof value === "number" ? value.toLocaleString() : value}
        </p>
      </div>
    </div>
  );
}
