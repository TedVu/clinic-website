import Link from "next/link";
import { getContent } from "@/content";
import { isSupplied } from "@/content/pending";
import { formatHours, fullAddress, telHref } from "@/lib/content-helpers";
import { brandName } from "@/lib/metadata";
import { getDictionary } from "@/locales";
import { doctorHref, href, NAV_KEYS, type Locale } from "@/lib/routes";
import { Fact } from "./Fact";

export function Footer({ locale }: { locale: Locale }) {
  const { clinic, doctors, specialties, copy } = getContent(locale);
  const t = getDictionary(locale);

  return (
    <footer className="border-t border-rule bg-surface">
      <div className="container-page grid gap-10 py-14 md:grid-cols-12 md:gap-8">
        <div className="md:col-span-5" data-footer-clinic="">
          <p className="font-semibold">{brandName(locale)}</p>
          <address className="mt-4 space-y-2 not-italic text-small">
            <Fact value={fullAddress(clinic)} locale={locale}>
              {(address) => <p data-footer-address="">{address}</p>}
            </Fact>
            <Fact value={clinic.phone} locale={locale}>
              {(phone) => (
                <p>
                  {t.labels.phone}:{" "}
                  <a href={telHref(phone)} className="link" data-footer-phone="">
                    {phone}
                  </a>
                </p>
              )}
            </Fact>
            <Fact value={clinic.hours} locale={locale}>
              {(hours) => (
                <div>
                  <p>{t.labels.hours}:</p>
                  {formatHours(hours, t).map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                  {isSupplied(clinic.hoursNote) && <p>{clinic.hoursNote}</p>}
                </div>
              )}
            </Fact>
          </address>
        </div>

        <div className="md:col-span-4">
          <h2 className="text-small font-semibold text-ink-muted">{t.footer.doctorsHeading}</h2>
          <ul className="mt-3 space-y-3 text-small">
            {doctors.map((doctor) => (
              <li key={doctor.slug}>
                <Link href={doctorHref(doctor.slug, locale)} className="link">
                  {doctor.title} {doctor.name}
                </Link>
                <span className="block text-ink-muted">{specialties[doctor.specialty].name}</span>
              </li>
            ))}
          </ul>
        </div>

        <nav aria-label={t.a11y.footerNav} className="md:col-span-3">
          <h2 className="text-small font-semibold text-ink-muted">{t.footer.navHeading}</h2>
          <ul className="mt-3 space-y-2 text-small">
            {[...NAV_KEYS, "booking" as const].map((key) => (
              <li key={key}>
                <Link href={href(key, locale)} className="text-ink no-underline hover:text-accent hover:underline">
                  {t.nav[key]}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="border-t border-rule">
        <div className="container-page space-y-3 py-6 text-small text-ink-muted">
          <p className="max-w-3xl">{copy.footer.disclaimer}</p>
          <p>
            © {new Date().getFullYear()} {brandName(locale)} ·{" "}
            <Link href={href("privacy", locale)} className="link">
              {t.nav.privacy}
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
