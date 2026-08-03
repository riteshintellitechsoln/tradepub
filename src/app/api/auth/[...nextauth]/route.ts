import { handlers } from "@/lib/auth";

// NextAuth's catch-all: handles /api/auth/session, /api/auth/csrf,
// /api/auth/callback/credentials (sign-in), /api/auth/signout, etc.
// This single file satisfies the spec's "POST /api/auth/login" and
// "POST /api/auth/logout" — see the comment in src/lib/auth.ts for why we
// use NextAuth's own endpoints rather than hand-rolling equivalents.
export const { GET, POST } = handlers;
