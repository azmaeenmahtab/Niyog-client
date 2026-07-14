"use client";

import { useState } from "react";
import { Button, Chip, Label, ListBox, Select, Table } from "@heroui/react";
import { toast } from "sonner";
import {
  banManagedUser,
  removeManagedUser,
  unbanManagedUser,
  updateManagedUserRole,
  type AdminUserRole,
  type ManagedUser,
} from "@/lib/actions/admin-users";
import { ConfirmModal } from "@/components/Modals/ConfirmationModal";

interface AdminUsersTableProps {
  initialUsers: ManagedUser[];
  totalUsers: number;
}

type PendingAction =
  | { type: "delete" | "unban"; user: ManagedUser }
  | { type: "ban" | "role"; user: ManagedUser }
  | null;

const ROLES: AdminUserRole[] = ["applicant", "recruiter", "admin"];

export function AdminUsersTable({ initialUsers, totalUsers }: AdminUsersTableProps) {
  const [users, setUsers] = useState(initialUsers);
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [banReason, setBanReason] = useState("");
  const [banDuration, setBanDuration] = useState("permanent");
  const [selectedRole, setSelectedRole] = useState<AdminUserRole>("applicant");

  const closeModal = () => {
    setPendingAction(null);
    setBanReason("");
    setBanDuration("permanent");
  };

  const runConfirmedAction = async () => {
    if (!pendingAction) return;
    setIsSubmitting(true);
    const { user } = pendingAction;
    let result;

    if (pendingAction.type === "delete") {
      result = await removeManagedUser(user.id);
      if (result.success) setUsers((current) => current.filter((item) => item.id !== user.id));
    } else if (pendingAction.type === "unban") {
      result = await unbanManagedUser(user.id);
      if (result.success) {
        setUsers((current) => current.map((item) => item.id === user.id ? { ...item, banned: false, banReason: null, banExpires: null } : item));
      }
    } else if (pendingAction.type === "ban") {
      const banExpiresIn = banDuration === "7-days" ? 60 * 60 * 24 * 7 : undefined;
      result = await banManagedUser(user.id, banReason, banExpiresIn);
      if (result.success) {
        setUsers((current) => current.map((item) => item.id === user.id ? { ...item, banned: true, banReason: banReason || "No reason provided" } : item));
      }
    } else {
      result = await updateManagedUserRole(user.id, selectedRole);
      if (result.success) {
        setUsers((current) => current.map((item) => item.id === user.id ? { ...item, role: selectedRole } : item));
      }
    }

    if (result.success) toast.success(result.message);
    else toast.error(result.message);

    setIsSubmitting(false);
    if (result.success) closeModal();
  };

  const openRoleModal = (user: ManagedUser) => {
    setSelectedRole((user.role as AdminUserRole) || "applicant");
    setPendingAction({ type: "role", user });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-white">Manage Users</h1>
        <p className="mt-1 text-sm text-white/60">{totalUsers} registered users.</p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-[#1a1a1a]/10 bg-white/70 shadow-[0_10px_30px_rgba(40,24,8,0.05)]">
        <Table>
          <Table.ScrollContainer>
            <Table.Content aria-label="Admin users table" className="min-w-225">
              <Table.Header>
                <Table.Column isRowHeader>User</Table.Column>
                <Table.Column>Role</Table.Column>
                <Table.Column>Status</Table.Column>
                <Table.Column>Joined</Table.Column>
                <Table.Column className="text-end">Actions</Table.Column>
              </Table.Header>
              <Table.Body>
                {users.map((user) => (
                  <Table.Row key={user.id} id={user.id}>
                    <Table.Cell>
                      <div>
                        <p className="font-medium text-[#1a1a1a]">{user.name || "Unnamed user"}</p>
                        <p className="mt-1 text-xs text-[#1a1a1a]/55">{user.email}</p>
                      </div>
                    </Table.Cell>
                    <Table.Cell>
                      <Chip size="sm" variant="soft" color={user.role === "admin" ? "warning" : "default"} className="capitalize">
                        {user.role || "applicant"}
                      </Chip>
                    </Table.Cell>
                    <Table.Cell>
                      <Chip size="sm" variant="soft" color={user.banned ? "danger" : "success"}>
                        {user.banned ? "Banned" : "Active"}
                      </Chip>
                    </Table.Cell>
                    <Table.Cell>
                      <span className="text-sm text-[#1a1a1a]/75">
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "—"}
                      </span>
                    </Table.Cell>
                    <Table.Cell>
                      <div className="flex justify-end gap-2">
                        <Button size="sm" variant="secondary" onClick={() => openRoleModal(user)}>Change role</Button>
                        <Button size="sm" variant={user.banned ? "secondary" : "danger-soft"} onClick={() => setPendingAction({ type: user.banned ? "unban" : "ban", user })}>
                          {user.banned ? "Unban" : "Ban"}
                        </Button>
                        <Button size="sm" variant="danger" onClick={() => setPendingAction({ type: "delete", user })}>Delete</Button>
                      </div>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Content>
          </Table.ScrollContainer>
        </Table>
        {!users.length && <p className="p-6 text-center text-sm text-[#1a1a1a]/60">No users found.</p>}
      </div>

      {pendingAction?.type === "delete" && (
        <ConfirmModal
          title={`Delete ${pendingAction.user.name || pendingAction.user.email}?`}
          description="This permanently removes the user and cannot be undone."
          confirmLabel="Delete user"
          variant="danger"
          isLoading={isSubmitting}
          onCancel={closeModal}
          onConfirm={runConfirmedAction}
        />
      )}
      {pendingAction?.type === "unban" && (
        <ConfirmModal
          title={`Unban ${pendingAction.user.name || pendingAction.user.email}?`}
          description="They will be able to sign in again."
          confirmLabel="Unban user"
          variant="warning"
          isLoading={isSubmitting}
          onCancel={closeModal}
          onConfirm={runConfirmedAction}
        />
      )}
      {pendingAction?.type === "ban" && (
        <UserActionModal title={`Ban ${pendingAction.user.name || pendingAction.user.email}?`} isLoading={isSubmitting} onCancel={closeModal} onConfirm={runConfirmedAction} confirmLabel="Ban user" danger>
          <div className="rounded-xl border border-red-200 bg-red-50 p-4">
            <div className="flex gap-3">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-red-100 text-sm font-bold text-red-700">!</span>
              <p className="text-sm leading-5 text-red-800">
                Banning prevents this user from signing in and revokes their active sessions.
              </p>
            </div>

            <div className="mt-4">
              <label htmlFor="ban-reason" className="block text-sm font-semibold text-gray-900">Reason for ban</label>
              <textarea
                id="ban-reason"
                value={banReason}
                onChange={(event) => setBanReason(event.target.value)}
                placeholder="e.g. Repeated spam reports"
                className="mt-1.5 min-h-24 w-full resize-y rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-red-500 focus:ring-2 focus:ring-red-100"
              />
            </div>

            <div className="mt-4">
              <Select
                className="w-full"
                placeholder="Select ban duration"
                selectionMode="single"
                value={banDuration}
                onChange={(value) => setBanDuration(value as string)}
              >
                <Label className="text-sm font-semibold text-gray-900">Ban duration</Label>
                <Select.Trigger className="mt-1.5 border-gray-300 bg-white text-gray-900 focus:border-red-500">
                  <Select.Value />
                  <Select.Indicator />
                </Select.Trigger>
                <Select.Popover>
                  <ListBox selectionMode="single">
                    <ListBox.Item id="permanent" textValue="Permanent">
                      Permanent
                      <ListBox.ItemIndicator />
                    </ListBox.Item>
                    <ListBox.Item id="7-days" textValue="7 days">
                      7 days
                      <ListBox.ItemIndicator />
                    </ListBox.Item>
                  </ListBox>
                </Select.Popover>
              </Select>
            </div>
          </div>
        </UserActionModal>
      )}
      {pendingAction?.type === "role" && (
        <UserActionModal title={`Update ${pendingAction.user.name || pendingAction.user.email}'s role?`} isLoading={isSubmitting} onCancel={closeModal} onConfirm={runConfirmedAction} confirmLabel="Update role">
          <Select
            className="w-full"
            placeholder="Select a role"
            selectionMode="single"
            value={selectedRole}
            onChange={(value) => setSelectedRole(value as AdminUserRole)}
          >
            <Label>New role</Label>
            <Select.Trigger>
              <Select.Value />
              <Select.Indicator />
            </Select.Trigger>
            <Select.Popover>
              <ListBox selectionMode="single">
                {ROLES.map((role) => (
                  <ListBox.Item key={role} id={role} textValue={role} className="capitalize">
                    <span className="capitalize">{role}</span>
                    <ListBox.ItemIndicator />
                  </ListBox.Item>
                ))}
              </ListBox>
            </Select.Popover>
          </Select>
        </UserActionModal>
      )}
    </div>
  );
}

function UserActionModal({ title, children, confirmLabel, isLoading, onCancel, onConfirm, danger = false }: { title: string; children: React.ReactNode; confirmLabel: string; isLoading: boolean; onCancel: () => void; onConfirm: () => void; danger?: boolean }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <h2 className="text-base font-bold text-gray-900">{title}</h2>
        <div className="mt-4">{children}</div>
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="secondary" isDisabled={isLoading} onClick={onCancel}>Cancel</Button>
          <Button variant={danger ? "danger" : "primary"} isDisabled={isLoading} onClick={onConfirm}>{isLoading ? "Working..." : confirmLabel}</Button>
        </div>
      </div>
    </div>
  );
}
