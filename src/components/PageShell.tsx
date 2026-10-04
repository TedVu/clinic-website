import type { ReactNode } from "react";
import { getDictionary } from "@/locales";
import type { Locale, NavKey } from "@/lib/routes";
import { ActionBar } from "./ActionBar";
import { Footer } from "./Footer";
import { Header } from "./Header";

/**
 * Header, main content, footer and the mobile action bar. Rendered per page (not in the layout)
 * so the current navigation item is known at build time without client JavaScript.
 */
export function PageShell({
  locale,
  current,
  children,
}: {
  locale: Locale;
  current?: NavKey;
  children: ReactNode;
}) {
  const t = getDictionary(locale);
  return (
    // Bottom padding on phones keeps the fixed action bar from covering the footer.
    <div className="flex min-h-dvh flex-col pb-[calc(3.5rem+1px+env(safe-area-inset-bottom))] md:pb-0">
      <a
        href="#main"
        className="btn btn-primary fixed left-3 top-3 z-[60] -translate-y-24 focus:translate-y-0"
      >
        {t.a11y.skipToContent}
      </a>
      <Header locale={locale} current={current} />
      <main id="main" tabIndex={-1} className="flex-1 focus:outline-none">
        {children}
      </main>
      <Footer locale={locale} />
      <ActionBar locale={locale} />
    </div>
  );
}
