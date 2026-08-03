import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/lib/db";

// Every download token already gets checked for expiry lazily — the moment
// someone clicks an expired link, GET /api/download marks it EXPIRED right
// then. This cron sweep exists for the links NOBODY ever clicks: without
// it, a Download that expired unused just sits at PENDING/EMAIL_SENT
// forever, quietly making Admin > Downloads and Analytics look healthier
// than they actually are.
//
// Protected via CRON_SECRET (set in Vercel's Cron config as a header, or
// compared against the Authorization header here) so this can't be
// triggered by anyone who finds the URL.
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await db.download.updateMany({
    where: {
      status: { in: ["PENDING", "EMAIL_SENT"] },
      tokenExpiresAt: { lt: new Date() },
    },
    data: { status: "EXPIRED" },
  });

  return NextResponse.json({ expired: result.count });
}
