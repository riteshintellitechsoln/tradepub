import { Suspense } from "react";
import type { Metadata } from "next";
import type { BookFormat } from "@prisma/client";

import { getBooks, getPublishingCompanies } from "@/actions/books";
import { getActiveCategories } from "@/actions/categories";
import { SearchFilterBar } from "@/components/books/search-filter-bar";
import { BookGrid } from "@/components/books/book-grid";
import { BookCard } from "@/components/books/book-card";
import { Pagination } from "@/components/shared/pagination";
import { EmptyState } from "@/components/shared/empty-state";
import type { SortOption } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Search",
  description: "Search every ebook, whitepaper, and report on TradeHub.",
};

interface SearchPageProps {
  searchParams: Promise<{
    q?: string;
    category?: string;
    format?: string;
    company?: string;
    sort?: string;
    page?: string;
  }>;
}

// With no query and no filters at all, this page just becomes "browse
// everything, newest first" — a reasonable default rather than an empty
// state, since there's no other single page that lists every book across
// every category.
export default async function SearchPage({ searchParams }: SearchPageProps) {
  const sp = await searchParams;

  const query = sp.q?.trim() || undefined;
  const categorySlug = sp.category || undefined;
  const format = (sp.format as BookFormat) || undefined;
  const companyId = sp.company || undefined;
  const sort = (sp.sort as SortOption) || "newest";
  const page = Math.max(1, Number(sp.page) || 1);

  const [{ books, totalCount, totalPages }, categories, companies] = await Promise.all([
    getBooks({ query, categorySlug, format, companyId, sort, page }),
    getActiveCategories(),
    getPublishingCompanies(),
  ]);

  function buildHref(targetPage: number) {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (categorySlug) params.set("category", categorySlug);
    if (format) params.set("format", format);
    if (companyId) params.set("company", companyId);
    if (sort !== "newest") params.set("sort", sort);
    if (targetPage > 1) params.set("page", String(targetPage));
    const qs = params.toString();
    return `/search${qs ? `?${qs}` : ""}`;
  }

  return (
    <div className="container py-12">
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-seal">Search</p>
        <h1 className="mt-1 font-display text-3xl font-bold sm:text-4xl">
          {query ? `Results for "${query}"` : "Search all resources"}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {totalCount} resource{totalCount === 1 ? "" : "s"}
        </p>
      </div>

      {/* useSearchParams inside SearchFilterBar requires a Suspense boundary */}
      <Suspense>
        <SearchFilterBar categories={categories} companies={companies} />
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
            title="No resources found"
            description="Try a different search term or clear a filter."
          />
        )}
      </div>

      <Pagination currentPage={page} totalPages={totalPages} buildHref={buildHref} />
    </div>
  );
}
