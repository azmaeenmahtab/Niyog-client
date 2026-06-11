const getAllJobs = async () => {
    try {
        const result = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/get-all-jobs`);
        const data = await result.json();
        return data;
    } catch (error) {
        console.log(error);
        return error;
    }
}

const getAllJobsByCompanyId = async (companyId, status) => {
    try {
        const result = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/get-jobs-by-company-id?companyId=${companyId}&status=${status}`);
        const data = await result.json();
        return data;
    } catch (error) {
        console.log(error);
        return error;
    }
}

export { getAllJobs, getAllJobsByCompanyId }