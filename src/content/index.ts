import type { Locale } from "@/lib/routes";
import type { Doctor, SiteContent, SpecialtyKey } from "./schema";
import { clinic } from "./vi/clinic";
import { doctors } from "./vi/doctors";
import { copy } from "./vi/pages";
import { services, specialties } from "./vi/services";

const content: Record<Locale, SiteContent> = {
  vi: { clinic, doctors, specialties, services, copy },
};

export function getContent(locale: Locale = "vi"): SiteContent {
  return content[locale];
}

export function getDoctor(slug: string, locale: Locale = "vi"): Doctor | undefined {
  return getContent(locale).doctors.find((doctor) => doctor.slug === slug);
}

export function doctorForSpecialty(key: SpecialtyKey, locale: Locale = "vi"): Doctor {
  const c = getContent(locale);
  const doctor = c.doctors.find((d) => d.slug === c.specialties[key].doctorSlug);
  if (!doctor) throw new Error(`No doctor configured for specialty "${key}"`);
  return doctor;
}
