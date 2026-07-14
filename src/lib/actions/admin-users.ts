"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export type AdminUserRole = "applicant" | "recruiter" | "admin";

export interface ManagedUser {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  role?: string | null;
  banned?: boolean | null;
  banReason?: string | null;
  banExpires?: string | Date | null;
  createdAt?: string | Date;
}

export interface AdminActionResult {
  success: boolean;
  message: string;
}

const actionError = (error: unknown): AdminActionResult => ({
  success: false,
  message: error instanceof Error ? error.message : "The user action could not be completed.",
});

async function getRequestHeaders() {
  return await headers();
}

export async function getManagedUsers(): Promise<{ users: ManagedUser[]; total: number }> {
  const result = await auth.api.listUsers({
    query: {
      sortBy: "createdAt",
      sortDirection: "desc",
    },
    headers: await getRequestHeaders(),
  });
  console.log("getManagedUsers result:", result);
  return {
    users: (result.users ?? []) as ManagedUser[],
    total: result.total ?? 0,
  };
}

export async function removeManagedUser(userId: string): Promise<AdminActionResult> {
  try {
    await auth.api.removeUser({
      body: { userId },
      headers: await getRequestHeaders(),
    });
    return { success: true, message: "User deleted successfully." };
  } catch (error) {
    return actionError(error);
  }
}

export async function banManagedUser(
  userId: string,
  banReason: string,
  banExpiresIn?: number,
): Promise<AdminActionResult> {
  try {
    await auth.api.banUser({
      body: {
        userId,
        banReason: banReason || "No reason provided",
        ...(banExpiresIn ? { banExpiresIn } : {}),
      },
      headers: await getRequestHeaders(),
    });
    return { success: true, message: "User banned successfully." };
  } catch (error) {
    return actionError(error);
  }
}

export async function unbanManagedUser(userId: string): Promise<AdminActionResult> {
  try {
    await auth.api.unbanUser({
      body: { userId },
      headers: await getRequestHeaders(),
    });
    return { success: true, message: "User unbanned successfully." };
  } catch (error) {
    return actionError(error);
  }
}

export async function updateManagedUserRole(
  userId: string,
  role: AdminUserRole,
): Promise<AdminActionResult> {
  try {
    await auth.api.setRole({
      // The application uses applicant/recruiter/admin roles. Better Auth's
      // default client typing only exposes admin/user, while the server API
      // accepts a role string and persists it in the user record.
      body: { userId, role: role as "admin" | "user" },
      headers: await getRequestHeaders(),
    });
    return { success: true, message: "User role updated successfully." };
  } catch (error) {
    return actionError(error);
  }
}
