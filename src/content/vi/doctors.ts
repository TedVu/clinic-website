import type { Doctor } from "../schema";

// Sources: the clinic's previous website and Facebook page, the Sở Y tế practising-certificate listing,
// and (for BS. Thanh Xuân's interests and education) her profile on Phòng khám đa khoa Hạnh Phúc's site. Everything else stays pending until the doctor supplies it in writing; nothing here may be
// inferred or estimated.
export const doctors: Doctor[] = [
  {
    slug: "vu-duy-minh",
    title: "BS.",
    name: "Vũ Duy Minh",
    specialty: "obstetrics",
    portrait: { image: "bs-vu-duy-minh", alt: "Chân dung BS. Vũ Duy Minh" },
    summary: "Bác sĩ chuyên khoa II Sản phụ khoa, công tác tại Bệnh viện Từ Dũ từ năm 1988.",
    bio: [
      "BS. Vũ Duy Minh là bác sĩ chuyên khoa II Sản phụ khoa, tốt nghiệp Đại học Y Dược TP. Hồ Chí Minh. Bác sĩ công tác tại Bệnh viện Từ Dũ từ năm 1988 và từng giữ chức Trưởng khoa Cấp cứu của bệnh viện.",
      "Tại phòng khám, bác sĩ trực tiếp khám thai, siêu âm thai và hướng dẫn dưỡng thai cho mẹ; khám và điều trị các bệnh phụ khoa; tư vấn hiếm muộn, kế hoạch hóa gia đình và tầm soát ung thư cổ tử cung.",
    ],
    qualifications: [
      "Bác sĩ chuyên khoa II (BS.CKII), chuyên khoa Sản phụ khoa",
      "Tốt nghiệp Đại học Y Dược TP. Hồ Chí Minh",
      "Chứng chỉ hành nghề số 008110/HCM-CCHN do Sở Y tế TP. Hồ Chí Minh cấp ngày 24/04/2013, phạm vi hoạt động: khám bệnh, chữa bệnh chuyên khoa Sản phụ khoa",
    ],
    experience: [
      "Bác sĩ chuyên khoa Sản tại Bệnh viện Từ Dũ từ năm 1988",
      "Từng giữ chức Trưởng khoa Cấp cứu, Bệnh viện Từ Dũ",
    ],
    affiliations: ["Bệnh viện Từ Dũ"],
    interests: [
      "Khám thai, dưỡng thai và siêu âm thai",
      "Các bệnh phụ khoa",
      "Hiếm muộn",
      "Kế hoạch hóa gia đình",
      "Tầm soát ung thư cổ tử cung",
    ],
  },
  {
    slug: "nguyen-thi-thanh-xuan",
    title: "BS.",
    name: "Nguyễn Thị Thanh Xuân",
    specialty: "pediatrics",
    portrait: { image: "bs-nguyen-thi-thanh-xuan", alt: "Chân dung BS. Nguyễn Thị Thanh Xuân" },
    summary: "Bác sĩ chuyên khoa I Nhi, chuyên khám và điều trị các bệnh hô hấp ở trẻ sơ sinh và trẻ nhỏ.",
    bio: [
      "BS. Nguyễn Thị Thanh Xuân tốt nghiệp Đại học Y Dược chuyên khoa Nhi và có hơn 27 năm kinh nghiệm khám chữa bệnh. Bác sĩ chuyên điều trị các bệnh về hô hấp cho trẻ sơ sinh và trẻ nhỏ.",
    ],
    qualifications: [
      "Bác sĩ chuyên khoa I (BS.CKI), chuyên khoa Nhi",
      "Tốt nghiệp Đại học Y Dược, chuyên khoa Nhi",
    ],
    experience: [
      "Bác sĩ trưởng khoa tại Trung tâm Y tế Quận 3",
      "Bác sĩ trưởng khoa tại Phòng khám đa khoa Hạnh Phúc",
    ],
    affiliations: ["Trung tâm Y tế Quận 3", "Phòng khám đa khoa Hạnh Phúc"],
    interests: ["Bệnh hô hấp ở trẻ sơ sinh và trẻ nhỏ"],
  },
];
