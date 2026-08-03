import { NextResponse, type NextRequest } from "next/server";
import type { BookFormat } from "@prisma/client";
import { getBooks } from "@/actions/books";
import { createBook } from "@/actions/admin/books";
import { auth } from "@/lib/auth";
import { isAdminRole } from "@/lib/rbac";
import type { SortOption } from "@/lib/constants";

// Public, read-only, programmatic access to the same book listing that
// /search uses internally — same query function (getBooks), so results are
// guaranteed consistent with what a visitor sees in the browser.
//
// Query params: q, category (slug), format, company (id), sort
// (newest|popular|title), page, perPage (capped at 50).
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  const query = searchParams.get("q") ?? undefined;
  const categorySlug = searchParams.get("category") ?? undefined;
  const format = (searchParams.get("format") as BookFormat) || undefined;
  const companyId = searchParams.get("company") ?? undefined;
  const sort = (searchParams.get("sort") as SortOption) || "newest";
  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const perPage = Math.min(50, Math.max(1, Number(searchParams.get("perPage")) || 12));

  const result = await getBooks({
    query,
    categorySlug,
    format,
    companyId,
    sort,
    page,
    perPage,
  });

  return NextResponse.json(result);
}

// Create a book — Admin only. Gated here directly (auth() + isAdminRole())
// rather than relying on createBook()'s own internal requireAdmin(), which
// calls next/navigation's redirect() — that's meant for Server
// Components/Actions rendered by React, not Route Handlers, and wouldn't
// behave correctly if it ever fired here. Checking first means it never
// does: an unauthorized request short-circuits with a JSON 401 before
// createBook() is ever called.
export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user || !isAdminRole(session.user.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const result = await createBook(body);
  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json({ id: result.id }, { status: 201 });
}
