import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";
import { adminClient, jwtClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
    /** The base URL of the server (optional if you're using the same domain) */
    baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
    plugins: [
        adminClient(),
        jwtClient(),
        inferAdditionalFields({
            user: {
                role: {
                    type: "string",
                },
            },
        }),
    ],
});

export const { signIn, signUp, useSession, signOut } = authClient;
