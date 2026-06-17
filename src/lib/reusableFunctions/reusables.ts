

// for client components — fetches from the backend API to avoid pulling
// server-only modules (next/headers, MongoClient) into the client bundle.
export const getRecruiterCompanyDataById = async (recruiterId: string) => {
  const baseUrl =
    process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

  const res = await fetch(
    `${baseUrl}/api/recruiter-company?recruiterId=${encodeURIComponent(recruiterId)}`,
    { cache: "no-store" }
  );

  if (!res.ok) return null;
  const json = await res.json();
  return json?.data ?? null;
};