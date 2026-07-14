import { getAuthedHeaders } from "../authHeader";

export interface Application {
  _id: string;
  jobId: string;
  userId: string;
  email: string;
  companyId?: string;
  recruiterId?: string;
  jobTitle: string;
  status: "applied" | "reviewed" | "shortlisted" | "rejected" | "accepted";
  appliedAt: string;
}

export interface GetApplicationsResponse {
  success: boolean;
  message: string;
  data?: Application[];
}

// Added for the status update action response
export interface UpdateApplicationResponse {
  success: boolean;
  message: string;
  data?: Application;
}

export async function getApplicationsByUserId(
  userId: string
): Promise<GetApplicationsResponse> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/applications/user/${userId}`,
      {
        method: "GET",
        headers: await getAuthedHeaders() as HeadersInit,
        credentials: "include",
      }
    );

    const result: GetApplicationsResponse = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to fetch applications.");
    }

    return result;
  } catch (error: any) {
    console.error("getApplicationsByUserId error:", error);
    return {
      success: false,
      message: error.message || "Network error. Failed to reach the backend server.",
    };
  }
}

/**
 * Fetch all applications for a specific job post (Recruiter perspective)
 */
export async function getApplicationsByJobId(
  jobId: string
): Promise<GetApplicationsResponse> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/applications/job/${jobId}`,
      {
        method: "GET",
        headers: await getAuthedHeaders() as HeadersInit,
        credentials: "include", // maintains cookie session consistency
      }
    );

    const result: GetApplicationsResponse = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to fetch applications for this job.");
    }

    return result;
  } catch (error: any) {
    console.error("getApplicationsByJobId error:", error);
    return {
      success: false,
      message: error.message || "Network error. Failed to reach the backend server.",
    };
  }
}

/**
 * Update the status of an application
 */
export async function updateApplicationStatusAction(
  applicationId: string,
  status: Application["status"]
): Promise<UpdateApplicationResponse> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/applications/${applicationId}/status`,
      {
        method: "PATCH",
        headers: await getAuthedHeaders() as HeadersInit,
        body: JSON.stringify({ status }),
        credentials: "include",
      }
    );

    const result: UpdateApplicationResponse = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to update application status.");
    }

    return result;
  } catch (error: any) {
    console.error("updateApplicationStatusAction error:", error);
    return {
      success: false,
      message: error.message || "Network error. Failed to update application status.",
    };
  }
}