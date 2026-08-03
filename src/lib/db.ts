import { PrismaClient } from "@prisma/client";

// Standard Next.js dev-mode singleton: without this, hot-reload creates a new
// PrismaClient (and a new connection pool) on every file save, eventually
// exhausting Postgres connections. In production each serverless invocation
// gets its own instance, which is the desired behavior.
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}
