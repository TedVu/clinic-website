import type { ReactNode } from "react";
import { getContent } from "@/content";
import { isSupplied, type Fact as FactValue } from "@/content/pending";
import { formatHours, fullAddress, mapsHref, telHref } from "@/lib/content-helpers";
import { getDictionary } from "@/locales";
import type { Locale } from "@/lib/routes";
import { Fact, shouldRender } from "./Fact";

type Field =
  "address" | "hours" | "phone" | "zalo" | "email" | "parking" | "whatToBring" | "bookingSteps";

const DEFAULT_FIELDS: Field[] = ["address", "hours", "phone", "zalo"];

/**
 * Practical clinic facts as a definition list with hairline rules. Rows for pending facts are
 * omitted on the live site (no empty labels) and shown with a marker on previews.
 */
export function ClinicInformation({
  locale,
  fields = DEFAULT_FIELDS,
}: {
  locale: Locale;
  fields?: Field[];
}) {
  const { clinic } = getContent(locale);
  const t = getDictionary(locale);

  const row = <T,>(
    field: Field,
    label: string,
    value: FactValue<T> | undefined,
    render: (v: T) => ReactNode,
  ) =>
    // `undefined` means the clinic doesn't use this field at all (e.g. no public email): no row.
    fields.includes(field) && value !== undefined && shouldRender(value) ? (
      <div
        key={field}
        data-field={field}
        className="grid gap-1 border-b border-rule py-5 sm:grid-cols-3 sm:gap-6"
      >
        <dt className="font-medium">{label}</dt>
        <dd className="sm:col-span-2">
          <Fact value={value} locale={locale}>
            {render}
          </Fact>
        </dd>
      </div>
    ) : null;

  const maps = mapsHref(clinic);

  const rows = [
    row("address", t.labels.address, fullAddress(clinic), (address) => (
      <>
        <p className="select-text">{address}</p>
        {maps && (
          <a href={maps} target="_blank" rel="noopener" className="link mt-1 inline-block">
            {t.actions.directions}
            <span className="sr-only"> {t.a11y.opensInNewTab}</span>
          </a>
        )}
      </>
    )),
    row("hours", t.labels.hours, clinic.hours, (hours) => (
      <>
        {formatHours(hours, t).map((line) => (
          <p key={line}>{line}</p>
        ))}
        {isSupplied(clinic.hoursNote) && <p className="text-ink-muted">{clinic.hoursNote}</p>}
      </>
    )),
    row("phone", t.labels.phone, clinic.phone, (phone) => (
      <a href={telHref(phone)} className="link text-lg font-medium">
        {phone}
      </a>
    )),
    row("zalo", t.labels.zalo, clinic.zaloUrl, (url) => (
      <a href={url} target="_blank" rel="noopener" className="link">
        {t.actions.messageZalo}
        <span className="sr-only"> {t.a11y.opensInNewTab}</span>
      </a>
    )),
    row("email", t.labels.email, clinic.email, (email) => (
      <a href={`mailto:${email}`} className="link">
        {email}
      </a>
    )),
    row("parking", t.labels.parking, clinic.parking, (parking) => <p>{parking}</p>),
    row("whatToBring", t.labels.whatToBring, clinic.whatToBring, (items) => (
      <ul className="list-disc space-y-1 pl-5">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    )),
    row("bookingSteps", t.labels.bookingSteps, clinic.bookingSteps, (steps) => (
      <ol className="list-decimal space-y-1 pl-5">
        {steps.map((step) => (
          <li key={step}>{step}</li>
        ))}
      </ol>
    )),
  ]
    .filter((element) => element !== null)
    // Rows follow the order the caller listed the fields in.
    .sort((a, b) => fields.indexOf(a.key as Field) - fields.indexOf(b.key as Field));

  // Nothing to show (all requested facts pending on the live site): render no empty list or rule.
  if (rows.length === 0) return null;
  return <dl className="border-t border-rule">{rows}</dl>;
}
