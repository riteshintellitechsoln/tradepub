// import Link from "next/link";
// import Image from "next/image";
// import { Plus } from "lucide-react";
// import { getAdminBooksList } from "@/actions/admin/books";
// import { AdminSearchBox } from "@/components/admin/admin-search-box";
// import { AdminTable } from "@/components/admin/admin-table";
// import { ArchiveBookButton } from "@/components/admin/archive-book-button";
// import { Pagination } from "@/components/shared/pagination";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";

// interface AdminBooksPageProps {
//   searchParams: Promise<{ q?: string; page?: string }>;
// }

// const STATUS_VARIANT = {
//   PUBLISHED: "default",
//   DRAFT: "secondary",
//   ARCHIVED: "outline",
// } as const;

// export default async function AdminBooksPage({ searchParams }: AdminBooksPageProps) {
//   const sp = await searchParams;
//   const query = sp.q || undefined;
//   const page = Math.max(1, Number(sp.page) || 1);

//   const { books, totalCount, totalPages } = await getAdminBooksList({ query, page });

//   function buildHref(targetPage: number) {
//     const params = new URLSearchParams();
//     if (query) params.set("q", query);
//     if (targetPage > 1) params.set("page", String(targetPage));
//     const qs = params.toString();
//     return `/admin/books${qs ? `?${qs}` : ""}`;
//   }

//   return (
//     <div>
//       <div className="mb-6 flex items-center justify-between">
//         <h1 className="font-display text-2xl font-bold">Books ({totalCount})</h1>
//         <Button asChild>
//           <Link href="/admin/books/new">
//             <Plus className="h-4 w-4" />
//             New Book
//           </Link>
//         </Button>
//       </div>

//       <div className="mb-4">
//         <AdminSearchBox placeholder="Search books by title..." />
//       </div>

//       <AdminTable
//         rows={books}
//         rowKey={(b) => b.id}
//         emptyMessage="No books match your search."
//         columns={[
//           {
//             header: "Cover",
//             cell: (b) => (
//               <div className="relative h-14 w-10 overflow-hidden rounded border">
//                 <Image src={b.coverImageUrl} alt={b.title} fill className="object-cover" />
//               </div>
//             ),
//           },
//           {
//             header: "Title",
//             cell: (b) => (
//               <Link href={`/admin/books/${b.id}`} className="font-medium hover:underline">
//                 {b.title}
//               </Link>
//             ),
//           },
//           { header: "Publisher", cell: (b) => b.company.name },
//           {
//             header: "Status",
//             cell: (b) => <Badge variant={STATUS_VARIANT[b.status]}>{b.status}</Badge>,
//           },
//           { header: "Downloads", cell: (b) => b.downloadCount },
//           {
//             header: "",
//             className: "text-right",
//             cell: (b) => (
//               <div className="flex justify-end gap-2">
//                 <Button variant="ghost" size="sm" asChild>
//                   <Link href={`/admin/books/${b.id}`}>Edit</Link>
//                 </Button>
//                 {b.status !== "ARCHIVED" && <ArchiveBookButton bookId={b.id} />}
//               </div>
//             ),
//           },
//         ]}
//       />

//       <Pagination currentPage={page} totalPages={totalPages} buildHref={buildHref} />
//     </div>
//   );
// }


// import Link from "next/link";
// import Image from "next/image";
// import { Plus } from "lucide-react";
// import { getAdminBooksList } from "@/actions/admin/books";
// import { AdminSearchBox } from "@/components/admin/admin-search-box";
// import { AdminTable } from "@/components/admin/admin-table";
// import { ArchiveBookButton } from "@/components/admin/archive-book-button";
// import { Pagination } from "@/components/shared/pagination";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";

// interface AdminBooksPageProps {
//   searchParams: Promise<{ q?: string; page?: string }>;
// }

// const STATUS_VARIANT = {
//   PUBLISHED: "default",
//   DRAFT: "secondary",
//   ARCHIVED: "outline",
// } as const;

