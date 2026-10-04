# Design

## Context

The repository is empty apart from a README and OpenSpec scaffolding, so there is no existing infrastructure to preserve. Motivation and scope are in `proposal.md`; required behaviour is in `specs/`. Constraints that shape the approach:

- Real launch, but most clinic facts (credentials, address, phone, photos, confirmed services) are not yet available.
- No backend: booking is phone + Zalo until a separate booking app exists.
- Local SEO in TP. Hồ Chí Minh is a primary goal; most visitors are on Android phones around 360px wide.
- The brief requires Next.js, TypeScript and Tailwind CSS, minimal JavaScript and minimal dependencies.

## Goals / Non-Goals

**Goals:**
- A fully static site that a non-developer can update by editing typed content files.
- A build that cannot ship invented facts or visible placeholders to production.
- English can be added later without moving Vietnamese URLs or touching components.

**Non-Goals:**
- Appointment form, booking logic, accounts or any server code.
- Analytics, cookie banners, chat widgets, embedded maps or other third-party scripts.
- A CMS. Content lives in the repo; a CMS can be considered once the content settles.
- English content (structure only).
- Per-service pages (the content model allows them; they come when doctors supply content).

## Decisions

### 1. Static export on Cloudflare Pages
`output: "export"` produces plain HTML/CSS/JS in `out/`, deployed to Cloudflare Pages. Production deploys from `main`; every other branch gets a preview URL.

