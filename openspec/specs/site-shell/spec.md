# site-shell Specification

## Purpose

Defines the header, navigation, mobile action bar and footer shared by every page, and the typography and accessibility baseline the whole site must meet.

## Requirements

### Requirement: Header navigation
Every page SHALL show a header with the clinic name linking home, the navigation items Trang chủ, Sản khoa, Nhi khoa, Bác sĩ, Phòng khám, Liên hệ, and an understated "Đặt lịch khám" action that goes to the configured booking destination. The current page's navigation item SHALL be indicated both visually and with `aria-current="page"`.

#### Scenario: Desktop header
- **WHEN** a page is viewed at 1280px wide
- **THEN** all six navigation items and the booking action appear in one horizontal row

#### Scenario: Current page
- **WHEN** the visitor is on the Nhi khoa page
- **THEN** the Nhi khoa item is marked as current

### Requirement: Mobile navigation
Below the desktop breakpoint the navigation SHALL collapse behind a menu button labelled for screen readers. The menu MUST open and close with keyboard and touch, close on Escape, return focus to the button when closed, and work without page reload.

#### Scenario: Opening the menu on a phone
- **WHEN** a visitor on a 360px-wide screen taps the menu button
- **THEN** all navigation items appear with touch targets at least 44px tall and the button's expanded state is announced

#### Scenario: Closing with Escape
- **WHEN** the menu is open and the visitor presses Escape
- **THEN** the menu closes and focus returns to the menu button

### Requirement: Mobile action bar
On small screens a fixed bottom bar SHALL offer three actions: "Gọi" (opens a phone call to the clinic), "Zalo" (opens the clinic's Zalo chat) and "Đặt lịch" (goes to the booking destination). It MUST respect device safe areas, MUST NOT cover page content at the end of the page, and SHALL NOT appear on desktop widths.

#### Scenario: Calling from a phone
- **WHEN** a visitor on a phone taps "Gọi"
- **THEN** the device's dialler opens with the clinic phone number

#### Scenario: Desktop
- **WHEN** the page is viewed at 1280px wide
- **THEN** the action bar is not shown

### Requirement: Footer
Every page SHALL end with a footer containing the clinic name, both doctors' names with their specialties, address, phone, opening hours, navigation links, a link to the privacy notice, and a short medical disclaimer stating that website information does not replace a medical examination.

#### Scenario: Footer content
- **WHEN** any page is loaded in production
- **THEN** the footer shows each of those items using the supplied clinic facts

### Requirement: Readable Vietnamese typography
The site SHALL use one sans-serif typeface whose Vietnamese glyphs are loaded together with its Latin glyphs, so no accented character falls back to another font. Body text SHALL be at least 17px on mobile and 18px on desktop, with line spacing that keeps stacked diacritics from touching between lines.

#### Scenario: Diacritic rendering
- **WHEN** a test string such as "Nguyễn Thị Thanh Xuân — ưỡng, ặ, ộ, ữ, Ỷ" is rendered in a heading and in body text
- **THEN** every character uses the site typeface and no diacritic overlaps the line above

### Requirement: Accessibility baseline
Pages SHALL use semantic landmarks (header, nav, main, footer), one `h1` per page with headings in order, a skip-to-content link, visible focus styles on every interactive element, WCAG AA colour contrast for text and controls, and meaningful alternative text for content images. Automated accessibility checks MUST report no serious or critical violations on any page.

#### Scenario: Keyboard-only visit
- **WHEN** a visitor navigates a page using only the keyboard
- **THEN** the skip link is the first focusable element, every control is reachable, and focus is always visible

#### Scenario: Automated audit
- **WHEN** the automated accessibility check runs against every page
- **THEN** it reports no serious or critical violations

### Requirement: Restrained visual design
The site SHALL NOT use gradients, glows, glassmorphism, decorative blobs or illustrations, heavy shadows, scroll-triggered entrance animations, parallax or statistic counters. Motion SHALL be limited to subtle hover and menu transitions, and all motion MUST be disabled when the visitor has requested reduced motion.

#### Scenario: Reduced motion
- **WHEN** the visitor's system requests reduced motion
- **THEN** opening the mobile menu and hovering links cause no animated transitions
