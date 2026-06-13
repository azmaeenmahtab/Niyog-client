export const getAllJobs = async () => {
    try {
        const result = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/get-all-jobs`);
        const data = await result.json();
        return data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const getAllJobsByCompanyId = async (companyId: string, status?: string) => {
    try {
        const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/get-jobs-by-company-id?companyId=${companyId}${status ? `&status=${status}` : ''}`;
        const result = await fetch(url);
        const data = await result.json();
        return data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}
