import { getContent } from "@/content";
import { isSupplied } from "@/content/pending";
import { formatHours, telHref } from "@/lib/content-helpers";
import { getDictionary } from "@/locales";
import type { Locale } from "@/lib/routes";
import { Fact } from "./Fact";
import { ChatIcon, PhoneIcon } from "./icons";

/** Large call and Zalo actions (t.actions.callClinic / messageZalo), with opening hours directly below. */
export function ContactActions({ locale, showHours = true }: { locale: Locale; showHours?: boolean }) {
  const { clinic } = getContent(locale);
  const t = getDictionary(locale);
  const tel = telHref(clinic.phone);

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Fact value={clinic.phone} locale={locale}>
          {(phone) => (
            <a href={tel} className="btn btn-primary min-h-13 text-lg" data-contact="call">
              <PhoneIcon /> {t.actions.callClinic}
              <span className="sr-only"> {phone}</span>
            </a>
          )}
        </Fact>
        <Fact value={clinic.zaloUrl} locale={locale}>
          {(url) => (
            <a
              href={url}
              target="_blank"
              rel="noopener"
              className="btn btn-secondary min-h-13 text-lg"
              data-contact="zalo"
            >
              <ChatIcon /> {t.actions.messageZalo}
              <span className="sr-only"> {t.a11y.opensInNewTab}</span>
            </a>
          )}
        </Fact>
      </div>
      {showHours && (
        <div className="mt-5 text-ink-muted" data-contact="hours">
          <Fact value={clinic.hours} locale={locale}>
            {(hours) => (
              <p>
                <span className="font-medium text-ink">{t.labels.hours}: </span>
                {formatHours(hours, t).join("; ")}
              </p>
            )}
          </Fact>
          {isSupplied(clinic.hoursNote) && <p className="mt-1 text-small">{clinic.hoursNote}</p>}
        </div>
      )}
    </div>
  );
}
