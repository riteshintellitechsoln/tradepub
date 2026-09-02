 "use server";

import { headers } from "next/headers";
import { db } from "@/lib/db";
import { publisherRequestSchema } from "@/lib/validations/publisher-request";
import { uploadPublisherPdf, isUploadConfigured } from "@/lib/storage/upload";
import { checkRateLimit } from "@/lib/rate-limit";

type SubmitResult = { success: true } | { success: false; error: string };

export async function submitPublisherRequest(formData: FormData): Promise<SubmitResult> {
  const headersList = await headers();
  const ip = headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  const { success: withinRateLimit } = await checkRateLimit(`publish:${ip}`);
  if (!withinRateLimit) {
    return { success: false, error: "Too many requests — please try again in a minute." };
  }

  const parsed = publisherRequestSchema.safeParse({
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    jobTitle: formData.get("jobTitle"),
    companyName: formData.get("companyName"),
    bookTitle: formData.get("bookTitle"),
    bookDescription: formData.get("bookDescription") ?? "",
  });

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid submission" };
  }

  let pdfFileKey: string | null = null;
  const file = formData.get("pdf");

  if (file instanceof File && file.size > 0) {
    if (file.type !== "application/pdf") {
      return { success: false, error: "Please upload a PDF file." };
    }
    if (file.size > 25 * 1024 * 1024) {
      return { success: false, error: "PDF must be under 25MB." };
    }

    if (isUploadConfigured()) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const uploaded = await uploadPublisherPdf(buffer, file.name);
      pdfFileKey = uploaded?.key ?? null;
    }
  }

  await db.publisherRequest.create({
    data: {
      fullName: parsed.data.fullName,
      email: parsed.data.email.toLowerCase().trim(),
      jobTitle: parsed.data.jobTitle,
      companyName: parsed.data.companyName,
      bookTitle: parsed.data.bookTitle,
      bookDescription: parsed.data.bookDescription || null,
      pdfFileKey,
    },
  });

  return { success: true };
}