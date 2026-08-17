// import type { Prisma, BookFormat } from "@prisma/client";
// import { db } from "@/lib/db";
// import type { BookCardData } from "@/types";
// import type { SortOption } from "@/lib/constants";

// // Shared `select` shape so every home-page query returns exactly what
// // BookCard needs — nothing more (no pdfFileKey, no raw viewCount) leaks to
// // the client. Reused by Module 10 (Categories) and Module 11 (Books) too.
// const bookCardSelect = {
//   id: true,
//   slug: true,
//   title: true,
//   shortDescription: true,
//   coverImageUrl: true,
//   isFeatured: true,
//   isTrending: true,
//   publishedAt: true,
//   company: { select: { name: true, logoUrl: true } },
//   categories: {
//     select: { category: { select: { name: true, slug: true } } },
//     take: 1,
//   },
// } satisfies Prisma.BookSelect;

// export async function getFeaturedBooks(limit = 4): Promise<BookCardData[]> {
//   return db.book.findMany({
//     where: { status: "PUBLISHED", isFeatured: true },
//     orderBy: { publishedAt: "desc" },
//     take: limit,
//     select: bookCardSelect,
//   });
// }

// export async function getLatestBooks(limit = 8): Promise<BookCardData[]> {
//   return db.book.findMany({
//     where: { status: "PUBLISHED" },
//     orderBy: { publishedAt: "desc" },
//     take: limit,
//     select: bookCardSelect,
//   });
// }

// export async function getTrendingBooks(limit = 4): Promise<BookCardData[]> {
//   return db.book.findMany({
//     where: { status: "PUBLISHED", isTrending: true },
//     orderBy: [{ downloadCount: "desc" }, { publishedAt: "desc" }],
//     take: limit,
//     select: bookCardSelect,
//   });
// }

// interface GetBooksParams {
//   page?: number;
//   perPage?: number;
//   format?: BookFormat;
//   companyId?: string;
//   categorySlug?: string;
//   query?: string;
//   sort?: SortOption;
// }

// // The general-purpose book query: every filter is optional. Powers /search
// // (Module 11) and GET /api/books directly; getBooksByCategory (below) is
// // just this with `categorySlug` pinned, so /category/[slug] (Module 10)
// // didn't need to change at all when this was generalized.
// export async function getBooks({
//   page = 1,
//   perPage = 12,
//   format,
//   companyId,
//   categorySlug,
//   query,
//   sort = "newest",
// }: GetBooksParams): Promise<{
//   books: BookCardData[];
//   totalCount: number;
//   totalPages: number;
// }> {
//   const where: Prisma.BookWhereInput = {
//     status: "PUBLISHED",
//     ...(categorySlug ? { categories: { some: { category: { slug: categorySlug } } } } : {}),
//     ...(format ? { format } : {}),
//     ...(companyId ? { companyId } : {}),
//     ...(query
//       ? {
//           OR: [
//             { title: { contains: query, mode: "insensitive" } },
//             { description: { contains: query, mode: "insensitive" } },
//           ],
//         }
//       : {}),
//   };

//   const orderBy: Prisma.BookOrderByWithRelationInput =
//     sort === "popular"
//       ? { downloadCount: "desc" }
//       : sort === "title"
//         ? { title: "asc" }
//         : { publishedAt: "desc" };

//   const [books, totalCount] = await Promise.all([
//     db.book.findMany({
//       where,
//       orderBy,
//       skip: (page - 1) * perPage,
//       take: perPage,
//       select: bookCardSelect,
//     }),
//     db.book.count({ where }),
//   ]);

//   return {
//     books,
//     totalCount,
//     totalPages: Math.max(1, Math.ceil(totalCount / perPage)),
//   };
// }

// interface GetBooksByCategoryParams {
//   slug: string;
//   page?: number;
//   perPage?: number;
//   format?: BookFormat;
//   companyId?: string;
//   query?: string;
//   sort?: SortOption;
// }

// // Powers /category/[slug] (Module 10). Kept as its own named function (rather
// // than making every call site pass `categorySlug`) since "books in THIS
// // category" reads more clearly at the call site than a generic filter bag.
// export async function getBooksByCategory({
//   slug,
//   ...rest
// }: GetBooksByCategoryParams) {
//   return getBooks({ ...rest, categorySlug: slug });
// }

// // Populates the "Publisher" filter on /search — every publisher with at
// // least one published book, not scoped to any category.
// export async function getPublishingCompanies() {
//   return db.company.findMany({
//     where: { books: { some: { status: "PUBLISHED" } } },
//     select: { id: true, name: true },
//     orderBy: { name: "asc" },
//   });
// }

// // Populates the "Publisher" filter dropdown with only publishers that
// // actually have a published book in this category — never an empty-result
// // filter option.
// export async function getCompaniesInCategory(slug: string) {
//   return db.company.findMany({
//     where: {
//       books: {
//         some: {
//           status: "PUBLISHED",
//           categories: { some: { category: { slug } } },
//         },
//       },
//     },
//     select: { id: true, name: true },
//     orderBy: { name: "asc" },
//   });
// }

