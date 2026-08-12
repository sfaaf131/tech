import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "",
    "/agentes",
    "/incubadora",
    "/fabrica",
    "/enterprise",
    "/servicios",
    "/modelo",
    "/cotizador",
    "/roi",
    "/passport",
    "/seguridad",
    "/contacto",
  ];

  return paths.map((path) => ({
    url: `${site.url}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.7,
  }));
}
