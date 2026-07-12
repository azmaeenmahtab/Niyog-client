export interface Company {
  _id: string;
  name: string;
  industry: string;
  website: string;
  location: string;
  employeeRange: string;
  description: string;
  logoUrl: string | null;
  recruiterId: string;
  status?: "pending" | "approved" | "declined";
  createdAt?: string;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL;
console.log("API_BASE:", API_BASE); // Log the API base URL for debugging

export async function getAllCompanies(): Promise<ApiResponse<Company[]>> {
  try {
    const response = await fetch(`${API_BASE}/api/admin/company/all`, {
      method: "GET",
      credentials: "include",
    });
    const result: ApiResponse<Company[]> = await response.json();
    if (!response.ok) {
      throw new Error(result.message || "Failed to fetch companies.");
    }
    return result;
  } catch (error: any) {
    console.error("getAllCompanies error:", error);
    return { success: false, message: error.message || "Network error." };
  }
}

export async function updateCompanyStatus(
  companyId: string,
  status: "approved" | "declined"
): Promise<ApiResponse<Company>> {
  try {
    const response = await fetch(`${API_BASE}/api/admin/company/update/status/${companyId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ status }),
    });
    const result: ApiResponse<Company> = await response.json();
    if (!response.ok) {
      throw new Error(result.message || "Failed to update company status.");
    }
    return result;
  } catch (error: any) {
    console.error("updateCompanyStatus error:", error);
    return { success: false, message: error.message || "Network error." };
  }
}

export async function deleteCompany(companyId: string): Promise<ApiResponse<null>> {
  try {
    const response = await fetch(`${API_BASE}/api/admin/company/delete/${companyId}`, {
      method: "DELETE",
      credentials: "include",
    });
    const result: ApiResponse<null> = await response.json();
    if (!response.ok) {
      throw new Error(result.message || "Failed to delete company.");
    }
    return result;
  } catch (error: any) {
    console.error("deleteCompany error:", error);
    return { success: false, message: error.message || "Network error." };
  }
}