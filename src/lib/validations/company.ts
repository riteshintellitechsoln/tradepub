import { z } from "zod";

// Companies here are PUBLISHERS — see the design note on the Company model
// in prisma/schema.prisma. Not to be confused with a Lead's employer,
// which is free text and never goes through this schema.
export const companySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  slug: z
    .string()
    .min(2, "Slug must be at least 2 characters")
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens only"),
  domain: z.string().optional().default(""),
  logoUrl: z.string().url("Enter a valid image URL").optional().or(z.literal("")),
  website: z.string().url("Enter a valid URL").optional().or(z.literal("")),
  about: z.string().optional().default(""),
});

export type CompanyFormValues = z.infer<typeof companySchema>;
