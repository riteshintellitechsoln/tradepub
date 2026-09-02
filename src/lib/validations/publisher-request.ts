import { z } from "zod";

export const publisherRequestSchema = z.object({
  fullName: z.string().min(2, "Enter your full name"),
  email: z.string().email("Enter a valid email address"),
  jobTitle: z.string().min(2, "Enter your job title"),
  companyName: z.string().min(2, "Enter your company name"),
  bookTitle: z.string().min(3, "Enter the resource's title"),
  bookDescription: z.string().max(1000).optional().default(""),
});

export type PublisherRequestInput = z.infer<typeof publisherRequestSchema>;