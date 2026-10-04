import type { ReactNode } from "react";
import { isSupplied, type Fact as FactValue } from "@/content/pending";
import { isProduction } from "@/lib/env";
import { getDictionary } from "@/locales";
import type { Locale } from "@/lib/routes";

type Props<T> = {
  value: FactValue<T>;
  children: (value: T) => ReactNode;
  /** Render the preview marker inline (inside a sentence or row) instead of as a block. */
  inline?: boolean;
  locale?: Locale;
};

/**
 * Renders a clinic-supplied fact. When the fact is pending:
 * - production: renders nothing, so the live site never shows placeholders
 * - preview/development: renders a dashed marker naming what still needs to be supplied
 */
export function Fact<T>({ value, children, inline, locale }: Props<T>) {
  if (isSupplied(value)) return <>{children(value)}</>;
  if (isProduction()) return null;
  return <PendingMarker label={value.label} inline={inline} locale={locale} />;
}

export function PendingMarker({
  label,
  inline,
  locale,
}: {
  label: string;
  inline?: boolean;
  locale?: Locale;
}) {
  const Tag = inline ? "span" : "p";
  return (
    <Tag className="pending-marker" data-pending="">
      {getDictionary(locale).labels.pendingPrefix}: {label}
    </Tag>
  );
}

/** True when a fact should take up space on the page: supplied, or a preview showing its marker. */
export function shouldRender<T>(value: FactValue<T>): boolean {
  return isSupplied(value) || !isProduction();
}
