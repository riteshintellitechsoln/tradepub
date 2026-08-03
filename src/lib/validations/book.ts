import { z } from "zod";
import { BookFormat, BookStatus } from "@prisma/client";

// Real schema for Admin > Books create/edit (Module 16), replacing the
// Module 2 stub. Shared by the form (client-side feedback) and the server
// action (source of truth) — the exact pattern used for every other schema
// in this app (lead, email, category).
export const bookSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  slug: z
    .string()
    .min(3, "Slug must be at least 3 characters")
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens only"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  shortDescription: z.string().max(200).optional().default(""),
  coverImageUrl: z.string().url("Enter a valid image URL"),
  pdfFileKey: z.string().min(1, "PDF file key is required"),
  pages: z.coerce.number().int().positive().optional(),
  language: z.string().min(1).default("English"),
  format: z.nativeEnum(BookFormat),
  status: z.nativeEnum(BookStatus),
  isFeatured: z.boolean().default(false),
  isTrending: z.boolean().default(false),
  tags: z.string().optional().default(""), // comma-separated in the form, split before saving
  companyId: z.string().min(1, "Select a publisher"),
  categoryIds: z.array(z.string()).min(1, "Select at least one category"),
});

export type BookFormValues = z.infer<typeof bookSchema>;
