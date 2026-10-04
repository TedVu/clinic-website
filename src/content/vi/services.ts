import type { Service, Specialty, SpecialtyKey } from "../schema";

export const specialties: Record<SpecialtyKey, Specialty> = {
  obstetrics: {
    key: "obstetrics",
    name: "Sản khoa",
    doctorSlug: "vu-duy-minh",
    shortIntro: "Khám thai, siêu âm thai và khám phụ khoa.",
    intro: [
      "Mang thai là một hành trình dài với nhiều câu hỏi. Tại phòng khám, mẹ được bác sĩ khám, trao đổi về kết quả và hướng dẫn những việc cần làm ở từng giai đoạn.",
      "Khám sản phụ khoa tại phòng khám do BS. Vũ Duy Minh, bác sĩ chuyên khoa II, phụ trách.",
    ],
  },
  pediatrics: {
    key: "pediatrics",
    name: "Nhi khoa",
    doctorSlug: "nguyen-thi-thanh-xuan",
    shortIntro: "Khám, theo dõi sức khỏe và sự phát triển của trẻ.",
    intro: [
      "Mỗi giai đoạn lớn lên của trẻ đều có những điều cha mẹ cần biết. Tại phòng khám, trẻ được bác sĩ khám và cha mẹ được hướng dẫn cách chăm sóc phù hợp.",
      "Khám nhi khoa tại phòng khám do BS. Nguyễn Thị Thanh Xuân, bác sĩ chuyên khoa I, phụ trách.",
    ],
  },
};

// All services below were confirmed by the clinic (October 2026). Add new ones with `confirmed: false`
// until the responsible doctor confirms them; unconfirmed services are hidden on the live site.
export const services: Service[] = [
  {
    id: "kham-thai-duong-thai",
    specialty: "obstetrics",
    name: "Khám thai và dưỡng thai",
    summary:
      "Khám thai theo lịch để theo dõi sức khỏe của mẹ và sự phát triển của thai, kèm hướng dẫn dưỡng thai qua từng giai đoạn.",
    confirmed: true,
  },
  {
    id: "sieu-am-thai",
    specialty: "obstetrics",
    name: "Siêu âm thai",
    summary: "Siêu âm để theo dõi sự phát triển của thai trong các lần khám.",
    confirmed: true,
  },
  {
    id: "benh-phu-khoa",
    specialty: "obstetrics",
    name: "Khám và điều trị bệnh phụ khoa",
    summary: "Khám, tư vấn và điều trị các bệnh phụ khoa thường gặp.",
    confirmed: true,
  },
  {
    id: "hiem-muon",
    specialty: "obstetrics",
    name: "Khám và tư vấn hiếm muộn",
    summary: "Khám và tư vấn cho các cặp vợ chồng gặp khó khăn khi mong con.",
    confirmed: true,
  },
  {
    id: "ke-hoach-hoa-gia-dinh",
    specialty: "obstetrics",
    name: "Kế hoạch hóa gia đình",
    summary: "Tư vấn các biện pháp tránh thai và kế hoạch sinh con phù hợp.",
    confirmed: true,
  },
  {
    id: "tam-soat-ung-thu-co-tu-cung",
    specialty: "obstetrics",
    name: "Tầm soát ung thư cổ tử cung",
    summary: "Khám và làm xét nghiệm tầm soát ung thư cổ tử cung.",
    confirmed: true,
  },
  {
    id: "tu-van-truoc-mang-thai",
    specialty: "obstetrics",
    name: "Tư vấn trước khi mang thai",
    summary:
      "Trao đổi với bác sĩ về sức khỏe và những điều cần chuẩn bị khi có kế hoạch mang thai.",
    confirmed: true,
  },
  {
    id: "tu-van-sau-sinh",
    specialty: "obstetrics",
    name: "Tư vấn sau sinh",
    summary: "Khám và tư vấn cho mẹ trong giai đoạn hồi phục sau sinh.",
    confirmed: true,
  },
  {
    id: "benh-ho-hap-tre-em",
    specialty: "pediatrics",
    name: "Khám bệnh hô hấp ở trẻ",
    summary: "Khám và điều trị các bệnh hô hấp thường gặp ở trẻ sơ sinh và trẻ nhỏ.",
    confirmed: true,
  },
  {
    id: "kham-suc-khoe-tre-em",
    specialty: "pediatrics",
    name: "Khám sức khỏe trẻ em",
    summary: "Khám tổng quát để đánh giá tình trạng sức khỏe chung của trẻ.",
    confirmed: true,
  },
  {
    id: "theo-doi-phat-trien",
    specialty: "pediatrics",
    name: "Theo dõi sự phát triển của trẻ",
    summary: "Theo dõi cân nặng, chiều cao và các mốc phát triển của trẻ theo từng độ tuổi.",
    confirmed: true,
  },
  {
    id: "tu-van-dinh-duong",
    specialty: "pediatrics",
    name: "Tư vấn dinh dưỡng",
    summary: "Tư vấn chế độ ăn phù hợp với độ tuổi và thể trạng của trẻ.",
    confirmed: true,
  },
  {
    id: "benh-thuong-gap",
    specialty: "pediatrics",
    name: "Khám các bệnh thường gặp ở trẻ",
    summary: "Khám khi trẻ có các triệu chứng thường gặp như sốt, ho, tiêu chảy hoặc phát ban.",
    confirmed: true,
  },
  {
    id: "cham-soc-so-sinh",
    specialty: "pediatrics",
    name: "Chăm sóc trẻ sơ sinh",
    summary: "Khám và hướng dẫn cha mẹ chăm sóc trẻ trong những tuần đầu sau sinh.",
    confirmed: true,
  },
  {
    id: "tu-van-cha-me",
    specialty: "pediatrics",
    name: "Tư vấn sức khỏe cho cha mẹ",
    summary: "Giải đáp thắc mắc của cha mẹ về sức khỏe và việc chăm sóc trẻ hằng ngày.",
    confirmed: true,
  },
];
