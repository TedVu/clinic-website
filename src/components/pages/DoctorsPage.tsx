import { getContent } from "@/content";
import { getDictionary } from "@/locales";
import { href, type Locale } from "@/lib/routes";
import { BookingCta } from "../BookingCta";
import { DoctorProfile } from "../DoctorProfile";
import { PageHeader } from "../PageHeader";
import { PageShell } from "../PageShell";

export function DoctorsPage({ locale }: { locale: Locale }) {
  const { copy, doctors } = getContent(locale);
  const t = getDictionary(locale);

  return (
    <PageShell locale={locale} current="doctors">
      <PageHeader
        locale={locale}
        crumbs={[
          { name: t.nav.home, path: href("home", locale) },
          { name: copy.doctorsPage.heading, path: href("doctors", locale) },
        ]}
        title={copy.doctorsPage.heading}
      >
        <p>{copy.doctorsPage.intro}</p>
      </PageHeader>

      {/* Each doctor gets a full-width row; portraits alternate sides on wide screens. */}
      <div className="border-t border-rule">
        <div className="container-page divide-y divide-rule">
          {doctors.map((doctor, index) => (
            <DoctorProfile
              key={doctor.slug}
              doctor={doctor}
              locale={locale}
              variant="summary"
              headingLevel="h2"
              reverse={index % 2 === 1}
            />
          ))}
        </div>
      </div>

      <BookingCta locale={locale} heading={t.actions.book} text={copy.specialtyPage.bookingText} />
    </PageShell>
  );
}
