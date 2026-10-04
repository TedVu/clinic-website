# Design review

Senior-product-designer pass over the 360 / 768 / 1280px screenshots of every page, in preview mode (pending facts marked) and production mode (pending facts omitted), against the brief's Final Quality Bar. Screenshots: `SCREENSHOTS=1 npx playwright test screenshots` → `review-screenshots/`.

## Quality bar

| Question | Finding |
| --- | --- |
| Does it look like a real private medical clinic? | Yes. Quiet header, plain-language headline, the doctors named in the first paragraph, contact details and a medical disclaimer on every page. No marketing claims, numbers or badges. |
| Understandable within five seconds? | Yes, after one fix (below): eyebrow "Sản khoa · Nhi khoa · TP. Hồ Chí Minh", the headline, and a lead naming both doctors are all on the first screen at 360×740. |
| Hierarchy from typography, not boxes? | Yes. Sections are separated by whitespace and 1px rules. The only filled surfaces are the closing booking band and the footer. Headings sit in a narrow left column, editorial style. |
| Unnecessary cards? | None. Doctors are full-width rows; services, principles and clinic facts are text lists with rules. |
| Unnecessary icons? | Only three functional icons (phone, chat, menu) on contact actions. No icon grids. |
| Unnecessary gradients / shadows / glass? | None anywhere. |
| Anything that feels like an AI landing page? | No oversized slogan, no full-viewport hero, no stats strip, no feature-card grid, no decorative illustration, no scroll animation. |
| Enough whitespace? | Yes: 56–80px section rhythm, body text measure capped around 68ch. |
| Easy for a parent or older patient? | 17px body text on phones (18px from 768px), 1.7 line-height, 44px+ touch targets, labelled "Menu" button with text, fixed Gọi / Zalo / Đặt lịch bar always within thumb reach. |
| Vietnamese renders correctly? | Yes. Be Vietnam Pro with the Vietnamese subset; stacked diacritics (ễ, ặ, ộ, ữ, Ỷ) never collide at the chosen line heights. An e2e test asserts the Vietnamese font face loads and all glyphs come from it. |
| Mobile genuinely well designed? | Yes. The phone layout puts headline, doctors and booking on the first screen, menu items are 48px rows, the booking page leads with two large contact actions, and the desktop-only QR code is hidden on phones. |

Lighthouse (mobile, production build with dummy launch values, compression as on Cloudflare): home, Sản khoa and a doctor page all score 99 performance / 100 accessibility / 100 best practices / 100 SEO; LCP 1.7–1.8s, CLS 0, TBT ≤ 100ms. axe reports no serious or critical violations on any page in either build.

## Issues found and fixed

1. **Hero eyebrow repeated the header.** "Phòng khám Sản – Nhi · TP. Hồ Chí Minh" sat directly under the header that already says "Phòng khám Sản – Nhi". Replaced with "Sản khoa · Nhi khoa · TP. Hồ Chí Minh" (`copy.hero.eyebrow`), which states both specialties at a glance. The share image uses the same line.
2. **Empty "Đến phòng khám" list in production mode.** With every clinic fact pending, the section showed a stray rule above nothing. `ClinicInformation` now renders nothing when it has no rows (a real launch can't reach this state, but the layout must never show empty structure). Rows also follow the caller's order, so the contact page lists phone and Zalo first.
3. **Action bar overlapped the footer by 1px.** The reserved bottom space didn't include the bar's top border. Fixed (`calc(3.5rem + 1px + safe-area)`).
4. **Share image missing on inner pages.** A page-level `openGraph` object replaced the inherited file-based image. Moved the generator to a static `/og.png` route and referenced it explicitly from every page's metadata.
5. **Doctor meta description capitalisation.** "bác sĩ Sản khoa" mid-sentence → "bác sĩ sản khoa".

## Accepted as-is

- **Preview markers are prominent** (dashed amber boxes). Intentional: they exist only on preview builds so the clinic sees exactly what is missing.
- **Doctor rows are sparse in production until credentials arrive.** They still read as complete: name, specialty, booking, specialty link. Each credential section appears automatically once supplied.
- **The hero photo is hidden below 1024px.** It would push the next section below the first screen on phones; real photos appear on the clinic and doctor pages at every size.

## Notes for later

- Once real photos exist, re-check the hero at 1280px with the photo instead of the specialty index.
- If the clinic adds many services per specialty, consider splitting them into per-service pages (the `id` on each service is already its future slug).

## Follow-up after real content arrived

6. **Long clinic name broke the desktop header.** "Phòng khám sản nhi 611/95 Điện Biên Phủ TP.HCM" squeezed the navigation until items wrapped ("Trang / chủ") at 1024 and 1280px. Navigation items and the booking button no longer wrap, the name wraps to two balanced lines instead, and the full horizontal navigation starts at 1280px (narrower screens use the Menu button). On phones the name is set slightly smaller so it fits on two lines beside "Menu".
7. **Redundant descriptor.** The generic "Phòng khám Sản – Nhi" line under the clinic name was dropped from the header and footer, since the real name already says it.
