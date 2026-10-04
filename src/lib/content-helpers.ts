import { isSupplied, type Fact } from "@/content/pending";
import type { Clinic, OpeningHours, Service, SpecialtyKey } from "@/content/schema";
import type { Dictionary } from "@/locales";
import { isProduction } from "./env";

/** Services visible on this build: confirmed only in production, all (marked) elsewhere. */
export function visibleServices(services: Service[], specialty: SpecialtyKey): Service[] {
  return services.filter((s) => s.specialty === specialty && (s.confirmed || !isProduction()));
}

export function confirmedServices(services: Service[], specialty: SpecialtyKey): Service[] {
  return services.filter((s) => s.specialty === specialty && s.confirmed);
}

/**
 * Plain text for a fact where markup isn't possible (titles, meta, alt text).
 * Pending facts become "[label]" on previews and "" in production.
 */
export function factText(value: Fact<string>): string {
  if (isSupplied(value)) return value;
  return isProduction() ? "" : `[${value.label}]`;
}

/** "0901 234 567" -> "tel:+84901234567". Undefined while the phone number is pending. */
export function telHref(phone: Fact<string>): string | undefined {
  if (!isSupplied(phone)) return undefined;
  const digits = phone.replace(/[^\d+]/g, "");
  const international = digits.startsWith("+") ? digits : digits.replace(/^0/, "+84");
  return `tel:${international}`;
}

export function fullAddress(clinic: Clinic): Fact<string> {
  const { street, ward, city } = clinic.address;
  if (!isSupplied(street)) return street;
  if (!isSupplied(ward)) return ward;
  return `${street}, ${ward}, ${city}`;
}

/** Clinic's Maps link, or a Google Maps search for the full address while the link is pending. */
export function mapsHref(clinic: Clinic): string | undefined {
  if (isSupplied(clinic.mapsUrl)) return clinic.mapsUrl;
  const address = fullAddress(clinic);
  if (!isSupplied(address)) return undefined;
  const query = isSupplied(clinic.name) ? `${clinic.name}, ${address}` : address;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

const DAY_ORDER = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"] as const;

/** ["mon","tue","wed"] -> "Thứ Hai – Thứ Tư"; non-consecutive days are listed with commas. */
export function formatDays(days: OpeningHours["days"], t: Dictionary): string {
  const sorted = [...days].sort((a, b) => DAY_ORDER.indexOf(a) - DAY_ORDER.indexOf(b));
  const first = sorted[0];
  const last = sorted.at(-1);
  if (!first || !last) return "";
  const consecutive =
    sorted.length > 2 &&
    DAY_ORDER.indexOf(last) - DAY_ORDER.indexOf(first) === sorted.length - 1;
  if (consecutive) return `${t.days[first]} – ${t.days[last]}`;
  return sorted.map((d) => t.days[d]).join(", ");
}

export function formatHours(hours: OpeningHours[], t: Dictionary): string[] {
  return hours.map((h) => `${formatDays(h.days, t)}: ${h.opens} – ${h.closes}`);
}

/** Replaces "{key}" tokens in a copy template. */
export function fill(template: string, values: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) => values[key] ?? match);
}
