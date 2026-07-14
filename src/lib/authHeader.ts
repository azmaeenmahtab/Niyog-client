"use server";
import { headers } from "next/headers";

export async function getAuthedHeaders(extra = {}) {
    const headerStore = await headers();
    const cookie = headerStore.get("cookie") || "";

    const authBaseUrl = process.env.BETTER_AUTH_URL
    if (!authBaseUrl) {
        return null;
    }

    const url = `${authBaseUrl}/api/auth/token`

    try {
        const response = await fetch(url, {
            method: "GET",
            cache: "no-store",
            headers: {
                ...(cookie ? { Cookie: cookie } : {}),
            },
        });

        if (!response.ok) {
            return null;
        }

        const data = await response.json();
        const token = data?.token;

        if (typeof token === "string" && token.split(".").length === 3) {
            console.log("token ", token);
            return {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
                ...extra,
            };
        }

        throw new Error("No JWT token available for protected request");
    } catch {
        // Try the next possible endpoint.
    }

}
