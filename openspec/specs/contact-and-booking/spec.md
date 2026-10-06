# contact-and-booking Specification

## Purpose

Gives patients the practical information to reach and visit the clinic, and a booking page that uses phone and Zalo now while leaving a single switch for a future booking app.

## Requirements

### Requirement: Single configurable booking destination
Every "Đặt lịch khám" / "Đặt lịch" action on the site SHALL resolve to one configured booking destination. By default this is the booking page `/dat-lich`. Changing the configured destination MUST update every booking action at once, including to an external URL.

#### Scenario: Switching to an external booking app
- **WHEN** the booking destination is configured as an external URL and the site is rebuilt
- **THEN** the header, hero, mobile action bar, doctor pages and specialty pages all link to that URL

### Requirement: Booking page offers phone and Zalo
The site SHALL provide `/dat-lich` with heading "Đặt lịch khám", explaining in plain language how to book, and offering two ways to contact the clinic: a phone call and a Zalo message. It SHALL show opening hours next to the contact options and the clinic-supplied booking instructions. The page MUST NOT contain a form or collect any personal data.

#### Scenario: Booking on a phone
- **WHEN** a visitor opens `/dat-lich` on a phone
- **THEN** two large actions, "Gọi phòng khám" and "Nhắn Zalo", are visible with the opening hours directly below

#### Scenario: No data collection
- **WHEN** the booking page is inspected
- **THEN** it contains no form fields and sends no data anywhere

### Requirement: Desktop booking uses readable number and QR code
On desktop widths the booking page SHALL show the phone number as large, selectable text and a QR code that opens the clinic's Zalo chat when scanned with a phone, with an instruction to scan it.

#### Scenario: Booking from a laptop
- **WHEN** a visitor opens `/dat-lich` at 1280px wide
- **THEN** the phone number is shown as text and a Zalo QR code with the caption "Quét mã bằng điện thoại để nhắn Zalo" is shown

#### Scenario: QR code target
- **WHEN** the QR code is scanned
- **THEN** it opens the same Zalo destination as the "Nhắn Zalo" action

### Requirement: Clinic information page
The site SHALL provide `/phong-kham` showing the clinic name, address with a link that opens it in Google Maps, phone, Zalo, opening hours, booking instructions, and, where supplied, parking information, what to bring, and clinic photos. Phone numbers SHALL be tappable call links and the address SHALL be selectable text.

#### Scenario: Getting directions
- **WHEN** a visitor selects the address link
- **THEN** Google Maps opens at the clinic location in a new context

#### Scenario: Optional parking info missing
- **WHEN** parking information is pending in production
- **THEN** the page shows no parking row

### Requirement: Contact page
The site SHALL provide `/lien-he`, reached from the "Liên hệ" navigation item, showing the clinic's phone (call link), Zalo action, email where supplied, address with Google Maps link and opening hours, with the phone and Zalo actions at the top. The clinic information page (`/phong-kham`) focuses on visiting the clinic; the contact page focuses on reaching it.

#### Scenario: Selecting Liên hệ
- **WHEN** a visitor selects "Liên hệ"
- **THEN** they arrive at `/lien-he` and the phone number and Zalo action are visible without scrolling

### Requirement: Privacy notice
The site SHALL provide `/chinh-sach-bao-mat` with the clinic-approved privacy notice, linked from the footer. Because the site collects no personal data, the notice SHALL say so and describe what the hosting provider may log.

#### Scenario: Privacy link
- **WHEN** a visitor selects the privacy link in the footer
- **THEN** the privacy notice page opens
