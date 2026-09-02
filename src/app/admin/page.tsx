// import Link from "next/link";
// import Image from "next/image";
// import { formatDistanceToNow } from "date-fns";
// import { BookText, Building2, Contact, Download, FolderTree } from "lucide-react";
// import {
//   getDashboardStats,
//   getDownloadsTimeSeries,
//   getRecentLeads,
//   getRecentDownloads,
//   getTopBooks,
// } from "@/actions/admin/dashboard";
// import { DownloadsChart } from "@/components/admin/downloads-chart";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";

// // The real Dashboard (Module 17), replacing Module 16's placeholder stat
// // cards. Still deliberately NOT Analytics (Module 18) — no date-range
// // filters, no exports, no per-book/per-category breakdowns. This answers
// // "what's happening right now," which is a different question than
// // Analytics' "how are we trending, and why."
// export default async function AdminDashboardPage() {
//   const [stats, series, recentLeads, recentDownloads, topBooks] = await Promise.all([
//     getDashboardStats(),
//     getDownloadsTimeSeries(14),
//     getRecentLeads(5),
//     getRecentDownloads(5),
//     getTopBooks(5),
//   ]);

//   const statCards = [
//     { label: "Books", value: stats.bookCount, href: "/admin/books", icon: BookText },
//     { label: "Categories", value: stats.categoryCount, href: "/admin/categories", icon: FolderTree },
//     { label: "Publishers", value: stats.companyCount, href: "/admin/companies", icon: Building2 },
//     {
//       label: "Leads",
//       value: stats.leadCount,
//       href: "/admin/leads",
//       icon: Contact,
//       delta: `+${stats.leadsThisWeek} this week`,
//     },
//     {
//       label: "Downloads",
//       value: stats.downloadCount,
//       href: "/admin/downloads",
//       icon: Download,
//       delta: `+${stats.downloadsThisWeek} this week`,
//     },
//   ];

//   return (
//     <div className="space-y-8">
//       <div>
//         <h1 className="font-display text-2xl font-bold">Dashboard</h1>
//         <p className="mt-1 text-sm text-muted-foreground">
//           Date-range filtering and exportable reports land in Module 18 (Analytics).
//         </p>
//       </div>

//       <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
//         {statCards.map((stat) => (
//           <Link key={stat.label} href={stat.href}>
//             <Card className="transition-colors hover:border-primary">
//               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                 <CardTitle className="text-sm font-medium text-muted-foreground">
//                   {stat.label}
//                 </CardTitle>
//                 <stat.icon className="h-4 w-4 text-muted-foreground" />
//               </CardHeader>
//               <CardContent>
//                 <p className="text-2xl font-bold">{stat.value}</p>
//                 {stat.delta && (
//                   <p className="mt-1 text-xs text-muted-foreground">{stat.delta}</p>
//                 )}
//               </CardContent>
//             </Card>
//           </Link>
//         ))}
//       </div>

//       <Card>
//         <CardHeader>
//           <CardTitle>Downloads, last 14 days</CardTitle>
//           <CardDescription>
//             One point per day, counted from when each download was requested.
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <DownloadsChart data={series} />
//         </CardContent>
//       </Card>

//       <div className="grid gap-6 lg:grid-cols-3">
//         <Card>
//           <CardHeader>
//             <CardTitle className="text-base">Recent Leads</CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-3">
//             {recentLeads.length === 0 && (
//               <p className="text-sm text-muted-foreground">No leads yet.</p>
//             )}
//             {recentLeads.map((lead) => (
//               <div key={lead.id} className="flex items-center justify-between gap-2 text-sm">
//                 <div className="min-w-0">
//                   <p className="truncate font-medium">{lead.fullName}</p>
//                   <p className="truncate text-xs text-muted-foreground">{lead.companyName}</p>
//                 </div>
//                 <p className="shrink-0 text-xs text-muted-foreground">
//                   {formatDistanceToNow(lead.createdAt, { addSuffix: true })}
//                 </p>
//               </div>
//             ))}
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader>
//             <CardTitle className="text-base">Recent Downloads</CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-3">
//             {recentDownloads.length === 0 && (
//               <p className="text-sm text-muted-foreground">No downloads yet.</p>
//             )}
//             {recentDownloads.map((d) => (
//               <div key={d.id} className="flex items-center justify-between gap-2 text-sm">
//                 <div className="min-w-0">
//                   <p className="truncate font-medium">{d.book.title}</p>
//                   <p className="truncate text-xs text-muted-foreground">{d.lead.fullName}</p>
//                 </div>
//                 <Badge
//                   variant={
//                     d.status === "FAILED"
//                       ? "destructive"
//                       : d.status === "DOWNLOADED" || d.status === "EMAIL_SENT"
//                         ? "default"
//                         : "secondary"
//                   }
//                 >
//                   {d.status}
//                 </Badge>
//               </div>
//             ))}
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader>
//             <CardTitle className="text-base">Top Books</CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-3">
//             {topBooks.length === 0 && (
//               <p className="text-sm text-muted-foreground">No downloads yet.</p>
//             )}
//             {topBooks.map((book, i) => (
//               <div key={book.id} className="flex items-center gap-3 text-sm">
//                 <span className="w-4 text-xs text-muted-foreground">{i + 1}</span>
//                 <div className="relative h-10 w-7 shrink-0 overflow-hidden rounded border">
//                   <Image src={book.coverImageUrl} alt={book.title} fill className="object-cover" />
//                 </div>
//                 <p className="flex-1 truncate font-medium">{book.title}</p>
//                 <span className="shrink-0 text-xs text-muted-foreground">
//                   {book.downloadCount}
//                 </span>
//               </div>
//             ))}
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// }