// // Full detail for /book/[slug] (Module 12) — everything the page needs and
// // nothing it doesn't (still no pdfFileKey; that only ever gets touched
// // server-side inside the Download flow, Module 13).
// export async function getBookBySlug(slug: string) {
//   return db.book.findUnique({
//     where: { slug },
//     select: {
//       id: true,
//       slug: true,
//       title: true,
//       description: true,
//       coverImageUrl: true,
//       pages: true,
//       language: true,
//       format: true,
//       tags: true,
//       status: true,
//       publishedAt: true,
//       company: {
//         select: { id: true, name: true, slug: true, logoUrl: true, website: true },
//       },
//       categories: {
//         select: { category: { select: { id: true, name: true, slug: true } } },
//       },
//     },
//   });
// }

// export type BookDetail = NonNullable<Awaited<ReturnType<typeof getBookBySlug>>>;

// // "Related Books" on the detail page — anything sharing at least one
// // category, ranked by popularity rather than recency, since "what else do
// // people in this space download" is a better related-content signal than
// // "what was published most recently."
// export async function getRelatedBooks({
//   bookId,
//   categorySlugs,
//   limit = 4,
// }: {
//   bookId: string;
//   categorySlugs: string[];
//   limit?: number;
// }): Promise<BookCardData[]> {
//   if (categorySlugs.length === 0) return [];

//   return db.book.findMany({
//     where: {
//       id: { not: bookId },
//       status: "PUBLISHED",
//       categories: { some: { category: { slug: { in: categorySlugs } } } },
//     },
//     orderBy: { downloadCount: "desc" },
//     take: limit,
//     select: bookCardSelect,
//   });
// }

// // Fire-and-forget from the detail page — a failed analytics increment
// // should never break the page render, hence the swallowed catch at the
// // call site rather than here.
// export async function incrementBookViewCount(bookId: string) {
//   await db.book.update({
//     where: { id: bookId },
//     data: { viewCount: { increment: 1 } },
//   });
// }

// // export async function getFormatCounts() {
// //   const rows = await db.book.groupBy({
// //     by: ["format"],
// //     where: { status: "PUBLISHED" },
// //     _count: { _all: true },
// //   });

// //   return rows
// //     .map((row) => ({ format: row.format, count: row._count._all }))
// //     .sort((a, b) => b.count - a.count);
// // }

// // A lean projection for the Download flow (Module 13) — just enough to
// // render "here's what you're about to get" on /download and /thank-you.
// // Deliberately narrower than getBookBySlug: no description, no tags, no
// // pdfFileKey — the download page doesn't need them and shouldn't fetch them.
// export async function getBookPreview(slug: string) {
//   const book = await db.book.findUnique({
//     where: { slug, status: "PUBLISHED" },
//     select: {
//       id: true,
//       slug: true,
//       title: true,
//       coverImageUrl: true,
//       company: { select: { name: true } },
//     },
//   });
//   if (!book) return null;

//   return {
//     id: book.id,
//     slug: book.slug,
//     title: book.title,
//     coverImageUrl: book.coverImageUrl,
//     companyName: book.company.name,
//   };
// }

// export type BookPreview = NonNullable<Awaited<ReturnType<typeof getBookPreview>>>;
"use server";


import type { Prisma, BookFormat } from "@prisma/client";
import { db } from "@/lib/db";
import type { BookCardData } from "@/types";
import type { SortOption } from "@/lib/constants";

const bookCardSelect = {
  id: true,
  slug: true,
  title: true,
  shortDescription: true,
  coverImageUrl: true,
  isFeatured: true,
  isTrending: true,
  publishedAt: true,
  company: { select: { name: true, logoUrl: true } },
  categories: {
    select: { category: { select: { name: true, slug: true } } },
    take: 1,
  },
} satisfies Prisma.BookSelect;

export async function getFeaturedBooks(limit = 4): Promise<BookCardData[]> {
  return db.book.findMany({
    where: { status: "PUBLISHED", isFeatured: true },
    orderBy: { publishedAt: "desc" },
    take: limit,
    select: bookCardSelect,
  });
}

export async function getLatestBooks(limit = 8): Promise<BookCardData[]> {
  return db.book.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { publishedAt: "desc" },
    take: limit,
    select: bookCardSelect,
  });
}

export async function getTrendingBooks(limit = 4): Promise<BookCardData[]> {
  return db.book.findMany({
    where: { status: "PUBLISHED", isTrending: true },
    orderBy: [{ downloadCount: "desc" }, { publishedAt: "desc" }],
    take: limit,
    select: bookCardSelect,
  });
}

interface GetBooksParams {
  page?: number;
  perPage?: number;
  format?: BookFormat;
  companyId?: string;
  categorySlug?: string;
  query?: string;
  sort?: SortOption;
}

