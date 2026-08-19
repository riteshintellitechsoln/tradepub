// "use server";

// import { revalidatePath } from "next/cache";
// import type { Prisma } from "@prisma/client";
// import { db } from "@/lib/db";
// import { requireAdmin } from "@/lib/session";
// import { bookSchema, type BookFormValues } from "@/lib/validations/book";

// type ActionResult = { success: true; id: string } | { success: false; error: string };

// function parseTags(raw: string): string[] {
//   return raw
//     .split(",")
//     .map((tag) => tag.trim())
//     .filter(Boolean);
// }

// // Backs Admin > Books' list view. Search-by-title only for now — good
// // enough for a catalog in the dozens/low hundreds; a real full-text index
// // would be the next step if the catalog grows much larger than that.
// export async function getAdminBooksList({
//   query,
//   page = 1,
//   perPage = 20,
// }: {
//   query?: string;
//   page?: number;
//   perPage?: number;
// }) {
//   await requireAdmin();

//   const where: Prisma.BookWhereInput = query
//     ? { title: { contains: query, mode: "insensitive" } }
//     : {};

//   const [books, totalCount] = await Promise.all([
//     db.book.findMany({
//       where,
//       orderBy: { createdAt: "desc" },
//       skip: (page - 1) * perPage,
//       take: perPage,
//       select: {
//         id: true,
//         title: true,
//         slug: true,
//         coverImageUrl: true,
//         status: true,
//         downloadCount: true,
//         company: { select: { name: true } },
//       },
//     }),
//     db.book.count({ where }),
//   ]);

//   return { books, totalCount, totalPages: Math.max(1, Math.ceil(totalCount / perPage)) };
// }

// export async function createBook(input: BookFormValues): Promise<ActionResult> {
//   const session = await requireAdmin();
//   const parsed = bookSchema.safeParse(input);
//   if (!parsed.success) {
//     return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid form" };
//   }

//   const existing = await db.book.findUnique({ where: { slug: parsed.data.slug } });
//   if (existing) {
//     return { success: false, error: "That slug is already in use by another book." };
//   }

//   const { categoryIds, tags, ...bookFields } = parsed.data;

//   const book = await db.book.create({
//     data: {
//       ...bookFields,
//       tags: parseTags(tags),
//       createdByAdminId: session.user.id,
//       publishedAt: parsed.data.status === "PUBLISHED" ? new Date() : null,
//       categories: {
//         create: categoryIds.map((categoryId) => ({ categoryId })),
//       },
//     },
//   });

//   revalidatePath("/admin/books");
//   revalidatePath("/"); // Home's Featured/Latest/Trending sections may include this book
//   revalidatePath("/category");

//   return { success: true, id: book.id };
// }

// export async function updateBook(id: string, input: BookFormValues): Promise<ActionResult> {
//   await requireAdmin();
//   const parsed = bookSchema.safeParse(input);
//   if (!parsed.success) {
//     return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid form" };
//   }

//   const existing = await db.book.findUnique({ where: { slug: parsed.data.slug } });
//   if (existing && existing.id !== id) {
//     return { success: false, error: "That slug is already in use by another book." };
//   }

//   const current = await db.book.findUnique({ where: { id }, select: { publishedAt: true } });
//   const { categoryIds, tags, ...bookFields } = parsed.data;

//   // Replacing all BookCategory rows (delete + recreate) rather than diffing
//   // is simpler and correct here — a book typically has a handful of
//   // categories, so there's no real cost to just rebuilding the set.
//   await db.$transaction([
//     db.bookCategory.deleteMany({ where: { bookId: id } }),
//     db.book.update({
//       where: { id },
//       data: {
//         ...bookFields,
//         tags: parseTags(tags),
//         // Set publishedAt the first time a book goes PUBLISHED; never
//         // overwrite it on every edit afterward.
//         publishedAt:
//           parsed.data.status === "PUBLISHED" ? (current?.publishedAt ?? new Date()) : current?.publishedAt,
//         categories: {
//           create: categoryIds.map((categoryId) => ({ categoryId })),
//         },
//       },
//     }),
//   ]);

//   revalidatePath("/admin/books");
//   revalidatePath(`/book/${parsed.data.slug}`);
//   revalidatePath("/");
//   revalidatePath("/category");

//   return { success: true, id };
// }

