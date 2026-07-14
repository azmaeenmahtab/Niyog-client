import { AdminUsersTable } from "@/components/Admin/UsersTable";
import { getManagedUsers } from "@/lib/actions/admin-users";

export default async function ManageUsersPage() {
  const { users, total } = await getManagedUsers();

  return <AdminUsersTable initialUsers={users} totalUsers={total} />;
}
