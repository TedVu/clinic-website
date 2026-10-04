# Danh sách thông tin cần phòng khám cung cấp

Website chỉ hiển thị những thông tin do phòng khám cung cấp. Không có thông tin nào về bằng cấp, kinh nghiệm, dịch vụ hay giờ làm việc được tự đặt ra.

- **Phần A** là thông tin **bắt buộc**: website chưa thể đưa lên mạng chính thức khi còn thiếu bất kỳ mục nào.
- **Phần B và C** là thông tin **nên có**: nếu chưa có, website sẽ tạm ẩn mục đó (không hiện chỗ trống), và hiện lại ngay khi được bổ sung.

Vui lòng gửi thông tin bằng văn bản (email hoặc Zalo) để lưu lại. Cột "Mã" dùng cho người cập nhật website, phòng khám không cần quan tâm.

> Người cập nhật website: chạy `npm run content:report` để xem danh sách còn thiếu tại thời điểm hiện tại.

---

## A. Bắt buộc trước khi website hoạt động

| Thông tin | Ghi chú | Mã |
| --- | --- | --- |
| Tên phòng khám (đúng như trên giấy phép và Google Maps) | Phải giống hệt tên trên Google Maps để tìm kiếm hoạt động tốt | `clinic.name` |
| Số nhà, tên đường | | `clinic.address.street` |
| Phường / xã | Theo địa giới hành chính hiện hành | `clinic.address.ward` |
| Số điện thoại phòng khám | Số sẽ hiện trên nút "Gọi" ở mọi trang | `clinic.phone` |
| Đường dẫn Zalo của phòng khám (https://zalo.me/...) | Tài khoản Zalo cá nhân: `https://zalo.me/<số điện thoại>`. Zalo Official Account: `https://zalo.me/<mã OA>`. Nên dùng tài khoản do nhiều nhân viên cùng trực. | `clinic.zaloUrl` |
| Giờ làm việc theo từng ngày trong tuần | Ví dụ: Thứ Hai – Thứ Sáu 08:00 – 17:00; Thứ Bảy 08:00 – 11:30 | `clinic.hours` |
| Các bước đặt lịch khám của phòng khám | Ví dụ: gọi hoặc nhắn Zalo → phòng khám xác nhận giờ khám → đến trước giờ hẹn 10 phút | `clinic.bookingSteps` |
| Tên miền website (ví dụ https://tenphongkham.vn) | Nên dùng tên miền `.vn` | `clinic.siteUrl` |
| Dịch vụ Sản khoa được xác nhận | Ít nhất một dịch vụ — xem phần D | `services` |
| Dịch vụ Nhi khoa được xác nhận | Ít nhất một dịch vụ — xem phần D | `services` |
| Duyệt chính sách bảo mật | Đọc trang "Chính sách bảo mật" trên bản xem trước và xác nhận đồng ý | `copy.privacy.approved` |

## B. Thông tin bác sĩ

Mỗi bác sĩ tự cung cấp và xác nhận thông tin của mình. Chỉ ghi những gì có thể chứng minh (bằng cấp, chứng chỉ hành nghề, nơi công tác thực tế).

### BS. Vũ Duy Minh — Sản khoa

| Thông tin | Ghi chú | Mã |
| --- | --- | --- |
| Ảnh chân dung BS. Vũ Duy Minh | Xem hướng dẫn ảnh ở phần E | `doctors.vu-duy-minh.portrait` |
| Giới thiệu ngắn về BS. Vũ Duy Minh (1–2 câu) | Hiện ở trang chủ và trang Bác sĩ | `doctors.vu-duy-minh.summary` |
| Tiểu sử chuyên môn của BS. Vũ Duy Minh | Một đến ba đoạn ngắn | `doctors.vu-duy-minh.bio` |
| Bằng cấp, chứng chỉ chuyên môn của BS. Vũ Duy Minh | Mỗi bằng cấp một dòng, kèm nơi cấp và năm nếu muốn | `doctors.vu-duy-minh.qualifications` |
| Kinh nghiệm lâm sàng của BS. Vũ Duy Minh | Mỗi vị trí một dòng | `doctors.vu-duy-minh.experience` |
| Nơi công tác, bệnh viện liên kết của BS. Vũ Duy Minh | Chỉ ghi nơi đang hoặc đã thực sự công tác | `doctors.vu-duy-minh.affiliations` |
| Lĩnh vực chuyên môn quan tâm của BS. Vũ Duy Minh | | `doctors.vu-duy-minh.interests` |

### BS. Nguyễn Thị Thanh Xuân — Nhi khoa

| Thông tin | Ghi chú | Mã |
| --- | --- | --- |
| Ảnh chân dung BS. Nguyễn Thị Thanh Xuân | Xem hướng dẫn ảnh ở phần E | `doctors.nguyen-thi-thanh-xuan.portrait` |
| Giới thiệu ngắn về BS. Nguyễn Thị Thanh Xuân (1–2 câu) | Hiện ở trang chủ và trang Bác sĩ | `doctors.nguyen-thi-thanh-xuan.summary` |
| Tiểu sử chuyên môn của BS. Nguyễn Thị Thanh Xuân | Một đến ba đoạn ngắn | `doctors.nguyen-thi-thanh-xuan.bio` |
| Bằng cấp, chứng chỉ chuyên môn của BS. Nguyễn Thị Thanh Xuân | Mỗi bằng cấp một dòng | `doctors.nguyen-thi-thanh-xuan.qualifications` |
| Kinh nghiệm lâm sàng của BS. Nguyễn Thị Thanh Xuân | Mỗi vị trí một dòng | `doctors.nguyen-thi-thanh-xuan.experience` |
| Nơi công tác, bệnh viện liên kết của BS. Nguyễn Thị Thanh Xuân | Chỉ ghi nơi đang hoặc đã thực sự công tác | `doctors.nguyen-thi-thanh-xuan.affiliations` |
| Lĩnh vực chuyên môn quan tâm của BS. Nguyễn Thị Thanh Xuân | | `doctors.nguyen-thi-thanh-xuan.interests` |

## C. Thông tin phòng khám bổ sung

| Thông tin | Ghi chú | Mã |
| --- | --- | --- |
| Email liên hệ | Phòng khám không dùng email công khai, bỏ qua | `clinic.email` |
| Ghi chú giờ làm việc, ví dụ lịch nghỉ lễ (nếu có) | | `clinic.hoursNote` |
| Đường dẫn Google Maps của phòng khám | Mở Google Maps → tìm phòng khám → "Chia sẻ" → sao chép đường liên kết | `clinic.mapsUrl` |
| Tọa độ phòng khám (vĩ độ, kinh độ) | Nhấn giữ vị trí trên Google Maps để thấy tọa độ, ví dụ 10.7769, 106.7009 | `clinic.geo` |
| Thông tin gửi xe | Có chỗ gửi xe máy / ô tô không, ở đâu, có tính phí không | `clinic.parking` |
| Giấy tờ cần mang theo khi đi khám | Ví dụ: sổ khám thai, kết quả xét nghiệm cũ, sổ tiêm chủng của bé | `clinic.whatToBring` |
| Ảnh phòng khám hoặc ảnh gia đình (ảnh thật, tự nhiên) | Ảnh chính ở trang chủ — xem phần E | `clinic.photos.hero` |
| Ảnh không gian bên trong phòng khám | Hiện ở trang Phòng khám | `clinic.photos.interior` |

## D. Xác nhận dịch vụ

Danh sách dưới đây chỉ là **gợi ý**. Website chỉ hiển thị dịch vụ mà bác sĩ phụ trách xác nhận là phòng khám **thực sự cung cấp**. Với mỗi dịch vụ, vui lòng đánh dấu Có / Không và sửa phần mô tả nếu chưa chính xác. Có thể thêm dịch vụ khác.

**Sản khoa (BS. Vũ Duy Minh xác nhận)**

Phòng khám đã xác nhận tất cả dịch vụ dưới đây (tháng 10/2026); bác sĩ có thể chỉnh lại cách diễn đạt bất cứ lúc nào.

| Có / Không | Dịch vụ | Mô tả hiện tại |
| --- | --- | --- |
| ☑ | Khám thai và dưỡng thai | Khám thai theo lịch để theo dõi sức khỏe của mẹ và sự phát triển của thai, kèm hướng dẫn dưỡng thai qua từng giai đoạn. |
| ☑ | Siêu âm thai | Siêu âm để theo dõi sự phát triển của thai trong các lần khám. |
| ☑ | Khám và điều trị bệnh phụ khoa | Khám, tư vấn và điều trị các bệnh phụ khoa thường gặp. |
| ☑ | Khám và tư vấn hiếm muộn | Khám và tư vấn cho các cặp vợ chồng gặp khó khăn khi mong con. |
| ☑ | Kế hoạch hóa gia đình | Tư vấn các biện pháp tránh thai và kế hoạch sinh con phù hợp. |
| ☑ | Tầm soát ung thư cổ tử cung | Khám và làm xét nghiệm tầm soát ung thư cổ tử cung. |
| ☑ | Tư vấn trước khi mang thai | Trao đổi với bác sĩ về sức khỏe và những điều cần chuẩn bị khi có kế hoạch mang thai. |
| ☑ | Tư vấn sau sinh | Khám và tư vấn cho mẹ trong giai đoạn hồi phục sau sinh. |

**Nhi khoa (BS. Nguyễn Thị Thanh Xuân xác nhận)**

Phòng khám đã xác nhận tất cả dịch vụ dưới đây (tháng 10/2026).

| Có / Không | Dịch vụ | Mô tả hiện tại |
| --- | --- | --- |
| ☑ | Khám bệnh hô hấp ở trẻ | Khám và điều trị các bệnh hô hấp thường gặp ở trẻ sơ sinh và trẻ nhỏ. |
| ☑ | Khám sức khỏe trẻ em | Khám tổng quát để đánh giá tình trạng sức khỏe chung của trẻ. |
| ☑ | Theo dõi sự phát triển của trẻ | Theo dõi cân nặng, chiều cao và các mốc phát triển của trẻ theo từng độ tuổi. |
| ☑ | Tư vấn dinh dưỡng | Tư vấn chế độ ăn phù hợp với độ tuổi và thể trạng của trẻ. |
| ☑ | Khám các bệnh thường gặp ở trẻ | Khám khi trẻ có các triệu chứng thường gặp như sốt, ho, tiêu chảy hoặc phát ban. |
| ☑ | Chăm sóc trẻ sơ sinh | Khám và hướng dẫn cha mẹ chăm sóc trẻ trong những tuần đầu sau sinh. |
| ☑ | Tư vấn sức khỏe cho cha mẹ | Giải đáp thắc mắc của cha mẹ về sức khỏe và việc chăm sóc trẻ hằng ngày. |

Bác sĩ cũng nên đọc lại phần giới thiệu chuyên khoa trên trang Sản khoa và Nhi khoa (bản xem trước) để chắc chắn cách diễn đạt phù hợp với thực tế khám tại phòng khám.

## E. Hướng dẫn ảnh

- Chỉ dùng **ảnh thật** chụp tại phòng khám, của chính bác sĩ và không gian phòng khám. **Không** dùng ảnh mạng, ảnh mẫu (stock) hay ảnh tạo bằng AI — đặc biệt không bao giờ dùng ảnh khuôn mặt không phải của bác sĩ.
- Phong cách tự nhiên, ánh sáng dịu, không chỉnh sửa quá tay. Ảnh chụp khoảnh khắc thật đáng tin hơn ảnh dàn dựng.
- **Ảnh chân dung bác sĩ:** ảnh dọc (tỉ lệ khoảng 4:5), nền đơn giản, chiều rộng tối thiểu 1200 px.
- **Ảnh phòng khám:** ảnh ngang hoặc dọc, chiều rộng tối thiểu 1600 px.
- **Ảnh có bệnh nhân hoặc trẻ em:** chỉ dùng khi có sự đồng ý bằng văn bản của người trong ảnh (hoặc cha mẹ của trẻ).
- Gửi ảnh gốc (không gửi qua tin nhắn nén ảnh). Người cập nhật website đặt ảnh vào thư mục `assets/photos/`; website tự tạo các kích thước phù hợp.

## F. Duyệt nội dung chung

Vui lòng đọc bản xem trước và xác nhận các đoạn văn sau phù hợp với phòng khám:

- Câu giới thiệu đầu trang chủ và đoạn mô tả bên dưới.
- Bốn nguyên tắc chăm sóc ("Chăm sóc tận tâm", "Thông tin rõ ràng", "Đồng hành cùng gia đình", "Chăm sóc liên tục cho mẹ và bé").
- Lời lưu ý y khoa ở cuối mỗi trang.
- Trang Chính sách bảo mật (mục bắt buộc ở phần A).

## G. Lưu ý pháp lý

Theo quy định về quảng cáo dịch vụ khám bệnh, chữa bệnh, nội dung website của cơ sở y tế có thể cần được **Sở Y tế xác nhận** trước khi đăng. Chủ phòng khám vui lòng kiểm tra với Sở Y tế TP. Hồ Chí Minh trước khi website hoạt động chính thức.
