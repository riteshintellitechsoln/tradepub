import Link from "next/link";
import { format } from "date-fns";
import type { PublisherRequestStatus } from "@prisma/client";
import { getAdminPublisherRequests } from "@/actions/admin/publisher-requests";
import { AdminSearchBox } from "@/components/admin/admin-search-box";
import { AdminFilterBar, AdminFilterField } from "@/components/admin/admin-filter-bar";
import { AdminDateRangeFilter } from "@/components/admin/admin-date-range-filter";
import { AdminStatusFilter } from "@/components/admin/admin-status-filter";
import { AdminTable } from "@/components/admin/admin-table";
import { ExportExcelButton } from "@/components/admin/export-excel-button";
import { Pagination } from "@/components/shared/pagination";
import { Badge } from "@/components/ui/badge";

interface PageProps {
  searchParams: Promise<{ q?: string; status?: string; from?: string; to?: string; page?: string }>;
}

const STATUS_VARIANT: Record<PublisherRequestStatus, "default" | "secondary" | "destructive" | "outline"> = {
  PENDING: "secondary",
  REVIEWING: "default",
  APPROVED: "default",
  REJECTED: "destructive",
};

const STATUS_OPTIONS = [
  { value: "PENDING", label: "Pending" },
  { value: "REVIEWING", label: "Reviewing" },
  { value: "APPROVED", label: "Approved" },
  { value: "REJECTED", label: "Rejected" },
];

export default async function AdminPublisherRequestsPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const query = sp.q || undefined;
  const status = sp.status as PublisherRequestStatus | undefined;
  const page = Math.max(1, Number(sp.page) || 1);

  const { requests, totalCount, totalPages } = await getAdminPublisherRequests({
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
    return `/admin/publisher-requests${qs ? `?${qs}` : ""}`;
  }

  const exportData = requests.map((r) => ({
    Name: r.fullName,
    Email: r.email,
    "Job Title": r.jobTitle,
    Company: r.companyName,
    "Resource Title": r.bookTitle,
    Status: r.status,
    "Has PDF": r.pdfFileKey ? "Yes" : "No",
    Submitted: format(r.createdAt, "yyyy-MM-dd HH:mm"),
  }));

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold">Publisher Requests ({totalCount})</h1>
        <ExportExcelButton data={exportData} filename="publisher-requests" sheetName="Requests" />
      </div>

      <AdminFilterBar>
        <AdminFilterField label="Search">
          <AdminSearchBox placeholder="Search by name, email, company, or title..." />
        </AdminFilterField>
        <AdminFilterField label="Status">
          <AdminStatusFilter options={STATUS_OPTIONS} placeholder="All statuses" />
        </AdminFilterField>
        <AdminFilterField label="Date range">
          <AdminDateRangeFilter />
        </AdminFilterField>
      </AdminFilterBar>

      <AdminTable
        rows={requests}
        rowKey={(r) => r.id}
        emptyMessage="No publisher requests match your filters."
        columns={[
          {
            header: "Submitted by",
            cell: (r) => (
              <Link href={`/admin/publisher-requests/${r.id}`} className="hover:underline">
                <p className="font-medium">{r.fullName}</p>
                <p className="text-xs text-muted-foreground">{r.email}</p>
              </Link>
            ),
          },
          { header: "Company", cell: (r) => r.companyName },
          { header: "Resource", cell: (r) => r.bookTitle },
          {
            header: "Status",
            cell: (r) => <Badge variant={STATUS_VARIANT[r.status]}>{r.status}</Badge>,
          },
          { header: "PDF", cell: (r) => (r.pdfFileKey ? "✅" : "—") },
          { header: "Submitted", cell: (r) => format(r.createdAt, "MMM d, yyyy") },
        ]}
      />

      <Pagination currentPage={page} totalPages={totalPages} buildHref={buildHref} />
    </div>
  );
}