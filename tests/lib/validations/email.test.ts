import { describe, expect, it } from "vitest";
import { companyEmailSchema, isCompanyEmailDomain } from "@/lib/validations/email";

describe("isCompanyEmailDomain", () => {
  it("rejects common free/consumer email providers", () => {
    expect(isCompanyEmailDomain("person@gmail.com")).toBe(false);
    expect(isCompanyEmailDomain("person@yahoo.com")).toBe(false);
    expect(isCompanyEmailDomain("person@hotmail.com")).toBe(false);
    expect(isCompanyEmailDomain("person@outlook.com")).toBe(false);
    expect(isCompanyEmailDomain("person@icloud.com")).toBe(false);
  });

  it("is case-insensitive on the domain", () => {
    expect(isCompanyEmailDomain("person@GMAIL.COM")).toBe(false);
    expect(isCompanyEmailDomain("person@Gmail.Com")).toBe(false);
  });

  it("accepts business domains", () => {
    expect(isCompanyEmailDomain("jane@acme.com")).toBe(true);
    expect(isCompanyEmailDomain("j.smith@subdomain.enterprise.co")).toBe(true);
  });

  it("rejects malformed input rather than throwing", () => {
    expect(isCompanyEmailDomain("not-an-email")).toBe(false);
    expect(isCompanyEmailDomain("")).toBe(false);
  });
});

describe("companyEmailSchema", () => {
  it("passes a well-formed business email", () => {
    const result = companyEmailSchema.safeParse("jane@acme.com");
    expect(result.success).toBe(true);
  });

  it("fails a free-provider email with a helpful message", () => {
    const result = companyEmailSchema.safeParse("jane@gmail.com");
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toMatch(/company email/i);
    }
  });

  it("fails an invalid email shape before the domain check ever runs", () => {
    const result = companyEmailSchema.safeParse("not-an-email");
    expect(result.success).toBe(false);
  });
});
