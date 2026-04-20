import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  async headers() {
    return [
      {
        // Apply security headers to all course content pages
        source: "/courses/:path*",
        headers: [
          // Prevent embedding in iframes on other sites
          { key: "X-Frame-Options", value: "DENY" },
          // Modern frame protection
          { key: "Content-Security-Policy", value: "frame-ancestors 'none'" },
          // Prevent MIME type sniffing
          { key: "X-Content-Type-Options", value: "nosniff" },
          // Prevent caching of protected content
          { key: "Cache-Control", value: "no-store, no-cache, must-revalidate, private" },
          { key: "Pragma", value: "no-cache" },
          { key: "Expires", value: "0" },
          // Disable FLoC / Topics API tracking
          { key: "Permissions-Policy", value: "display-capture=(), screen-wake-lock=(), picture-in-picture=()" },
          // Prevent page from being indexed by search engines (protect content)
          { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive, nosnippet, noimageindex" },
        ],
      },
      {
        // Same for the dashboard/main area
        source: "/dashboard/:path*",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Content-Security-Policy", value: "frame-ancestors 'none'" },
          { key: "Cache-Control", value: "no-store, no-cache, must-revalidate, private" },
        ],
      },
    ];
  },
};

export default nextConfig;
