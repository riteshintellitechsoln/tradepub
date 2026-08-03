import { db } from "@/lib/db";
import { BookForm } from "@/components/admin/book-form";

export default async function NewBookPage() {
  const [companies, categories] = await Promise.all([
    db.company.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } }),
    db.category.findMany({ select: { id: true, name: true }, orderBy: { order: "asc" } }),
  ]);

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-bold">New Book</h1>
      <BookForm companies={companies} categories={categories} />
    </div>
  );
}
