/**
 * Every internal URL comes from here. Vietnamese is served at the root without a prefix;
 * English will be added later as an `en` entry with paths under `/en/...`.
 * Published paths must never change (they are indexed and shared on Zalo/Facebook).
 */
export const ROUTE_KEYS = [
  "home",
  "obstetrics",
  "pediatrics",
  "doctors",
  "clinic",
  "contact",
  "booking",
  "privacy",
] as const;
export type RouteKey = (typeof ROUTE_KEYS)[number];

const paths = {
  vi: {
    home: "/",
    obstetrics: "/san-khoa",
    pediatrics: "/nhi-khoa",
    doctors: "/bac-si",
    clinic: "/phong-kham",
    contact: "/lien-he",
    booking: "/dat-lich",
    privacy: "/chinh-sach-bao-mat",
  },
} as const satisfies Record<string, Record<RouteKey, string>>;

export type Locale = keyof typeof paths;
export const DEFAULT_LOCALE: Locale = "vi";

/** Locales that are actually published. The language switcher only appears when this has 2+ entries. */
export const enabledLocales: readonly Locale[] = ["vi"];

export function href(key: RouteKey, locale: Locale = DEFAULT_LOCALE): string {
  return paths[locale][key];
}

export function doctorHref(slug: string, locale: Locale = DEFAULT_LOCALE): string {
  return `${paths[locale].doctors}/${slug}`;
}

export const NAV_KEYS = [
  "home",
  "obstetrics",
  "pediatrics",
  "doctors",
  "clinic",
  "contact",
] as const satisfies readonly RouteKey[];
export type NavKey = (typeof NAV_KEYS)[number];

export function allPaths(locale: Locale, doctorSlugs: readonly string[]): string[] {
  return [
    ...ROUTE_KEYS.map((key) => href(key, locale)),
    ...doctorSlugs.map((slug) => doctorHref(slug, locale)),
  ];
}
