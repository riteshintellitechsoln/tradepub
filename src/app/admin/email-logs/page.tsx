// import type { EmailStatus } from "@prisma/client";
// import { format } from "date-fns";
// import { db } from "@/lib/db";
// import { AdminTable } from "@/components/admin/admin-table";
// import { Pagination } from "@/components/shared/pagination";
// import { Badge } from "@/components/ui/badge";

// interface AdminEmailLogsPageProps {
//   searchParams: Promise<{ page?: string }>;
// }

// const STATUS_VARIANT: Record<EmailStatus, "default" | "secondary" | "destructive" | "outline"> = {
//   QUEUED: "secondary",
//   SENT: "default",
//   DELIVERED: "default",
//   OPENED: "default",
//   CLICKED: "default",
//   BOUNCED: "destructive",
//   COMPLAINED: "destructive",
//   FAILED: "destructive",
// };

// // One row per send ATTEMPT (not per Download) — a resend creates a new row
// // here rather than overwriting the original, so delivery history for a
// // single download stays complete even after multiple attempts.
// export default async function AdminEmailLogsPage({ searchParams }: AdminEmailLogsPageProps) {
//   const sp = await searchParams;
//   const page = Math.max(1, Number(sp.page) || 1);
//   const perPage = 25;

//   const [logs, totalCount] = await Promise.all([
//     db.emailLog.findMany({
//       orderBy: { createdAt: "desc" },
//       skip: (page - 1) * perPage,
//       take: perPage,
//       include: { download: { select: { book: { select: { title: true } } } } },
//     }),
//     db.emailLog.count(),
//   ]);

//   const totalPages = Math.max(1, Math.ceil(totalCount / perPage));

//   function buildHref(targetPage: number) {
//     return targetPage > 1 ? `/admin/email-logs?page=${targetPage}` : "/admin/email-logs";
//   }

//   return (
//     <div>
//       <h1 className="mb-6 font-display text-2xl font-bold">Email Logs ({totalCount})</h1>

//       <AdminTable
//         rows={logs}
//         rowKey={(log) => log.id}
//         emptyMessage="No emails sent yet."
//         columns={[
//           { header: "To", cell: (l) => l.to },
//           { header: "Subject", cell: (l) => l.subject },
//           { header: "Book", cell: (l) => l.download.book.title },
//           {
//             header: "Status",
//             cell: (l) => <Badge variant={STATUS_VARIANT[l.status]}>{l.status}</Badge>,
//           },
//           {
//             header: "Sent At",
//             cell: (l) => (l.sentAt ? format(l.sentAt, "MMM d, yyyy HH:mm") : "—"),
//           },
//           {
//             header: "Error",
//             className: "max-w-xs truncate text-destructive",
//             cell: (l) => l.error ?? "—",
//           },
//         ]}
//       />

//       <Pagination currentPage={page} totalPages={totalPages} buildHref={buildHref} />
//     </div>
//   );
// }


import type { EmailStatus, Prisma } from "@prisma/client";
import { format } from "date-fns";
import { db } from "@/lib/db";
import { getDateRange } from "@/lib/admin-filters";
import { AdminFilterBar, AdminFilterField } from "@/components/admin/admin-filter-bar";
import { AdminDateRangeFilter } from "@/components/admin/admin-date-range-filter";
import { AdminStatusFilter } from "@/components/admin/admin-status-filter";
import { AdminTable } from "@/components/admin/admin-table";
import { Pagination } from "@/components/shared/pagination";
import { Badge } from "@/components/ui/badge";

interface AdminEmailLogsPageProps {
  searchParams: Promise<{ page?: string; status?: string; from?: string; to?: string }>;
}

const STATUS_VARIANT: Record<EmailStatus, "default" | "secondary" | "destructive" | "outline"> = {
  QUEUED: "secondary",
  SENT: "default",
  DELIVERED: "default",
  OPENED: "default",
  CLICKED: "default",
  BOUNCED: "destructive",
  COMPLAINED: "destructive",
  FAILED: "destructive",
};

const STATUS_OPTIONS = [
  { value: "QUEUED", label: "Queued" },
  { value: "SENT", label: "Sent" },
  { value: "DELIVERED", label: "Delivered" },
  { value: "OPENED", label: "Opened" },
  { value: "CLICKED", label: "Clicked" },
  { value: "BOUNCED", label: "Bounced" },
  { value: "COMPLAINED", label: "Complained" },
  { value: "FAILED", label: "Failed" },
];

export default async function AdminEmailLogsPage({ searchParams }: AdminEmailLogsPageProps) {
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page) || 1);
  const perPage = 25;
  const status = sp.status as EmailStatus | undefined;
  const dateRange = getDateRange(sp.from, sp.to);

  const where: Prisma.EmailLogWhereInput = {
    ...(status ? { status } : {}),
    ...(dateRange ? { createdAt: dateRange } : {}),
  };

  const [logs, totalCount] = await Promise.all([
    db.emailLog.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * perPage,
      take: perPage,
      include: { download: { select: { book: { select: { title: true } } } } },
    }),
    db.emailLog.count({ where }),
  ]);

  const totalPages = Math.max(1, Math.ceil(totalCount / perPage));

  function buildHref(targetPage: number) {
    const params = new URLSearchParams();
    if (sp.status) params.set("status", sp.status);
    if (sp.from) params.set("from", sp.from);
    if (sp.to) params.set("to", sp.to);
    if (targetPage > 1) params.set("page", String(targetPage));
    const qs = params.toString();
    return `/admin/email-logs${qs ? `?${qs}` : ""}`;
  }

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-bold">Email Logs ({totalCount})</h1>

      <AdminFilterBar>
        <AdminFilterField label="Status">
          <AdminStatusFilter options={STATUS_OPTIONS} placeholder="All statuses" />
        </AdminFilterField>
        <AdminFilterField label="Date range">
          <AdminDateRangeFilter />
        </AdminFilterField>
      </AdminFilterBar>

      <AdminTable
        rows={logs}
        rowKey={(log) => log.id}
        emptyMessage="No emails match your filters."
        columns={[
          { header: "To", cell: (l) => l.to },
          { header: "Subject", cell: (l) => l.subject },
          { header: "Book", cell: (l) => l.download.book.title },
          {
            header: "Status",
            cell: (l) => <Badge variant={STATUS_VARIANT[l.status]}>{l.status}</Badge>,
          },
          {
            header: "Sent At",
            cell: (l) => (l.sentAt ? format(l.sentAt, "MMM d, yyyy HH:mm") : "—"),
          },
          {
            header: "Error",
            className: "max-w-xs truncate text-destructive",
            cell: (l) => l.error ?? "—",
          },
        ]}
      />

      <Pagination currentPage={page} totalPages={totalPages} buildHref={buildHref} />
    </div>
  );
}