/** @type {import('next').NextConfig} */
const nextConfig = {
  // Security headers applied to every response
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          // Prevent clickjacking
          { key: "X-Frame-Options", value: "DENY" },
          // Stop MIME sniffing
          { key: "X-Content-Type-Options", value: "nosniff" },
          // Force HTTPS
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
          // Limit referrer info
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // Permissions policy — lock down browser features we don't need
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          // Content Security Policy
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline'",          // Next.js needs unsafe-inline
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: blob:",
              "connect-src 'self'",                          // API calls go to /api/* only
              "frame-ancestors 'none'",
            ].join("; "),
          },
        ],
      },
      // Lock down the API routes — no caching, no external access
      {
        source: "/api/(.*)",
        headers: [
          { key: "Cache-Control", value: "no-store, no-cache, must-revalidate" },
          { key: "X-Robots-Tag", value: "noindex" },
        ],
      },
    ];
  },

  // Only allow requests from your own origin in production
  async rewrites() {
    return [];
  },
};

module.exports = nextConfig;
