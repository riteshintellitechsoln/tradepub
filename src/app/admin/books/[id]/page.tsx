import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { BookForm } from "@/components/admin/book-form";

interface EditBookPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditBookPage({ params }: EditBookPageProps) {
  const { id } = await params;

  const [book, companies, categories] = await Promise.all([
    db.book.findUnique({
      where: { id },
      include: { categories: { select: { categoryId: true } } },
    }),
    db.company.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } }),
    db.category.findMany({ select: { id: true, name: true }, orderBy: { order: "asc" } }),
  ]);

  if (!book) notFound();

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-bold">Edit Book</h1>
      <BookForm companies={companies} categories={categories} book={book} />
    </div>
  );
}