// // A "delete" here ARCHIVES the book rather than removing the row. Book
// // deletion in Prisma cascades to Download (onDelete: Cascade in the
// // schema) — a hard delete would silently erase real lead/download history
// // tied to that book. Archiving keeps everything intact while removing it
// // from every public listing (getBooks/getBooksByCategory/etc. all filter
// // on status: "PUBLISHED").
// export async function archiveBook(id: string): Promise<ActionResult> {
//   await requireAdmin();
//   await db.book.update({ where: { id }, data: { status: "ARCHIVED" } });

//   revalidatePath("/admin/books");
//   revalidatePath("/");
//   revalidatePath("/category");

//   return { success: true, id };
// }

 

"use server";

import { revalidatePath } from "next/cache";
import type { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/session";
import { bookSchema, type BookFormValues } from "@/lib/validations/book";

type ActionResult = { success: true; id: string } | { success: false; error: string };

function parseTags(raw: string): string[] {
  return raw
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

export async function getAdminBooksList({
  query,
  status,
  format,
  page = 1,
  perPage = 20,
}: {
  query?: string;
  status?: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  format?: "EBOOK" | "WHITEPAPER" | "REPORT" | "CASE_STUDY" | "GUIDE" | "DATASHEET" | "WEBINAR";
  page?: number;
  perPage?: number;
}) {
  await requireAdmin();

  const where: Prisma.BookWhereInput = {
    ...(query ? { title: { contains: query, mode: "insensitive" } } : {}),
    ...(status ? { status } : {}),
    ...(format ? { format } : {}),
  };

  const [books, totalCount] = await Promise.all([
    db.book.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * perPage,
      take: perPage,
      select: {
        id: true,
        title: true,
        slug: true,
        coverImageUrl: true,
        status: true,
        downloadCount: true,
        downloadLimit: true,
        forceOutOfStock: true,
        company: { select: { name: true } },
      },
    }),
    db.book.count({ where }),
  ]);

  return { books, totalCount, totalPages: Math.max(1, Math.ceil(totalCount / perPage)) };
}

export async function createBook(input: BookFormValues): Promise<ActionResult> {
  const session = await requireAdmin();
  const parsed = bookSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid form" };
  }

  const existing = await db.book.findUnique({ where: { slug: parsed.data.slug } });
  if (existing) {
    return { success: false, error: "That slug is already in use by another book." };
  }

  const { categoryIds, tags, ...bookFields } = parsed.data;

  const book = await db.book.create({
    data: {
      ...bookFields,
      tags: parseTags(tags),
      createdByAdminId: session.user.id,
      publishedAt: parsed.data.status === "PUBLISHED" ? new Date() : null,
      categories: {
        create: categoryIds.map((categoryId) => ({ categoryId })),
      },
    },
  });

  revalidatePath("/admin/books");
  revalidatePath("/");
  revalidatePath("/category");

  return { success: true, id: book.id };
}

export async function updateBook(id: string, input: BookFormValues): Promise<ActionResult> {
  await requireAdmin();
  const parsed = bookSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid form" };
  }

  const existing = await db.book.findUnique({ where: { slug: parsed.data.slug } });
  if (existing && existing.id !== id) {
    return { success: false, error: "That slug is already in use by another book." };
  }

  const current = await db.book.findUnique({ where: { id }, select: { publishedAt: true } });
  const { categoryIds, tags, ...bookFields } = parsed.data;

  await db.$transaction([
    db.bookCategory.deleteMany({ where: { bookId: id } }),
    db.book.update({
      where: { id },
      data: {
        ...bookFields,
        tags: parseTags(tags),
        publishedAt:
          parsed.data.status === "PUBLISHED" ? (current?.publishedAt ?? new Date()) : current?.publishedAt,
        categories: {
          create: categoryIds.map((categoryId) => ({ categoryId })),
        },
      },
    }),
  ]);

  revalidatePath("/admin/books");
  revalidatePath(`/book/${parsed.data.slug}`);
  revalidatePath("/");
  revalidatePath("/category");

  return { success: true, id };
}

export async function archiveBook(id: string): Promise<ActionResult> {
  await requireAdmin();
  await db.book.update({ where: { id }, data: { status: "ARCHIVED" } });

  revalidatePath("/admin/books");
  revalidatePath("/");
  revalidatePath("/category");

  return { success: true, id };
}
