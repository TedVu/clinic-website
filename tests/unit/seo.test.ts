import { afterEach, describe, expect, it, vi } from "vitest";
import { getContent } from "@/content";
import { pending } from "@/content/pending";
import { doctorMetadata, pageMetadata } from "@/lib/page-metadata";
import { ROUTE_KEYS } from "@/lib/routes";
import { breadcrumbJsonLd, medicalClinicJsonLd, physicianJsonLd } from "@/lib/schema-org";
import type { Clinic, Doctor, Service } from "@/content/schema";
import { completeContent, pendingClinic, pendingDoctor, testManifest } from "./fixtures";

const manifest = testManifest();
const clinicLd = (clinic: Clinic, services: Service[] = []) =>
  medicalClinicJsonLd(clinic, services, manifest);
const doctorLd = (doctor: Doctor, clinic: Clinic) =>
  physicianJsonLd(doctor, clinic, "Bác sĩ Sản khoa", manifest);

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

  it("keeps every title within the 65 characters search results display", () => {
    for (const meta of allMetadata()) {
      const title = (meta.title as { absolute: string }).absolute;
      expect([...title].length, title).toBeLessThanOrEqual(65);
    }
  });

  it("names the district in every page's title or description", () => {
    const { district } = getContent("vi").clinic;
    for (const meta of allMetadata()) {
      const title = (meta.title as { absolute: string }).absolute;
      expect(`${title} ${meta.description}`, title).toContain(district);
    }
  });

  it("includes the credentialed doctor name and specialty in a doctor's title, with a canonical path", () => {
    const meta = doctorMetadata("vu-duy-minh", "vi");
    expect((meta.title as { absolute: string }).absolute).toBe(
      "BS.CKII Vũ Duy Minh – Bác sĩ Sản khoa | Sản Nhi Quận 3",
    );
    expect(meta.alternates?.canonical).toBe("/bac-si/vu-duy-minh");
    expect(meta.openGraph).toMatchObject({ locale: "vi_VN", url: "/bac-si/vu-duy-minh" });
  });

  it("gives each doctor's title and Physician JSON-LD the same credential prefix", () => {
    const { clinic, doctors } = getContent("vi");
    for (const doctor of doctors) {
      const fullName = `${doctor.title} ${doctor.name}`;
      const title = (doctorMetadata(doctor.slug, "vi").title as { absolute: string }).absolute;
      expect(title.startsWith(`${fullName} `), title).toBe(true);
      expect(doctorLd(doctor, clinic).name).toBe(fullName);
    }
  });

  it("suffixes titles with the short brand while structured data keeps the full clinic name", () => {
    const { clinic } = getContent("vi");
    const title = (pageMetadata("obstetrics", "vi").title as { absolute: string }).absolute;
    expect(title).toMatch(new RegExp(` \\| ${clinic.shortName}$`));
    expect(title).not.toContain(clinic.name as string);
    expect(clinicLd(clinic).name).toBe(clinic.name);
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
    const json = clinicLd({ ...pendingClinic(), photos: { hero: pending("Ảnh"), interior: pending("Ảnh") } });
    for (const key of ["name", "telephone", "address", "geo", "openingHoursSpecification", "hasMap", "image", "sameAs"]) {
      expect(json).not.toHaveProperty(key);
    }
    expect(JSON.stringify(json)).not.toMatch(/pending|Cần bổ sung/);
  });

  it("describes a complete clinic", () => {
    const content = completeContent();
    const json = clinicLd({ ...content.clinic, geo: { latitude: 10.77, longitude: 106.7 } });
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
    const json = clinicLd({ ...content.clinic, geo: pending("Tọa độ") });
    expect(json).not.toHaveProperty("geo");
  });

  it("links a physician to the clinic", () => {
    const json = doctorLd(pendingDoctor(0), pendingClinic());
    expect(json).toMatchObject({ "@type": ["Person", "Physician"], name: "BS.CKII Vũ Duy Minh" });
    expect((json.worksFor as { "@id": string })["@id"]).toMatch(/#clinic$/);
    expect(json).not.toHaveProperty("description");
  });

  it("links the clinic to its supplied profiles only", () => {
    const content = completeContent();
    expect(clinicLd(content.clinic).sameAs).toEqual([
      "https://maps.google.com/?cid=1",
      "https://www.facebook.com/phongkhamthunghiem",
      "https://danhba.example/phong-kham-thu-nghiem",
    ]);
    const partly = { ...content.clinic.profiles, facebook: pending("Facebook") };
    const json = clinicLd({ ...content.clinic, profiles: partly });
    expect(json.sameAs).toEqual(["https://maps.google.com/?cid=1", "https://danhba.example/phong-kham-thu-nghiem"]);
    expect(JSON.stringify(json)).not.toMatch(/Facebook|pending/);
  });

  it("serves the district while the postal address keeps the official ward", () => {
    const { clinic } = completeContent();
    const json = clinicLd(clinic);
    expect(json.areaServed).toEqual([
      { "@type": "AdministrativeArea", name: clinic.district },
      { "@type": "City", name: clinic.address.city },
    ]);
    expect((json.address as { addressLocality: string }).addressLocality).toBe("Phường Thử");
  });

  it("lists confirmed services only, whatever the build", () => {
    vi.stubEnv("SITE_ENV", "preview");
    const { clinic, services } = completeContent();
    const [hidden, ...shown] = services;
    const json = clinicLd(clinic, [{ ...hidden!, confirmed: false }, ...shown]);
    const names = (json.availableService as { name: string }[]).map((s) => s.name);
    expect(names).toEqual(shown.map((s) => s.name));
    expect(names).not.toContain(hidden!.name);
    expect(json.availableService).toContainEqual({
      "@type": "MedicalProcedure",
      name: shown[0]!.name,
      description: shown[0]!.summary,
    });
  });

  it("gives the clinic an absolute image URL, and none while the photo is pending", () => {
    const { clinic } = completeContent();
    expect(clinicLd(clinic).image).toMatch(/^https?:\/\/[^/]+\/images\/phong-kham-mat-tien-1200\.webp$/);
    const json = clinicLd({ ...clinic, photos: { ...clinic.photos, hero: pending("Ảnh") } });
    expect(json).not.toHaveProperty("image");
  });

  it("describes a complete physician with image, job title, focus areas and own profiles", () => {
    const { clinic, doctors } = completeContent();
    const doctor = doctors[0]!;
    const json = doctorLd(doctor, clinic);
    expect(json).toMatchObject({
      jobTitle: "Bác sĩ Sản khoa",
      image: expect.stringMatching(/^https?:\/\/[^/]+\/images\/bs-vu-duy-minh-1200\.webp$/),
      knowsAbout: doctor.interests,
      sameAs: doctor.profiles,
    });
    expect(clinicLd(clinic).sameAs).not.toContain((doctor.profiles as string[])[0]);
  });

  it("omits a pending portrait, focus areas and profiles from the physician", () => {
    const json = doctorLd(pendingDoctor(1), pendingClinic());
    for (const key of ["image", "knowsAbout", "sameAs"]) expect(json).not.toHaveProperty(key);
  });

  it("never marks up ratings or reviews about itself", () => {
    const { clinic, doctors, services } = completeContent();
    const blocks = [clinicLd(clinic, services), ...doctors.map((d) => doctorLd(d, clinic))];
    for (const block of blocks) expect(JSON.stringify(block)).not.toMatch(/aggregateRating|"review"/);
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