// export default async function AdminBooksPage({ searchParams }: AdminBooksPageProps) {
//   const sp = await searchParams;
//   const query = sp.q || undefined;
//   const page = Math.max(1, Number(sp.page) || 1);

//   const { books, totalCount, totalPages } = await getAdminBooksList({ query, page });

//   function buildHref(targetPage: number) {
//     const params = new URLSearchParams();
//     if (query) params.set("q", query);
//     if (targetPage > 1) params.set("page", String(targetPage));
//     const qs = params.toString();
//     return `/admin/books${qs ? `?${qs}` : ""}`;
//   }

//   return (
//     <div>
//       <div className="mb-6 flex items-center justify-between">
//         <h1 className="font-display text-2xl font-bold">Books ({totalCount})</h1>
//         <Button asChild>
//           <Link href="/admin/books/new">
//             <Plus className="h-4 w-4" />
//             New Book
//           </Link>
//         </Button>
//       </div>

//       <div className="mb-4">
//         <AdminSearchBox placeholder="Search books by title..." />
//       </div>

//       <AdminTable
//         rows={books}
//         rowKey={(b) => b.id}
//         emptyMessage="No books match your search."
//         columns={[
//           {
//             header: "Cover",
//             cell: (b) => (
//               <div className="relative h-14 w-10 overflow-hidden rounded border">
//                 <Image src={b.coverImageUrl} alt={b.title} fill className="object-cover" />
//               </div>
//             ),
//           },
//           {
//             header: "Title",
//             cell: (b) => (
//               <Link href={`/admin/books/${b.id}`} className="font-medium hover:underline">
//                 {b.title}
//               </Link>
//             ),
//           },
//           { header: "Publisher", cell: (b) => b.company.name },
//           {
//             header: "Status",
//             cell: (b) => <Badge variant={STATUS_VARIANT[b.status]}>{b.status}</Badge>,
//           },
//           {
//             header: "Stock",
//             cell: (b) => {
//               if (b.downloadLimit == null) {
//                 return <span className="text-muted-foreground">{b.downloadCount} / Unlimited</span>;
//               }
//               const remaining = b.downloadLimit - b.downloadCount;
//               if (remaining <= 0) {
//                 return <Badge variant="destructive">Out of Stock</Badge>;
//               }
//               return (
//                 <span>
//                   {b.downloadCount} / {b.downloadLimit}{" "}
//                   <span className="text-muted-foreground">({remaining} left)</span>
//                 </span>
//               );
//             },
//           },
//           {
//             header: "",
//             className: "text-right",
//             cell: (b) => (
//               <div className="flex justify-end gap-2">
//                 <Button variant="ghost" size="sm" asChild>
//                   <Link href={`/admin/books/${b.id}`}>Edit</Link>
//                 </Button>
//                 {b.status !== "ARCHIVED" && <ArchiveBookButton bookId={b.id} />}
//               </div>
//             ),
//           },
//         ]}
//       />

//       <Pagination currentPage={page} totalPages={totalPages} buildHref={buildHref} />
//     </div>
//   );
// }




// import Link from "next/link";
// import Image from "next/image";
// import { Plus } from "lucide-react";
// import { getAdminBooksList } from "@/actions/admin/books";
// import { BOOK_FORMAT_OPTIONS } from "@/lib/constants";
// import { AdminSearchBox } from "@/components/admin/admin-search-box";
// import { AdminStatusFilter } from "@/components/admin/admin-status-filter";
// import { AdminTable } from "@/components/admin/admin-table";
// import { ArchiveBookButton } from "@/components/admin/archive-book-button";
// import { Pagination } from "@/components/shared/pagination";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";

// interface AdminBooksPageProps {
//   searchParams: Promise<{ q?: string; page?: string; status?: string; format?: string }>;
// }

// const STATUS_VARIANT = {
//   PUBLISHED: "default",
//   DRAFT: "secondary",
//   ARCHIVED: "outline",
// } as const;

// const STATUS_OPTIONS = [
//   { value: "DRAFT", label: "Draft" },
//   { value: "PUBLISHED", label: "Published" },
//   { value: "ARCHIVED", label: "Archived" },
// ];

