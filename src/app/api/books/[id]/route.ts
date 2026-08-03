import { NextResponse, type NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { isAdminRole } from "@/lib/rbac";
import { updateBook, archiveBook } from "@/actions/admin/books";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// PUT /api/books/:id — Admin only. Same auth-gate-before-calling-the-action
// pattern as POST /api/books — see that file's comment for why.
export async function PUT(request: NextRequest, { params }: RouteParams) {
  const session = await auth();
  if (!session?.user || !isAdminRole(session.user.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const result = await updateBook(id, body);
  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json({ id: result.id });
}

// DELETE /api/books/:id — "delete" ARCHIVES the book rather than removing
// the row. See the comment on archiveBook() in actions/admin/books.ts for
// why a hard delete would be destructive to real download/lead history.
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const session = await auth();
  if (!session?.user || !isAdminRole(session.user.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const result = await archiveBook(id);
  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json({ id: result.id });
}
