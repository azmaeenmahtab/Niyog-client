"use client";

import {
	createContext,
	useContext,
	useMemo,
	type ReactNode,
} from "react";
import { useSession } from "@/lib/auth-client";

type SessionData = NonNullable<ReturnType<typeof useSession>["data"]>;
type SessionUser = SessionData["user"] & {
	role?: string;
	userId?: string;
};

export interface UserInfoContextValue {
	session: SessionData | null;
	user: SessionUser | null;
	isLoading: boolean;
	isAuthenticated: boolean;
}

const UserInfoContext = createContext<UserInfoContextValue | null>(null);

export function UserInfoProvider({ children }: { children: ReactNode }) {
	const { data: session, isPending } = useSession();

	const value = useMemo(
		() => ({
			session: session ?? null,
			user: session?.user ?? null,
			isLoading: isPending,
			isAuthenticated: Boolean(session?.user),
		}),
		[isPending, session],
	);

	return (
		<UserInfoContext.Provider value={value}>
			{children}
		</UserInfoContext.Provider>
	);
}

export function useUserInfo(): UserInfoContextValue {
	const ctx = useContext(UserInfoContext);
	if (!ctx) {
		throw new Error("useUserInfo must be used within a UserInfoProvider");
	}
	return ctx;
}
