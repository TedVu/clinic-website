import type { Metadata } from "next";
import { getContent, getDoctor } from "@/content";
import { fill } from "./content-helpers";
import { brandName, buildMetadata } from "./metadata";
import { doctorHref, href, type Locale, type RouteKey } from "./routes";

type StaticKey = Exclude<RouteKey, "home">;

/** Title and description for every page, taken from the locale's content. */
export function pageMetadata(key: RouteKey, locale: Locale): Metadata {
  const { copy } = getContent(locale);
  if (key === "home") {
    return buildMetadata({
      path: href("home", locale),
      title: fill(copy.meta.homeTitle, { clinic: brandName(locale) }),
      description: copy.meta.homeDescription,
      absoluteTitle: true,
      locale,
    });
  }
  const meta = copy.meta[key satisfies StaticKey];
  return buildMetadata({ path: href(key, locale), ...meta, locale });
}

export function doctorMetadata(slug: string, locale: Locale): Metadata {
  const { copy, specialties } = getContent(locale);
  const doctor = getDoctor(slug, locale);
  if (!doctor) return {};
  const values = {
    name: `${doctor.title} ${doctor.name}`,
    specialty: specialties[doctor.specialty].name,
    specialtyLower: specialties[doctor.specialty].name.toLocaleLowerCase(locale),
  };
  return buildMetadata({
    path: doctorHref(slug, locale),
    title: fill(copy.meta.doctor.title, values),
    description: fill(copy.meta.doctor.description, values),
    locale,
  });
}
