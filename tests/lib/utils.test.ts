import { describe, expect, it } from "vitest";
import { cn, slugify } from "@/lib/utils";

describe("slugify", () => {
  it("lowercases and hyphenates", () => {
    expect(slugify("Enterprise Applications")).toBe("enterprise-applications");
  });

  it("converts & to 'and' rather than dropping it", () => {
    expect(slugify("Sales & Marketing")).toBe("sales-and-marketing");
  });

  it("strips leading/trailing hyphens produced by punctuation", () => {
    expect(slugify("  Cloud!!  ")).toBe("cloud");
  });

  it("collapses repeated non-alphanumeric runs into a single hyphen", () => {
    expect(slugify("Data---Tools___2026")).toBe("data-tools-2026");
  });
});

describe("cn", () => {
  it("merges class strings", () => {
    expect(cn("px-2", "py-4")).toBe("px-2 py-4");
  });

  it("lets a later conflicting Tailwind class win (tailwind-merge behavior)", () => {
    expect(cn("px-2", "px-4")).toBe("px-4");
  });

  it("drops falsy values", () => {
    expect(cn("px-2", false, undefined, null, "py-1")).toBe("px-2 py-1");
  });
});
