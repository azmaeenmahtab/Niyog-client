interface RoleRadioGroupProps {
  value: string;
  onChange: (value: string) => void;
}

export function RoleRadioGroup({ value, onChange }: RoleRadioGroupProps) {
  return (
    <div className="flex flex-col gap-2.5">
      <label className="text-sm font-medium text-[#1a1a1a]/80">
        Account Type
      </label>
      <div className="grid grid-cols-2 gap-3">
        <label
          className={`flex cursor-pointer items-center justify-center gap-2.5 rounded-xl border p-3 text-sm font-semibold transition-all ${
            value === "applicant"
              ? "border-[#e2613a] bg-[#fbe8d8]/50 text-[#e2613a] shadow-[0_2px_10px_rgba(226,97,58,0.12)]"
              : "border-[#1a1a1a]/12 bg-white/70 text-[#1a1a1a]/70 hover:bg-white hover:text-[#1a1a1a]"
          }`}
        >
          <input
            type="radio"
            name="role"
            value="applicant"
            checked={value === "applicant"}
            onChange={() => onChange("applicant")}
            className="h-4 w-4 accent-[#e2613a]"
          />
          <span>Applicant</span>
        </label>

        <label
          className={`flex cursor-pointer items-center justify-center gap-2.5 rounded-xl border p-3 text-sm font-semibold transition-all ${
            value === "recruiter"
              ? "border-[#e2613a] bg-[#fbe8d8]/50 text-[#e2613a] shadow-[0_2px_10px_rgba(226,97,58,0.12)]"
              : "border-[#1a1a1a]/12 bg-white/70 text-[#1a1a1a]/70 hover:bg-white hover:text-[#1a1a1a]"
          }`}
        >
          <input
            type="radio"
            name="role"
            value="recruiter"
            checked={value === "recruiter"}
            onChange={() => onChange("recruiter")}
            className="h-4 w-4 accent-[#e2613a]"
          />
          <span>Recruiter</span>
        </label>
      </div>
    </div>
  );
}
