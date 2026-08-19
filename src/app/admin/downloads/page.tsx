// import type { Prisma, DownloadStatus } from "@prisma/client";
// import { format } from "date-fns";
// import { db } from "@/lib/db";
// import { AdminSearchBox } from "@/components/admin/admin-search-box";
// import { AdminTable } from "@/components/admin/admin-table";
// import { ResendEmailButton } from "@/components/admin/resend-email-button";
// import { Pagination } from "@/components/shared/pagination";
// import { Badge } from "@/components/ui/badge";

// interface AdminDownloadsPageProps {
//   searchParams: Promise<{ q?: string; page?: string }>;
// }

// const STATUS_VARIANT: Record<DownloadStatus, "default" | "secondary" | "destructive" | "outline"> = {
//   PENDING: "secondary",
//   EMAIL_SENT: "default",
//   DOWNLOADED: "default",
//   EXPIRED: "outline",
//   FAILED: "destructive",
// };

// // One row per download EVENT (see the Lead-vs-Download design note in
// // prisma/schema.prisma) — a single lead can appear here many times, once
// // per book they've requested.
// export default async function AdminDownloadsPage({ searchParams }: AdminDownloadsPageProps) {
//   const sp = await searchParams;
//   const query = sp.q || undefined;
//   const page = Math.max(1, Number(sp.page) || 1);
//   const perPage = 20;

//   const where: Prisma.DownloadWhereInput = query
//     ? {
//         OR: [
//           { lead: { email: { contains: query, mode: "insensitive" } } },
//           { book: { title: { contains: query, mode: "insensitive" } } },
//         ],
//       }
//     : {};

//   const [downloads, totalCount] = await Promise.all([
//     db.download.findMany({
//       where,
//       orderBy: { createdAt: "desc" },
//       skip: (page - 1) * perPage,
//       take: perPage,
//       include: {
//         lead: { select: { email: true, fullName: true } },
//         book: { select: { title: true } },
//       },
//     }),
//     db.download.count({ where }),
//   ]);

//   const totalPages = Math.max(1, Math.ceil(totalCount / perPage));

//   function buildHref(targetPage: number) {
//     const params = new URLSearchParams();
//     if (query) params.set("q", query);
//     if (targetPage > 1) params.set("page", String(targetPage));
//     const qs = params.toString();
//     return `/admin/downloads${qs ? `?${qs}` : ""}`;
//   }

//   return (
//     <div>
//       <h1 className="mb-6 font-display text-2xl font-bold">Downloads ({totalCount})</h1>

//       <div className="mb-4">
//         <AdminSearchBox placeholder="Search by lead email or book title..." />
//       </div>

//       <AdminTable
//         rows={downloads}
//         rowKey={(d) => d.id}
//         emptyMessage="No downloads yet."
//         columns={[
//           {
//             header: "Lead",
//             cell: (d) => (
//               <>
//                 {d.lead.fullName}{" "}
//                 <span className="text-muted-foreground">({d.lead.email})</span>
//               </>
//             ),
//           },
//           { header: "Book", cell: (d) => d.book.title },
//           {
//             header: "Status",
//             cell: (d) => <Badge variant={STATUS_VARIANT[d.status]}>{d.status}</Badge>,
//           },
//           { header: "Requested", cell: (d) => format(d.createdAt, "MMM d, yyyy HH:mm") },
//           {
//             header: "Downloaded",
//             cell: (d) => (d.downloadedAt ? format(d.downloadedAt, "MMM d, yyyy HH:mm") : "—"),
//           },
//           {
//             header: "",
//             className: "text-right",
//             cell: (d) =>
//               d.status === "FAILED" || d.status === "EXPIRED" ? (
//                 <ResendEmailButton downloadId={d.id} />
//               ) : null,
//           },
//         ]}
//       />

//       <Pagination currentPage={page} totalPages={totalPages} buildHref={buildHref} />
//     </div>
//   );
// }

