# Spec Delta

## Purpose

Explains what the clinic offers: a home page that makes the two specialties clear within seconds, and a page for each specialty that lists only services the clinic has confirmed.

## ADDED Requirements

### Requirement: Home page communicates the clinic immediately
The home page SHALL open with a hero that states the clinic provides obstetric and pediatric care, names BS. Vũ Duy Minh (Sản khoa) and BS. Nguyễn Thị Thanh Xuân (Nhi khoa), and offers two actions: "Đặt lịch khám" (booking destination) and "Tìm hiểu dịch vụ" (services). The hero MUST NOT fill the whole viewport and MUST NOT place text over a photograph.

#### Scenario: First view on a phone
- **WHEN** the home page loads on a 360px-wide screen
- **THEN** the headline, both specialties and the booking action are visible without scrolling, and the next section begins within the first screen height

### Requirement: Home page sections
The home page SHALL include, in order: the hero, a short introduction to each specialty linking to its page, an introduction to both doctors linking to their pages, the clinic's care principles, practical clinic information (address, hours, phone, Zalo) and a booking call to action.

#### Scenario: Specialty links
- **WHEN** a visitor selects the Sản khoa introduction on the home page
- **THEN** they arrive at the Sản khoa page

### Requirement: Care principles without marketing claims
The care principles section SHALL present short principles (for example Chăm sóc tận tâm, Thông tin rõ ràng, Đồng hành cùng gia đình, Chăm sóc liên tục cho mẹ và bé) as text, without icon grids, statistics or superlatives.

#### Scenario: Principles section
- **WHEN** the principles section is rendered
- **THEN** it contains only headings and short descriptive sentences, with no numbers presented as achievements and no icons

### Requirement: Specialty pages
The site SHALL provide a Sản khoa page at `/san-khoa` and a Nhi khoa page at `/nhi-khoa`. Each SHALL introduce the specialty, name and link to the doctor who provides it, list the confirmed services with a short plain-language description each, and end with a booking call to action.

#### Scenario: Sản khoa page
- **WHEN** a visitor opens `/san-khoa`
- **THEN** they see an introduction, BS. Vũ Duy Minh linked to his profile, the confirmed obstetric services and a booking action

### Requirement: Services are easy to scan
Services SHALL be presented as a typographic list (name followed by a short description), not as a grid of icon cards. Each service SHALL have a stable identifier so it can later move to its own page without changing other content.

#### Scenario: Scanning on a phone
- **WHEN** a visitor scrolls the Nhi khoa page on a phone
- **THEN** each service name is visually distinct from its description and the list reads as a single column

### Requirement: No medical claims
Specialty and service copy SHALL describe what a service involves in neutral terms and SHALL NOT promise outcomes, name procedures the clinic has not confirmed, or give individual medical advice.

#### Scenario: Copy review
- **WHEN** the specialty and service copy is reviewed
- **THEN** it contains no guarantees, outcome claims or unconfirmed procedures
