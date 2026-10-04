import Link from "next/link";
import { getContent } from "@/content";
import { getDictionary } from "@/locales";
import type { Locale } from "@/lib/routes";
import { ContactActions } from "./ContactActions";
import { Section } from "./Section";

/** Closing call to action used at the end of pages. */
export function BookingCta({ locale, heading, text }: { locale: Locale; heading: string; text: string }) {
  const { clinic } = getContent(locale);
  const t = getDictionary(locale);
  return (
    <Section id="dat-lich-kham" heading={heading} intro={<p>{text}</p>} tone="surface">
      <ContactActions locale={locale} />
      <p className="mt-6">
        <Link href={clinic.bookingHref} className="link" data-booking-link="">
          {t.actions.book}
        </Link>
      </p>
    </Section>
  );
}
