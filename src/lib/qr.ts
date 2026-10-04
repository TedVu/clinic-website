import QRCode from "qrcode";

/** Inline SVG markup for a QR code, generated at build time (no client JavaScript). */
export async function qrSvg(payload: string): Promise<string> {
  return QRCode.toString(payload, {
    type: "svg",
    margin: 1,
    errorCorrectionLevel: "M",
    color: { dark: "#1e2a2f", light: "#ffffff" },
  });
}
