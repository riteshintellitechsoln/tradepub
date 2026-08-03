import type { Book, BookCategory, Category, Company } from "@prisma/client";

// Re-export the Prisma model types we reference often, so components/actions
// import from "@/types" instead of "@prisma/client" directly — keeps the
// Prisma import surface small and makes it easy to layer app-specific fields
// on top later if needed.
export type {
  Admin,
  AdminRole,
  Book,
  BookCategory,
  BookFormat,
  BookStatus,
  Category,
  Company,
  CompanySize,
  Download,
  DownloadStatus,
  EmailLog,
  EmailStatus,
  Lead,
  User,
} from "@prisma/client";

// Composite shapes the UI actually needs (a Book joined with its Category
// names and publisher), rather than raw Prisma relation objects everywhere.
export type BookWithRelations = Book & {
  company: Company;
  categories: (BookCategory & { category: Category })[];
};

export type BookCardData = Pick<
  Book,
  | "id"
  | "slug"
  | "title"
  | "shortDescription"
  | "coverImageUrl"
  | "isFeatured"
  | "isTrending"
  | "publishedAt"
> & {
  company: Pick<Company, "name" | "logoUrl">;
  categories: { category: Pick<Category, "name" | "slug"> }[];
};
