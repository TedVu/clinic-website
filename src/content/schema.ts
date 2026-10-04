/**
 * The shape of all site content. Each locale provides content of exactly this shape
 * (src/content/<locale>/), so an English translation is checked by the compiler.
 *
 * Rules (see docs/content-checklist.md):
 * - Clinic facts and doctor credentials are `Fact<T>`: either the real value supplied by
 *   the clinic, or `pending("...")`. Never an empty string, a guess or placeholder text.
 * - Services carry `confirmed`; only confirmed services are shown on the live site.
 * - No reviews, ratings, statistics, superlatives or outcome promises anywhere.
 */
import type { Fact } from "./pending";

export type { Fact, Pending } from "./pending";

export type SpecialtyKey = "obstetrics" | "pediatrics";

export type DayOfWeek = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";

export type OpeningHours = {
  days: DayOfWeek[];
  /** 24-hour "HH:MM" */
  opens: string;
  closes: string;
};

/** A real photograph in assets/photos/<image>.(jpg|png|webp). */
export type Photo = { image: string; alt: string };

export type Clinic = {
  name: Fact<string>;
  /** Generic, always-true description, e.g. "Phòng khám Sản – Nhi". */
  descriptor: string;
  address: {
    street: Fact<string>;
    ward: Fact<string>;
    city: string;
    country: "VN";
  };
  /** As patients should see it, e.g. "0901 234 567". */
  phone: Fact<string>;
  /** Full Zalo link: https://zalo.me/<phone> (personal) or https://zalo.me/<oa-id> (Official Account). */
  zaloUrl: Fact<string>;
  /** Optional: leave out entirely if the clinic has no public email. */
  email?: Fact<string>;
  hours: Fact<OpeningHours[]>;
  hoursNote: Fact<string>;
  /** Google Maps link for the clinic. If pending, a Maps search for the address is used. */
  mapsUrl: Fact<string>;
  geo: Fact<{ latitude: number; longitude: number }>;
  parking: Fact<string>;
  whatToBring: Fact<string[]>;
  bookingSteps: Fact<string[]>;
  /** Public site address with https://, no trailing slash. */
  siteUrl: Fact<string>;
  /** Where every "Đặt lịch khám" action goes. Replace with the booking app URL when it exists. */
  bookingHref: string;
  photos: {
    hero: Fact<Photo>;
    interior: Fact<Photo>;
  };
};

export type Doctor = {
  slug: string;
  /** Professional title shown before the name, e.g. "BS." */
  title: string;
  name: string;
  specialty: SpecialtyKey;
  portrait: Fact<Photo>;
  /** One or two sentences for overview sections. */
  summary: Fact<string>;
  bio: Fact<string[]>;
  qualifications: Fact<string[]>;
  experience: Fact<string[]>;
  affiliations: Fact<string[]>;
  interests: Fact<string[]>;
};

export type Specialty = {
  key: SpecialtyKey;
  name: string;
  doctorSlug: string;
  /** One sentence for the home page. */
  shortIntro: string;
  /** Paragraphs for the specialty page. */
  intro: string[];
};

export type Service = {
  /** Stable id, used as the anchor and as the future per-service page slug. */
  id: string;
  specialty: SpecialtyKey;
  name: string;
  summary: string;
  /** Set to true only when the clinic confirms it offers this service. */
  confirmed: boolean;
};

export type PageMeta = { title: string; description: string };

export type Principle = { title: string; text: string };

export type SiteCopy = {
  meta: {
    /** Absolute title for the home page; "{clinic}" is replaced with the clinic name. */
    homeTitle: string;
    homeDescription: string;
    obstetrics: PageMeta;
    pediatrics: PageMeta;
    doctors: PageMeta;
    /** "{name}", "{specialty}" and "{specialtyLower}" are replaced per doctor. */
    doctor: PageMeta;
    clinic: PageMeta;
    contact: PageMeta;
    booking: PageMeta;
    privacy: PageMeta;
    notFound: PageMeta;
  };
  hero: {
    /** Short line above the headline naming both specialties and the city. */
    eyebrow: string;
    headline: string;
    lead: string;
  };
  home: {
    specialtiesHeading: string;
    doctorsHeading: string;
    doctorsIntro: string;
    principlesHeading: string;
    visitHeading: string;
    bookingHeading: string;
    bookingText: string;
  };
  principles: Principle[];
  specialtyPage: {
    servicesHeading: string;
    doctorHeading: string;
    bookingText: string;
  };
  doctorsPage: {
    heading: string;
    intro: string;
  };
  clinicPage: {
    heading: string;
    intro: string;
  };
  contactPage: {
    heading: string;
    intro: string;
  };
  bookingPage: {
    heading: string;
    intro: string;
    stepsHeading: string;
    qrCaption: string;
    hoursReminder: string;
  };
  privacy: {
    /** Must be set to true once the clinic has reviewed and approved the text (launch-blocking). */
    approved: boolean;
    heading: string;
    updated: string;
    sections: { heading: string; paragraphs: string[] }[];
  };
  footer: {
    disclaimer: string;
  };
  notFound: {
    heading: string;
    text: string;
  };
  ogImage: {
    alt: string;
  };
};

export type SiteContent = {
  clinic: Clinic;
  doctors: Doctor[];
  specialties: Record<SpecialtyKey, Specialty>;
  services: Service[];
  copy: SiteCopy;
};
