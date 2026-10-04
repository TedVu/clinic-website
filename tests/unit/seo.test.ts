import { afterEach, describe, expect, it, vi } from "vitest";
import { getContent } from "@/content";
import { pending } from "@/content/pending";
import { doctorMetadata, pageMetadata } from "@/lib/page-metadata";
import { ROUTE_KEYS } from "@/lib/routes";
import { breadcrumbJsonLd, medicalClinicJsonLd, physicianJsonLd } from "@/lib/schema-org";
import { completeContent, pendingClinic, pendingDoctor } from "./fixtures";

afterEach(() => vi.unstubAllEnvs());

function allMetadata() {
  return [
    ...ROUTE_KEYS.map((key) => pageMetadata(key, "vi")),
    ...getContent("vi").doctors.map((d) => doctorMetadata(d.slug, "vi")),
  ];
}

describe("page metadata", () => {
  it("gives every page a unique title and description", () => {
    const metas = allMetadata();
    const titles = metas.map((m) => (m.title as { absolute: string }).absolute);
    const descriptions = metas.map((m) => m.description);
    expect(new Set(titles).size).toBe(metas.length);
    expect(new Set(descriptions).size).toBe(metas.length);
  });

  it("includes doctor, specialty and city in a doctor's title, with a canonical path", () => {
    const meta = doctorMetadata("vu-duy-minh", "vi");
    expect((meta.title as { absolute: string }).absolute).toMatch(
      /^BS\. Vũ Duy Minh – Bác sĩ Sản khoa, TP\. Hồ Chí Minh \| /,
    );
    expect(meta.alternates?.canonical).toBe("/bac-si/vu-duy-minh");
    expect(meta.openGraph).toMatchObject({ locale: "vi_VN", url: "/bac-si/vu-duy-minh" });
  });

  it("is noindex outside production and indexable in production", () => {
    vi.stubEnv("SITE_ENV", "preview");
    expect(pageMetadata("home", "vi").robots).toEqual({ index: false, follow: false });
    vi.stubEnv("SITE_ENV", "production");
    expect(pageMetadata("home", "vi").robots).toEqual({ index: true, follow: true });
  });
});

describe("structured data", () => {
  it("omits every pending fact", () => {
    const json = medicalClinicJsonLd(pendingClinic());
    for (const key of ["name", "telephone", "address", "geo", "openingHoursSpecification", "hasMap"]) {
      expect(json).not.toHaveProperty(key);
    }
    expect(JSON.stringify(json)).not.toMatch(/pending|Cần bổ sung/);
  });

  it("describes a complete clinic", () => {
    const content = completeContent();
    const json = medicalClinicJsonLd({ ...content.clinic, geo: { latitude: 10.77, longitude: 106.7 } });
    expect(json).toMatchObject({
      "@type": "MedicalClinic",
      name: "Phòng khám Thử Nghiệm",
      telephone: "0900 000 000",
      address: { streetAddress: "1 Đường Thử", addressLocality: "Phường Thử", addressCountry: "VN" },
      geo: { "@type": "GeoCoordinates", latitude: 10.77 },
      openingHoursSpecification: [
        { dayOfWeek: expect.arrayContaining(["https://schema.org/Monday"]), opens: "08:00", closes: "17:00" },
      ],
    });
  });

  it("drops geo when coordinates are pending", () => {
    const content = completeContent();
    const json = medicalClinicJsonLd({ ...content.clinic, geo: pending("Tọa độ") });
    expect(json).not.toHaveProperty("geo");
  });

  it("links a physician to the clinic", () => {
    const json = physicianJsonLd(pendingDoctor(0), pendingClinic());
    expect(json).toMatchObject({ "@type": "Physician", name: "BS. Vũ Duy Minh" });
    expect((json.worksFor as { "@id": string })["@id"]).toMatch(/#clinic$/);
    expect(json).not.toHaveProperty("description");
  });

  it("numbers breadcrumb items with absolute URLs", () => {
    const json = breadcrumbJsonLd([
      { name: "Trang chủ", path: "/" },
      { name: "Sản khoa", path: "/san-khoa" },
    ]);
    expect(json.itemListElement).toEqual([
      expect.objectContaining({ position: 1, item: expect.stringMatching(/^https?:\/\/[^/]+\/$/) }),
      expect.objectContaining({ position: 2, item: expect.stringMatching(/\/san-khoa$/) }),
    ]);
  });
});
