import { getContent } from "@/content";
import { medicalClinicJsonLd } from "@/lib/schema-org";
import { getDictionary } from "@/locales";
import { href, type Locale } from "@/lib/routes";
import { BookingCta } from "../BookingCta";
import { ClinicInformation } from "../ClinicInformation";
import { Fact } from "../Fact";
import { JsonLd } from "../JsonLd";
import { PageHeader } from "../PageHeader";
import { PageShell } from "../PageShell";
import { ResponsiveImage } from "../ResponsiveImage";

export function ClinicPage({ locale }: { locale: Locale }) {
  const { clinic, copy, services } = getContent(locale);
  const t = getDictionary(locale);

  return (
    <PageShell locale={locale} current="clinic">
      <JsonLd data={medicalClinicJsonLd(clinic, services)} />
      <PageHeader
        locale={locale}
        crumbs={[
          { name: t.nav.home, path: href("home", locale) },
          { name: copy.clinicPage.heading, path: href("clinic", locale) },
        ]}
        title={copy.clinicPage.heading}
      >
        <p>{copy.clinicPage.intro}</p>
      </PageHeader>

      <div className="container-page grid gap-12 pb-16 md:pb-24 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <ClinicInformation
            locale={locale}
            fields={["address", "hours", "phone", "zalo", "parking", "whatToBring", "bookingSteps"]}
          />
        </div>
        <div className="lg:col-span-5">
          <Fact value={clinic.photos.interior} locale={locale}>
            {(photo) => (
              <ResponsiveImage
                photo={photo}
                sizes="(min-width: 64rem) 38vw, 100vw"
                className="h-auto w-full"
              />
            )}
          </Fact>
        </div>
      </div>

      <BookingCta locale={locale} heading={t.actions.book} text={copy.specialtyPage.bookingText} />
    </PageShell>
  );
}
