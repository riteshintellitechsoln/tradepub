// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   reactStrictMode: true,

//   images: {
//     remotePatterns: [
//       {
//         protocol: "https",
//         hostname: "res.cloudinary.com",
//       },
//       {
//         protocol: "https",
//         hostname: "placehold.co",
//       },
//       {
//         protocol: "https",
//         hostname: "*.r2.dev",
//       },
//       {
//         protocol: "https",
//         hostname: "*.s3.amazonaws.com",
//       },
//     ],
//     formats: ["image/avif", "image/webp"],
//   },

//   // Security headers applied to every route
//   async headers() {
//     return [
//       {
//         source: "/:path*",
//         headers: [
//           { key: "X-Frame-Options", value: "DENY" },
//           { key: "X-Content-Type-Options", value: "nosniff" },
//           { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
//           { key: "X-XSS-Protection", value: "1; mode=block" },
//           {
//             key: "Permissions-Policy",
//             value: "camera=(), microphone=(), geolocation=()",
//           },
//         ],
//       },
//     ];
//   },

//   experimental: {
//     serverActions: {
//       bodySizeLimit: "5mb",
//     },
//   },
// };

// export default nextConfig;



import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
      },
      // {
      //   protocol: "https",
      //   hostname: "*.r2.dev",
      // },
      // {
      //   protocol: "https",
      //   hostname: "*.s3.amazonaws.com",
      // },

      {
        protocol: "https",
        hostname: "*.r2.dev",
      },
      {
        protocol: "https",
        hostname: "*.s3.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "*.gstatic.com",
      },

    ],
    formats: ["image/avif", "image/webp"],
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // Security headers applied to every route
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },

  experimental: {
    serverActions: {
      bodySizeLimit: "5mb",
    },
  },
};

export default nextConfig;