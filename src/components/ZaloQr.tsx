import { qrSvg } from "@/lib/qr";

/** QR code that opens the clinic's Zalo chat; same URL as the Zalo message action. */
export async function ZaloQr({ url, label }: { url: string; label: string }) {
  const svg = await qrSvg(url);
  return (
    <div
      role="img"
      aria-label={label}
      data-qr-payload={url}
      className="size-40 border border-rule bg-white p-2 [&>svg]:size-full"
      // Generated locally by the qrcode library from a URL in our own content.
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
