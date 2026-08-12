"use client";

import { useState } from "react";
import Script from "next/script";

export function SwaggerLoader() {
  const [bundleLoaded, setBundleLoaded] = useState(false);

  return (
    <>
      <Script
        src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js"
        strategy="afterInteractive"
        onLoad={() => setBundleLoaded(true)}
      />
      {bundleLoaded && (
        <Script
          id="swagger-ui-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.SwaggerUIBundle({
                url: "/api/openapi.json",
                dom_id: "#swagger-ui",
              });
            `,
          }}
        />
      )}
    </>
  );
}