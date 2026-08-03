 import { Resend } from "resend";
import { DownloadEmail } from "@/lib/email/templates/download-email";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export const isEmailConfigured = !!resend;

interface SendDownloadEmailParams {
  to: string;
  recipientName: string;
  bookTitle: string;
  coverImageUrl: string;
  publisherName: string;
  downloadUrl: string;
  expiresInMinutes: number;
}

interface SendResult {
  success: boolean;
  providerMessageId?: string;
  error?: string;
}

export async function sendDownloadEmail(params: SendDownloadEmailParams): Promise<SendResult> {
  if (!resend) {
    console.error(
      "[email] RESEND_API_KEY is not set — see .env.example. Every download will fail at the email step until this is configured.",
    );
    return { success: false, error: "Email is not configured (RESEND_API_KEY missing)." };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM ?? "TradeHub <downloads@tradehub.example>",
      to: params.to,
      subject: `Your download: ${params.bookTitle}`,
      react: DownloadEmail({
        recipientName: params.recipientName,
        bookTitle: params.bookTitle,
        coverImageUrl: params.coverImageUrl,
        publisherName: params.publisherName,
        downloadUrl: params.downloadUrl,
        expiresInMinutes: params.expiresInMinutes,
      }),
    });

    if (error) {
      console.error("[email] Resend API returned an error:", error);
      return { success: false, error: error.message };
    }

    return { success: true, providerMessageId: data?.id };
  } catch (err) {
    console.error("[email] sendDownloadEmail threw unexpectedly:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown email error",
    };
  }
}