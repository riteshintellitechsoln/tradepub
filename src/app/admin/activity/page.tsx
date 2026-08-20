import Link from "next/link";
import { format } from "date-fns";
import type { DownloadStatus } from "@prisma/client";
import { getAdminActivity } from "@/actions/admin/activity";
import { AdminSearchBox } from "@/components/admin/admin-search-box";
import { AdminFilterBar, AdminFilterField } from "@/components/admin/admin-filter-bar";
import { AdminDateRangeFilter } from "@/components/admin/admin-date-range-filter";
import { AdminStatusFilter } from "@/components/admin/admin-status-filter";
import { AdminTable } from "@/components/admin/admin-table";
import { ResendEmailButton } from "@/components/admin/resend-email-button";
import { Pagination } from "@/components/shared/pagination";
import { Badge } from "@/components/ui/badge";

interface AdminActivityPageProps {
  searchParams: Promise<{ q?: string; status?: string; from?: string; to?: string; page?: string }>;
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

export default async function AdminActivityPage({ searchParams }: AdminActivityPageProps) {
  const sp = await searchParams;
  const query = sp.q || undefined;
  const status = sp.status as DownloadStatus | undefined;
  const page = Math.max(1, Number(sp.page) || 1);

  const { activity, totalCount, totalPages } = await getAdminActivity({
    query,
    status,
    from: sp.from,
    to: sp.to,
    page,
  });

  function buildHref(targetPage: number) {
    const params = new URLSearchParams();
    if (sp.q) params.set("q", sp.q);
    if (sp.status) params.set("status", sp.status);
    if (sp.from) params.set("from", sp.from);
    if (sp.to) params.set("to", sp.to);
    if (targetPage > 1) params.set("page", String(targetPage));
    const qs = params.toString();
    return `/admin/activity${qs ? `?${qs}` : ""}`;
  }

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-bold">Activity ({totalCount})</h1>

      <AdminFilterBar>
        <AdminFilterField label="Search">
          <AdminSearchBox placeholder="Search by lead name, email, or book title..." />
        </AdminFilterField>
        <AdminFilterField label="Status">
          <AdminStatusFilter options={STATUS_OPTIONS} placeholder="All statuses" />
        </AdminFilterField>
        <AdminFilterField label="Date range">
          <AdminDateRangeFilter />
        </AdminFilterField>
      </AdminFilterBar>

      <AdminTable
        rows={activity}
        rowKey={(row) => row.id}
        emptyMessage="No activity matches your filters."
        columns={[
          {
            header: "Lead",
            cell: (row) => (
              <div>
                <p className="font-medium">{row.leadName}</p>
                <p className="text-xs text-muted-foreground">{row.leadEmail}</p>
              </div>
            ),
          },
          {
            header: "Book",
            cell: (row) => (
              <Link href={`/book/${row.bookSlug}`} className="hover:underline">
                {row.bookTitle}
              </Link>
            ),
          },
          {
            header: "Status",
            cell: (row) => <Badge variant={STATUS_VARIANT[row.status]}>{row.status}</Badge>,
          },
          {
            header: "Email Attempts",
            cell: (row) => (
              <span className="text-sm">
                {row.emailAttempts} attempt{row.emailAttempts === 1 ? "" : "s"}
                {row.latestEmailError && (
                  <span className="ml-1 text-xs text-destructive">
                    ({row.latestEmailError.slice(0, 40)}
                    {row.latestEmailError.length > 40 ? "…" : ""})
                  </span>
                )}
              </span>
            ),
          },
          { header: "Requested", cell: (row) => format(row.createdAt, "MMM d, yyyy HH:mm") },
          {
            header: "Downloaded",
            cell: (row) => (row.downloadedAt ? format(row.downloadedAt, "MMM d, yyyy HH:mm") : "—"),
          },
          {
            header: "",
            className: "text-right",
            cell: (row) =>
              row.status === "FAILED" || row.status === "EXPIRED" ? (
                <ResendEmailButton downloadId={row.id} />
              ) : null,
          },
        ]}
      />

      <Pagination currentPage={page} totalPages={totalPages} buildHref={buildHref} />
    </div>
  );
}