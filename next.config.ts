import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async redirects() {
    return [
      { source: "/incubadora", destination: "/startups", permanent: true },
      { source: "/fabrica", destination: "/enterprise", permanent: true },
      { source: "/modelo", destination: "/startups", permanent: true },
      { source: "/contacto", destination: "/enterprise", permanent: true },
      { source: "/servicios", destination: "/enterprise", permanent: true },
      { source: "/passport", destination: "/acceso", permanent: true },
      { source: "/app", destination: "/dashboard", permanent: true },
      { source: "/app/:path*", destination: "/dashboard", permanent: true },
      { source: "/cotizador", destination: "/enterprise", permanent: true },
      { source: "/roi", destination: "/enterprise", permanent: true },
      { source: "/seguridad", destination: "/enterprise", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "DENY" },
        ],
      },
    ];
  },
};

export default nextConfig;
