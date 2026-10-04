import Link from "next/link";
import { getContent } from "@/content";
import { isSupplied } from "@/content/pending";
import { telHref } from "@/lib/content-helpers";
import { getDictionary } from "@/locales";
import type { Locale } from "@/lib/routes";
import { ChatIcon, PhoneIcon } from "./icons";

/** Fixed call / Zalo / booking bar on phones. The page reserves matching space at the bottom. */
export function ActionBar({ locale }: { locale: Locale }) {
  const { clinic } = getContent(locale);
  const t = getDictionary(locale);
  const tel = telHref(clinic.phone);
  const zalo = isSupplied(clinic.zaloUrl) ? clinic.zaloUrl : undefined;
  const item = "flex min-h-14 items-center justify-center gap-2 font-medium no-underline";

  return (
    <nav
      aria-label={t.a11y.quickActions}
      data-action-bar=""
      className="fixed inset-x-0 bottom-0 z-40 border-t border-rule bg-paper pb-[env(safe-area-inset-bottom)] md:hidden"
    >
      <ul className="grid grid-cols-3">
        <li>
          {tel ? (
            <a href={tel} className={`${item} text-accent`}>
              <PhoneIcon /> {t.actions.call}
            </a>
          ) : (
            <span aria-disabled="true" className={`${item} text-ink-muted`}>
              <PhoneIcon /> {t.actions.call}
            </span>
          )}
        </li>
        <li className="border-l border-rule">
          {zalo ? (
            <a href={zalo} className={`${item} text-accent`} target="_blank" rel="noopener">
              <ChatIcon /> {t.actions.zalo}
            </a>
          ) : (
            <span aria-disabled="true" className={`${item} text-ink-muted`}>
              <ChatIcon /> {t.actions.zalo}
            </span>
          )}
        </li>
        <li>
          <Link href={clinic.bookingHref} className={`${item} h-full bg-accent text-paper`}>
            {t.actions.bookShort}
          </Link>
        </li>
      </ul>
    </nav>
  );
}
