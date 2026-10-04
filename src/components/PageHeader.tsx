import type { ReactNode } from "react";
import type { Crumb } from "@/lib/schema-org";
import type { Locale } from "@/lib/routes";
import { Breadcrumbs } from "./Breadcrumbs";

/** Top of an inner page: breadcrumb, optional eyebrow, the page's single h1 and a lead paragraph. */
export function PageHeader({
  locale,
  crumbs,
  eyebrow,
  title,
  children,
}: {
  locale: Locale;
  crumbs: Crumb[];
  eyebrow?: ReactNode;
  title: string;
  children?: ReactNode;
}) {
  return (
    <div className="container-page pb-12 pt-8 md:pb-16 md:pt-10">
      <Breadcrumbs crumbs={crumbs} locale={locale} />
      <div className="mt-8 max-w-3xl md:mt-12">
        {eyebrow && <p className="mb-3 text-eyebrow font-medium text-accent">{eyebrow}</p>}
        <h1 className="text-h1 md:text-[2.333rem]">{title}</h1>
        {children && <div className="mt-5 space-y-4 text-lead text-ink-muted">{children}</div>}
      </div>
    </div>
  );
}
