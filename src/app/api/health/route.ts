import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// A real health check, not just "the process is alive" — pings the
// database with a trivial query, since a running Next.js process that
// can't reach Postgres is not actually healthy. Point uptime monitoring
// (Vercel, UptimeRobot, etc.) at this in production.
export async function GET() {
  try {
    await db.$queryRaw`SELECT 1`;
    return NextResponse.json({ status: "ok", timestamp: new Date().toISOString() });
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 503 },
    );
  }
}
