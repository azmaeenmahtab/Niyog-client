import { getSession } from "better-auth/api";
import { getCompanyAction } from "../actions/company";
import { authClient } from "@/lib/auth-client";
import { headers } from "next/headers";
import { auth } from "../auth";



export const getRecruiterCompanyData = async () => {
  const user = await auth.api.getSession({
    headers: await headers(),
  });
//   console.log( "user", user);
  const recruiterId = user?.user?.id;

    const companies = await getCompanyAction(recruiterId);
    return companies;
};