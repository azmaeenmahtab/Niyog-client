import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";

interface InputCustomProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function InputCustom({ label, error, className = "", ...props }: InputCustomProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-[12px] font-medium uppercase tracking-wider text-white/40">
          {label}
        </label>
      )}
      <input
        {...props}
        className={`h-10 w-full rounded-xl border ${
          error ? "border-red-500/50 bg-red-500/5" : "border-white/8 bg-white/5"
        } px-3.5 text-[14px] text-white placeholder-white/20 outline-none transition
        hover:border-white/15 focus:border-[#6e63ff]/60 focus:bg-white/8 ${className}`}
      />
      {error && <span className="text-[12px] text-red-400">{error}</span>}
    </div>
  );
}

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export function Textarea({ label, error, className = "", ...props }: TextareaProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-[12px] font-medium uppercase tracking-wider text-white/40">
          {label}
        </label>
      )}
      <textarea
        {...props}
        className={`w-full resize-none rounded-xl border ${
          error ? "border-red-500/50 bg-red-500/5" : "border-white/8 bg-white/5"
        } px-3.5 py-3 text-[14px] text-white placeholder-white/20 outline-none transition
        hover:border-white/15 focus:border-[#6e63ff]/60 focus:bg-white/8 ${className}`}
      />
      {error && <span className="text-[12px] text-red-400">{error}</span>}
    </div>
  );
}

interface ToggleProps {
  label?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export function Toggle({ label, checked, onChange }: ToggleProps) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5">
      <div
        onClick={() => onChange(!checked)}
        className={`relative h-5 w-9 rounded-full transition-colors duration-200 ${
          checked ? "bg-[#6e63ff]" : "bg-white/15"
        }`}
      >
        <span
          className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform duration-200 ${
            checked ? "translate-x-4" : "translate-x-0.5"
          }`}
        />
      </div>
      {label && <span className="text-[13px] text-white/50">{label}</span>}
    </label>
  );
}
