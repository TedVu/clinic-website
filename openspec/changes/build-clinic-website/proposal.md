# Proposal

## Why

A private Obstetrics & Pediatrics clinic in TP. Hồ Chí Minh (BS. Vũ Duy Minh — Sản khoa; BS. Nguyễn Thị Thanh Xuân — Nhi khoa) needs a public website that patients and parents can find through search and trust at a glance. The site is going live for real patients, so it must never show invented medical facts or unfilled placeholders, and it must be built to rank for local searches (clinic name, doctor names, "phòng khám sản nhi" + district).

The full brief lives outside the repo (`Build a polished, production-quality web.md`); this proposal records the scope decisions made while exploring it.

## What Changes

- New greenfield Next.js + TypeScript + Tailwind CSS site in this repo, fully statically rendered, with no backend.
- Vietnamese is the primary language and is served at the site root (`/`, `/san-khoa`, …). English is prepared for but not shipped; it will live under `/en/...` later.
- Pages: home, Sản khoa, Nhi khoa, doctors overview, one page per doctor, clinic information (`/phong-kham`), contact (`/lien-he`), booking (`/dat-lich`), and privacy notice.
- **No appointment form.** The booking page offers phone and Zalo only (with a Zalo QR code on desktop). Every "Đặt lịch khám" action points to one configurable booking destination so a separate booking app (built later, outside this change) can replace it without code hunts.
- A content model that represents "not yet supplied" explicitly. Facts the site cannot launch without (clinic name, address, phone, Zalo, opening hours, privacy text, site URL, at least one confirmed service per specialty) block the production build when missing. Optional facts (qualifications, affiliations, portraits, parking…) are omitted from production pages when missing and shown as visible markers in development and preview builds.
- Local-SEO foundations: Vietnamese ASCII slugs, per-page titles and descriptions, canonical URLs, Open Graph, sitemap, robots.txt, and Schema.org JSON-LD (`MedicalClinic`, `Physician`, `BreadcrumbList`) generated only from supplied facts.
- A mobile-first editorial design: restrained palette, one accent colour, Vietnamese-safe typography, a fixed mobile action bar (Gọi / Zalo / Đặt lịch), and no decorative "AI template" patterns.
- A content-collection checklist for the clinic and a launch checklist (domain, hosting, Google Business Profile, Search Console, Cốc Cốc), since much of what makes the site rank and launch lives outside the code.

## Capabilities

### New Capabilities

- `content-model`: How clinic, doctor, service and copy content is stored separately from UI, how unsupplied facts are represented, and the launch-blocking vs optional rules that keep invented or placeholder facts off the live site.
- `localization`: Vietnamese-first routing at the root, separation of translatable strings from components, and the structure that lets English be added under `/en` without restructuring.
- `site-shell`: Header with navigation and booking action, mobile navigation, fixed mobile action bar, footer with clinic details and disclaimer, and the accessibility and typography baseline every page shares.
- `specialty-services`: The home page and the Sản khoa / Nhi khoa pages that explain each specialty and list only confirmed services.
- `doctor-profiles`: The doctors overview and a dedicated page per doctor, presenting only supplied credentials.
- `contact-and-booking`: The clinic information page, the contact page and the booking page (phone, Zalo, QR, hours, how booking works), plus the single configurable booking destination.
- `seo`: Metadata, canonical URLs, Open Graph, sitemap, robots.txt and structured data for local search.

### Modified Capabilities

None. This is the first change in the project.

## Impact

- **Code:** creates the whole application under `src/` plus config, scripts and tests. The repo currently holds only a README and OpenSpec scaffolding, so nothing existing is replaced.
- **Dependencies:** Next.js, React, TypeScript, Tailwind CSS. Dev-only: ESLint, Vitest, Playwright with axe-core. One build-time QR code library. No runtime third-party services, no analytics, and no embedded third-party maps in this change.
- **Hosting:** static export deployed to Cloudflare Pages (recommended in explore; free for commercial use, edge locations in Hà Nội and Sài Gòn).
- **People outside the code:** the clinic must supply facts, photos and approved copy before production launch, and the owner should confirm with Sở Y tế whether the site's content needs advertising approval. Setting up the Google Business Profile, domain and search-console accounts is owner work tracked in the tasks.