// export default async function AdminBooksPage({ searchParams }: AdminBooksPageProps) {
//   const sp = await searchParams;
//   const query = sp.q || undefined;
//   const page = Math.max(1, Number(sp.page) || 1);
//   const status = sp.status as "DRAFT" | "PUBLISHED" | "ARCHIVED" | undefined;
//   const format = sp.format as
//     | "EBOOK"
//     | "WHITEPAPER"
//     | "REPORT"
//     | "CASE_STUDY"
//     | "GUIDE"
//     | "DATASHEET"
//     | "WEBINAR"
//     | undefined;

//   const { books, totalCount, totalPages } = await getAdminBooksList({
//     query,
//     status,
//     format,
//     page,
//   });

//   function buildHref(targetPage: number) {
//     const params = new URLSearchParams();
//     if (query) params.set("q", query);
//     if (sp.status) params.set("status", sp.status);
//     if (sp.format) params.set("format", sp.format);
//     if (targetPage > 1) params.set("page", String(targetPage));
//     const qs = params.toString();
//     return `/admin/books${qs ? `?${qs}` : ""}`;
//   }

//   return (
//     <div>
//       <div className="mb-6 flex items-center justify-between">
//         <h1 className="font-display text-2xl font-bold">Books ({totalCount})</h1>
//         <Button asChild>
//           <Link href="/admin/books/new">
//             <Plus className="h-4 w-4" />
//             New Book
//           </Link>
//         </Button>
//       </div>

//       <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
//         <AdminSearchBox placeholder="Search books by title..." />
//         <AdminStatusFilter options={STATUS_OPTIONS} placeholder="All statuses" paramName="status" />
//         <AdminStatusFilter
//           options={BOOK_FORMAT_OPTIONS.map((o) => ({ value: o.value, label: o.label }))}
//           placeholder="All formats"
//           paramName="format"
//         />
//       </div>

//       <AdminTable
//         rows={books}
//         rowKey={(b) => b.id}
//         emptyMessage="No books match your filters."
//         columns={[
//           {
//             header: "Cover",
//             cell: (b) => (
//               <div className="relative h-14 w-10 overflow-hidden rounded border">
//                 <Image src={b.coverImageUrl} alt={b.title} fill className="object-cover" />
//               </div>
//             ),
//           },
//           {
//             header: "Title",
//             cell: (b) => (
//               <Link href={`/admin/books/${b.id}`} className="font-medium hover:underline">
//                 {b.title}
//               </Link>
//             ),
//           },
//           { header: "Publisher", cell: (b) => b.company.name },
//           {
//             header: "Status",
//             cell: (b) => <Badge variant={STATUS_VARIANT[b.status]}>{b.status}</Badge>,
//           },
//           {
//             header: "Stock",
//             cell: (b) => {
//               if (b.downloadLimit == null) {
//                 return <span className="text-muted-foreground">{b.downloadCount} / Unlimited</span>;
//               }
//               const remaining = b.downloadLimit - b.downloadCount;
//               if (remaining <= 0) {
//                 return <Badge variant="destructive">Out of Stock</Badge>;
//               }
//               return (
//                 <span>
//                   {b.downloadCount} / {b.downloadLimit}{" "}
//                   <span className="text-muted-foreground">({remaining} left)</span>
//                 </span>
//               );
//             },
//           },
//           {
//             header: "",
//             className: "text-right",
//             cell: (b) => (
//               <div className="flex justify-end gap-2">
//                 <Button variant="ghost" size="sm" asChild>
//                   <Link href={`/admin/books/${b.id}`}>Edit</Link>
//                 </Button>
//                 {b.status !== "ARCHIVED" && <ArchiveBookButton bookId={b.id} />}
//               </div>
//             ),
//           },
//         ]}
//       />

//       <Pagination currentPage={page} totalPages={totalPages} buildHref={buildHref} />
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

  const { books, totalCount, totalPages } = await getAdminBooksList({
    query,
    status,
    format,
    page,
  });

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
              // A manual override always wins over the computed stock value.
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
