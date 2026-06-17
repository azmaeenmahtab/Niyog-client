import { useState, type ChangeEvent, type FormEvent } from "react";
import { useRouter } from "next/navigation";

const INITIAL = {
  title: "",
  category: "",
  type: "",
  deadline: "",
  salaryMin: "",
  salaryMax: "",
  currency: "",
  city: "",
  country: "",
  responsibilities: "",
  requirements: "",
  benefits: "",
};

export type JobFormFields = typeof INITIAL;
type FieldKey = keyof JobFormFields;
type FormErrors = Partial<Record<FieldKey, string>>;

interface Company {
  id?: string;
  name?: string;
  industry?: string;
  logoUrl?: string;
}

interface Recruiter {
  id?: string;
}

interface UsePostJobFormOptions {
  onClose?: () => void;
  company?: Company;
  recruiter?: Recruiter;
}

export function usePostJobForm({ company, recruiter }: UsePostJobFormOptions) {
  const [fields, setFields] = useState(INITIAL);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isRemote, setIsRemote] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleChange = (key: FieldKey) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFields((prev) => ({ ...prev, [key]: e.target.value }));
    setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const setField = (key: FieldKey, value: string) => {
    setFields((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const validate = () => {
    const errs: FormErrors = {};
    if (!fields.title.trim()) errs.title = "Job title is required.";
    if (!fields.category) errs.category = "Please select a category.";
    if (!fields.type) errs.type = "Please select a job type.";
    if (!fields.deadline) {
      errs.deadline = "Deadline is required.";
    } else if (new Date(fields.deadline) <= new Date()) {
      errs.deadline = "Deadline must be a future date.";
    }
    if (!fields.salaryMin) {
      errs.salaryMin = "Required.";
    } else if (isNaN(Number(fields.salaryMin)) || Number(fields.salaryMin) < 0) {
      errs.salaryMin = "Enter a valid amount.";
    }
    if (!fields.salaryMax) {
      errs.salaryMax = "Required.";
    } else if (Number(fields.salaryMax) <= Number(fields.salaryMin)) {
      errs.salaryMax = "Must be greater than min.";
    }
    if (!fields.currency) errs.currency = "Select a currency.";
    if (!isRemote) {
      if (!fields.city.trim()) errs.city = "City is required.";
      if (!fields.country.trim()) errs.country = "Country is required.";
    }
    if (!fields.responsibilities.trim())
      errs.responsibilities = "Responsibilities are required.";
    if (!fields.requirements.trim())
      errs.requirements = "Requirements are required.";
    return errs;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setIsSubmitting(true);
    try {
      const payload = {
        ...fields,
        isRemote,
        status: "active",
        companyId: company?.id,
        companyLogoUrl: company.logoUrl,
        companyName: company.name,
        companyIndustry: company.industry,
        recruiterId: recruiter?.id,
        postedAt: new Date().toISOString(),
      };

      console.log("payload ", payload);

      await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/post-job`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      setFields(INITIAL);
      setErrors({});
      router.push("/dashboard/recruiter/jobs");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    fields,
    errors,
    isRemote,
    setIsRemote,
    handleChange,
    handleSubmit,
    isSubmitting,
    setField,
  };
}
