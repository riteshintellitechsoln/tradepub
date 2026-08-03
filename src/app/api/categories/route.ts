import { NextResponse, type NextRequest } from "next/server";
import { getActiveCategories } from "@/actions/categories";
import { createCategory } from "@/actions/admin/categories";
import { auth } from "@/lib/auth";
import { isAdminRole } from "@/lib/rbac";

// GET /api/categories — same query the Navbar's Topics menu and /category
// index page already use (Module 7/10), exposed for programmatic access.
export async function GET() {
  const categories = await getActiveCategories();
  return NextResponse.json({ categories });
}

// POST /api/categories — Admin only.
export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user || !isAdminRole(session.user.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const result = await createCategory(body);
  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json({ id: result.id }, { status: 201 });
}
