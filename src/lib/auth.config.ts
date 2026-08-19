// import type { NextAuthConfig } from "next-auth";
// import { isAdminRole } from "@/lib/rbac";

// // Edge-safe half of the NextAuth config: no Prisma, no bcrypt, no
// // Node-only dependencies. This is the ONLY part of the auth setup that
// // src/middleware.ts is allowed to import, since Next.js middleware runs on
// // the Edge runtime, which can't open a Postgres TCP connection or run
// // bcrypt's native comparisons.
// //
// // src/lib/auth.ts spreads this object and adds the real Credentials
// // provider + Prisma adapter for use in Server Components, Route Handlers,
// // and Server Actions (all of which run on the Node runtime).
// export const authConfig = {
//   pages: {
//     signIn: "/login",
//   },
//   session: {
//     strategy: "jwt",
//      maxAge: 60 * 5,
//   },
//   callbacks: {
//     // Runs on every request middleware matches. Returning false triggers an
//     // automatic redirect to `pages.signIn` (with `callbackUrl` attached).
//     authorized({ auth, request }) {
//       const isAdminRoute = request.nextUrl.pathname.startsWith("/admin");
//       if (!isAdminRoute) return true;

//       return !!auth?.user && isAdminRole(auth.user.role);
//     },
//   },
//   providers: [], // populated in lib/auth.ts — kept empty here on purpose
// } satisfies NextAuthConfig;



import type { NextAuthConfig } from "next-auth";
import { isAdminRole } from "@/lib/rbac";

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24,
  },
  callbacks: {
    authorized({ auth, request }) {
      const isAdminRoute = request.nextUrl.pathname.startsWith("/admin");
      if (!isAdminRoute) return true;

      return !!auth?.user && isAdminRole(auth.user.role);
    },
  },
  providers: [],
} satisfies NextAuthConfig;