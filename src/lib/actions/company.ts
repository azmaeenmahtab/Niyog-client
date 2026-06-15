"use server";

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

export interface RegisterCompanyPayload {
  name: string;
  industry: string;
  website: string;
  location: string;
  employeeRange: string;
  description: string;
  logoUrl: string | null;
  recruiterId: string;
}

export interface RegisterCompanyResult {
  ok: boolean;
  message: string;
  insertedId?: string;
  fieldErrors?: Partial<Record<keyof RegisterCompanyPayload, string>>;
}

export async function RegisterCompanyAction(
  payload: RegisterCompanyPayload,
): Promise<RegisterCompanyResult> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/register-company`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    const data = (await res.json().catch(() => ({}))) as {
      success?: boolean;
      message?: string;
      data?: { insertedId?: string };
      error?: string;
      errors?: Partial<Record<keyof RegisterCompanyPayload, string>>;
    };

    if (!res.ok || data.success === false) {
      return {
        ok: false,
        message: data.message || data.error || `Request failed (${res.status})`,
        fieldErrors: data.errors,
      };
    }

    return {
      ok: true,
      message: data.message || "Company registered successfully",
      insertedId: data.data?.insertedId,
    };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Network error. Please try again.";
    return { ok: false, message };
  }
}

export interface Company {
  _id: string;
  name: string;
  industry: string;
  website: string;
  location: string;
  employeeRange: string;
  description: string;
  logoUrl: string | null;
}

export interface GetCompanyResult {
  ok: boolean;
  message: string;
  company: Company | null;
}

export async function getCompanyAction(recruiterId: string): Promise<GetCompanyResult> {
  try {
    const url = `${API_BASE_URL}/api/recruiter-company?recruiterId=${encodeURIComponent(recruiterId)}`;
    console.log("[getCompanyAction] fetching", url);
    const res = await fetch(url, {
      method: "GET",
    });

    const data = (await res.json().catch(() => ({}))) as {
      success?: boolean;
      message?: string;
      data?: Company | null;
      error?: string;
    };

    if (!res.ok || data.success === false) {
      return {
        ok: false,
        message: data.message || data.error || `Request failed (${res.status})`,
        company: null,
      };
    }

    return {
      ok: true,
      message: data.message || "Company fetched successfully",
      company: data.data ?? null,
    };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Network error. Please try again.";
    return { ok: false, message, company: null };
  }
}