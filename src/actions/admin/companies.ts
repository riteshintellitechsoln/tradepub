"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/session";
import { companySchema, type CompanyFormValues } from "@/lib/validations/company";

type ActionResult = { success: true; id: string } | { success: false; error: string };

export async function createCompany(input: CompanyFormValues): Promise<ActionResult> {
  await requireAdmin();
  const parsed = companySchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid form" };
  }

  const existing = await db.company.findUnique({ where: { slug: parsed.data.slug } });
  if (existing) {
    return { success: false, error: "A publisher with that slug already exists." };
  }

  const company = await db.company.create({
    data: {
      ...parsed.data,
      logoUrl: parsed.data.logoUrl || null,
      website: parsed.data.website || null,
      domain: parsed.data.domain || null,
    },
  });

  revalidatePath("/admin/companies");
  return { success: true, id: company.id };
}

export async function updateCompany(id: string, input: CompanyFormValues): Promise<ActionResult> {
  await requireAdmin();
  const parsed = companySchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid form" };
  }

  const conflict = await db.company.findFirst({
    where: { slug: parsed.data.slug, NOT: { id } },
  });
  if (conflict) {
    return { success: false, error: "A publisher with that slug already exists." };
  }

  await db.company.update({
    where: { id },
    data: {
      ...parsed.data,
      logoUrl: parsed.data.logoUrl || null,
      website: parsed.data.website || null,
      domain: parsed.data.domain || null,
    },
  });

  revalidatePath("/admin/companies");
  revalidatePath("/book"); // publisher name/logo shows on every book card & detail page
  return { success: true, id };
}

// Deliberately NOT caught-and-hidden: Book.companyId has onDelete: Restrict
// in the schema specifically so this throws (rather than silently cascading
// and orphaning books) when a publisher still has books attached. The
// caller surfaces that as a clear "still has books" message instead of a
// raw Prisma error.
export async function deleteCompany(id: string): Promise<ActionResult> {
  await requireAdmin();

  const bookCount = await db.book.count({ where: { companyId: id } });
  if (bookCount > 0) {
    return {
      success: false,
      error: `This publisher still has ${bookCount} book${bookCount === 1 ? "" : "s"} — reassign or archive them first.`,
    };
  }

  await db.company.delete({ where: { id } });
  revalidatePath("/admin/companies");
  return { success: true, id };
}
