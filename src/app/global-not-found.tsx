import type { Metadata } from "next";
import { NotFoundContent } from "@/components/pages/NotFoundContent";
import { PageShell } from "@/components/PageShell";
import { getContent } from "@/content";
import { beVietnam } from "@/lib/fonts";
import { brandName } from "@/lib/metadata";
import "@/styles/globals.css";

const { copy } = getContent("vi");

export const metadata: Metadata = {
  title: `${copy.meta.notFound.title} | ${brandName("vi")}`,
  description: copy.meta.notFound.description,
  robots: { index: false, follow: true },
};

/** 404 for URLs that match no route (rendered as out/404.html). Vietnamese is the default language. */
export default function GlobalNotFound() {
  return (
    <html lang="vi" className={beVietnam.variable}>
      <body>
        <PageShell locale="vi">
          <NotFoundContent locale="vi" />
        </PageShell>
      </body>
    </html>
  );
}
