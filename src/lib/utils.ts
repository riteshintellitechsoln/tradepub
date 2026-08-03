import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Standard shadcn/ui className merge helper. Used by every UI component.
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Shared with prisma/seed.ts's local copy conceptually — used by every
// Admin form (Books/Categories/Companies) to auto-fill a slug from a name,
// which the admin can still edit by hand afterward.
export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
