import type { MetadataRoute } from "next";
import { db } from "@/lib/db";

// Dynamic since Module 12: every published book and active category gets a
// real sitemap entry, not just the static top-level routes. Runs at request
// time (no caching directive), so it always reflects the current catalog.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  const [books, categories] = await Promise.all([
    db.book.findMany({
      where: { status: "PUBLISHED" },
      select: { slug: true, updatedAt: true },
    }),
    db.category.findMany({
      where: { isActive: true },
      select: { slug: true },
    }),
  ]);

  return [
    { url: base, changeFrequency: "daily", priority: 1 },
    { url: `${base}/category`, changeFrequency: "daily", priority: 0.8 },
    { url: `${base}/search`, changeFrequency: "weekly", priority: 0.5 },
    { url: `${base}/privacy`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${base}/terms`, changeFrequency: "yearly", priority: 0.2 },
    ...categories.map((category) => ({
      url: `${base}/category/${category.slug}`,
      changeFrequency: "daily" as const,
      priority: 0.7,
    })),
    ...books.map((book) => ({
      url: `${base}/book/${book.slug}`,
      lastModified: book.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
  ];
}
