import { doctorForSpecialty, getContent } from "@/content";
import type { SpecialtyKey } from "@/content/schema";
import { visibleServices } from "@/lib/content-helpers";
import { getDictionary } from "@/locales";
import { href, type Locale } from "@/lib/routes";
import { BookingCta } from "../BookingCta";
import { DoctorProfile } from "../DoctorProfile";
import { PageHeader } from "../PageHeader";
import { PageShell } from "../PageShell";
import { Section } from "../Section";
import { ServiceSection } from "../ServiceSection";

export function SpecialtyPage({ locale, specialty: key }: { locale: Locale; specialty: SpecialtyKey }) {
  const { copy, specialties, services } = getContent(locale);
  const t = getDictionary(locale);
  const specialty = specialties[key];
  const doctor = doctorForSpecialty(key, locale);

  return (
    <PageShell locale={locale} current={key}>
      <PageHeader
        locale={locale}
        crumbs={[
          { name: t.nav.home, path: href("home", locale) },
          { name: specialty.name, path: href(key, locale) },
        ]}
        eyebrow={t.labels.specialty}
        title={specialty.name}
      >
        {specialty.intro.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </PageHeader>

      <Section id="dich-vu" heading={copy.specialtyPage.servicesHeading}>
        <ServiceSection
          services={visibleServices(services, key)}
          unconfirmedLabel={t.labels.unconfirmedService}
        />
      </Section>

      <Section heading={copy.specialtyPage.doctorHeading}>
        <div className="-mt-10 md:-mt-14">
          <DoctorProfile doctor={doctor} locale={locale} variant="summary" />
        </div>
      </Section>

      <BookingCta locale={locale} heading={t.actions.book} text={copy.specialtyPage.bookingText} />
    </PageShell>
  );
}
