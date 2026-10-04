import { notFound } from "next/navigation";
import { getContent, getDoctor } from "@/content";
import { physicianJsonLd } from "@/lib/schema-org";
import { getDictionary } from "@/locales";
import { doctorHref, href, type Locale } from "@/lib/routes";
import { Breadcrumbs } from "../Breadcrumbs";
import { DoctorProfile } from "../DoctorProfile";
import { JsonLd } from "../JsonLd";
import { PageShell } from "../PageShell";

export function DoctorPage({ locale, slug }: { locale: Locale; slug: string }) {
  const doctor = getDoctor(slug, locale);
  if (!doctor) notFound();
  const { clinic, copy } = getContent(locale);
  const t = getDictionary(locale);

  return (
    <PageShell locale={locale} current="doctors">
      <JsonLd data={physicianJsonLd(doctor, clinic)} />
      <div className="container-page pb-16 pt-8 md:pb-24 md:pt-10">
        <Breadcrumbs
          locale={locale}
          crumbs={[
            { name: t.nav.home, path: href("home", locale) },
            { name: copy.doctorsPage.heading, path: href("doctors", locale) },
            { name: `${doctor.title} ${doctor.name}`, path: doctorHref(doctor.slug, locale) },
          ]}
        />
        <div className="mt-8 md:mt-12">
          <DoctorProfile doctor={doctor} locale={locale} variant="full" />
        </div>
      </div>
    </PageShell>
  );
}
