import { isSupplied, type Fact } from "@/content/pending";
import type { Clinic, DayOfWeek, Doctor, Photo, Service, SpecialtyKey } from "@/content/schema";
import { mapsHref } from "./content-helpers";
import { getImage, loadImageManifest, type ImageManifest } from "./image-manifest";
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

/** Absolute URL of a photo's largest WebP variant; JSON-LD needs absolute URLs. */
export function photoUrl(
  photo: Fact<Photo>,
  manifest: ImageManifest = loadImageManifest(),
): string | undefined {
  if (!isSupplied(photo)) return undefined;
  const largest = getImage(photo.image, manifest).webp.reduce((a, b) => (b.width > a.width ? b : a));
  return `${siteUrl()}${largest.src}`;
}

/** Only the URLs actually supplied; undefined (property omitted) when there are none. */
function suppliedUrls(...facts: Fact<string | string[]>[]): string[] | undefined {
  const urls = facts.filter(isSupplied).flat();
  return urls.length > 0 ? urls : undefined;
}

export function medicalClinicJsonLd(
  clinic: Clinic,
  services: Service[],
  manifest: ImageManifest = loadImageManifest(),
): JsonLd {
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
    image: photoUrl(clinic.photos.hero, manifest),
    // The district people search by; the postal address above keeps the official ward.
    areaServed: [
      { "@type": "AdministrativeArea", name: clinic.district },
      { "@type": "City", name: clinic.address.city },
    ],
    // Confirmed only, on every build: structured data never advertises an unconfirmed service.
    availableService: services
      .filter((s) => s.confirmed)
      .map((s) => ({ "@type": "MedicalProcedure", name: s.name, description: s.summary })),
    sameAs: suppliedUrls(
      clinic.profiles.googleBusiness,
      clinic.profiles.facebook,
      clinic.profiles.directories,
    ),
    // No aggregateRating or review: search engines disallow self-serving review markup.
  });
}

export function physicianJsonLd(
  doctor: Doctor,
  clinic: Clinic,
  jobTitle: string,
  manifest: ImageManifest = loadImageManifest(),
): JsonLd {
  return compact({
    "@context": "https://schema.org",
    // Schema.org's Physician is an organization type; adding Person makes jobTitle and worksFor
    // valid and describes the doctor as an individual.
    "@type": ["Person", "Physician"],
    name: `${doctor.title} ${doctor.name}`,
    url: `${siteUrl()}${doctorHref(doctor.slug)}`,
    jobTitle,
    medicalSpecialty: SPECIALTY_URI[doctor.specialty],
    description: isSupplied(doctor.summary) ? doctor.summary : undefined,
    image: photoUrl(doctor.portrait, manifest),
    knowsAbout: isSupplied(doctor.interests) ? doctor.interests : undefined,
    sameAs: suppliedUrls(doctor.profiles),
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
