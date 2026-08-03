"use server";

import { headers } from "next/headers";
import { nanoid } from "nanoid";
import { db } from "@/lib/db";
import { leadSchema, type LeadInput } from "@/lib/validations/lead";
import { createDownloadToken } from "@/lib/tokens";
import { checkRateLimit } from "@/lib/rate-limit";
import { sendDownloadEmail } from "@/lib/email/resend";

interface InitiateDownloadInput extends LeadInput {
  bookSlug: string;
}

type InitiateDownloadResult =
  | { success: true; downloadId: string }
  | { success: false; error: string };

// The full pipeline behind the spec's Download Flow diagram:
//   Company Email Check → Lead Form → Database Save → Generate Secure
//   Token → Email PDF → Thank You Page
//
// Steps 1-2 (email check, lead form) already happened client-side in
// DownloadWizard/LeadForm before this is ever called — but this function
// re-validates everything server-side regardless. Client validation is a
// UX nicety; it is never trustworthy on its own, since anyone can call this
// action directly with whatever payload they want.
//
// Email sending is now REAL (Module 15, via lib/email/resend.ts) — no more
// console.log stub. If the send fails (including "not configured at all"),
// the Lead and Download rows are still kept — there's a genuine contact
// and intent worth preserving for Admin follow-up — but the visitor is told
// the truth rather than being sent to a Thank You page for an email that
// never went out.
export async function initiateDownload(
  input: InitiateDownloadInput,
): Promise<InitiateDownloadResult> {
  const parsed = leadSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Invalid submission",
    };
  }

  const headersList = await headers();
  const ip = headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const userAgent = headersList.get("user-agent") ?? undefined;

  const { success: withinRateLimit } = await checkRateLimit(ip);
  if (!withinRateLimit) {
    return { success: false, error: "Too many requests — please try again in a minute." };
  }

  const book = await db.book.findUnique({
    where: { slug: input.bookSlug, status: "PUBLISHED" },
    select: {
      id: true,
      title: true,
      coverImageUrl: true,
      company: { select: { name: true } },
    },
  });
  if (!book) {
    return { success: false, error: "This resource is no longer available." };
  }

  const {
    fullName,
    email,
    phone,
    companyName,
    jobTitle,
    country,
    state,
    city,
    department,
    industry,
    companySize,
    consentGiven,
  } = parsed.data;
  const domain = email.split("@")[1]?.toLowerCase();

  // One Lead per unique email (Lead.email is @unique) — upsert rather than
  // insert, so a returning visitor updates their existing contact record
  // (with whatever they just typed) instead of creating a duplicate.
  const lead = await db.lead.upsert({
    where: { email },
    update: {
      fullName,
      phone,
      companyName,
      jobTitle,
      country,
      state: state || null,
      city: city || null,
      department,
      industry,
      companySize,
      consentGiven,
      consentAt: new Date(),
      ipAddress: ip,
      userAgent,
    },
    create: {
      fullName,
      email,
      companyDomain: domain,
      phone,
      companyName,
      jobTitle,
      country,
      state: state || null,
      city: city || null,
      department,
      industry,
      companySize,
      consentGiven,
      consentAt: new Date(),
      ipAddress: ip,
      userAgent,
    },
  });

  // Generate the Download row's id ourselves (via nanoid) BEFORE creating
  // the row, so the token's payload can embed the real id from the start —
  // no "create with a placeholder token, then patch it" step needed.
  const downloadId = nanoid();
  const { token, tokenHash, expiresAt } = createDownloadToken({ downloadId });

  const download = await db.download.create({
    data: {
      id: downloadId,
      leadId: lead.id,
      bookId: book.id,
      tokenHash,
      tokenExpiresAt: expiresAt,
      status: "PENDING",
      ipAddress: ip,
      userAgent,
    },
  });

  const ttlMinutes = Number(process.env.DOWNLOAD_TOKEN_TTL_MINUTES ?? 30);
  const downloadUrl = `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/api/download?token=${token}`;
  const subject = `Your download: ${book.title}`;

  const emailResult = await sendDownloadEmail({
    to: email,
    recipientName: fullName,
    bookTitle: book.title,
    coverImageUrl: book.coverImageUrl,
    publisherName: book.company.name,
    downloadUrl,
    expiresInMinutes: ttlMinutes,
  });

  if (!emailResult.success) {
    // The Lead and Download rows already exist — keeping them is
    // deliberate (there's a real contact and a real intent to preserve for
    // Admin follow-up/retry, via resendDownloadEmail below) — but the
    // visitor gets an honest failure rather than a Thank You page for an
    // email that never went out.
    await db.$transaction([
      db.download.update({ where: { id: download.id }, data: { status: "FAILED" } }),
      db.emailLog.create({
        data: {
          downloadId: download.id,
          to: email,
          subject,
          status: "FAILED",
          error: emailResult.error,
        },
      }),
    ]);

    return {
      success: false,
      error: "We couldn't send your download link. Please try again in a moment.",
    };
  }

  await db.$transaction([
    db.download.update({
      where: { id: download.id },
      data: { status: "EMAIL_SENT" },
    }),
    db.emailLog.create({
      data: {
        downloadId: download.id,
        to: email,
        subject,
        status: "SENT",
        sentAt: new Date(),
        providerMessageId: emailResult.providerMessageId,
      },
    }),
    db.book.update({
      where: { id: book.id },
      data: { downloadCount: { increment: 1 } },
    }),
  ]);

  return { success: true, downloadId: download.id };
}

