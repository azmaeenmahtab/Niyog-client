export interface SubmitApplicationResponse {
  success: boolean;
  message: string;
  data?: any;
}

export async function submitApplication(
  userId: string,
  jobId: string,
  email: string
): Promise<SubmitApplicationResponse> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/applications/${userId}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ jobId, email }),
      }
    );

    const result: SubmitApplicationResponse = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to submit application.");
    }

    return result;
  } catch (error: any) {
    console.error("submitApplication error:", error);
    return {
      success: false,
      message: error.message || "Network error. Failed to reach the backend server.",
    };
  }
}