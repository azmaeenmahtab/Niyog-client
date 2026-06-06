import { useState } from "react";
import { useRouter } from "next/navigation";


const INITIAL = {
  title: "",
  category: "",
  type: "",
  deadline: "",
  salaryMin: "",
  salaryMax: "",
  currency: "USD",
  city: "",
  country: "",
  responsibilities: "",
  requirements: "",
  benefits: "",
};

export function usePostJobForm({ onClose, company, recruiter }) {
  const [fields, setFields] = useState(INITIAL);
  const [errors, setErrors] = useState({});
  const [isRemote, setIsRemote] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

  const handleChange = (key) => (e) => {
    setFields((prev) => ({ ...prev, [key]: e.target.value }));
    setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!fields.title.trim()) e.title = "Job title is required.";
    if (!fields.category) e.category = "Please select a category.";
    if (!fields.type) e.type = "Please select a job type.";
    if (!fields.deadline) {
      e.deadline = "Deadline is required.";
    } else if (new Date(fields.deadline) <= new Date()) {
      e.deadline = "Deadline must be a future date.";
    }
    if (!fields.salaryMin) {
      e.salaryMin = "Required.";
    } else if (isNaN(fields.salaryMin) || Number(fields.salaryMin) < 0) {
      e.salaryMin = "Enter a valid amount.";
    }
    if (!fields.salaryMax) {
      e.salaryMax = "Required.";
    } else if (Number(fields.salaryMax) <= Number(fields.salaryMin)) {
      e.salaryMax = "Must be greater than min.";
    }
    if (!fields.currency) e.currency = "Select a currency.";
    if (!isRemote) {
      if (!fields.city.trim()) e.city = "City is required.";
      if (!fields.country.trim()) e.country = "Country is required.";
    }
    if (!fields.responsibilities.trim())
      e.responsibilities = "Responsibilities are required.";
    if (!fields.requirements.trim())
      e.requirements = "Requirements are required.";
    return e;
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }
    setIsSubmitting(true);
    try {
      const payload = {
        ...fields,
        isRemote,
        status: "active",
        companyId: company?.id,
        recruiterId: recruiter?.id,
        postedAt: new Date().toISOString(),
      };
      // TODO: replace with your real API call
      console.log("Submitting job:", payload);
      await new Promise((r) => setTimeout(r, 800)); // simulated delay
      setFields(INITIAL);
      setErrors({});
      // in handleSubmit, replace onClose() with:
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
  };
}