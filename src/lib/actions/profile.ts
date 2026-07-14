"use server";

import { getAuthedHeaders } from "../authHeader";


export interface UserProfile {
  _id: string | { $oid: string };
  name: string;
  email: string;
  emailVerified: boolean;
  image: string;
  createdAt: string | { $date: string };
  updatedAt: string | { $date: string };
  role: 'admin' | 'applicant' | 'recruiter';
  banned?: boolean;
  banReason?: string | null;
}

interface ProfileApiResponse {
  success: boolean;
  message: string;
  data?: UserProfile;
}

/**
 * Fetches user profile data from the backend using Server-Side authenticated headers.
 * @param userId - The ID of the target profile (extracted from the route slug)
 */
export async function fetchUserProfile(userId: string): Promise<ProfileApiResponse> {
  try {
    const authHeaders = await getAuthedHeaders();

    if (!authHeaders) {
      return {
        success: false,
        message: "Unauthorized. Please log in to view this profile.",
      };
    }

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";
    const response = await fetch(`${backendUrl}/api/user/profile/${userId}`, {
      method: "GET",
      headers: authHeaders,
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to retrieve user profile data.");
    }

    return {
      success: true,
      message: result.message || "User profile retrieved successfully.",
      data: result.data,
    };
  } catch (error: any) {
    console.error("fetchUserProfile Helper Error:", error);
    return {
      success: false,
      message: error.message || "Network error. Failed to reach the backend server.",
    };
  }
}