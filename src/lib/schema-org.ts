import { isSupplied } from "@/content/pending";
import type { Clinic, DayOfWeek, Doctor, SpecialtyKey } from "@/content/schema";
import { mapsHref } from "./content-helpers";
import { siteUrl } from "./metadata";
import { doctorHref } from "./routes";

/**
 * Schema.org JSON-LD built only from supplied facts: a pending fact drops its property
 * entirely rather than emitting a placeholder.
 */
type JsonLd = Record<string, unknown>;

const DAY_URI: Record<DayOfWeek, string> = {
  mon: "https://schema.org/Monday",
  tue: "https://schema.org/Tuesday",
  wed: "https://schema.org/Wednesday",
  thu: "https://schema.org/Thursday",
  fri: "https://schema.org/Friday",
  sat: "https://schema.org/Saturday",
  sun: "https://schema.org/Sunday",
};

const SPECIALTY_URI: Record<SpecialtyKey, string> = {
  obstetrics: "https://schema.org/Obstetric",
  pediatrics: "https://schema.org/Pediatric",
};

function compact(object: JsonLd): JsonLd {
  return Object.fromEntries(Object.entries(object).filter(([, value]) => value !== undefined));
}

export function clinicId(): string {
  return `${siteUrl()}/#clinic`;
}

export function medicalClinicJsonLd(clinic: Clinic): JsonLd {
  const { street, ward, city, country } = clinic.address;
  const address =
    isSupplied(street) && isSupplied(ward)
      ? {
          "@type": "PostalAddress",
          streetAddress: street,
          addressLocality: ward,
          addressRegion: city,
          addressCountry: country,
        }
      : undefined;

  return compact({
    "@context": "https://schema.org",
    "@type": "MedicalClinic",
    "@id": clinicId(),
    name: isSupplied(clinic.name) ? clinic.name : undefined,
    url: `${siteUrl()}/`,
    telephone: isSupplied(clinic.phone) ? clinic.phone : undefined,
    email: clinic.email !== undefined && isSupplied(clinic.email) ? clinic.email : undefined,
    address,
    geo: isSupplied(clinic.geo)
      ? { "@type": "GeoCoordinates", latitude: clinic.geo.latitude, longitude: clinic.geo.longitude }
      : undefined,
    hasMap: isSupplied(clinic.mapsUrl) ? mapsHref(clinic) : undefined,
    openingHoursSpecification: isSupplied(clinic.hours)
      ? clinic.hours.map((h) => ({
          "@type": "OpeningHoursSpecification",
          dayOfWeek: h.days.map((d) => DAY_URI[d]),
          opens: h.opens,
          closes: h.closes,
        }))
      : undefined,
    medicalSpecialty: [SPECIALTY_URI.obstetrics, SPECIALTY_URI.pediatrics],
  });
}

export function physicianJsonLd(doctor: Doctor, clinic: Clinic): JsonLd {
  return compact({
    "@context": "https://schema.org",
    "@type": "Physician",
    name: `${doctor.title} ${doctor.name}`,
    url: `${siteUrl()}${doctorHref(doctor.slug)}`,
    medicalSpecialty: SPECIALTY_URI[doctor.specialty],
    description: isSupplied(doctor.summary) ? doctor.summary : undefined,
    telephone: isSupplied(clinic.phone) ? clinic.phone : undefined,
    worksFor: { "@id": clinicId() },
  });
}

export type Crumb = { name: string; path: string };

export function breadcrumbJsonLd(crumbs: Crumb[]): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: `${siteUrl()}${crumb.path === "/" ? "/" : crumb.path}`,
    })),
  };
}
