import type { AdminRole } from "@prisma/client";

// Every Admin role that may access /admin/*. EDITOR is included because they
// manage Books/Categories; Module 16 narrows individual admin screens
// further (e.g. only SUPER_ADMIN can manage other Admins).
export const ADMIN_ROLES: AdminRole[] = ["SUPER_ADMIN", "ADMIN", "EDITOR"];

export function isAdminRole(role: string | undefined | null): role is AdminRole {
  return !!role && (ADMIN_ROLES as string[]).includes(role);
}
