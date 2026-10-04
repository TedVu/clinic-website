import Link from "next/link";
import { getContent } from "@/content";
import { isSupplied } from "@/content/pending";
import type { Doctor } from "@/content/schema";
import { getDictionary } from "@/locales";
import { doctorHref, href, type Locale } from "@/lib/routes";
import { Fact, PendingMarker, shouldRender } from "./Fact";
import { ResponsiveImage } from "./ResponsiveImage";

type Props = {
  doctor: Doctor;
  locale: Locale;
  /** summary: overview rows linking to the profile; full: the doctor's own page. */
  variant: "summary" | "full";
  /** Put the portrait on the right on wide screens (alternating rows). */
  reverse?: boolean;
  headingLevel?: "h2" | "h3";
};

function Portrait({ doctor, priority }: { doctor: Doctor; priority?: boolean }) {
  if (isSupplied(doctor.portrait)) {
    return (
      <ResponsiveImage
        photo={doctor.portrait}
        sizes="(min-width: 64rem) 30vw, (min-width: 48rem) 40vw, 100vw"
        priority={priority}
        className="aspect-[4/5] w-full object-cover"
      />
    );
  }
  return (
    <div className="flex aspect-[4/5] w-full items-center bg-surface p-4">
      <PendingMarker label={doctor.portrait.label} />
    </div>
  );
}

/**
 * A doctor presented with room to breathe: full-width row, portrait (when supplied) beside the text.
 * Without a portrait on the live site, the profile becomes a purely typographic layout.
 */
export function DoctorProfile({ doctor, locale, variant, reverse, headingLevel = "h3" }: Props) {
  const { specialties, clinic } = getContent(locale);
  const t = getDictionary(locale);
  const specialty = specialties[doctor.specialty];
  const hasPortrait = shouldRender(doctor.portrait);
  const fullName = `${doctor.title} ${doctor.name}`;
  const Heading = variant === "full" ? "h1" : headingLevel;

  const details = [
    { key: "bio", label: t.doctor.bio, value: doctor.bio, list: false },
    { key: "qualifications", label: t.doctor.qualifications, value: doctor.qualifications, list: true },
    { key: "experience", label: t.doctor.experience, value: doctor.experience, list: true },
    { key: "affiliations", label: t.doctor.affiliations, value: doctor.affiliations, list: true },
    { key: "interests", label: t.doctor.interests, value: doctor.interests, list: true },
  ] as const;

  return (
    <article
      className={`grid gap-8 md:grid-cols-12 md:gap-10 ${variant === "full" ? "" : "py-10 md:py-14"}`}
      data-doctor={doctor.slug}
    >
      {hasPortrait && (
        <div className={`md:col-span-5 lg:col-span-4 ${reverse ? "md:order-2" : ""}`}>
          <Portrait doctor={doctor} priority={variant === "full"} />
        </div>
      )}

      <div className={hasPortrait ? "md:col-span-7 lg:col-span-8" : "md:col-span-12 lg:col-span-9"}>
        <p className="text-eyebrow font-medium text-accent">
          <Link href={href(doctor.specialty, locale)} className="no-underline hover:underline">
            {specialty.name}
          </Link>
        </p>
        <Heading
          className={variant === "full" ? "mt-3 text-h1 md:text-[2.333rem]" : "mt-2 text-h2"}
        >
          {fullName}
        </Heading>

        <div className={`mt-4 max-w-2xl ${variant === "full" ? "text-lead text-ink-muted" : ""}`}>
          <Fact value={doctor.summary} locale={locale}>
            {(summary) => <p>{summary}</p>}
          </Fact>
        </div>

        {variant === "summary" ? (
          <p className="mt-6">
            <Link href={doctorHref(doctor.slug, locale)} className="link font-medium">
              {t.actions.viewProfile}
              <span className="sr-only">: {fullName}</span>
            </Link>
          </p>
        ) : (
          <>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href={clinic.bookingHref} className="btn btn-primary" data-booking-link="">
                {t.actions.book}
              </Link>
              <Link href={href(doctor.specialty, locale)} className="btn btn-secondary">
                {specialty.name}
              </Link>
            </div>

            <div className="mt-12 max-w-2xl">
              {details.map(({ key, label, value, list }) =>
                shouldRender(value) ? (
                  <section key={key} data-detail={key} className="border-t border-rule py-6">
                    <h2 className="text-h3">{label}</h2>
                    <div className="mt-3">
                      <Fact value={value as typeof doctor.bio} locale={locale}>
                        {(items) =>
                          list ? (
                            <ul className="list-disc space-y-1.5 pl-5">
                              {items.map((item) => (
                                <li key={item}>{item}</li>
                              ))}
                            </ul>
                          ) : (
                            <div className="space-y-4">
                              {items.map((paragraph) => (
                                <p key={paragraph}>{paragraph}</p>
                              ))}
                            </div>
                          )
                        }
                      </Fact>
                    </div>
                  </section>
                ) : null,
              )}
            </div>
          </>
        )}
      </div>
    </article>
  );
}
