import type { Clinic } from "../schema";
import { href } from "@/lib/routes";

export const clinic: Clinic = {
  // Exactly as on the Google Business Profile, so search engines match the two.
  name: "Phòng khám sản nhi 611/95 Điện Biên Phủ TP.HCM",
  shortName: "Sản Nhi Quận 3",
  descriptor: "Phòng khám Sản – Nhi",
  district: "Quận 3",
  address: {
    street: "611/95 Điện Biên Phủ",
    // Formerly Phường 1, Quận 3 (before the 2025 ward merger); matches the Google Maps listing.
    ward: "Phường Bàn Cờ",
    city: "TP. Hồ Chí Minh",
    country: "VN",
  },
  phone: "0918 377 501",
  zaloUrl: "https://zalo.me/0918377501",
  // No public email: the clinic is contacted by phone and Zalo only.
  hours: [{ days: ["mon", "tue", "wed", "thu", "fri", "sat"], opens: "17:30", closes: "19:30" }],
  hoursNote: "Chủ nhật nghỉ.",
  mapsUrl: "https://maps.app.goo.gl/ZAVVodd8sUm4QRV6A",
  // Decoded from the listing's plus code QM9H+74.
  geo: { latitude: 10.768187, longitude: 106.677813 },
  parking: "Có chỗ gửi xe tại phòng khám. Quý khách vui lòng tự bảo quản tư trang cá nhân.",
  whatToBring: ["Các giấy tờ, kết quả xét nghiệm theo chỉ định của bác sĩ (nếu có)"],
  bookingSteps: [
    "Gọi điện hoặc nhắn Zalo số 0918 377 501 vào bất kỳ lúc nào.",
    "Phòng khám xác nhận ngày và giờ khám với bạn.",
    "Đến phòng khám đúng giờ hẹn.",
  ],
  siteUrl: "https://phongkhamsannhi.com",
  // Override with BOOKING_HREF (used by tests) or replace with the booking app URL later.
  bookingHref: process.env.BOOKING_HREF || href("booking", "vi"),
  photos: {
    hero: {
      image: "phong-kham-mat-tien",
      alt: "Mặt tiền phòng khám tại 611/95 Điện Biên Phủ, biển hiệu ghi BS. Duy Minh – Sản phụ khoa và BS. Thanh Xuân – Nhi khoa",
    },
    interior: { image: "phong-kham-ben-trong", alt: "BS. Nguyễn Thị Thanh Xuân tại phòng khám" },
  },
  profiles: {
    // Supplied October 2026. The share link (share.google/hbMEMzaF2q0vSY6Ep) resolves to this
    // Knowledge Graph entity, whose name matches clinic.name; this is its stable form.
    googleBusiness: "https://www.google.com/search?kgmid=/g/11sjytfnyy",
    // The clinic's page under its earlier name, "Phòng khám Sản phụ khoa & Siêu âm Bác sĩ Vũ Duy Minh".
    facebook: "https://www.facebook.com/bsvuduyminh/",
    // Supplied by the clinic owner (October 2026). mamnon.com.vn checked: shows 611/95 Điện Biên Phủ.
    directories: [
      "https://mamnon.com.vn/danh-ba/tp-ho-chi-minh/quan-3/co-so/25165-phong-kham-san-phu-khoa-sieu-am-bac-si-vu-duy-minh",
      "https://kiddihub.com/chi-tiet/phong-kham-san-phu-khoa-sieu-am-bac-si-vu-duy-minh",
    ],
  },
};