import type { Prisma, DownloadStatus } from "@prisma/client";
import { format } from "date-fns";
import { db } from "@/lib/db";
import { getDateRange } from "@/lib/admin-filters";
import { AdminSearchBox } from "@/components/admin/admin-search-box";
import { AdminFilterBar, AdminFilterField } from "@/components/admin/admin-filter-bar";
import { AdminDateRangeFilter } from "@/components/admin/admin-date-range-filter";
import { AdminStatusFilter } from "@/components/admin/admin-status-filter";
import { AdminTable } from "@/components/admin/admin-table";
import { ResendEmailButton } from "@/components/admin/resend-email-button";
import { Pagination } from "@/components/shared/pagination";
import { Badge } from "@/components/ui/badge";

interface AdminDownloadsPageProps {
  searchParams: Promise<{
    q?: string;
    page?: string;
    status?: string;
    from?: string;
    to?: string;
  }>;
}

const STATUS_VARIANT: Record<DownloadStatus, "default" | "secondary" | "destructive" | "outline"> = {
  PENDING: "secondary",
  EMAIL_SENT: "default",
  DOWNLOADED: "default",
  EXPIRED: "outline",
  FAILED: "destructive",
};

const STATUS_OPTIONS = [
  { value: "PENDING", label: "Pending" },
  { value: "EMAIL_SENT", label: "Email Sent" },
  { value: "DOWNLOADED", label: "Downloaded" },
  { value: "EXPIRED", label: "Expired" },
  { value: "FAILED", label: "Failed" },
];

export default async function AdminDownloadsPage({ searchParams }: AdminDownloadsPageProps) {
  const sp = await searchParams;
  const query = sp.q || undefined;
  const page = Math.max(1, Number(sp.page) || 1);
  const perPage = 20;
  const status = sp.status as DownloadStatus | undefined;
  const dateRange = getDateRange(sp.from, sp.to);

  const where: Prisma.DownloadWhereInput = {
    ...(query
      ? {
          OR: [
            { lead: { email: { contains: query, mode: "insensitive" } } },
            { book: { title: { contains: query, mode: "insensitive" } } },
          ],
        }
      : {}),
    ...(status ? { status } : {}),
    ...(dateRange ? { createdAt: dateRange } : {}),
  };

  const [downloads, totalCount] = await Promise.all([
    db.download.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * perPage,
      take: perPage,
      include: {
        lead: { select: { email: true, fullName: true } },
        book: { select: { title: true } },
      },
    }),
    db.download.count({ where }),
  ]);

  const totalPages = Math.max(1, Math.ceil(totalCount / perPage));

  function buildHref(targetPage: number) {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (sp.status) params.set("status", sp.status);
    if (sp.from) params.set("from", sp.from);
    if (sp.to) params.set("to", sp.to);
    if (targetPage > 1) params.set("page", String(targetPage));
    const qs = params.toString();
    return `/admin/downloads${qs ? `?${qs}` : ""}`;
  }

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-bold">Downloads ({totalCount})</h1>

      <AdminFilterBar>
        <AdminFilterField label="Search">
          <AdminSearchBox placeholder="Search by lead email or book title..." />
        </AdminFilterField>
        <AdminFilterField label="Status">
          <AdminStatusFilter options={STATUS_OPTIONS} placeholder="All statuses" />
        </AdminFilterField>
        <AdminFilterField label="Date range">
          <AdminDateRangeFilter />
        </AdminFilterField>
      </AdminFilterBar>

      <AdminTable
        rows={downloads}
        rowKey={(d) => d.id}
        emptyMessage="No downloads match your filters."
        columns={[
          {
            header: "Lead",
            cell: (d) => (
              <>
                {d.lead.fullName}{" "}
                <span className="text-muted-foreground">({d.lead.email})</span>
              </>
            ),
          },
          { header: "Book", cell: (d) => d.book.title },
          {
            header: "Status",
            cell: (d) => <Badge variant={STATUS_VARIANT[d.status]}>{d.status}</Badge>,
          },
          { header: "Requested", cell: (d) => format(d.createdAt, "MMM d, yyyy HH:mm") },
          {
            header: "Downloaded",
            cell: (d) => (d.downloadedAt ? format(d.downloadedAt, "MMM d, yyyy HH:mm") : "—"),
          },
          {
            header: "",
            className: "text-right",
            cell: (d) =>
              d.status === "FAILED" || d.status === "EXPIRED" ? (
                <ResendEmailButton downloadId={d.id} />
              ) : null,
          },
        ]}
      />

      <Pagination currentPage={page} totalPages={totalPages} buildHref={buildHref} />
    </div>
  );
}