"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/session";
import { categorySchema, type CategoryFormValues } from "@/lib/validations/category";

type ActionResult = { success: true; id: string } | { success: false; error: string };

export async function createCategory(input: CategoryFormValues): Promise<ActionResult> {
  await requireAdmin();
  const parsed = categorySchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid form" };
  }

  const existing = await db.category.findFirst({
    where: { OR: [{ slug: parsed.data.slug }, { name: parsed.data.name }] },
  });
  if (existing) {
    return { success: false, error: "A category with that name or slug already exists." };
  }

  const category = await db.category.create({ data: parsed.data });

  revalidatePath("/admin/categories");
  revalidatePath("/"); // Navbar/Footer/Home category lists
  revalidatePath("/category");

  return { success: true, id: category.id };
}

export async function updateCategory(id: string, input: CategoryFormValues): Promise<ActionResult> {
  await requireAdmin();
  const parsed = categorySchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid form" };
  }

  const conflict = await db.category.findFirst({
    where: { OR: [{ slug: parsed.data.slug }, { name: parsed.data.name }], NOT: { id } },
  });
  if (conflict) {
    return { success: false, error: "A category with that name or slug already exists." };
  }

  await db.category.update({ where: { id }, data: parsed.data });

  revalidatePath("/admin/categories");
  revalidatePath("/");
  revalidatePath("/category");
  revalidatePath(`/category/${parsed.data.slug}`);

  return { success: true, id };
}

// A real delete (not archive) — unlike Book, deleting a Category only
// removes its BookCategory join rows (onDelete: Cascade on that relation),
// which un-tags books from this category without touching the books
// themselves. Nothing destructive to real business data happens here.
export async function deleteCategory(id: string): Promise<ActionResult> {
  await requireAdmin();
  await db.category.delete({ where: { id } });

  revalidatePath("/admin/categories");
  revalidatePath("/");
  revalidatePath("/category");

  return { success: true, id };
}