- *Why:* there is no server work to do. Static HTML is the fastest and most crawlable option, and Cloudflare Pages is free for commercial use with edge locations in Hà Nội and Sài Gòn.
- *Alternatives:* Vercel (Hobby tier is non-commercial; Pro costs about $20/month and adds server features we don't use); Netlify (comparable, but no Vietnamese edge locations); a Vietnamese VPS (more operations work for no benefit).
- *Consequence:* no middleware, no rewrites, no built-in image optimization. Decisions 2 and 6 work within that.

### 2. Vietnamese at the root using route groups with separate root layouts
```
src/app/
  (vi)/
    layout.tsx            <html lang="vi">, fonts, Header, Footer, ActionBar
    page.tsx              /
    san-khoa/page.tsx     /san-khoa
    nhi-khoa/page.tsx
    bac-si/page.tsx
    bac-si/[slug]/page.tsx   generateStaticParams from doctor content
    phong-kham/page.tsx
    lien-he/page.tsx
    dat-lich/page.tsx
    chinh-sach-bao-mat/page.tsx
    not-found.tsx
  (en)/en/...             added later with <html lang="en">
  sitemap.ts
  robots.ts
```
Route files are thin: each one calls a shared page component with `locale="vi"`. `src/lib/routes.ts` maps a route key (for example `obstetrics`) to its path in each locale (`/san-khoa`, later `/en/obstetrics`). Every internal link goes through it, which is also how hreflang alternates are produced.

- *Why:* gives unprefixed Vietnamese URLs with a correct `lang` attribute and no redirect, which is what static export needs.
- *Alternative rejected:* a `[locale]` segment. It forces `/vi/...` URLs and needs a redirect from `/`, which static export can't do cleanly. The middleware-based `localePrefix: "as-needed"` approach used by i18n libraries needs a server.
- *Known cost:* moving between the two root layouts triggers a full page load. That's acceptable, since it only happens when switching language.

### 3. Plain typed dictionaries instead of an i18n library
`src/locales/vi.ts` exports interface strings (nav labels, button text, section headings), typed as `Dictionary`. The English file will use `satisfies Dictionary`, so any missing key fails type-checking. No pluralization or ICU formatting is needed for this site.

- *Alternative:* next-intl. Good, but it brings middleware-oriented setup and a runtime dependency for very few strings.

### 4. Content model with explicit "pending" values
```
src/content/
  schema.ts          types: Clinic, Doctor, Service, Specialty, PageCopy, Fact<T>
  pending.ts         pending(label) -> { kind: "pending", label }
  vi/
    clinic.ts        name, address, phone, zalo, hours, maps, geo, parking...
    doctors.ts       two doctors; credentials as Fact<...>
    services.ts      per specialty; each { id, name, summary, confirmed }
    pages.ts         page copy: hero, intros, principles, booking steps, privacy
src/lib/content-check.ts   LAUNCH_BLOCKING list + check/report functions
```
`Fact<T> = T | Pending`. Components never read a `Fact` directly. They use one helper (`isSupplied`) and one rendering primitive (`<Fact>`), which renders the value, renders nothing in production, or renders a dashed marker in development and preview. Launch-blocking facts are listed once in `content-check.ts` rather than flagged on each value, so the rule is in one place and can be reviewed.

Environment: `SITE_ENV` is `production` | `preview` | `development` and is set per Cloudflare environment. It controls placeholder visibility, `noindex`, and whether the content check is strict.

### 5. Content gate runs before every build
`npm run build` runs `scripts/check-content.ts` first. When `SITE_ENV=production` it exits non-zero on any pending launch-blocking fact and lists each one. Otherwise it only prints the report. `npm run content:report` prints the full pending list (launch-blocking and optional) at any time.

- *Why at build time:* a production deploy that would show `[Cần bổ sung]` instead of a phone number simply doesn't happen. Preview deploys stay buildable, so the clinic can review the site while content arrives.

### 6. Images: pre-sized at build, served with `<picture>`
Source photos go in `assets/photos/`. `scripts/build-images.ts` (sharp, dev dependency) writes AVIF and WebP at a few widths (480, 800, 1200, 1600) into `public/images/`, plus a manifest with dimensions. A small `ResponsiveImage` server component renders `<picture>` with `srcset`, `sizes`, explicit `width`/`height`, and `loading="lazy"` except for the hero.

- *Alternatives:* `images.unoptimized` (ships full-size photos, which hurts LCP on phones); the `next-image-export-optimizer` package (works, but adds a dependency for about six images); Cloudflare Images (paid, and a runtime dependency).

### 7. Typography and visual system
- **Typeface:** Be Vietnam Pro, loaded with `next/font/google` using `subsets: ["latin", "vietnamese"]`, weights 400/500/600, self-hosted at build time. Without the `vietnamese` subset, accented letters fall back to a system font one letter at a time, which is the most common way Vietnamese sites render badly.
- **Type scale:** body 17px mobile / 18px desktop, line-height 1.7. Headings line-height 1.25–1.3, because stacked diacritics (ệ, ỗ, ặ) need the space. `h1` about 2.25rem mobile / 2.75rem desktop. Body text measure at most about 68ch.
- **Palette (Tailwind v4 `@theme` tokens; values are a starting point and must pass contrast tests):**
  ```
  --color-paper     #FAF8F4   page background (warm white)
  --color-surface   #F2EEE7   quiet secondary surface
  --color-rule      #E2DCD2   hairline dividers
  --color-ink       #1E2A2F   text (charcoal navy)
  --color-ink-muted #4F5B60   secondary text (AA on paper)
  --color-accent    #2D5F5B   muted deep teal: links, buttons, current nav
  ```
  One accent only. Specialties are told apart by layout and wording, not by colour; in particular, no pink/blue coding.
- **Shape and depth:** square edges by default; 4px radius on buttons only; no shadows. Sections are separated by whitespace and 1px rules, not boxes.
- **Layout:** 12-column grid, max width about 1200px, 20px side margins on mobile. Doctors are shown in alternating full-width rows (portrait or typographic column plus a text column). Services use a definition-list style (name in medium weight, summary underneath) in one column on mobile and two on wide screens.
- **Motion:** colour and opacity transitions of 150ms or less on hover/focus and on the menu; everything disabled under `prefers-reduced-motion`. No Framer Motion.

```
  HOME, desktop
  +----------------------------------------------------------------+
  | Clinic name      Trang chủ  Sản khoa  Nhi khoa ...  [Đặt lịch] |
  +----------------------------------------------------------------+
  |  Phòng khám Sản - Nhi                   +--------------------+ |
  |  Chăm sóc sức khỏe cho mẹ và bé,        |  clinic / family   | |
  |  từ những ngày đầu tiên.                |  photo (or none)   | |
  |  Sản khoa - BS. Vũ Duy Minh             |                    | |
  |  Nhi khoa - BS. Nguyễn Thị Thanh Xuân   +--------------------+ |
  |  [Đặt lịch khám]  Tìm hiểu dịch vụ ->                          |
  |----------------------------------------------------------------|
  |  Sản khoa                    |  Nhi khoa                       |
  |  short intro, 3 services ->  |  short intro, 3 services ->     |
  |----------------------------------------------------------------|
  |  Bác sĩ  (two alternating rows)                                |
  |  Principles  (4 short text items, 2x2, no icons)               |
  |  Address / hours / phone / Zalo            |  Đặt lịch khám    |
  +----------------------------------------------------------------+
```

### 8. Client JavaScript limited to the mobile menu
Everything is a server component rendered to static HTML except `MobileNav`, a disclosure (`button[aria-expanded]` controlling a panel) that handles Escape and returns focus. `ActionBar` is plain links (`tel:`, the Zalo URL, the booking href) with `padding-bottom: env(safe-area-inset-bottom)`; the page gets matching bottom padding on small screens so the bar never covers the footer.

### 9. Booking destination and Zalo
`src/content/vi/clinic.ts` holds `booking.href` (default `routes.booking`) and `zalo.url`. The full Zalo URL is stored rather than built from a phone number, so it works for both a personal account (`https://zalo.me/<phone>`) and an Official Account (`https://zalo.me/<oa-id>`). The QR code is generated at build time as inline SVG from `zalo.url` using the `qrcode` package inside a server component, so no client code is shipped.

### 10. Maps as a link, not an embed
The address links to Google Maps (a `maps.app.goo.gl` or `google.com/maps` URL from content). No iframe: it's heavy, it sets third-party cookies, and the privacy notice would have to cover it. A click-to-load embed can be added later if the clinic wants one.

### 11. SEO implementation
- Metadata through the App Router `generateMetadata` and a small `buildMetadata(routeKey, copy)` helper, so each page provides a title, description, canonical URL and Open Graph from content. `metadataBase` comes from the clinic's site URL (launch-blocking).
- `app/sitemap.ts` and `app/robots.ts` are generated statically. robots.txt switches to disallow-all when `SITE_ENV !== "production"`, and pages add `noindex` there too.
- JSON-LD builders in `src/lib/schema-org.ts` produce `MedicalClinic` / `Physician` / `BreadcrumbList` objects with pending facts dropped, rendered as `<script type="application/ld+json">` in server components.
- A default Open Graph image is a typographic 1200×630 PNG (clinic name plus specialties) made once with `next/og` at build time, since there is no real photo yet.

### 12. Tooling and tests
- Latest stable Next.js (App Router), React, TypeScript (strict) and Tailwind CSS v4, with versions checked at install time; Node LTS.
- ESLint with the Next.js config. A test fails if Vietnamese diacritic characters appear under `src/components` or `src/app` (content belongs in content and locale files).
- **Vitest:** content check, `Fact` rendering rules, routes map, metadata and JSON-LD builders.
- **Playwright against the built `out/` folder served statically:** navigation, mobile menu (keyboard and Escape), action bar visibility by viewport, booking links, page screenshots at 360 / 768 / 1280 for responsive review, a diacritic-rendering check, and `@axe-core/playwright` on every page.
- Lighthouse (mobile) run manually against a production-mode build before launch.

```
  src/
    app/          route files only (thin)
    components/   Header, MobileNav, ActionBar, Footer, DoctorProfile,
                  ServiceSection, ClinicInformation, ContactActions,
                  ZaloQr, ResponsiveImage, Fact, LanguageSwitcher
    content/      schema + vi/ content (facts, services, page copy)
    locales/      vi.ts interface strings
    lib/          routes, env, content-check, metadata, schema-org
    styles/       globals.css (Tailwind v4 @theme tokens)
  scripts/        check-content.ts, build-images.ts
  assets/photos/  source photos (real, clinic-supplied)
  tests/          unit/ (vitest), e2e/ (playwright)
  docs/           content-checklist.md, launch-checklist.md
```

## Risks / Trade-offs

- [Clinic content arrives late, so production is blocked] → Intended behaviour. Preview deploys stay usable, and `docs/content-checklist.md` plus `content:report` show exactly what's missing.
- [Pages look sparse in production while optional facts are pending] → Every layout is designed and tested with all optional facts omitted (screenshots in that state are part of the responsive review).
- [Search ranking takes time; broad terms belong to large hospitals] → Target doctor-name and district searches first, with Physician pages, consistent name/address/phone, and the Google Business Profile in the launch checklist. Expectations are written down in the launch checklist.
- [Thin specialty content limits SEO] → Doctor-reviewed copy is a content-checklist item, and the service model supports splitting into per-service pages later.
- [Multiple root layouts are a less common App Router pattern] → Covered by an e2e test of the 404 page and of `lang` on every route; with only Vietnamese at launch there's a single root layout in practice.
- [Zalo personal account ties bookings to one phone] → Stored as a full URL so switching to an Official Account later is a content edit; noted for the clinic.
- [Medical advertising rules may require Sở Y tế content approval] → Listed in the launch checklist as an owner action; site copy avoids claims either way.
- [No analytics means no traffic data] → Google Search Console and the Business Profile give search and map insights without client-side tracking; analytics can be a later change.

## Migration Plan

1. Connect the repo to Cloudflare Pages: build command `npm run build`, output `out`, `SITE_ENV=production` on the production branch and `preview` elsewhere.
2. Review on preview URLs (placeholders visible, `noindex`) while content is collected.
3. When `content:report` shows no launch-blocking items, merge to `main`; the strict content gate runs in the production build.
4. Attach the domain, submit the sitemap to Google Search Console and Cốc Cốc Webmaster, and link the site from the Google Business Profile.
5. Rollback: re-promote the previous deployment in Cloudflare Pages (instant; there is no data to migrate).

## Open Questions

- Domain name: set later as the site URL fact; it doesn't change the design.
- Zalo personal account or Official Account: handled by storing the full URL.
- Whether the clinic already has a Google Business Profile: an owner task in the launch checklist either way.
- Map coordinates for `geo`: optional; omitted until supplied.
