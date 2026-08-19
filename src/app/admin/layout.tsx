// import { requireAdmin } from "@/lib/session";
// import { AdminSidebar } from "@/components/admin/sidebar";
// import { UserNav } from "@/components/layout/user-nav";
// import { ModeToggle } from "@/components/shared/mode-toggle";
// import { SessionWatcher } from "@/components/admin/session-watcher";

// // middleware.ts (Module 5) already blocks unauthenticated/non-admin
// // requests to /admin/* at the edge — requireAdmin() here is deliberate
// // defense-in-depth, not redundancy: it also gives every admin page a
// // typed, guaranteed-non-null session without re-deriving that check itself.
// export default async function AdminLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   await requireAdmin();

//   return (
//     <div className="flex min-h-screen">
//        <SessionWatcher />
//       <AdminSidebar />
//       <div className="flex flex-1 flex-col">
//         <header className="flex h-16 items-center justify-between border-b px-6">
//           <p className="text-sm text-muted-foreground">Admin Panel</p>
//           <div className="flex items-center gap-2">
//             <ModeToggle />
//             <UserNav />
//           </div>
//         </header>
//         <main className="flex-1 overflow-x-auto p-6">{children}</main>
//       </div>
//     </div>
//   );
// }


import { requireAdmin } from "@/lib/session";
import { AdminSidebar } from "@/components/admin/sidebar";
import { UserNav } from "@/components/layout/user-nav";
import { ModeToggle } from "@/components/shared/mode-toggle";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b px-6">
          <p className="text-sm text-muted-foreground">Admin Panel</p>
          <div className="flex items-center gap-2">
            <ModeToggle />
            <UserNav />
          </div>
        </header>
        <main className="flex-1 overflow-x-auto p-6">{children}</main>
      </div>
    </div>
  );
}