// Issues a FRESH token rather than reusing the original one — the first
// may already be expired or already used, and every resend attempt gets
// its own EmailLog row, so Admin > Email Logs (Module 16) shows accurate
// per-attempt delivery history rather than overwriting the original send's
// record. Used by the spec's POST /api/send-email and, later, the "Resend"
// action on Admin > Downloads.
export async function resendDownloadEmail(
  downloadId: string,
): Promise<InitiateDownloadResult> {
  const download = await db.download.findUnique({
    where: { id: downloadId },
    include: {
      lead: { select: { email: true, fullName: true } },
      book: {
        select: { title: true, coverImageUrl: true, company: { select: { name: true } } },
      },
    },
  });
  if (!download) {
    return { success: false, error: "Download not found." };
  }

  const { token, tokenHash, expiresAt } = createDownloadToken({ downloadId: download.id });
  await db.download.update({
    where: { id: download.id },
    data: { tokenHash, tokenExpiresAt: expiresAt, status: "PENDING" },
  });

  const ttlMinutes = Number(process.env.DOWNLOAD_TOKEN_TTL_MINUTES ?? 30);
  const downloadUrl = `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/api/download?token=${token}`;
  const subject = `Your download: ${download.book.title}`;

  const emailResult = await sendDownloadEmail({
    to: download.lead.email,
    recipientName: download.lead.fullName,
    bookTitle: download.book.title,
    coverImageUrl: download.book.coverImageUrl,
    publisherName: download.book.company.name,
    downloadUrl,
    expiresInMinutes: ttlMinutes,
  });

  if (!emailResult.success) {
    await db.emailLog.create({
      data: {
        downloadId: download.id,
        to: download.lead.email,
        subject,
        status: "FAILED",
        error: emailResult.error,
      },
    });
    return { success: false, error: emailResult.error ?? "Failed to resend email." };
  }

  await db.$transaction([
    db.download.update({ where: { id: download.id }, data: { status: "EMAIL_SENT" } }),
    db.emailLog.create({
      data: {
        downloadId: download.id,
        to: download.lead.email,
        subject,
        status: "SENT",
        sentAt: new Date(),
        providerMessageId: emailResult.providerMessageId,
      },
    }),
  ]);

  return { success: true, downloadId: download.id };
}
