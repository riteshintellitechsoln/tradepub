import { NextResponse, type NextRequest } from "next/server";
import { verifyDownloadToken, hashToken } from "@/lib/tokens";
import { db } from "@/lib/db";
import { getSignedDownloadUrl } from "@/lib/storage/r2";
import { initiateDownload } from "@/actions/download";

// GET /api/download?token=... — the link that actually goes in the emailed
// message (Module 15) and what a browser navigates to when someone clicks
// it. This has to be GET (an email link is always clicked, never fetched
// via POST), which is why the spec's literal "POST /api/download" is
// implemented as the JSON endpoint below instead — see that handler's
// comment for the full reasoning.
export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");
  if (!token) {
    return NextResponse.redirect(new URL("/download?error=missing-token", request.url));
  }

  const payload = verifyDownloadToken(token);
  if (!payload) {
    return NextResponse.redirect(new URL("/download?error=invalid-or-expired", request.url));
  }

  const download = await db.download.findUnique({
    where: { id: payload.downloadId },
    include: { book: { select: { slug: true, pdfFileKey: true } } },
  });

  // Comparing the hash (not the raw token) against what's stored means a
  // token that verifies cryptographically but doesn't match any known
  // download — e.g. one signed with a leaked secret — still gets rejected.
  if (!download || download.tokenHash !== hashToken(token)) {
    return NextResponse.redirect(new URL("/download?error=invalid-or-expired", request.url));
  }

  if (download.tokenExpiresAt < new Date()) {
    await db.download.update({ where: { id: download.id }, data: { status: "EXPIRED" } });
    return NextResponse.redirect(
      new URL(`/download?error=expired&book=${download.book.slug}`, request.url),
    );
  }

  const signedUrl = await getSignedDownloadUrl(download.book.pdfFileKey);

  // Storage isn't configured yet in this environment (no real files exist
  // until Module 16's upload UI ships) — fail informatively rather than
  // marking the download complete for a file that was never actually served.
  if (!signedUrl) {
    return NextResponse.redirect(
      new URL(
        `/download?error=storage-not-configured&book=${download.book.slug}`,
        request.url,
      ),
    );
  }

  await db.download.update({
    where: { id: download.id },
    data: { status: "DOWNLOADED", downloadedAt: new Date() },
  });

  return NextResponse.redirect(signedUrl);
}

// POST /api/download — the spec's literal route. An email link must be
// GET-able by definition (clicking a link is always a GET), so this POST
// endpoint instead serves as the programmatic/JSON equivalent of the
// /download page's flow: an API consumer can submit the same
// { fullName, email, consentGiven, bookSlug } payload the DownloadWizard
// does and get back a JSON result, without a browser form in between.
// It calls the exact same initiateDownload() the page uses.
export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const result = await initiateDownload(body);

  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json({ downloadId: result.downloadId }, { status: 201 });
}
