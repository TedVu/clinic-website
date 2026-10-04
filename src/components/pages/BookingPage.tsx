import { getContent } from "@/content";
import { isSupplied } from "@/content/pending";
import { formatHours, telHref } from "@/lib/content-helpers";
import { getDictionary } from "@/locales";
import { href, type Locale } from "@/lib/routes";
import { ContactActions } from "../ContactActions";
import { Fact } from "../Fact";
import { PageHeader } from "../PageHeader";
import { PageShell } from "../PageShell";
import { Section } from "../Section";
import { ZaloQr } from "../ZaloQr";

/** Booking by phone and Zalo. No form and no data collection (a separate booking app comes later). */
export function BookingPage({ locale }: { locale: Locale }) {
  const { clinic, copy } = getContent(locale);
  const t = getDictionary(locale);

  return (
    <PageShell locale={locale}>
      <PageHeader
        locale={locale}
        crumbs={[
          { name: t.nav.home, path: href("home", locale) },
          { name: copy.bookingPage.heading, path: href("booking", locale) },
        ]}
        title={copy.bookingPage.heading}
      >
        <p>{copy.bookingPage.intro}</p>
      </PageHeader>

      <div className="container-page pb-14 md:pb-20">
        {/* Phones: two large actions with hours right below. */}
        <div className="md:hidden" data-booking="mobile">
          <ContactActions locale={locale} />
        </div>

        {/* Wider screens: the number as large text, and a QR code to continue on a phone. */}
        <div className="hidden border-t border-rule pt-10 md:grid md:grid-cols-2 md:gap-12" data-booking="desktop">
          <div>
            <h2 className="text-h3 text-ink-muted">{t.labels.phone}</h2>
            <Fact value={clinic.phone} locale={locale}>
              {(phone) => (
                <a
                  href={telHref(phone)}
                  className="mt-3 block text-[2.222rem] font-semibold leading-tight text-ink no-underline select-all hover:text-accent"
                  data-booking-phone=""
                >
                  {phone}
                </a>
              )}
            </Fact>
          </div>
          <div>
            <h2 className="text-h3 text-ink-muted">{t.labels.zalo}</h2>
            <Fact value={clinic.zaloUrl} locale={locale}>
              {(url) => (
                <div className="mt-3 flex items-start gap-6">
                  <ZaloQr url={url} label={copy.bookingPage.qrCaption} />
                  <div>
                    <p className="max-w-[16rem]">{copy.bookingPage.qrCaption}</p>
                    <a href={url} target="_blank" rel="noopener" className="link mt-3 inline-block">
                      {t.actions.openZalo}
                      <span className="sr-only"> {t.a11y.opensInNewTab}</span>
                    </a>
                  </div>
                </div>
              )}
            </Fact>
          </div>
          <div className="col-span-2 border-t border-rule pt-6 text-ink-muted">
            <Fact value={clinic.hours} locale={locale}>
              {(hours) => (
                <p>
                  <span className="font-medium text-ink">{t.labels.hours}: </span>
                  {formatHours(hours, t).join("; ")}
                </p>
              )}
            </Fact>
            {isSupplied(clinic.hoursNote) && <p className="mt-1 text-small">{clinic.hoursNote}</p>}
            <p className="mt-1 text-small">{copy.bookingPage.hoursReminder}</p>
          </div>
        </div>
      </div>

      <Section heading={copy.bookingPage.stepsHeading}>
        <Fact value={clinic.bookingSteps} locale={locale}>
          {(steps) => (
            <ol className="max-w-2xl space-y-4">
              {steps.map((step, index) => (
                <li key={step} className="grid grid-cols-[2rem_1fr] border-t border-rule pt-4">
                  <span className="font-semibold text-accent">{index + 1}.</span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          )}
        </Fact>
      </Section>
    </PageShell>
  );
}
