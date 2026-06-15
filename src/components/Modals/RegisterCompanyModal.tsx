"use client";

import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { createPortal } from "react-dom";
import { Icon } from "@iconify/react";
import { Button, Label, ListBox, Select, toast } from "@heroui/react";
import { InputCustom, Textarea } from "@/components/RecruiterDashboard/FormField";
import { useRegisterCompanyModal } from "@/lib/contexts/registerCompanyModalContext";
import {
  RegisterCompanyAction,
  type RegisterCompanyPayload,
} from "@/lib/actions/company";
import { useSession } from "@/lib/auth-client";

 
// ─── Constants ────────────────────────────────────────────────────────────────

const IMGBB_API_KEY = process.env.NEXT_PUBLIC_IMGBB_API_KEY!;

const INDUSTRIES = [
  { id: "technology", name: "Technology" },
  { id: "design", name: "Design" },
  { id: "marketing", name: "Marketing" },
  { id: "sales", name: "Sales" },
  { id: "finance", name: "Finance" },
  { id: "hr", name: "HR" },
  { id: "operations", name: "Operations" },
  { id: "product", name: "Product" },
  { id: "data", name: "Data" },
  { id: "legal", name: "Legal" },
  { id: "other", name: "Other" },
];

const EMPLOYEE_RANGES = [
  { id: "1-10", name: "1-10 employees" },
  { id: "11-50", name: "11-50 employees" },
  { id: "51-200", name: "51-200 employees" },
  { id: "201-500", name: "201-500 employees" },
  { id: "501-1000", name: "501-1000 employees" },
  { id: "1000+", name: "1000+ employees" },
];

const EMPTY_FORM = {
  name: "",
  industry: "",
  website: "",
  location: "",
  employeeRange: "",
  description: "",
};

type FormFields = typeof EMPTY_FORM;
type FormErrors = Partial<Record<keyof FormFields | "logoUrl", string>>;

 

// ─── Helpers ──────────────────────────────────────────────────────────────────

function validate(fields: FormFields): FormErrors {
  const errors: FormErrors = {};
  if (!fields.name.trim())        errors.name = "Company name is required";
  if (!fields.industry)           errors.industry = "Select an industry";
  if (!fields.location.trim())    errors.location = "Location is required";
  if (!fields.employeeRange)      errors.employeeRange = "Select a range";
  if (!fields.description.trim()) errors.description = "Add a short description";

  if (!fields.website.trim()) {
    errors.website = "Website URL is required";
  } else if (!/^https?:\/\/.+\..+/.test(fields.website.trim())) {
    errors.website = "Enter a valid URL (https://...)";
  }

  return errors;
}

async function uploadToImgbb(file: File): Promise<string> {
  const body = new FormData();
  body.append("image", file);

  const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
    method: "POST",
    body,
  });

  if (!res.ok) throw new Error("Logo upload failed");

  const data = await res.json();
  return data.data.url as string; // permanent image URL
}

// ─── Component ────────────────────────────────────────────────────────────────

