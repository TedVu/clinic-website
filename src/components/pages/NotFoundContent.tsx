import Link from "next/link";
import { getContent } from "@/content";
import { getDictionary } from "@/locales";
import { href, type Locale } from "@/lib/routes";

export function NotFoundContent({ locale }: { locale: Locale }) {
  const { copy } = getContent(locale);
  const t = getDictionary(locale);
  return (
    <div className="container-page py-20 md:py-28">
      <div className="max-w-xl">
        <p className="text-eyebrow font-medium text-accent">404</p>
        <h1 className="mt-3 text-h1">{copy.notFound.heading}</h1>
        <p className="mt-4 text-lead text-ink-muted">{copy.notFound.text}</p>
        <p className="mt-8">
          <Link href={href("home", locale)} className="btn btn-primary">
            {t.actions.backHome}
          </Link>
        </p>
      </div>
    </div>
  );
}
