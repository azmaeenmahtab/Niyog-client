export type getAllJobsQueryParams = {
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
        const result = await fetch(url);
        const data = await result.json();
        return data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}