export function RegisterCompanyModal() {
  const { isOpen, closeModal } = useRegisterCompanyModal();
  const { data: session, isPending: sessionPending } = useSession();

  const [mounted, setMounted]         = useState(false);
  const [fields, setFields]           = useState<FormFields>(EMPTY_FORM);
  const [errors, setErrors]           = useState<FormErrors>({});
  const [logoFile, setLogoFile]       = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
 
  // Needed so the portal only runs on the client (avoids Next.js SSR mismatch)
  useEffect(() => { setMounted(true); }, []);

  // Close on Escape + lock body scroll while open
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") handleClose(); };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Field helpers ──

  function setField(key: keyof FormFields, value: string) {
    setFields((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined })); // clear error on change
  }

  function handleLogoChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogoFile(file);
    setErrors((prev) => ({ ...prev, logoUrl: undefined }));
    // Show a local preview immediately; the real upload happens on submit
    const reader = new FileReader();
    reader.onload = () => setLogoPreview(reader.result as string);
    reader.readAsDataURL(file);
  }

  function resetForm() {
    setFields(EMPTY_FORM);
    setErrors({});
    setLogoFile(null);
    setLogoPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function handleClose() {
    resetForm();
    closeModal();
  }

  // ── Submit ──

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (sessionPending) return;

    const recruiterId = session?.user?.id;
    if (!recruiterId) {
      setErrors((prev) => ({
        ...prev,
        logoUrl: "You must be logged in to register a company.",
      }));
      return;
    }

    const nextErrors = validate(fields);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setIsSubmitting(true);
    try {
      let logoUrl: string | null = null;

      if (logoFile) {
        logoUrl = await uploadToImgbb(logoFile);
      }

      const payload: RegisterCompanyPayload = { ...fields, logoUrl, recruiterId };
      const result = await RegisterCompanyAction(payload);

      if (!result.ok) {
        setErrors((prev) => ({
          ...prev,
          ...(result.fieldErrors ?? {}),
        }));
        // Fall back to a top-level message under the logo field if no field errors came back.
        if (!result.fieldErrors) {
          setErrors((prev) => ({ ...prev, logoUrl: result.message }));
        }
        return;
      }

      resetForm();
      toast.success("Company registered.")
      // Show the toast first, then close the modal on the next tick so the
      // toast provider has a chance to render before the modal unmounts.
       setTimeout(closeModal, 0);
    } catch (err) {
      console.error(err);
      setErrors((prev) => ({ ...prev, logoUrl: "Logo upload failed. Try again." }));
    } finally {
      setIsSubmitting(false);
    }
  }

  // Toast provider is mounted with the modal; firing it is done via toastRef.


  // ─────────────────────────────────────────────────────────────────────────────

  if (!mounted || !isOpen) return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="register-company-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-6 backdrop-blur-sm"
      onMouseDown={(e) => e.target === e.currentTarget && handleClose()}
    >
      <div className="w-full max-w-xl overflow-hidden rounded-2xl border border-white/10 bg-[#1a1a1a] shadow-2xl">
        <form onSubmit={handleSubmit} className="flex flex-col">

          {/* Header */}
          <div className="flex items-start justify-between gap-4 border-b border-white/10 px-6 py-5">
            <div>
              <h2 id="register-company-title" className="text-lg font-semibold text-white">
                Register New Company
              </h2>
              <p className="mt-1 text-xs text-white/50">
                Enter your business details to start hiring on HireLoop.
              </p>
            </div>
            <button
              type="button"
              aria-label="Close"
              onClick={handleClose}
              className="rounded-md p-1 text-white/50 transition hover:bg-white/10 hover:text-white"
            >
              <Icon icon="gravity-ui:xmark" className="size-4" />
            </button>
          </div>

          {/* Body */}
          <div className="flex max-h-[70vh] flex-col gap-4 overflow-y-auto px-6 py-5">

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <InputCustom
                label="Company Name"
                placeholder="e.g. Acme Corp"
                value={fields.name}
                onChange={(e) => setField("name", e.target.value)}
                error={errors.name}
              />
              <Select
                className="w-full"
                placeholder="Select Industry"
                value={fields.industry}
                onChange={(value) => setField("industry", value as string)}
              >
                <Label className="text-white/40">Industry / Category</Label>
                <Select.Trigger>
                  <Select.Value />
                  <Select.Indicator />
                </Select.Trigger>
                <Select.Popover>
                  <ListBox selectionMode="single">
                    {INDUSTRIES.map((item) => (
                      <ListBox.Item key={item.id} id={item.id} textValue={item.name}>
                        {item.name}
                        <ListBox.ItemIndicator />
                      </ListBox.Item>
                    ))}
                  </ListBox>
                </Select.Popover>
                {errors.industry && (
                  <span className="text-[12px] text-red-400">{errors.industry}</span>
                )}
              </Select>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <InputCustom
                label="Website URL"
                placeholder="https://example.com"
                value={fields.website}
                onChange={(e) => setField("website", e.target.value)}
                error={errors.website}
              />
              <InputCustom
                label="Location"
                placeholder="e.g. San Francisco, USA"
                value={fields.location}
                onChange={(e) => setField("location", e.target.value)}
                error={errors.location}
              />
            </div>

            <Select
              className="w-full"
              placeholder="Select Employee Range"
              value={fields.employeeRange}
              onChange={(value) => setField("employeeRange", value as string)}
            >
              <Label className="text-white/40">Employee Count Range</Label>
              <Select.Trigger>
                <Select.Value />
                <Select.Indicator />
              </Select.Trigger>
              <Select.Popover>
                <ListBox selectionMode="single">
                  {EMPLOYEE_RANGES.map((item) => (
                    <ListBox.Item key={item.id} id={item.id} textValue={item.name}>
                      {item.name}
                      <ListBox.ItemIndicator />
                    </ListBox.Item>
                  ))}
                </ListBox>
              </Select.Popover>
              {errors.employeeRange && (
                <span className="text-[12px] text-red-400">{errors.employeeRange}</span>
              )}
            </Select>

            {/* Logo upload */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-medium uppercase tracking-wider text-white/40">
                Company Logo
              </label>
              <div className="flex items-center gap-3">
                {/* Preview box */}
                <div className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-dashed border-white/15 bg-white/5">
                  {logoPreview ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={logoPreview} alt="Logo preview" className="size-full object-cover" />
                  ) : (
                    <Icon icon="gravity-ui:cloud-arrow-up" className="size-5 text-white/40" />
                  )}
                </div>
                {/* File input */}
                <div className="flex flex-1 flex-col gap-1.5">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleLogoChange}
                    className="block w-full cursor-pointer rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-[12px] text-white/70 file:mr-3 file:rounded-md file:border-0 file:bg-white/10 file:px-3 file:py-1 file:text-[12px] file:text-white hover:border-white/20"
                  />
                  <span className="text-[11px] text-white/40">PNG, JPG or SVG up to 2MB</span>
                </div>
              </div>
              {errors.logoUrl && <span className="text-[12px] text-red-400">{errors.logoUrl}</span>}
            </div>

            <Textarea
              label="Brief Description"
              placeholder="Tell candidates what your company does…"
              rows={4}
              value={fields.description}
              onChange={(e) => setField("description", e.target.value)}
              error={errors.description}
            />
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 border-t border-white/10 bg-[#161616] px-6 py-4">
            <button
              type="button"
              onClick={handleClose}
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-[13px] text-white/70 transition hover:bg-white/10 hover:text-white"
            >
              Cancel
            </button>
            <Button
              type="submit"
              variant="primary"
              isDisabled={isSubmitting}
              className="rounded-xl bg-linear-to-r from-[#6f62ff] to-[#7a5cff] px-5 py-2 text-[13px] font-semibold text-white"
            >
              {isSubmitting ? "Registering…" : "Register Company"}
            </Button>
          </div>

        </form>
      </div>

      {/* Success toast — provider lives in DOM, button is hidden via trigger="" */}
     </div>,
    document.body,
  );
}