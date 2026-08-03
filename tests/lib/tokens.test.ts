import { describe, expect, it } from "vitest";
import { createDownloadToken, hashToken, verifyDownloadToken } from "@/lib/tokens";

describe("createDownloadToken / verifyDownloadToken", () => {
  it("round-trips: a freshly created token verifies back to its payload", () => {
    const { token } = createDownloadToken({ downloadId: "abc123" });
    const payload = verifyDownloadToken(token);
    expect(payload).not.toBeNull();
    expect(payload?.downloadId).toBe("abc123");
  });

  it("rejects a tampered token", () => {
    const { token } = createDownloadToken({ downloadId: "abc123" });
    const tampered = token.slice(0, -2) + "xx";
    expect(verifyDownloadToken(tampered)).toBeNull();
  });

  it("rejects garbage input rather than throwing", () => {
    expect(verifyDownloadToken("not-a-real-token")).toBeNull();
  });

  it("hashToken is deterministic for the same input", () => {
    const { token } = createDownloadToken({ downloadId: "xyz" });
    expect(hashToken(token)).toBe(hashToken(token));
  });

  it("hashToken produces different hashes for different tokens", () => {
    const a = createDownloadToken({ downloadId: "a" });
    const b = createDownloadToken({ downloadId: "b" });
    expect(hashToken(a.token)).not.toBe(hashToken(b.token));
  });

  it("the tokenHash returned alongside the token matches hashToken(token) — this is the exact invariant GET /api/download relies on", () => {
    const { token, tokenHash } = createDownloadToken({ downloadId: "abc" });
    expect(hashToken(token)).toBe(tokenHash);
  });

  it("sets an expiry in the future", () => {
    const { expiresAt } = createDownloadToken({ downloadId: "abc" });
    expect(expiresAt.getTime()).toBeGreaterThan(Date.now());
  });
});
