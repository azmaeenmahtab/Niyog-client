export interface JobReport {
  _id: string;
  userId: string;
  jobId: string;
  jobTitle: string;
  reason: string;
  details?: string;
  status: "pending" | "reviewed" | "dismissed";
  reportedAt: string;
  updatedAt?: string;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function getAllReports(status?: string): Promise<ApiResponse<JobReport[]>> {
  try {
    const query = status && status !== "all" ? `?status=${status}` : "";
    const response = await fetch(`${API_BASE}/api/admin/reports${query}`, {
      method: "GET",
      credentials: "include",
    });
    const result: ApiResponse<JobReport[]> = await response.json();
    if (!response.ok) {
      throw new Error(result.message || "Failed to fetch reports.");
    }
    return result;
  } catch (error: any) {
    console.error("getAllReports error:", error);
    return { success: false, message: error.message || "Network error." };
  }
}

export async function dismissReport(reportId: string): Promise<ApiResponse<JobReport>> {
  try {
    const response = await fetch(`${API_BASE}/api/admin/reports/${reportId}/dismiss`, {
      method: "PATCH",
      credentials: "include",
    });
    const result: ApiResponse<JobReport> = await response.json();
    if (!response.ok) {
      throw new Error(result.message || "Failed to dismiss report.");
    }
    return result;
  } catch (error: any) {
    console.error("dismissReport error:", error);
    return { success: false, message: error.message || "Network error." };
  }
}

export async function deactivateReportedJob(
  reportId: string,
  jobId: string
): Promise<ApiResponse<{ job: any; report: JobReport }>> {
  try {
    const response = await fetch(`${API_BASE}/api/admin/reports/${reportId}/deactivate-job`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ jobId }),
    });
    const result: ApiResponse<{ job: any; report: JobReport }> = await response.json();
    if (!response.ok) {
      throw new Error(result.message || "Failed to deactivate job.");
    }
    return result;
  } catch (error: any) {
    console.error("deactivateReportedJob error:", error);
    return { success: false, message: error.message || "Network error." };
  }
}

export async function deleteReportedJob(
  reportId: string,
  jobId: string
): Promise<ApiResponse<{ job: any; report: JobReport }>> {
  try {
    const response = await fetch(`${API_BASE}/api/admin/reports/${reportId}/job`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ jobId }),
    });
    const result: ApiResponse<{ job: any; report: JobReport }> = await response.json();
    if (!response.ok) {
      throw new Error(result.message || "Failed to delete job.");
    }
    return result;
  } catch (error: any) {
    console.error("deleteReportedJob error:", error);
    return { success: false, message: error.message || "Network error." };
  }
}