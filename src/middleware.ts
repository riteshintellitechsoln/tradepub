import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";

// Deliberately built from `authConfig` (the edge-safe half), NOT from
// `@/lib/auth` — importing the full config here would pull Prisma and
// bcrypt into the Edge runtime bundle and crash at deploy time.
//
// With `pages.signIn` set and an `authorized` callback that returns false,
// NextAuth automatically redirects the request to /login with
// `?callbackUrl=<original path>` attached — no manual redirect logic needed.
export const { auth: middleware } = NextAuth(authConfig);

export const config = {
  matcher: ["/admin/:path*"],
};
