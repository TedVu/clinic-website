import Link from "next/link";
import { getDictionary } from "@/locales";
import { enabledLocales, href, type Locale } from "@/lib/routes";

export function shouldShowLanguageSwitcher(locales: readonly Locale[] = enabledLocales): boolean {
  return locales.length > 1;
}

/** Hidden until a second locale is published, so there is never a dead link to English. */
export function LanguageSwitcher({
  locale,
  locales = enabledLocales,
}: {
  locale: Locale;
  locales?: readonly Locale[];
}) {
  if (!shouldShowLanguageSwitcher(locales)) return null;
  const t = getDictionary(locale);
  return (
    <nav aria-label={t.a11y.languageSwitcher}>
      <ul className="flex gap-3 text-small">
        {locales.map((code) => (
          <li key={code}>
            <Link
              href={href("home", code)}
              hrefLang={code}
              lang={code}
              aria-current={code === locale ? "true" : undefined}
              className={code === locale ? "font-medium text-ink no-underline" : "link"}
            >
              {getDictionary(code).languageName}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
