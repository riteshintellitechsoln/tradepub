import { NextResponse, type NextRequest } from "next/server";
import { initiateDownload } from "@/actions/download";

// Intentionally an alias for POST /api/download's logic, not a second
// implementation. In this platform's actual design, there is no "capture
// a lead" action independent of "request a download" — the Lead Form
// (Module 14) only ever appears embedded in the Download Flow, and the
// spec's own flow diagram has Lead Form feeding directly into Database
// Save → Token → Email, never standing alone. So rather than build a
// second, parallel "just save a lead" pathway that the rest of the app
// never actually uses, this route delegates to the exact same
// initiateDownload() that POST /api/download and the DownloadWizard use —
// same validation, same Lead upsert, same token + email pipeline.
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
