import Link from "next/link";
import { doctorForSpecialty, getContent } from "@/content";
import { isSupplied } from "@/content/pending";
import type { SpecialtyKey } from "@/content/schema";
import { visibleServices } from "@/lib/content-helpers";
import { medicalClinicJsonLd } from "@/lib/schema-org";
import { getDictionary } from "@/locales";
import { doctorHref, href, type Locale } from "@/lib/routes";
import { BookingCta } from "../BookingCta";
import { ClinicInformation } from "../ClinicInformation";
import { DoctorProfile } from "../DoctorProfile";
import { PendingMarker } from "../Fact";
import { JsonLd } from "../JsonLd";
import { PageShell } from "../PageShell";
import { ResponsiveImage } from "../ResponsiveImage";
import { Section } from "../Section";
import { isProduction } from "@/lib/env";

const SPECIALTY_KEYS: SpecialtyKey[] = ["obstetrics", "pediatrics"];

export function HomePage({ locale }: { locale: Locale }) {
  const { clinic, copy, specialties, services, doctors } = getContent(locale);
  const t = getDictionary(locale);

  return (
    <PageShell locale={locale} current="home">
      <JsonLd data={medicalClinicJsonLd(clinic)} />

      <section
        aria-labelledby="hero-heading"
        className="container-page grid gap-10 pb-12 pt-8 md:pb-20 md:pt-16 lg:grid-cols-12 lg:items-center lg:gap-14"
      >
        <div className="lg:col-span-7">
          <p className="text-eyebrow font-medium text-accent">
            {copy.hero.eyebrow}
          </p>
          <h1
            id="hero-heading"
            className="mt-3 max-w-[20ch] text-[1.889rem] leading-[1.25] md:text-[2.667rem] md:leading-[1.2]"
          >
            {copy.hero.headline}
          </h1>
          <p className="mt-5 max-w-xl text-lead text-ink-muted">{copy.hero.lead}</p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row md:mt-9">
            <Link href={clinic.bookingHref} className="btn btn-primary" data-booking-link="">
              {t.actions.book}
            </Link>
            <Link href="#chuyen-khoa" className="btn btn-secondary">
              {t.actions.learnServices}
            </Link>
          </div>
        </div>

        {/* Photo beside the text, never behind it. Without a photo: a plain index of the two specialties. */}
        <div className="hidden lg:col-span-5 lg:block">
          {isSupplied(clinic.photos.hero) ? (
            <ResponsiveImage
              photo={clinic.photos.hero}
              sizes="(min-width: 64rem) 38vw, 100vw"
              priority
              className="aspect-[4/5] w-full object-cover"
            />
          ) : (
            <>
              <ul className="border-t border-rule">
                {SPECIALTY_KEYS.map((key) => {
                  const doctor = doctorForSpecialty(key, locale);
                  return (
                    <li key={key} className="border-b border-rule">
                      <Link href={href(key, locale)} className="group block py-6 no-underline">
                        <span className="block text-h3 text-ink group-hover:text-accent">
                          {specialties[key].name}
                        </span>
                        <span className="mt-1 block text-ink-muted">
                          {doctor.title} {doctor.name}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
              {!isProduction() && (
                <div className="mt-4">
                  <PendingMarker label={clinic.photos.hero.label} locale={locale} />
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <Section id="chuyen-khoa" heading={copy.home.specialtiesHeading}>
        <div className="grid gap-12 md:grid-cols-2 md:gap-10">
          {SPECIALTY_KEYS.map((key) => {
            const specialty = specialties[key];
            const doctor = doctorForSpecialty(key, locale);
            const list = visibleServices(services, key).slice(0, 4);
            return (
              <div key={key} data-specialty={key}>
                <h3 className="text-h2">
                  <Link href={href(key, locale)} className="text-ink no-underline hover:text-accent">
                    {specialty.name}
                  </Link>
                </h3>
                <p className="mt-3">{specialty.shortIntro}</p>
                <p className="mt-3 text-ink-muted">
                  {t.labels.doctorInCharge}:{" "}
                  <Link href={doctorHref(doctor.slug, locale)} className="link">
                    {doctor.title} {doctor.name}
                  </Link>
                </p>
                {list.length > 0 && (
                  <ul className="mt-6 border-t border-rule">
                    {list.map((service) => (
                      <li key={service.id} className="border-b border-rule py-3">
                        <Link
                          href={`${href(key, locale)}#${service.id}`}
                          className="text-ink no-underline hover:text-accent"
                        >
                          {service.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
                <p className="mt-6">
                  <Link href={href(key, locale)} className="link font-medium">
                    {t.actions.viewSpecialty}
                    <span className="sr-only">: {specialty.name}</span>
                  </Link>
                </p>
              </div>
            );
          })}
        </div>
      </Section>

      <Section heading={copy.home.doctorsHeading} intro={<p>{copy.home.doctorsIntro}</p>}>
        <div className="-mt-10 divide-y divide-rule md:-mt-14">
          {doctors.map((doctor) => (
            <DoctorProfile key={doctor.slug} doctor={doctor} locale={locale} variant="summary" />
          ))}
        </div>
      </Section>

      <Section heading={copy.home.principlesHeading}>
        <div className="grid gap-x-10 gap-y-8 sm:grid-cols-2">
          {copy.principles.map((principle) => (
            <div key={principle.title} className="border-t border-rule pt-5">
              <h3 className="text-h3">{principle.title}</h3>
              <p className="mt-2 text-ink-muted">{principle.text}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section heading={copy.home.visitHeading}>
        <ClinicInformation locale={locale} />
        <p className="mt-6">
          <Link href={href("clinic", locale)} className="link font-medium">
            {t.nav.clinic}
          </Link>
        </p>
      </Section>

      <BookingCta locale={locale} heading={copy.home.bookingHeading} text={copy.home.bookingText} />
    </PageShell>
  );
}
