import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import { DoctorProfile } from "@/components/DoctorProfile";
import { LanguageSwitcher, shouldShowLanguageSwitcher } from "@/components/LanguageSwitcher";
import { ResponsiveImage } from "@/components/ResponsiveImage";
import type { Doctor } from "@/content/schema";
import { getImage, type ImageManifest } from "@/lib/image-manifest";
import { qrSvg } from "@/lib/qr";
import { pendingDoctor } from "./fixtures";

afterEach(() => vi.unstubAllEnvs());

const manifest: ImageManifest = {
  "bs-vu-duy-minh": {
    width: 1200,
    height: 1500,
    avif: [
      { width: 480, src: "/images/bs-vu-duy-minh-480.avif" },
      { width: 1200, src: "/images/bs-vu-duy-minh-1200.avif" },
    ],
    webp: [
      { width: 480, src: "/images/bs-vu-duy-minh-480.webp" },
      { width: 1200, src: "/images/bs-vu-duy-minh-1200.webp" },
    ],
  },
};

describe("ResponsiveImage", () => {
  const photo = { image: "bs-vu-duy-minh", alt: "Chân dung BS. Vũ Duy Minh" };

  it("renders AVIF/WebP sources with dimensions, alt text and lazy loading", () => {
    const html = renderToStaticMarkup(<ResponsiveImage photo={photo} sizes="100vw" manifest={manifest} />);
    expect(html).toContain('type="image/avif"');
    expect(html).toContain("/images/bs-vu-duy-minh-480.webp 480w, /images/bs-vu-duy-minh-1200.webp 1200w");
    expect(html).toContain('width="1200"');
    expect(html).toContain('height="1500"');
    expect(html).toContain('alt="Chân dung BS. Vũ Duy Minh"');
    expect(html).toContain('loading="lazy"');
  });

  it("loads eagerly with high priority when marked priority", () => {
    const html = renderToStaticMarkup(<ResponsiveImage photo={photo} sizes="100vw" priority manifest={manifest} />);
    expect(html).toContain('loading="eager"');
    expect(html).toContain('fetchPriority="high"');
  });

  it("fails the build with a clear message when the photo is missing", () => {
    expect(() => getImage("khong-co", manifest)).toThrow(/assets\/photos\/khong-co/);
  });
});

describe("DoctorProfile", () => {
  const seed = pendingDoctor(0);

  it("renders only name, specialty and links when nothing is supplied (production)", () => {
    vi.stubEnv("SITE_ENV", "production");
    const html = renderToStaticMarkup(<DoctorProfile doctor={seed} locale="vi" variant="full" />);
    expect(html).toContain("BS. Vũ Duy Minh");
    expect(html).toContain("Sản khoa");
    expect(html).toContain("Đặt lịch khám");
    expect(html).not.toContain("data-detail");
    expect(html).not.toContain("<img");
    expect(html).not.toContain("data-pending");
  });

  it("shows supplied facts and omits pending ones (production)", () => {
    vi.stubEnv("SITE_ENV", "production");
    const doctor: Doctor = { ...seed, bio: ["Đoạn giới thiệu."], interests: ["Theo dõi thai kỳ"] };
    const html = renderToStaticMarkup(<DoctorProfile doctor={doctor} locale="vi" variant="full" />);
    expect(html).toContain('data-detail="bio"');
    expect(html).toContain("Đoạn giới thiệu.");
    expect(html).toContain('data-detail="interests"');
    expect(html).not.toContain('data-detail="qualifications"');
  });

  it("marks every missing fact on previews", () => {
    vi.stubEnv("SITE_ENV", "preview");
    const html = renderToStaticMarkup(<DoctorProfile doctor={seed} locale="vi" variant="full" />);
    expect(html.match(/data-detail=/g)).toHaveLength(5);
    expect(html).toContain("Cần bổ sung: Ảnh chân dung BS. Vũ Duy Minh");
  });
});

describe("LanguageSwitcher", () => {
  it("renders nothing while Vietnamese is the only locale", () => {
    expect(shouldShowLanguageSwitcher(["vi"])).toBe(false);
    expect(renderToStaticMarkup(<LanguageSwitcher locale="vi" />)).toBe("");
  });

  it("would render once a second locale is enabled", () => {
    expect(shouldShowLanguageSwitcher(["vi", "vi"])).toBe(true);
  });
});

describe("Zalo QR code", () => {
  it("encodes exactly the Zalo URL as an SVG", async () => {
    const svg = await qrSvg("https://zalo.me/0900000000");
    expect(svg).toMatch(/^<svg/);
    // Same payload produces the same code; a different URL produces a different one.
    expect(await qrSvg("https://zalo.me/0900000000")).toBe(svg);
    expect(await qrSvg("https://zalo.me/0911111111")).not.toBe(svg);
  });
});
