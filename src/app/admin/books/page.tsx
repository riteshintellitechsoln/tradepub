import Link from "next/link";
import Image from "next/image";
import { Plus } from "lucide-react";
import { getAdminBooksList } from "@/actions/admin/books";
import { AdminSearchBox } from "@/components/admin/admin-search-box";
import { AdminTable } from "@/components/admin/admin-table";
import { ArchiveBookButton } from "@/components/admin/archive-book-button";
import { Pagination } from "@/components/shared/pagination";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface AdminBooksPageProps {
  searchParams: Promise<{ q?: string; page?: string }>;
}

const STATUS_VARIANT = {
  PUBLISHED: "default",
  DRAFT: "secondary",
  ARCHIVED: "outline",
} as const;

export default async function AdminBooksPage({ searchParams }: AdminBooksPageProps) {
  const sp = await searchParams;
  const query = sp.q || undefined;
  const page = Math.max(1, Number(sp.page) || 1);

  const { books, totalCount, totalPages } = await getAdminBooksList({ query, page });

  function buildHref(targetPage: number) {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
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

      <div className="mb-4">
        <AdminSearchBox placeholder="Search books by title..." />
      </div>

      <AdminTable
        rows={books}
        rowKey={(b) => b.id}
        emptyMessage="No books match your search."
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
          { header: "Downloads", cell: (b) => b.downloadCount },
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
