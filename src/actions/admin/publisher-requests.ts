"use server";

import { revalidatePath } from "next/cache";
import type { Prisma, PublisherRequestStatus } from "@prisma/client";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/session";
import { getDateRange } from "@/lib/admin-filters";

export async function getAdminPublisherRequests({
  query,
  status,
  from,
  to,
  page = 1,
  perPage = 20,
}: {
  query?: string;
  status?: PublisherRequestStatus;
  from?: string;
  to?: string;
  page?: number;
  perPage?: number;
}) {
  await requireAdmin();

  const dateRange = getDateRange(from, to);

  const where: Prisma.PublisherRequestWhereInput = {
    ...(query
      ? {
          OR: [
            { fullName: { contains: query, mode: "insensitive" } },
            { email: { contains: query, mode: "insensitive" } },
            { companyName: { contains: query, mode: "insensitive" } },
            { bookTitle: { contains: query, mode: "insensitive" } },
          ],
        }
      : {}),
    ...(status ? { status } : {}),
    ...(dateRange ? { createdAt: dateRange } : {}),
  };

  const [requests, totalCount] = await Promise.all([
    db.publisherRequest.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    db.publisherRequest.count({ where }),
  ]);

  return { requests, totalCount, totalPages: Math.max(1, Math.ceil(totalCount / perPage)) };
}

export async function getPublisherRequestById(id: string) {
  await requireAdmin();
  return db.publisherRequest.findUnique({ where: { id } });
}

export async function updatePublisherRequestStatus(
  id: string,
  status: PublisherRequestStatus,
  adminNotes?: string,
) {
  await requireAdmin();
  await db.publisherRequest.update({
    where: { id },
    data: { status, adminNotes },
  });
  revalidatePath("/admin/publisher-requests");
  revalidatePath(`/admin/publisher-requests/${id}`);
  return { success: true };
}

export async function getPublisherRequestPdfUrl(id: string): Promise<string | null> {
  await requireAdmin();
  const request = await db.publisherRequest.findUnique({
    where: { id },
    select: { pdfFileKey: true },
  });
  if (!request?.pdfFileKey) return null;

  const { getSignedDownloadUrl } = await import("@/lib/storage/r2");
  return getSignedDownloadUrl(request.pdfFileKey);
}