// Imports the Vietnamese content files directly (not "@/content") so tests can mock "@/content"
// with this fixture without a circular import.
import { isPending, pending } from "@/content/pending";
import type { Clinic, Doctor, SiteContent } from "@/content/schema";
import type { ImageManifest } from "@/lib/image-manifest";
import { clinic } from "@/content/vi/clinic";
import { doctors } from "@/content/vi/doctors";
import { copy } from "@/content/vi/pages";
import { services, specialties } from "@/content/vi/services";

/**
 * An image manifest covering every photo the content references, so structured-data tests do not
 * depend on public/images/manifest.json (generated at build time, not committed).
 */
export function testManifest(): ImageManifest {
  const names = [
    ...Object.values(clinic.photos),
    ...doctors.map((d) => d.portrait),
  ].flatMap((photo) => (isPending(photo) ? [] : [photo.image]));
  return Object.fromEntries(
    names.map((name) => [
      name,
      {
        width: 1200,
        height: 1500,
        avif: [{ width: 1200, src: `/images/${name}-1200.avif` }],
        webp: [
          { width: 480, src: `/images/${name}-480.webp` },
          { width: 1200, src: `/images/${name}-1200.webp` },
        ],
      },
    ]),
  );
}

/** Seed content with every launch-blocking fact filled in with obvious test values. */
export function completeContent(): SiteContent {
  const seed = structuredClone({ clinic, doctors, specialties, services, copy });
  return {
    ...seed,
    clinic: {
      ...seed.clinic,
      name: "Phòng khám Thử Nghiệm",
      address: { ...seed.clinic.address, street: "1 Đường Thử", ward: "Phường Thử" },
      phone: "0900 000 000",
      zaloUrl: "https://zalo.me/0900000000",
      hours: [{ days: ["mon", "tue", "wed", "thu", "fri"], opens: "08:00", closes: "17:00" }],
      siteUrl: "https://example.vn",
      bookingSteps: ["Gọi điện hoặc nhắn Zalo."],
      profiles: {
        googleBusiness: "https://maps.google.com/?cid=1",
        facebook: "https://www.facebook.com/phongkhamthunghiem",
        directories: ["https://danhba.example/phong-kham-thu-nghiem"],
      },
    },
    doctors: seed.doctors.map((d) => ({ ...d, profiles: [`https://danhba.example/${d.slug}`] })),
    services: seed.services.map((s) => ({ ...s, confirmed: true })),
    copy: { ...seed.copy, privacy: { ...seed.copy.privacy, approved: true } },
  };
}

/** The clinic with every fact pending, independent of what the content files currently hold. */
export function pendingClinic(): Clinic {
  const base = structuredClone(clinic);
  return {
    ...base,
    name: pending("Tên phòng khám"),
    address: { ...base.address, street: pending("Số nhà, tên đường"), ward: pending("Phường / xã") },
    phone: pending("Số điện thoại phòng khám"),
    zaloUrl: pending("Đường dẫn Zalo"),
    email: pending("Email"),
    hours: pending("Giờ làm việc"),
    hoursNote: pending("Ghi chú giờ làm việc"),
    mapsUrl: pending("Google Maps"),
    geo: pending("Tọa độ"),
    parking: pending("Gửi xe"),
    whatToBring: pending("Giấy tờ cần mang theo"),
    bookingSteps: pending("Các bước đặt lịch"),
    siteUrl: pending("Tên miền"),
    profiles: {
      googleBusiness: pending("Google Business Profile"),
      facebook: pending("Facebook"),
      directories: pending("Danh bạ"),
    },
  };
}

/** A doctor with only name and specialty supplied. */
export function pendingDoctor(index = 0): Doctor {
  const base = structuredClone(doctors[index]!);
  const label = `${base.title} ${base.name}`;
  return {
    ...base,
    portrait: pending(`Ảnh chân dung ${label}`),
    summary: pending(`Giới thiệu ngắn về ${label}`),
    bio: pending(`Tiểu sử chuyên môn của ${label}`),
    qualifications: pending(`Bằng cấp của ${label}`),
    experience: pending(`Kinh nghiệm của ${label}`),
    affiliations: pending(`Nơi công tác của ${label}`),
    interests: pending(`Lĩnh vực quan tâm của ${label}`),
    profiles: pending(`Hồ sơ của ${label} trên các trang danh bạ`),
  };
}
