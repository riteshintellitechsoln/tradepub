import { format } from "date-fns";
import { db } from "@/lib/db";
import { AdminTable } from "@/components/admin/admin-table";

// Read-only on purpose — Users are created by NextAuth's own sign-up/sign-in
// flow (Module 5), not by an Admin. Most visitors will never create one;
// they download as a guest lead, which is why an empty table here is
// completely normal and not a sign anything is broken — see Leads for the
// actual contact list this platform exists to build.
export default async function AdminUsersPage() {
  const users = await db.user.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-bold">Users ({users.length})</h1>
      <p className="mb-4 max-w-2xl text-sm text-muted-foreground">
        Registered &quot;My Library&quot; accounts. Most visitors download as a guest lead
        without ever creating one — see{" "}
        <a href="/admin/leads" className="text-primary hover:underline">
          Leads
        </a>{" "}
        for the full contact list.
      </p>

      <AdminTable
        rows={users}
        rowKey={(u) => u.id}
        emptyMessage="No registered users yet — that's expected, since downloading never requires an account."
        columns={[
          { header: "Name", cell: (u) => u.name ?? "—" },
          { header: "Email", cell: (u) => u.email },
          { header: "Joined", cell: (u) => format(u.createdAt, "MMM d, yyyy") },
        ]}
      />
    </div>
  );
}
