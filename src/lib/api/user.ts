// src/utils/api.ts
import { getAuthedHeaders } from "../authHeader";

export interface UpdateRoleResponse {
  success: boolean;
  message: string;
  data?: any; // Contains the updated user object from your collection
}

/**
 * Sends a PATCH request passing the userId directly in the URL parameter.
 * @param userId - The string ID of the user (e.g., "64f1a2b3...")
 * @param role - The selected target role ("applicant" or "recruiter")
 */
export async function updateUserRole(
  userId: string, 
  role: "applicant" | "recruiter"
): Promise<UpdateRoleResponse> {
  try {
    // If your backend is hosted on a different port/url during development,
    // append it here, e.g., `http://localhost:5000/api/users/${userId}/role`
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/update-role?userId=${userId}`, {
      method: "PATCH",
      headers: {
        ...await getAuthedHeaders()
      },
      body: JSON.stringify({ role }),
    });

    const result: UpdateRoleResponse = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Something went wrong updating the role.");
    }
    console.log("API Response after role update:", result);
    return result;
  } catch (error: any) {
    console.error("API Helper Error:", error);
    return {
      success: false,
      message: error.message || "Network error. Failed to reach the backend server.",
    };
  }
}