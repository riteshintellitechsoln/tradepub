"use server";

import { headers } from "next/headers";
import { db } from "@/lib/db";
import { checkRateLimit } from "@/lib/rate-limit";
import { resendDownloadEmail } from "@/actions/download";

// Backs /my-library — a public, email-based self-service lookup, NOT an
// authenticated account feature. This matches how TradePub's own "My
// Library" actually works: you prove you're the person behind an email by
// simply having that email, since a real download link already went
// there. No password, no signup flow.
//
// NOTE ON A DELIBERATE TRADE-OFF: this explicitly tells the visitor when
// an email has no Lead record at all ("found: false"), rather than
// showing the same empty state as a real lead with zero downloads. That's
// a product choice for clearer UX — the cost is that it makes this
// endpoint usable to probe "does this email exist as a lead," a mild
// email-enumeration exposure. Rate-limiting below is what keeps that from
// being trivially automatable at scale, but it doesn't eliminate the
// exposure entirely.
export async function getLibraryByEmail(email: string) {
  const headersList = await headers();
  const ip = headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  const { success: withinRateLimit } = await checkRateLimit(`library:${ip}`);
  if (!withinRateLimit) {
    return {
      success: false as const,
      error: "Too many requests — please try again in a minute.",
    };
  }

  const normalizedEmail = email.toLowerCase().trim();

  const lead = await db.lead.findUnique({
    where: { email: normalizedEmail },
    select: { id: true, fullName: true, email: true },
  });

  if (!lead) {
    return { success: true as const, found: false as const, downloads: [] };
  }

  const downloads = await db.download.findMany({
    where: { leadId: lead.id },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      status: true,
      createdAt: true,
      book: {
        select: {
          slug: true,
          title: true,
          coverImageUrl: true,
          company: { select: { name: true } },
        },
      },
    },
  });

  return { success: true as const, found: true as const, lead, downloads };
}

// Self-service resend — deliberately re-checks that the download actually
// belongs to a Lead with the exact email provided before ever calling
// resendDownloadEmail(). Without this check, anyone who discovered a
// downloadId (they're high-entropy nanoids, but not secret) could trigger
// a resend for someone else's download; this closes that gap regardless
// of how the underlying action might otherwise be reachable.
export async function requestLibraryResend(downloadId: string, email: string) {
  const download = await db.download.findUnique({
    where: { id: downloadId },
    select: { id: true, lead: { select: { email: true } } },
  });

  const normalizedEmail = email.toLowerCase().trim();
  if (!download || download.lead.email.toLowerCase() !== normalizedEmail) {
    return { success: false as const, error: "That download couldn't be found for this email." };
  }

  return resendDownloadEmail(downloadId);
}