"use client";

import { SessionProvider as NextAuthSessionProvider } from "next-auth/react";

// Thin, named wrapper so consumers import from "@/components/providers"
// rather than reaching into "next-auth/react" directly, and so Module 6
// (Layout) can mount it in the root layout with one line. Once mounted,
// any client component — the Navbar's "Sign In" / "My Library" toggle in
// Module 7, for instance — can call useSession() or signOut().
export function SessionProvider({ children }: { children: React.ReactNode }) {
  return <NextAuthSessionProvider>{children}</NextAuthSessionProvider>;
}
