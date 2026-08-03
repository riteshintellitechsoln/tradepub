import { NextResponse, type NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { isAdminRole } from "@/lib/rbac";
import { resendDownloadEmail } from "@/actions/download";

// Spec's POST /api/send-email. In this architecture, "send an email for a
// download" always means RE-sending an existing Download's link — the
// initial send happens automatically inside initiateDownload() during the
// download flow itself (Module 13/14). Making this a generic "send
// arbitrary email to arbitrary address" endpoint would be an
// unauthenticated email-relay surface (a spam vector), so instead it wraps
// resendDownloadEmail() and requires a known downloadId.
//
// Admin-only: gated here directly via auth() + isAdminRole() (both already
// built in Module 5) rather than waiting for Module 16's UI to exist —
// there's no reason to ship an unprotected endpoint in the meantime.
export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user || !isAdminRole(session.user.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const downloadId = body?.downloadId;

  if (!downloadId || typeof downloadId !== "string") {
    return NextResponse.json({ error: "downloadId is required" }, { status: 400 });
  }

  const result = await resendDownloadEmail(downloadId);

  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json({ downloadId: result.downloadId }, { status: 200 });
}
