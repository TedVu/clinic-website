import type { SiteCopy } from "../schema";

export const copy: SiteCopy = {
  meta: {
    homeTitle: "{clinic} – Sản khoa, Nhi khoa",
    homeDescription:
      "Phòng khám sản khoa và nhi khoa tại TP. Hồ Chí Minh. Sản khoa: BS. Vũ Duy Minh. Nhi khoa: BS. Nguyễn Thị Thanh Xuân. Đặt lịch qua điện thoại hoặc Zalo.",
    obstetrics: {
      title: "Sản khoa – BS. Vũ Duy Minh, TP. Hồ Chí Minh",
      description:
        "Khám thai, siêu âm thai và khám phụ khoa cùng BS.CKII Vũ Duy Minh tại TP. Hồ Chí Minh.",
    },
    pediatrics: {
      title: "Nhi khoa – BS. Nguyễn Thị Thanh Xuân, TP. Hồ Chí Minh",
      description:
        "Khám, theo dõi sức khỏe và sự phát triển của trẻ cùng BS. Nguyễn Thị Thanh Xuân tại TP. Hồ Chí Minh.",
    },
    doctors: {
      title: "Bác sĩ Sản khoa và Nhi khoa tại TP. Hồ Chí Minh",
      description:
        "Giới thiệu BS. Vũ Duy Minh (Sản khoa) và BS. Nguyễn Thị Thanh Xuân (Nhi khoa) tại phòng khám.",
    },
    doctor: {
      title: "{name} – Bác sĩ {specialty}, TP. Hồ Chí Minh",
      description: "Thông tin về {name}, bác sĩ {specialtyLower} tại phòng khám, TP. Hồ Chí Minh.",
    },
    clinic: {
      title: "Thông tin phòng khám – Địa chỉ, giờ làm việc",
      description: "Địa chỉ, giờ làm việc, chỉ đường và những điều cần biết khi đến phòng khám.",
    },
    contact: {
      title: "Liên hệ – Điện thoại, Zalo, địa chỉ",
      description: "Số điện thoại, Zalo, địa chỉ và giờ làm việc của phòng khám.",
    },
    booking: {
      title: "Đặt lịch khám qua điện thoại và Zalo",
      description: "Cách đặt lịch khám sản khoa và nhi khoa qua điện thoại hoặc Zalo.",
    },
    privacy: {
      title: "Chính sách bảo mật",
      description: "Chính sách bảo mật thông tin của website phòng khám.",
    },
    notFound: {
      title: "Không tìm thấy trang",
      description: "Trang bạn tìm không tồn tại.",
    },
  },
  hero: {
    eyebrow: "Sản khoa · Nhi khoa · TP. Hồ Chí Minh",
    headline: "Chăm sóc sức khỏe cho mẹ và bé, từ những ngày đầu tiên.",
    lead: "Phòng khám chuyên về sản khoa và nhi khoa tại TP. Hồ Chí Minh. BS. Vũ Duy Minh khám và theo dõi thai kỳ cho mẹ; BS. Nguyễn Thị Thanh Xuân khám và chăm sóc sức khỏe cho trẻ.",
  },
  home: {
    specialtiesHeading: "Chuyên khoa",
    doctorsHeading: "Bác sĩ",
    doctorsIntro:
      "Mỗi chuyên khoa do một bác sĩ trực tiếp phụ trách, để mẹ và bé được theo dõi bởi cùng một người qua các lần khám.",
    principlesHeading: "Cách chúng tôi chăm sóc",
    visitHeading: "Đến phòng khám",
    bookingHeading: "Đặt lịch khám",
    bookingText:
      "Gọi điện hoặc nhắn Zalo cho phòng khám vào bất kỳ lúc nào; phòng khám sẽ xác nhận ngày và giờ khám.",
  },
  principles: [
    {
      title: "Chăm sóc tận tâm",
      text: "Bác sĩ lắng nghe và dành thời gian trao đổi với từng gia đình.",
    },
    {
      title: "Thông tin rõ ràng",
      text: "Kết quả khám và hướng theo dõi được giải thích bằng ngôn ngữ dễ hiểu.",
    },
    {
      title: "Đồng hành cùng gia đình",
      text: "Cha mẹ được hướng dẫn cụ thể những việc cần làm ở nhà và khi nào cần quay lại khám.",
    },
    {
      title: "Chăm sóc liên tục cho mẹ và bé",
      text: "Từ khi mang thai đến những năm đầu đời của trẻ, mẹ và bé có thể được theo dõi tại cùng một phòng khám.",
    },
  ],
  specialtyPage: {
    servicesHeading: "Dịch vụ",
    doctorHeading: "Bác sĩ phụ trách",
    bookingText: "Gọi điện hoặc nhắn Zalo để đặt lịch khám.",
  },
  doctorsPage: {
    heading: "Bác sĩ",
    intro:
      "Phòng khám có hai bác sĩ, mỗi người phụ trách một chuyên khoa: sản khoa cho mẹ và nhi khoa cho bé.",
  },
  clinicPage: {
    heading: "Phòng khám",
    intro: "Những thông tin cần biết trước khi đến khám.",
  },
  contactPage: {
    heading: "Liên hệ",
    intro: "Gọi điện hoặc nhắn Zalo cho phòng khám vào bất kỳ lúc nào.",
  },
  bookingPage: {
    heading: "Đặt lịch khám",
    intro:
      "Phòng khám nhận đặt lịch qua điện thoại và Zalo vào bất kỳ lúc nào. Phòng khám sẽ xác nhận ngày và giờ khám phù hợp với bạn.",
    stepsHeading: "Cách đặt lịch",
    qrCaption: "Quét mã bằng điện thoại để nhắn Zalo",
    hoursReminder: "Giờ làm việc là thời gian phòng khám tiếp bệnh; bạn có thể gọi hoặc nhắn Zalo đặt lịch vào bất kỳ lúc nào.",
  },
  privacy: {
    // Approved by the clinic, October 2026.
    approved: true,
    heading: "Chính sách bảo mật",
    updated: "Cập nhật lần cuối: tháng 10 năm 2026",
    sections: [
      {
        heading: "Website không thu thập thông tin cá nhân",
        paragraphs: [
          "Website này không có biểu mẫu đăng ký hay đặt lịch, không dùng cookie theo dõi và không sử dụng công cụ phân tích hay quảng cáo của bên thứ ba.",
        ],
      },
      {
        heading: "Khi bạn liên hệ với phòng khám",
        paragraphs: [
          "Khi bạn gọi điện hoặc nhắn tin qua Zalo, thông tin bạn cung cấp được trao đổi trực tiếp với phòng khám qua các dịch vụ đó, không đi qua website này.",
        ],
      },
      {
        heading: "Thông tin kỹ thuật do nhà cung cấp lưu trữ ghi lại",
        paragraphs: [
          "Nhà cung cấp dịch vụ lưu trữ website (Cloudflare) có thể ghi lại một số thông tin kỹ thuật như địa chỉ IP, loại trình duyệt và thời điểm truy cập để vận hành và bảo vệ hệ thống. Phòng khám không dùng các thông tin này để nhận diện người truy cập.",
        ],
      },
      {
        heading: "Câu hỏi về chính sách này",
        paragraphs: [
          "Nếu có câu hỏi, vui lòng liên hệ phòng khám qua số điện thoại hoặc Zalo ở cuối trang.",
        ],
      },
    ],
  },
  footer: {
    disclaimer:
      "Thông tin trên website chỉ nhằm mục đích tham khảo, không thay thế cho việc thăm khám và tư vấn trực tiếp với bác sĩ. Khi có dấu hiệu cấp cứu, vui lòng đến cơ sở y tế gần nhất.",
  },
  notFound: {
    heading: "Không tìm thấy trang",
    text: "Trang bạn tìm có thể đã được đổi địa chỉ hoặc không tồn tại.",
  },
  ogImage: {
    alt: "Phòng khám Sản – Nhi: BS. Vũ Duy Minh (Sản khoa), BS. Nguyễn Thị Thanh Xuân (Nhi khoa)",
  },
};
