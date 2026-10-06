import type { Metadata } from "next";
import { getContent } from "@/content";
import { isSupplied } from "@/content/pending";
import { isProduction } from "./env";
import { DEFAULT_LOCALE, type Locale } from "./routes";

/**
 * Public origin used for canonical URLs, Open Graph and the sitemap.
 * Production always has `clinic.siteUrl` (launch-blocking). Cloudflare preview deploys fall back
 * to their own URL; local builds to localhost.
 */
export function siteUrl(locale: Locale = DEFAULT_LOCALE): string {
  const { siteUrl } = getContent(locale).clinic;
  if (isSupplied(siteUrl)) return siteUrl.replace(/\/$/, "");
  return (process.env.CF_PAGES_URL ?? "http://localhost:3000").replace(/\/$/, "");
}

/** Clinic name, or the generic descriptor on previews while the name is pending. */
export function brandName(locale: Locale = DEFAULT_LOCALE): string {
  const { clinic } = getContent(locale);
  return isSupplied(clinic.name) ? clinic.name : clinic.descriptor;
}

/**
 * Short brand for the page-title suffix. Titles stay within what search results display, while
 * the full name (brandName) stays everywhere the clinic must match its Google Business Profile.
 */
export function shortBrand(locale: Locale = DEFAULT_LOCALE): string {
  return getContent(locale).clinic.shortName;
}

export const OG_LOCALE: Record<Locale, string> = { vi: "vi_VN" };

/** Share image generated at build time by src/app/og.png/route.tsx. */
export const OG_IMAGE = { url: "/og.png", width: 1200, height: 630 } as const;

type PageMetaInput = {
  path: string;
  title: string;
  description: string;
  /** Use the title as-is instead of appending " | <short brand>". */
  absoluteTitle?: boolean;
  locale?: Locale;
};

export function buildMetadata({
  path,
  title,
  description,
  absoluteTitle,
  locale = DEFAULT_LOCALE,
}: PageMetaInput): Metadata {
  const fullTitle = absoluteTitle ? title : `${title} | ${shortBrand(locale)}`;
  return {
    title: { absolute: fullTitle },
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      title: fullTitle,
      description,
      url: path,
      siteName: brandName(locale),
      locale: OG_LOCALE[locale],
      images: [{ ...OG_IMAGE, alt: getContent(locale).copy.ogImage.alt }],
    },
    robots: isProduction() ? { index: true, follow: true } : { index: false, follow: false },
  };
}
