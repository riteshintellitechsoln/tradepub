"use server";

import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/session";
import { bucketByDay } from "@/lib/analytics";

// Every function here backs /admin (Module 17). Deliberately separate from
// Module 18 (Analytics) — this is "what's happening right now, at a
// glance," not filterable date-range reports or exports. That distinction
// is what keeps this module and the next one from overlapping.

export async function getDashboardStats() {
  await requireAdmin();

  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);

  const [
    bookCount,
    categoryCount,
    companyCount,
    leadCount,
    downloadCount,
    leadsThisWeek,
    downloadsThisWeek,
  ] = await Promise.all([
    db.book.count(),
    db.category.count(),
    db.company.count(),
    db.lead.count(),
    db.download.count(),
    db.lead.count({ where: { createdAt: { gte: weekAgo } } }),
    db.download.count({ where: { createdAt: { gte: weekAgo } } }),
  ]);

  return {
    bookCount,
    categoryCount,
    companyCount,
    leadCount,
    downloadCount,
    leadsThisWeek,
    downloadsThisWeek,
  };
}

// Buckets Download rows by calendar day via the shared bucketByDay helper
// (Module 18 extracted this once Analytics needed the same logic for
// arbitrary date ranges). Always returns exactly `days` points, including
// days with zero downloads, so the chart never has gaps.
export async function getDownloadsTimeSeries(days = 14) {
  await requireAdmin();

  const since = new Date();
  since.setDate(since.getDate() - (days - 1));
  since.setHours(0, 0, 0, 0);

  const downloads = await db.download.findMany({
    where: { createdAt: { gte: since } },
    select: { createdAt: true },
  });

  return bucketByDay(downloads.map((d) => d.createdAt), since, days);
}

export async function getRecentLeads(limit = 5) {
  await requireAdmin();
  return db.lead.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
    select: { id: true, fullName: true, companyName: true, email: true, createdAt: true },
  });
}

export async function getRecentDownloads(limit = 5) {
  await requireAdmin();
  return db.download.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
    select: {
      id: true,
      status: true,
      createdAt: true,
      lead: { select: { fullName: true, email: true } },
      book: { select: { title: true } },
    },
  });
}

export async function getTopBooks(limit = 5) {
  await requireAdmin();
  return db.book.findMany({
    where: { downloadCount: { gt: 0 } },
    orderBy: { downloadCount: "desc" },
    take: limit,
    select: { id: true, title: true, downloadCount: true, coverImageUrl: true },
  });
}