export async function getBooks({
  page = 1,
  perPage = 12,
  format,
  companyId,
  categorySlug,
  query,
  sort = "newest",
}: GetBooksParams): Promise<{
  books: BookCardData[];
  totalCount: number;
  totalPages: number;
}> {
  const where: Prisma.BookWhereInput = {
    status: "PUBLISHED",
    ...(categorySlug ? { categories: { some: { category: { slug: categorySlug } } } } : {}),
    ...(format ? { format } : {}),
    ...(companyId ? { companyId } : {}),
    ...(query
      ? {
          OR: [
            { title: { contains: query, mode: "insensitive" } },
            { description: { contains: query, mode: "insensitive" } },
          ],
        }
      : {}),
  };

  const orderBy: Prisma.BookOrderByWithRelationInput =
    sort === "popular"
      ? { downloadCount: "desc" }
      : sort === "title"
        ? { title: "asc" }
        : { publishedAt: "desc" };

  const [books, totalCount] = await Promise.all([
    db.book.findMany({
      where,
      orderBy,
      skip: (page - 1) * perPage,
      take: perPage,
      select: bookCardSelect,
    }),
    db.book.count({ where }),
  ]);

  return {
    books,
    totalCount,
    totalPages: Math.max(1, Math.ceil(totalCount / perPage)),
  };
}

interface GetBooksByCategoryParams {
  slug: string;
  page?: number;
  perPage?: number;
  format?: BookFormat;
  companyId?: string;
  query?: string;
  sort?: SortOption;
}

export async function getBooksByCategory({
  slug,
  ...rest
}: GetBooksByCategoryParams) {
  return getBooks({ ...rest, categorySlug: slug });
}

export async function getPublishingCompanies() {
  return db.company.findMany({
    where: { books: { some: { status: "PUBLISHED" } } },
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });
}

export async function getCompaniesInCategory(slug: string) {
  return db.company.findMany({
    where: {
      books: {
        some: {
          status: "PUBLISHED",
          categories: { some: { category: { slug } } },
        },
      },
    },
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });
}

export async function getBookBySlug(slug: string) {
  return db.book.findUnique({
    where: { slug },
    select: {
      id: true,
      slug: true,
      title: true,
      description: true,
      coverImageUrl: true,
      pages: true,
      language: true,
      format: true,
      tags: true,
      status: true,
      publishedAt: true,
      company: {
        select: { id: true, name: true, slug: true, logoUrl: true, website: true },
      },
      categories: {
        select: { category: { select: { id: true, name: true, slug: true } } },
      },
    },
  });
}

export type BookDetail = NonNullable<Awaited<ReturnType<typeof getBookBySlug>>>;

export async function getRelatedBooks({
  bookId,
  categorySlugs,
  limit = 4,
}: {
  bookId: string;
  categorySlugs: string[];
  limit?: number;
}): Promise<BookCardData[]> {
  if (categorySlugs.length === 0) return [];

  return db.book.findMany({
    where: {
      id: { not: bookId },
      status: "PUBLISHED",
      categories: { some: { category: { slug: { in: categorySlugs } } } },
    },
    orderBy: { downloadCount: "desc" },
    take: limit,
    select: bookCardSelect,
  });
}

export async function incrementBookViewCount(bookId: string) {
  await db.book.update({
    where: { id: bookId },
    data: { viewCount: { increment: 1 } },
  });
}

export async function getBookPreview(slug: string) {
  const book = await db.book.findUnique({
    where: { slug, status: "PUBLISHED" },
    select: {
      id: true,
      slug: true,
      title: true,
      coverImageUrl: true,
      company: { select: { name: true } },
    },
  });
  if (!book) return null;

  return {
    id: book.id,
    slug: book.slug,
    title: book.title,
    coverImageUrl: book.coverImageUrl,
    companyName: book.company.name,
  };
}

export type BookPreview = NonNullable<Awaited<ReturnType<typeof getBookPreview>>>;

export async function getFormatCounts() {
  const rows = await db.book.groupBy({
    by: ["format"],
    where: { status: "PUBLISHED" },
    _count: { _all: true },
  });

  return rows
    .map((row) => ({ format: row.format, count: row._count._all }))
    .sort((a, b) => b.count - a.count);
}

export async function getBooksBySlugs(slugs: string[]): Promise<BookCardData[]> {
  if (slugs.length === 0) return [];

  const books = await db.book.findMany({
    where: { slug: { in: slugs }, status: "PUBLISHED" },
    select: bookCardSelect,
  });

  const bySlug = new Map(books.map((b) => [b.slug, b]));
  return slugs
    .map((slug) => bySlug.get(slug))
    .filter((b): b is BookCardData => Boolean(b));
}

export async function getRecommendationsForSlugs(
  slugs: string[],
  limit = 4,
): Promise<BookCardData[]> {
  if (slugs.length === 0) return [];

  const sourceBooks = await db.book.findMany({
    where: { slug: { in: slugs } },
    select: { categories: { select: { category: { select: { slug: true } } } } },
  });

  const categorySlugs = Array.from(
    new Set(sourceBooks.flatMap((b) => b.categories.map((c) => c.category.slug))),
  );

  if (categorySlugs.length === 0) return [];

  return db.book.findMany({
    where: {
      status: "PUBLISHED",
      slug: { notIn: slugs },
      categories: { some: { category: { slug: { in: categorySlugs } } } },
    },
    orderBy: { downloadCount: "desc" },
    take: limit,
    select: bookCardSelect,
  });
}