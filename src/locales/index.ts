import type { Locale } from "@/lib/routes";
import { vi, type Dictionary } from "./vi";

export type { Dictionary } from "./vi";

const dictionaries: Record<Locale, Dictionary> = { vi };

export function getDictionary(locale: Locale = "vi"): Dictionary {
  return dictionaries[locale];
}
