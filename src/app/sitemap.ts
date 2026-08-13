import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date("2026-08-13");
  const paths = [
    { path: "", priority: 1 },
    { path: "/enterprise", priority: 0.9 },
    { path: "/startups", priority: 0.9 },
  ] as const;

  return paths.map((item) => ({
    url: `${site.url}${item.path}`,
    lastModified,
    changeFrequency: "weekly" as const,
    priority: item.priority,
  }));
}
