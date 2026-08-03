import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const isConfigured =
  !!process.env.R2_ACCOUNT_ID &&
  !!process.env.R2_ACCESS_KEY_ID &&
  !!process.env.R2_SECRET_ACCESS_KEY;

const client = isConfigured
  ? new S3Client({
      region: "auto",
      endpoint:
        process.env.R2_ENDPOINT ?? `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID!,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
      },
    })
  : null;

export const isStorageConfigured = isConfigured;

// Returns null (rather than throwing) when R2 credentials aren't set —
// e.g. this sandbox, or a fresh local install before an Admin has uploaded
// real files in Module 16. GET /api/download treats null as "storage not
// configured yet" and shows a friendly message instead of a 500.
export async function getSignedDownloadUrl(
  key: string,
  expiresInSeconds = 300,
): Promise<string | null> {
  if (!client) return null;

  const command = new GetObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME,
    Key: key,
  });

  return getSignedUrl(client, command, { expiresIn: expiresInSeconds });
}
