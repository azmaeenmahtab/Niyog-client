export interface SaveJobResponse {
  success: boolean;
  message: string;
  data?: any;
}

export async function saveJob(userId: string, jobId: string): Promise<SaveJobResponse> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/save-job/${userId}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ jobId }),
      }
    );
    const result: SaveJobResponse = await response.json();
    if (!response.ok) throw new Error(result.message || "Failed to save job.");
    return result;
  } catch (error: any) {
    console.error("saveJob error:", error);
    return { success: false, message: error.message || "Network error." };
  }
}

export async function unsaveJob(userId: string, jobId: string): Promise<SaveJobResponse> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/save-job/${userId}/${jobId}`,
      { method: "DELETE", credentials: "include" }
    );
    const result: SaveJobResponse = await response.json();
    if (!response.ok) throw new Error(result.message || "Failed to unsave job.");
    return result;
  } catch (error: any) {
    console.error("unsaveJob error:", error);
    return { success: false, message: error.message || "Network error." };
  }
}

export interface ReportJobResponse {
  success: boolean;
  message: string;
  data?: any;
}

export async function reportJob(
  userId: string,
  jobId: string,
  reason: string,
  details?: string
): Promise<ReportJobResponse> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/report-job/${userId}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ jobId, reason, details }),
      }
    );
    const result: ReportJobResponse = await response.json();
    if (!response.ok) throw new Error(result.message || "Failed to report job.");
    return result;
  } catch (error: any) {
    console.error("reportJob error:", error);
    return { success: false, message: error.message || "Network error." };
  }
}
