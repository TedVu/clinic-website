import type { MetadataRoute } from "next";
import { isProduction } from "@/lib/env";
import { siteUrl } from "@/lib/metadata";

export const dynamic = "force-static";

/** Production invites crawling; preview and local builds tell search engines to stay out. */
export default function robots(): MetadataRoute.Robots {
  if (!isProduction()) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${siteUrl()}/sitemap.xml`,
  };
}
