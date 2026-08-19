import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

// Deliberately NOT the Next.js test setup (next/jest) — everything this
// suite covers (validation schemas, token logic, small pure utilities) has
// no dependency on Next's runtime, so plain Vitest + tsconfig path
// resolution is enough and starts in a fraction of the time.
export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts"],
  },
});
