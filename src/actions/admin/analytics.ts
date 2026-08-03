"use server";

import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/session";
import { bucketByDay } from "@/lib/analytics";

// Distinct from Module 17 (Dashboard): this module answers "how are we
// trending, and why" via a date-range picker and breakdowns by category,
// publisher, industry, and company size. Dashboard answers "what's
// happening right now" with no filtering at all — genuinely different
// jobs, which is why they're separate pages rather than one page with an
// ever-growing pile of charts.
export type AnalyticsRange = "7d" | "30d" | "90d";

const RANGE_DAYS: Record<AnalyticsRange, number> = { "7d": 7, "30d": 30, "90d": 90 };

function rangeSince(range: AnalyticsRange): Date {
  const since = new Date();
  since.setDate(since.getDate() - (RANGE_DAYS[range] - 1));
  since.setHours(0, 0, 0, 0);
  return since;
}

export async function getDownloadsSeriesForRange(range: AnalyticsRange) {
  await requireAdmin();
  const since = rangeSince(range);

  const downloads = await db.download.findMany({
    where: { createdAt: { gte: since } },
    select: { createdAt: true },
  });

  return bucketByDay(downloads.map((d) => d.createdAt), since, RANGE_DAYS[range]);
}

// A book counting toward every category it's tagged with (rather than
// picking just one) is a deliberate choice: a book tagged both "Security"
// and "Cloud" genuinely represents demand in both, and undercounting one
// of them to force totals to add up neatly would be less honest, not more.
export async function getDownloadsByCategory(range: AnalyticsRange) {
  await requireAdmin();
  const since = rangeSince(range);

  const downloads = await db.download.findMany({
    where: { createdAt: { gte: since } },
    select: {
      book: {
        select: { categories: { select: { category: { select: { name: true } } } } },
      },
    },
  });

  const counts = new Map<string, number>();
  for (const download of downloads) {
    for (const bookCategory of download.book.categories) {
      const name = bookCategory.category.name;
      counts.set(name, (counts.get(name) ?? 0) + 1);
    }
  }

  return [...counts.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);
}

export async function getDownloadsByPublisher(range: AnalyticsRange) {
  await requireAdmin();
  const since = rangeSince(range);

  const downloads = await db.download.findMany({
    where: { createdAt: { gte: since } },
    select: { book: { select: { company: { select: { name: true } } } } },
  });

  const counts = new Map<string, number>();
  for (const download of downloads) {
    const name = download.book.company.name;
    counts.set(name, (counts.get(name) ?? 0) + 1);
  }

  return [...counts.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);
}

// groupBy runs directly on Lead's own scalar fields — no relation join
// needed, unlike the category breakdown above.
export async function getLeadsByIndustry(range: AnalyticsRange) {
  await requireAdmin();
  const since = rangeSince(range);

  const rows = await db.lead.groupBy({
    by: ["industry"],
    where: { createdAt: { gte: since } },
    _count: { _all: true },
  });

  return rows
    .map((row) => ({ name: row.industry, count: row._count._all }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);
}

export async function getLeadsByCompanySize(range: AnalyticsRange) {
  await requireAdmin();
  const since = rangeSince(range);

  const rows = await db.lead.groupBy({
    by: ["companySize"],
    where: { createdAt: { gte: since } },
    _count: { _all: true },
  });

  return rows
    .map((row) => ({ companySize: row.companySize, count: row._count._all }))
    .sort((a, b) => b.count - a.count);
}
