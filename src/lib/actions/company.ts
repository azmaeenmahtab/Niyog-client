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

export interface GetAllCompaniesResult {
  ok: boolean;
  message: string;
  companies: Company[];
}

export async function getAllCompaniesAction(): Promise<GetAllCompaniesResult> {
  try {
    console.log("[getAllCompaniesAction] fetching", `${API_BASE_URL}/api/all-companies`);
    const res = await fetch(`${API_BASE_URL}/api/all-companies`, {
      method: "GET",
    });

    const data = (await res.json().catch(() => ({}))) as {
      success?: boolean;
      message?: string;
      data?: Company[];
      error?: string;
    };

    if (!res.ok || data.success === false) {
      return {
        ok: false,
        message: data.message || data.error || `Request failed (${res.status})`,
        companies: [],
      };
    }

    return {
      ok: true,
      message: data.message || "Companies fetched successfully",
      companies: Array.isArray(data.data) ? data.data : [],
    };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Network error. Please try again.";
    return { ok: false, message, companies: [] };
  }
}