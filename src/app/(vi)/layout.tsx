import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { beVietnam } from "@/lib/fonts";
import { brandName, siteUrl } from "@/lib/metadata";
import "@/styles/globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl("vi")),
  applicationName: brandName("vi"),
  formatDetection: { telephone: false, address: false, email: false },
};

export const viewport: Viewport = {
  themeColor: "#faf8f4",
  width: "device-width",
  initialScale: 1,
};

/** Root layout for Vietnamese pages (served at the site root). English will get its own under (en)/en. */
export default function VietnameseLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="vi" className={beVietnam.variable}>
      <body>{children}</body>
    </html>
  );
}
