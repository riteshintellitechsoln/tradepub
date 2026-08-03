import { Suspense } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { BookFormat } from "@prisma/client";

import { getCategoryBySlug } from "@/actions/categories";
import { getBooksByCategory, getCompaniesInCategory } from "@/actions/books";
import { CategoryFilterBar } from "@/components/categories/category-filter-bar";
import { BookGrid } from "@/components/books/book-grid";
import { BookCard } from "@/components/books/book-card";
import { Pagination } from "@/components/shared/pagination";
import { EmptyState } from "@/components/shared/empty-state";
import type { SortOption } from "@/lib/constants";

interface CategoryDetailPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{
    page?: string;
    format?: string;
    company?: string;
    q?: string;
    sort?: string;
  }>;
}

export async function generateMetadata({
  params,
}: CategoryDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) return {};

  return {
    title: category.name,
    description:
      category.description ??
      `Free ${category.name} ebooks, whitepapers, and reports — no paywall, just a business email.`,
  };
}

// Every control on this page (search, format, publisher, sort, page number)
// is read straight from `searchParams` — the URL IS the state. That's what
// makes every filtered/sorted/paginated view here shareable and
// bookmarkable, and it's why CategoryFilterBar (Module 10) never holds its
// own "current filters" state — it just writes to the URL and lets this
// Server Component re-fetch.
export default async function CategoryDetailPage({
  params,
  searchParams,
}: CategoryDetailPageProps) {
  const { slug } = await params;
  const sp = await searchParams;

  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  const page = Math.max(1, Number(sp.page) || 1);
  const format = (sp.format as BookFormat) || undefined;
  const companyId = sp.company || undefined;
  const query = sp.q || undefined;
  const sort = (sp.sort as SortOption) || "newest";

  const [{ books, totalCount, totalPages }, companies] = await Promise.all([
    getBooksByCategory({ slug, page, format, companyId, query, sort }),
    getCompaniesInCategory(slug),
  ]);

  function buildHref(targetPage: number) {
    const urlParams = new URLSearchParams();
    if (format) urlParams.set("format", format);
    if (companyId) urlParams.set("company", companyId);
    if (query) urlParams.set("q", query);
    if (sort !== "newest") urlParams.set("sort", sort);
    if (targetPage > 1) urlParams.set("page", String(targetPage));
    const qs = urlParams.toString();
    return `/category/${slug}${qs ? `?${qs}` : ""}`;
  }

  return (
    <div className="container py-12">
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-seal">Category</p>
        <h1 className="mt-1 font-display text-3xl font-bold sm:text-4xl">{category.name}</h1>
        {category.description && (
          <p className="mt-2 max-w-2xl text-muted-foreground">{category.description}</p>
        )}
        <p className="mt-2 text-sm text-muted-foreground">
          {totalCount} resource{totalCount === 1 ? "" : "s"}
        </p>
      </div>

      {/* useSearchParams inside CategoryFilterBar requires a Suspense boundary */}
      <Suspense>
        <CategoryFilterBar companies={companies} />
      </Suspense>

      <div className="mt-8">
        {books.length > 0 ? (
          <BookGrid>
            {books.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </BookGrid>
        ) : (
          <EmptyState
            title="No resources match your filters"
            description="Try clearing a filter or searching a different term."
          />
        )}
      </div>

      <Pagination currentPage={page} totalPages={totalPages} buildHref={buildHref} />
    </div>
  );
}
