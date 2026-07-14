import { getAuthedHeaders } from "../authHeader";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL;

export interface RecruiterStats {
  totalJobPosts: number;
  totalApplicants: number;
  activeJobs: number;
  jobsClosed: number;
}

export async function getRecruiterStats(recruiterId: string): Promise<ApiResponse<RecruiterStats>> {
  try {
    const response = await fetch(`${API_BASE}/api/dashboard/recruiter/${recruiterId}`, 
        { 
            method: "GET",
            headers: await getAuthedHeaders() as HeadersInit,
            credentials: "include" });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || "Failed to fetch stats.");
    return result;
  } catch (error: any) {
    return { success: false, message: error.message || "Network error." };
  }
}

export interface AdminStats {
  totalUsers: number;
  totalJobs: number;
  totalCompanies: number;
  pendingReports: number;
}

export async function getAdminStats(): Promise<ApiResponse<AdminStats>> {
  try {
    const response = await fetch(`${API_BASE}/api/dashboard/admin`, 
    { 
        method: "GET",
        headers: await getAuthedHeaders() as HeadersInit,
        credentials: "include" 
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || "Failed to fetch stats.");
    return result;
  } catch (error: any) {
    return { success: false, message: error.message || "Network error." };
  }
}

export interface ApplicantStats {
  totalApplications: number;
  savedJobs: number;
  shortlisted: number;
  pendingReview: number;
}

export async function getApplicantStats(userId: string): Promise<ApiResponse<ApplicantStats>> {
  try {
    const response = await fetch(`${API_BASE}/api/dashboard/applicant/${userId}`, { 
        method: "GET",
        headers: await getAuthedHeaders() as HeadersInit,
        credentials: "include" 
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || "Failed to fetch stats.");
    return result;
  } catch (error: any) {
    return { success: false, message: error.message || "Network error." };
  }
}