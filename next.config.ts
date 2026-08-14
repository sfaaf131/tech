import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async redirects() {
    return [
      { source: "/incubadora", destination: "/", permanent: true },
      { source: "/fabrica", destination: "/", permanent: true },
      { source: "/modelo", destination: "/", permanent: true },
      { source: "/contacto", destination: "/cooperar", permanent: true },
      { source: "/servicios", destination: "/", permanent: true },
      { source: "/passport", destination: "/", permanent: true },
      { source: "/app", destination: "/", permanent: true },
      { source: "/app/:path*", destination: "/", permanent: true },
      { source: "/cotizador", destination: "/", permanent: true },
      { source: "/roi", destination: "/", permanent: true },
      { source: "/seguridad", destination: "/", permanent: true },
      { source: "/enterprise", destination: "/", permanent: true },
      { source: "/startups", destination: "/", permanent: true },
      { source: "/acceso", destination: "/", permanent: true },
      { source: "/dashboard", destination: "/", permanent: true },
      { source: "/proyectos", destination: "/lab", permanent: true },
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
