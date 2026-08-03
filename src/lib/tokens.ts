import crypto from "crypto";
import jwt from "jsonwebtoken";

const SECRET = process.env.DOWNLOAD_TOKEN_SECRET ?? "dev-only-insecure-secret-change-me";
const TTL_MINUTES = Number(process.env.DOWNLOAD_TOKEN_TTL_MINUTES ?? 30);

interface DownloadTokenPayload {
  downloadId: string;
}

// The RAW token exists ONLY in the emailed URL — it is never persisted.
// What lands in Download.tokenHash is its SHA-256 hash (see schema comment
// on that column). If the database ever leaked, nobody could reconstruct a
// working download link from what's stored.
export function createDownloadToken(payload: DownloadTokenPayload): {
  token: string;
  tokenHash: string;
  expiresAt: Date;
} {
  const expiresAt = new Date(Date.now() + TTL_MINUTES * 60 * 1000);
  const token = jwt.sign(payload, SECRET, { expiresIn: `${TTL_MINUTES}m` });
  return { token, tokenHash: hashToken(token), expiresAt };
}

export function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

// Verifies signature + expiry. A tampered, expired, or garbage token
// returns null rather than throwing — callers just treat null as "show the
// invalid-link error," no try/catch needed at every call site.
export function verifyDownloadToken(token: string): DownloadTokenPayload | null {
  try {
    return jwt.verify(token, SECRET) as DownloadTokenPayload;
  } catch {
    return null;
  }
}
