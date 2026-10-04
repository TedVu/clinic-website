import { getContent } from "@/content";
import { medicalClinicJsonLd } from "@/lib/schema-org";
import { getDictionary } from "@/locales";
import { href, type Locale } from "@/lib/routes";
import { ClinicInformation } from "../ClinicInformation";
import { ContactActions } from "../ContactActions";
import { JsonLd } from "../JsonLd";
import { PageHeader } from "../PageHeader";
import { PageShell } from "../PageShell";

export function ContactPage({ locale }: { locale: Locale }) {
  const { clinic, copy } = getContent(locale);
  const t = getDictionary(locale);

  return (
    <PageShell locale={locale} current="contact">
      <JsonLd data={medicalClinicJsonLd(clinic)} />
      <PageHeader
        locale={locale}
        crumbs={[
          { name: t.nav.home, path: href("home", locale) },
          { name: copy.contactPage.heading, path: href("contact", locale) },
        ]}
        title={copy.contactPage.heading}
      >
        <p>{copy.contactPage.intro}</p>
      </PageHeader>

      <div className="container-page pb-16 md:pb-24">
        <div className="max-w-3xl">
          <ContactActions locale={locale} showHours={false} />
          <div className="mt-12">
            <ClinicInformation locale={locale} fields={["phone", "zalo", "email", "address", "hours"]} />
          </div>
        </div>
      </div>
    </PageShell>
  );
}