import Link from "next/link";
import Image from "next/image";
import { Plus } from "lucide-react";
import { getAdminBooksList } from "@/actions/admin/books";
import { BOOK_FORMAT_OPTIONS } from "@/lib/constants";
import { AdminSearchBox } from "@/components/admin/admin-search-box";
import { AdminFilterBar, AdminFilterField } from "@/components/admin/admin-filter-bar";
import { AdminStatusFilter } from "@/components/admin/admin-status-filter";
import { AdminTable } from "@/components/admin/admin-table";
import { ArchiveBookButton } from "@/components/admin/archive-book-button";
import { Pagination } from "@/components/shared/pagination";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { unstable_noStore as noStore } from "next/cache";
// Forces this page to always fetch fresh data on every request — without
// this, Next.js can sometimes serve a cached render of this route (even
// in dev mode after Fast Refresh), showing stale Stock values that don't
// match the database until a full server restart.
export const dynamic = "force-dynamic";


interface AdminBooksPageProps {
  searchParams: Promise<{ q?: string; page?: string; status?: string; format?: string }>;
}

const STATUS_VARIANT = {
  PUBLISHED: "default",
  DRAFT: "secondary",
  ARCHIVED: "outline",
} as const;

const STATUS_OPTIONS = [
  { value: "DRAFT", label: "Draft" },
  { value: "PUBLISHED", label: "Published" },
  { value: "ARCHIVED", label: "Archived" },
];

export default async function AdminBooksPage({ searchParams }: AdminBooksPageProps) {
  noStore();
  const sp = await searchParams;
  const query = sp.q || undefined;
  const page = Math.max(1, Number(sp.page) || 1);
  const status = sp.status as "DRAFT" | "PUBLISHED" | "ARCHIVED" | undefined;
  const format = sp.format as
    | "EBOOK"
    | "WHITEPAPER"
    | "REPORT"
    | "CASE_STUDY"
    | "GUIDE"
    | "DATASHEET"
    | "WEBINAR"
    | undefined;

  // const { books, totalCount, totalPages } = await getAdminBooksList({
  //   query,
  //   status,
  //   format,
  //   page,
  // });
  const { books, totalCount, totalPages } = await getAdminBooksList({
    query,
    status,
    format,
    page,
  });

  // console.log("STOCK DEBUG:", books.map((b) => ({ title: b.title, forceOutOfStock: b.forceOutOfStock })));

  function buildHref(targetPage: number) {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (sp.status) params.set("status", sp.status);
    if (sp.format) params.set("format", sp.format);
    if (targetPage > 1) params.set("page", String(targetPage));
    const qs = params.toString();
    return `/admin/books${qs ? `?${qs}` : ""}`;
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold">Books ({totalCount})</h1>
        <Button asChild>
          <Link href="/admin/books/new">
            <Plus className="h-4 w-4" />
            New Book
          </Link>
        </Button>
      </div>

      <AdminFilterBar>
        <AdminFilterField label="Search">
          <AdminSearchBox placeholder="Search books by title..." />
        </AdminFilterField>
        <AdminFilterField label="Status">
          <AdminStatusFilter options={STATUS_OPTIONS} placeholder="All statuses" paramName="status" />
        </AdminFilterField>
        <AdminFilterField label="Format">
          <AdminStatusFilter
            options={BOOK_FORMAT_OPTIONS.map((o) => ({ value: o.value, label: o.label }))}
            placeholder="All formats"
            paramName="format"
          />
        </AdminFilterField>
      </AdminFilterBar>

      <AdminTable
        rows={books}
        rowKey={(b) => b.id}
        emptyMessage="No books match your filters."
        columns={[
          {
            header: "Cover",
            cell: (b) => (
              <div className="relative h-14 w-10 overflow-hidden rounded border">
                <Image src={b.coverImageUrl} alt={b.title} fill className="object-cover" />
              </div>
            ),
          },
          {
            header: "Title",
            cell: (b) => (
              <Link href={`/admin/books/${b.id}`} className="font-medium hover:underline">
                {b.title}
              </Link>
            ),
          },
          { header: "Publisher", cell: (b) => b.company.name },
          {
            header: "Status",
            cell: (b) => <Badge variant={STATUS_VARIANT[b.status]}>{b.status}</Badge>,
          },
          {
            header: "Stock",
            cell: (b) => {
              if (b.forceOutOfStock) {
                return (
                  <Badge variant="destructive" className="gap-1">
                    Out of Stock <span className="opacity-75">(Manual)</span>
                  </Badge>
                );
              }
              if (b.downloadLimit == null) {
                return <span className="text-muted-foreground">{b.downloadCount} / Unlimited</span>;
              }
              const remaining = b.downloadLimit - b.downloadCount;
              if (remaining <= 0) {
                return <Badge variant="destructive">Out of Stock</Badge>;
              }
              return (
                <span>
                  {b.downloadCount} / {b.downloadLimit}{" "}
                  <span className="text-muted-foreground">({remaining} left)</span>
                </span>
              );
            },
          },
          {
            header: "",
            className: "text-right",
            cell: (b) => (
              <div className="flex justify-end gap-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/admin/books/${b.id}`}>Edit</Link>
                </Button>
                {b.status !== "ARCHIVED" && <ArchiveBookButton bookId={b.id} />}
              </div>
            ),
          },
        ]}
      />

      <Pagination currentPage={page} totalPages={totalPages} buildHref={buildHref} />
    </div>
  );
}