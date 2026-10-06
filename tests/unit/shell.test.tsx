import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import { completeContent, testManifest } from "./fixtures";

// Render shell components against content with every launch-blocking fact supplied.
vi.mock("@/content", async (importOriginal) => {
  const original = await importOriginal<typeof import("@/content")>();
  const { completeContent: complete } = await import("./fixtures");
  const content = complete();
  return { ...original, getContent: () => content };
});

const { ActionBar } = await import("@/components/ActionBar");
const { Footer } = await import("@/components/Footer");
const { medicalClinicJsonLd } = await import("@/lib/schema-org");

afterEach(() => vi.unstubAllEnvs());

describe("ActionBar", () => {
  it("links call, Zalo and booking", () => {
    const html = renderToStaticMarkup(<ActionBar locale="vi" />);
    expect(html).toContain('href="tel:+84900000000"');
    expect(html).toContain('href="https://zalo.me/0900000000"');
    expect(html).toContain('href="/dat-lich"');
    expect(html).toContain("md:hidden");
  });
});

describe("Footer", () => {
  it("shows the same name, address and phone as the structured data", () => {
    vi.stubEnv("SITE_ENV", "production");
    const html = renderToStaticMarkup(<Footer locale="vi" />);
    const clinic = medicalClinicJsonLd(completeContent().clinic, [], testManifest()) as {
      name: string;
      telephone: string;
      address: { streetAddress: string; addressLocality: string; addressRegion: string };
    };
    expect(html).toContain(clinic.name);
    expect(html).toContain(clinic.telephone);
    const { streetAddress, addressLocality, addressRegion } = clinic.address;
    expect(html).toContain(`${streetAddress}, ${addressLocality}, ${addressRegion}`);
  });

  it("lists hours, both doctors, privacy link and disclaimer with no placeholders in production", () => {
    vi.stubEnv("SITE_ENV", "production");
    const html = renderToStaticMarkup(<Footer locale="vi" />);
    expect(html).toContain("Thứ Hai – Thứ Sáu: 08:00 – 17:00");
    expect(html).toContain("BS.CKII Vũ Duy Minh");
    expect(html).toContain("BS.CKI Nguyễn Thị Thanh Xuân");
    expect(html).toContain('href="/chinh-sach-bao-mat"');
    expect(html).toContain("không thay thế cho việc thăm khám");
    expect(html).not.toContain("data-pending");
  });
});
