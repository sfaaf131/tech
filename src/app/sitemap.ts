import type { MetadataRoute } from "next";
import { experiments } from "@/lib/lab";
import { notes } from "@/lib/notes";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date("2026-08-14");
  const staticPaths = [
    { path: "", priority: 1 },
    { path: "/experimentos", priority: 0.9 },
    { path: "/notas", priority: 0.8 },
    { path: "/cooperar", priority: 0.8 },
  ];

  return [
    ...staticPaths.map((item) => ({
      url: `${site.url}${item.path}`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: item.priority,
    })),
    ...experiments.map((item) => ({
      url: `${site.url}/experimentos/${item.slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...notes.map((item) => ({
      url: `${site.url}/notas/${item.slug}`,
      lastModified: new Date(item.date),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
  ];
}
