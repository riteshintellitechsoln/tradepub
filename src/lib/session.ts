import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { isAdminRole } from "@/lib/rbac";

// Convenience helpers for Server Components / Server Actions. Middleware
// already blocks unauthenticated requests to /admin/*, but these give
// individual pages and actions (e.g. "only SUPER_ADMIN can delete an Admin"
// in Module 16) an easy, explicit check without re-deriving the session shape.

export async function getCurrentUser() {
  const session = await auth();
  return session?.user ?? null;
}

export async function requireAdmin() {
  const session = await auth();
  if (!session?.user || !isAdminRole(session.user.role)) {
    redirect("/login");
  }
  return session;
}
