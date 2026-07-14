import { getAuthedHeaders } from "../authHeader";

export type getAllJobsQueryParams = {
    /** Use "all" for admin views that must include active and inactive jobs. */
    status?: "active" | "inactive" | "all";
    type?: string;
    search?: string;
    location?: string;
    experience?: string;
    salary?: string;
    sort?: string;
    page?: string;
    keyword?: string;
    place?: string;
    isRemote?: string; // "true" | "false" — translated to boolean in the controller
}

const buildQueryString = (params: Record<string, string | number | undefined | null>): string => {
    const search = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
        if (value === undefined || value === null || value === "") continue;
        search.set(key, String(value));
    }
    return search.toString();
};

export const getAllJobs = async (queryParams: getAllJobsQueryParams) => {
    try {
        const qs = buildQueryString(queryParams);
        const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/get-all-jobs${qs ? `?${qs}` : ""}`;
        console.log("[lib/api/jobs] getAllJobs → fetching URL:", url);
        const result = await fetch(url);
        console.log("[lib/api/jobs] response status:", result.status, result.statusText);
        const data = await result.json();
        console.log("[lib/api/jobs] response body keys:", data ? Object.keys(data) : null, "success:", data?.success, "data length:", Array.isArray(data?.data) ? data.data.length : "n/a");
        return data;
    } catch (error) {
        console.log("[lib/api/jobs] getAllJobs error:", error);
        throw error;
    }
}

export const getAllJobsByCompanyId = async (companyId: string, status?: string) => {
    try {
        const qs = buildQueryString({ companyId, status });
        const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/get-jobs-by-company-id${qs ? `?${qs}` : ""}`;
        const result = await fetch(url, {
            headers: await getAuthedHeaders() as HeadersInit,
            credentials: "include"
        });
        const data = await result.json();
        return data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}


export async function getJobById(jobId: string) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/get-job/${jobId}`, {
        headers: await getAuthedHeaders() as HeadersInit,
        credentials: "include"
    });
    const result = await response.json();
    if (!response.ok) return null;
    return result.data;
  } catch (error) {
    console.error("getJobById error:", error);
    return null;
  }
}


export interface CheckSavedResponse {
  success: boolean;
  message: string;
  data?: { isSaved: boolean };
}

export async function checkJobSaved(userId: string, jobId: string): Promise<CheckSavedResponse> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/save-job/check/${userId}/${jobId}`,
      {
        headers: await getAuthedHeaders() as HeadersInit,
        credentials: "include"
      }
    );
    const result: CheckSavedResponse = await response.json();
    if (!response.ok) throw new Error(result.message || "Failed to check saved status.");
    return result;
  } catch (error: any) {
    console.error("checkJobSaved error:", error);
    return { success: false, message: error.message || "Network error." };
  }
}

export interface CheckReportedResponse {
  success: boolean;
  message: string;
  data?: { isReported: boolean };
}

export async function checkJobReported(userId: string, jobId: string): Promise<CheckReportedResponse> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/report-job/check/${userId}/${jobId}`,
      {
        headers: await getAuthedHeaders() as HeadersInit,
        credentials: "include"
      }
    );
    const result: CheckReportedResponse = await response.json();
    if (!response.ok) throw new Error(result.message || "Failed to check reported status.");
    return result;
  } catch (error: any) {
    console.error("checkJobReported error:", error);
    return { success: false, message: error.message || "Network error." };
  }
}



export interface SavedJob {
  _id: string;
  userId: string;
  jobId: string;
  jobTitle: string;
  companyName: string;
  companyLogoUrl?: string | null;
  savedAt: string;
}

export interface GetSavedJobsResponse {
  success: boolean;
  message: string;
  data?: SavedJob[];
}

export async function getSavedJobs(userId: string): Promise<GetSavedJobsResponse> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/saved-jobs/${userId}`,
      {
        headers: await getAuthedHeaders() as HeadersInit,
        credentials: "include"
      }
    );
    const result: GetSavedJobsResponse = await response.json();
    if (!response.ok) throw new Error(result.message || "Failed to fetch saved jobs.");
    return result;
  } catch (error: any) {
    console.error("getSavedJobs error:", error);
    return { success: false, message: error.message || "Network error." };
  }
}
