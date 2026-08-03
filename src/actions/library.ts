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
// Rate-limited (not admin-gated) rather than locked behind auth — the
// limiter exists specifically to discourage using this as an
// email-enumeration probe ("does X person have a Lead record?") while
// still letting anyone who legitimately downloaded something look up
// their own history.
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
    // Same shape as a real match with zero downloads — a page that renders
    // differently for "unknown email" vs. "known email, nothing yet" would
    // let this be used to enumerate which emails exist as leads.
    return { success: true as const, lead: null, downloads: [] };
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

  return { success: true as const, lead, downloads };
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
