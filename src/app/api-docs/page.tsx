import type { Metadata } from "next";
import { SwaggerLoader } from "@/components/api-docs/swagger-loader";

export const metadata: Metadata = {
  title: "API Docs",
  robots: { index: false, follow: false },
};

export default function ApiDocsPage() {
  return (
    <>
      <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css" />
      <div id="swagger-ui" />
      <SwaggerLoader />
    </>
  );
}