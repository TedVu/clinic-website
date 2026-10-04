import Link from "next/link";
import { getDictionary } from "@/locales";
import { breadcrumbJsonLd, type Crumb } from "@/lib/schema-org";
import type { Locale } from "@/lib/routes";
import { JsonLd } from "./JsonLd";

/** Visible breadcrumb trail plus its BreadcrumbList structured data. The last crumb is the current page. */
export function Breadcrumbs({ crumbs, locale }: { crumbs: Crumb[]; locale: Locale }) {
  const t = getDictionary(locale);
  return (
    <>
      <nav aria-label={t.a11y.breadcrumb} className="text-small text-ink-muted">
        <ol className="flex flex-wrap gap-x-2">
          {crumbs.map((crumb, index) => {
            const last = index === crumbs.length - 1;
            return (
              <li key={crumb.path} className="flex gap-x-2">
                {last ? (
                  <span aria-current="page">{crumb.name}</span>
                ) : (
                  <>
                    <Link href={crumb.path} className="text-ink-muted hover:text-accent">
                      {crumb.name}
                    </Link>
                    <span aria-hidden="true">/</span>
                  </>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
    </>
  );
}
