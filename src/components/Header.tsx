import Link from "next/link";
import { getContent } from "@/content";
import { brandName } from "@/lib/metadata";
import { getDictionary } from "@/locales";
import { href, NAV_KEYS, type Locale, type NavKey } from "@/lib/routes";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { MobileNav } from "./MobileNav";

export function Header({ locale, current }: { locale: Locale; current?: NavKey }) {
  const { clinic } = getContent(locale);
  const t = getDictionary(locale);
  const items = NAV_KEYS.map((key) => ({
    key,
    href: href(key, locale),
    label: t.nav[key],
    current: key === current,
  }));

  return (
    <header className="relative border-b border-rule bg-paper">
      <div className="container-page flex min-h-16 items-center justify-between gap-4 py-3 sm:gap-6 xl:min-h-20">
        {/* Long clinic names wrap onto two lines here; navigation items never wrap. */}
        <Link href={href("home", locale)} className="group min-w-0 leading-snug no-underline">
          <span className="block max-w-[15rem] text-[0.889rem] font-semibold text-balance text-ink group-hover:text-accent sm:max-w-[20rem] sm:text-base">
            {brandName(locale)}
          </span>
        </Link>

        <nav aria-label={t.a11y.mainNav} className="hidden shrink-0 xl:block">
          <ul className="flex items-center gap-7">
            {items.map((item) => (
              <li key={item.key}>
                <Link
                  href={item.href}
                  aria-current={item.current ? "page" : undefined}
                  className={`block whitespace-nowrap py-2 text-[0.95rem] no-underline transition-colors hover:text-accent ${
                    item.current
                      ? "font-medium text-accent underline decoration-2 underline-offset-[0.6em]"
                      : "text-ink"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden shrink-0 items-center gap-5 xl:flex">
          <LanguageSwitcher locale={locale} />
          <Link href={clinic.bookingHref} className="btn btn-primary whitespace-nowrap text-[0.95rem]">
            {t.actions.book}
          </Link>
        </div>

        <MobileNav
          items={items}
          bookingHref={clinic.bookingHref}
          labels={{
            menu: t.actions.menu,
            open: t.a11y.openMenu,
            close: t.a11y.closeMenu,
            nav: t.a11y.mainNav,
            book: t.actions.book,
          }}
        >
          <LanguageSwitcher locale={locale} />
        </MobileNav>
      </div>
    </header>
  );
}
