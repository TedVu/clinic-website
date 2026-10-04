import type { MetadataRoute } from "next";
import { getContent } from "@/content";
import { siteUrl } from "@/lib/metadata";
import { allPaths, enabledLocales } from "@/lib/routes";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();
  return enabledLocales.flatMap((locale) =>
    allPaths(locale, getContent(locale).doctors.map((d) => d.slug)).map((path) => ({
      url: `${base}${path}`,
      changeFrequency: "monthly" as const,
      priority: path === "/" ? 1 : 0.7,
    })),
  );
}
