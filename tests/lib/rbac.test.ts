import { describe, expect, it } from "vitest";
import { isAdminRole, ADMIN_ROLES } from "@/lib/rbac";

describe("isAdminRole", () => {
  it("accepts every role in ADMIN_ROLES", () => {
    for (const role of ADMIN_ROLES) {
      expect(isAdminRole(role)).toBe(true);
    }
  });

  it("rejects the plain USER role — the one non-admin role in the app", () => {
    expect(isAdminRole("USER")).toBe(false);
  });

  it("rejects null/undefined/empty without throwing — callers pass session?.user?.role directly", () => {
    expect(isAdminRole(null)).toBe(false);
    expect(isAdminRole(undefined)).toBe(false);
    expect(isAdminRole("")).toBe(false);
  });

  it("rejects an unrelated string", () => {
    expect(isAdminRole("SUPERUSER")).toBe(false);
  });
});
