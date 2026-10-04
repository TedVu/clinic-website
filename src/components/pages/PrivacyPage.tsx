import { getContent } from "@/content";
import { isProduction } from "@/lib/env";
import { getDictionary } from "@/locales";
import { href, type Locale } from "@/lib/routes";
import { PendingMarker } from "../Fact";
import { PageHeader } from "../PageHeader";
import { PageShell } from "../PageShell";

export function PrivacyPage({ locale }: { locale: Locale }) {
  const { copy } = getContent(locale);
  const t = getDictionary(locale);
  const { privacy } = copy;

  return (
    <PageShell locale={locale}>
      <PageHeader
        locale={locale}
        crumbs={[
          { name: t.nav.home, path: href("home", locale) },
          { name: privacy.heading, path: href("privacy", locale) },
        ]}
        title={privacy.heading}
      >
        <p className="text-small">{privacy.updated}</p>
      </PageHeader>

      <div className="container-page pb-16 md:pb-24">
        <div className="max-w-2xl">
          {!privacy.approved && !isProduction() && (
            <div className="mb-8">
              <PendingMarker label={t.labels.awaitingApproval} locale={locale} />
            </div>
          )}
          {privacy.sections.map((section) => (
            <section key={section.heading} className="border-t border-rule py-6">
              <h2 className="text-h3">{section.heading}</h2>
              <div className="mt-3 space-y-4">
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </PageShell>
  );
}
