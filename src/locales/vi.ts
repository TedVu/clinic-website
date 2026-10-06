/**
 * Interface strings (labels, buttons, headings that belong to the UI rather than to content).
 * An English dictionary must be declared `satisfies Dictionary` so missing keys fail type-checking.
 */
export const vi = {
  languageName: "Tiếng Việt",
  nav: {
    home: "Trang chủ",
    obstetrics: "Sản khoa",
    pediatrics: "Nhi khoa",
    doctors: "Bác sĩ",
    clinic: "Phòng khám",
    contact: "Liên hệ",
    booking: "Đặt lịch",
    privacy: "Chính sách bảo mật",
  },
  a11y: {
    skipToContent: "Chuyển đến nội dung chính",
    mainNav: "Điều hướng chính",
    footerNav: "Điều hướng cuối trang",
    openMenu: "Mở menu",
    closeMenu: "Đóng menu",
    quickActions: "Liên hệ nhanh",
    breadcrumb: "Đường dẫn",
    homeLink: "Về trang chủ",
    languageSwitcher: "Chọn ngôn ngữ",
    opensInNewTab: "(mở trong thẻ mới)",
  },
  actions: {
    book: "Đặt lịch khám",
    bookShort: "Đặt lịch",
    learnServices: "Tìm hiểu dịch vụ",
    call: "Gọi",
    callClinic: "Gọi phòng khám",
    zalo: "Zalo",
    messageZalo: "Nhắn Zalo",
    directions: "Xem đường đi trên Google Maps",
    viewProfile: "Xem thông tin bác sĩ",
    viewSpecialty: "Xem chi tiết",
    backHome: "Về trang chủ",
    menu: "Menu",
    openZalo: "Mở Zalo",
  },
  labels: {
    address: "Địa chỉ",
    hours: "Giờ làm việc",
    phone: "Điện thoại",
    zalo: "Zalo",
    email: "Email",
    parking: "Gửi xe",
    whatToBring: "Khi đi khám, vui lòng mang theo",
    bookingSteps: "Cách đặt lịch",
    specialty: "Chuyên khoa",
    doctorInCharge: "Bác sĩ phụ trách",
    pendingPrefix: "Cần bổ sung",
    unconfirmedService: "Phòng khám chưa xác nhận dịch vụ này",
    awaitingApproval: "Nội dung chờ phòng khám duyệt",
    photoPending: "Ảnh",
  },
  doctor: {
    bio: "Giới thiệu",
    qualifications: "Bằng cấp, chứng chỉ",
    experience: "Kinh nghiệm lâm sàng",
    affiliations: "Nơi công tác",
    interests: "Lĩnh vực quan tâm",
    /** Structured-data job title; "{specialty}" is the specialty name. */
    jobTitle: "Bác sĩ {specialty}",
  },
  days: {
    mon: "Thứ Hai",
    tue: "Thứ Ba",
    wed: "Thứ Tư",
    thu: "Thứ Năm",
    fri: "Thứ Sáu",
    sat: "Thứ Bảy",
    sun: "Chủ nhật",
  },
  footer: {
    doctorsHeading: "Bác sĩ",
    contactHeading: "Liên hệ",
    navHeading: "Trang",
    copyright: "Bản quyền thuộc về",
  },
};

type Widen<T> = { [K in keyof T]: T[K] extends string ? string : Widen<T[K]> };
export type Dictionary = Widen<typeof vi>;
