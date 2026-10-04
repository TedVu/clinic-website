// Imports the Vietnamese content files directly (not "@/content") so tests can mock "@/content"
// with this fixture without a circular import.
import { pending } from "@/content/pending";
import type { Clinic, Doctor, SiteContent } from "@/content/schema";
import { clinic } from "@/content/vi/clinic";
import { doctors } from "@/content/vi/doctors";
import { copy } from "@/content/vi/pages";
import { services, specialties } from "@/content/vi/services";

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
    },
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
  };
}
