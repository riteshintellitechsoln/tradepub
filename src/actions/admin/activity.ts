"use server";

import type { Prisma, DownloadStatus } from "@prisma/client";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/session";
import { getDateRange } from "@/lib/admin-filters";

export async function getAdminActivity({
  query,
  status,
  from,
  to,
  page = 1,
  perPage = 20,
}: {
  query?: string;
  status?: DownloadStatus;
  from?: string;
  to?: string;
  page?: number;
  perPage?: number;
}) {
  await requireAdmin();

  const dateRange = getDateRange(from, to);

  const where: Prisma.DownloadWhereInput = {
    ...(query
      ? {
          OR: [
            { lead: { email: { contains: query, mode: "insensitive" } } },
            { lead: { fullName: { contains: query, mode: "insensitive" } } },
            { book: { title: { contains: query, mode: "insensitive" } } },
          ],
        }
      : {}),
    ...(status ? { status } : {}),
    ...(dateRange ? { createdAt: dateRange } : {}),
  };

  const [downloads, totalCount] = await Promise.all([
    db.download.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * perPage,
      take: perPage,
      include: {
        lead: { select: { fullName: true, email: true } },
        book: { select: { title: true, slug: true } },
        emailLogs: {
          orderBy: { createdAt: "desc" },
          select: { status: true, error: true, createdAt: true },
        },
      },
    }),
    db.download.count({ where }),
  ]);

  const activity = downloads.map((d) => ({
    id: d.id,
    leadName: d.lead.fullName,
    leadEmail: d.lead.email,
    bookTitle: d.book.title,
    bookSlug: d.book.slug,
    status: d.status,
    createdAt: d.createdAt,
    downloadedAt: d.downloadedAt,
    emailAttempts: d.emailLogs.length,
    latestEmailStatus: d.emailLogs[0]?.status ?? null,
    latestEmailError: d.emailLogs[0]?.error ?? null,
  }));

  return {
    activity,
    totalCount,
    totalPages: Math.max(1, Math.ceil(totalCount / perPage)),
  };
}